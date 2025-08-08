import express from 'express';
import Question from '../models/Question.js';

const router = express.Router();

// Get available modules
router.get('/modules', async (req, res) => {
  try {
    const modules = await Question.distinct('module');
    
    const moduleData = await Promise.all(
      modules.map(async (module) => {
        const totalQuestions = await Question.countDocuments({ module });
        const chapters = await Question.distinct('chapter', { module });
        
        return {
          id: module.toLowerCase().replace(/\s+/g, '-'),
          name: module,
          totalQuestions,
          chapters: chapters.length,
          difficulty: {
            easy: await Question.countDocuments({ module, difficulty: 'Easy' }),
            medium: await Question.countDocuments({ module, difficulty: 'Medium' }),
            hard: await Question.countDocuments({ module, difficulty: 'Hard' })
          }
        };
      })
    );

    res.json({
      success: true,
      data: moduleData
    });

  } catch (error) {
    console.error('Error fetching modules:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching modules'
    });
  }
});

// Get questions for a specific module and type
router.get('/questions/:module/:type', async (req, res) => {
  try {
    const { module, type } = req.params;
    const { difficulty, limit = 10 } = req.query;

    // Build query
    const query = {
      module: new RegExp(module, 'i')
    };

    if (difficulty && difficulty !== 'all') {
      query.difficulty = difficulty;
    }

    // For revision, get random questions
    if (type === 'revision') {
      const questions = await Question.aggregate([
        { $match: query },
        { $sample: { size: parseInt(limit) } }
      ]);

      return res.json({
        success: true,
        data: questions.map(q => ({
          _id: q._id,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          difficulty: q.difficulty,
          chapter: q.chapter,
          marks: q.marks,
          timeLimit: q.timeLimit
        }))
      });
    }

    // For mock tests, get structured set
    if (type === 'mock') {
      const totalQuestions = parseInt(limit);
      const easyCount = Math.floor(totalQuestions * 0.4); // 40% easy
      const mediumCount = Math.floor(totalQuestions * 0.4); // 40% medium
      const hardCount = totalQuestions - easyCount - mediumCount; // 20% hard

      const [easyQuestions, mediumQuestions, hardQuestions] = await Promise.all([
        Question.aggregate([
          { $match: { ...query, difficulty: 'Easy' } },
          { $sample: { size: easyCount } }
        ]),
        Question.aggregate([
          { $match: { ...query, difficulty: 'Medium' } },
          { $sample: { size: mediumCount } }
        ]),
        Question.aggregate([
          { $match: { ...query, difficulty: 'Hard' } },
          { $sample: { size: hardCount } }
        ])
      ]);

      const allQuestions = [...easyQuestions, ...mediumQuestions, ...hardQuestions]
        .sort(() => Math.random() - 0.5); // Shuffle

      return res.json({
        success: true,
        data: allQuestions.map(q => ({
          _id: q._id,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          difficulty: q.difficulty,
          chapter: q.chapter,
          marks: q.marks,
          timeLimit: q.timeLimit
        }))
      });
    }

    // Default case
    const questions = await Question.find(query).limit(parseInt(limit));

    res.json({
      success: true,
      data: questions
    });

  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching questions'
    });
  }
});

// Submit mock test results
router.post('/submit-mock/:module', async (req, res) => {
  try {
    const { module } = req.params;
    const { answers, timeTaken } = req.body;

    // Calculate score
    let correctAnswers = 0;
    let totalMarks = 0;
    let earnedMarks = 0;

    const detailedResults = await Promise.all(
      Object.entries(answers).map(async ([questionId, userAnswer]) => {
        const question = await Question.findById(questionId);
        if (!question) return null;

        const isCorrect = question.correctAnswer === userAnswer;
        if (isCorrect) {
          correctAnswers++;
          earnedMarks += question.marks;
        }
        totalMarks += question.marks;

        return {
          questionId,
          question: question.question,
          userAnswer,
          correctAnswer: question.correctAnswer,
          isCorrect,
          explanation: question.explanation,
          marks: question.marks,
          earnedMarks: isCorrect ? question.marks : 0
        };
      })
    );

    const results = detailedResults.filter(r => r !== null);
    const accuracy = totalMarks > 0 ? (earnedMarks / totalMarks) * 100 : 0;

    res.json({
      success: true,
      data: {
        module,
        totalQuestions: results.length,
        correctAnswers,
        accuracy: Math.round(accuracy * 100) / 100,
        totalMarks,
        earnedMarks,
        timeTaken,
        results
      }
    });

  } catch (error) {
    console.error('Error submitting mock test:', error);
    res.status(500).json({
      success: false,
      message: 'Server error submitting test results'
    });
  }
});

// Get chapter-wise performance
router.get('/performance/:module', async (req, res) => {
  try {
    const { module } = req.params;
    
    const chapters = await Question.distinct('chapter', { 
      module: new RegExp(module, 'i') 
    });

    const chapterStats = await Promise.all(
      chapters.map(async (chapter) => {
        const totalQuestions = await Question.countDocuments({ 
          module: new RegExp(module, 'i'), 
          chapter 
        });
        
        const difficultyBreakdown = {
          easy: await Question.countDocuments({ 
            module: new RegExp(module, 'i'), 
            chapter, 
            difficulty: 'Easy' 
          }),
          medium: await Question.countDocuments({ 
            module: new RegExp(module, 'i'), 
            chapter, 
            difficulty: 'Medium' 
          }),
          hard: await Question.countDocuments({ 
            module: new RegExp(module, 'i'), 
            chapter, 
            difficulty: 'Hard' 
          })
        };

        return {
          chapter,
          totalQuestions,
          difficulty: difficultyBreakdown
        };
      })
    );

    res.json({
      success: true,
      data: {
        module,
        chapters: chapterStats
      }
    });

  } catch (error) {
    console.error('Error fetching performance data:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching performance data'
    });
  }
});

export default router;
