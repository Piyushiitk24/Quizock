import express from 'express';
import Question from '../models/Question.js';
import User from '../models/User.js';
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Configure multer for CSV uploads
const upload = multer({ 
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'), false);
    }
  }
});

// Admin login
router.post('/login', (req, res) => {
  const { password } = req.body;
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({
      success: false,
      message: 'Invalid admin password' 
    });
  }

  req.session.isAdmin = true;
  res.json({
    success: true,
    message: 'Admin login successful'
  });
});

// Middleware to check admin authentication
const requireAdmin = (req, res, next) => {
  if (!req.session.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};

// Get all questions (admin only)
router.get('/questions', requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, module, difficulty } = req.query;
    
    const query = {};
    if (module && module !== 'all') {
      query.module = new RegExp(module, 'i');
    }
    if (difficulty && difficulty !== 'all') {
      query.difficulty = difficulty;
    }

    const questions = await Question.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Question.countDocuments(query);

    res.json({
      success: true,
      data: {
        questions,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalQuestions: total
      }
    });

  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching questions'
    });
  }
});

// Add new question (admin only)
router.post('/questions', requireAdmin, async (req, res) => {
  try {
    const questionData = req.body;
    
    const question = new Question(questionData);
    await question.save();

    res.status(201).json({
      success: true,
      message: 'Question added successfully',
      data: question
    });

  } catch (error) {
    console.error('Error adding question:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding question'
    });
  }
});

// Update question (admin only)
router.put('/questions/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const question = await Question.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    res.json({
      success: true,
      message: 'Question updated successfully',
      data: question
    });

  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating question'
    });
  }
});

// Delete question (admin only)
router.delete('/questions/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findByIdAndDelete(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    res.json({
      success: true,
      message: 'Question deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting question'
    });
  }
});

// Upload CSV file (admin only)
router.post('/upload-csv', requireAdmin, upload.single('csvFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No CSV file uploaded'
      });
    }

    const questions = [];
    const errors = [];

    // Read and parse CSV file
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (row) => {
        try {
          // Validate required fields
          if (!row.module || !row.question || !row.correctAnswer) {
            errors.push(`Row missing required fields: ${JSON.stringify(row)}`);
            return;
          }

          const question = {
            module: row.module.trim(),
            chapter: row.chapter?.trim() || 'General',
            difficulty: row.difficulty?.trim() || 'Medium',
            type: row.type?.trim() || 'MCQ',
            question: row.question.trim(),
            correctAnswer: row.correctAnswer.trim(),
            explanation: row.explanation?.trim() || 'No explanation provided',
            marks: parseInt(row.marks) || 1,
            timeLimit: parseInt(row.timeLimit) || 120,
            tags: row.tags ? row.tags.split(',').map(tag => tag.trim()) : []
          };

          // Handle options for MCQ
          if (question.type === 'MCQ') {
            question.options = {
              A: row.optionA?.trim() || '',
              B: row.optionB?.trim() || '',
              C: row.optionC?.trim() || '',
              D: row.optionD?.trim() || ''
            };
          }

          questions.push(question);
        } catch (error) {
          errors.push(`Error processing row: ${error.message}`);
        }
      })
      .on('end', async () => {
        try {
          // Insert questions into database
          let successCount = 0;
          for (const questionData of questions) {
            try {
              const question = new Question(questionData);
              await question.save();
              successCount++;
            } catch (error) {
              errors.push(`Error saving question: ${error.message}`);
            }
          }

          // Clean up uploaded file
          fs.unlinkSync(req.file.path);

          res.json({
            success: true,
            message: `CSV processed successfully`,
            data: {
              totalRows: questions.length,
              successfulImports: successCount,
              errors: errors.length,
              errorDetails: errors
            }
          });

        } catch (error) {
          console.error('Error processing CSV:', error);
          res.status(500).json({
            success: false,
            message: 'Error processing CSV file'
          });
        }
      })
      .on('error', (error) => {
        console.error('CSV parsing error:', error);
        fs.unlinkSync(req.file.path);
        res.status(500).json({
          success: false,
          message: 'Error parsing CSV file'
        });
      });

  } catch (error) {
    console.error('CSV upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error uploading CSV'
    });
  }
});

// Get admin dashboard stats
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const totalQuestions = await Question.countDocuments();
    const totalUsers = await User.countDocuments();
    
    const moduleStats = await Question.aggregate([
      {
        $group: {
          _id: '$module',
          count: { $sum: 1 },
          difficulties: {
            $push: '$difficulty'
          }
        }
      }
    ]);

    const processedModuleStats = moduleStats.map(stat => ({
      module: stat._id,
      totalQuestions: stat.count,
      easy: stat.difficulties.filter(d => d === 'Easy').length,
      medium: stat.difficulties.filter(d => d === 'Medium').length,
      hard: stat.difficulties.filter(d => d === 'Hard').length
    }));

    // Get recent activity
    const recentUsers = await User.find()
      .sort({ 'progress.lastActivity': -1 })
      .limit(5)
      .select('username fullName progress.lastActivity progress.totalQuizzesTaken');

    const recentQuestions = await Question.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('module chapter question createdAt');

    res.json({
      success: true,
      data: {
        overview: {
          totalQuestions,
          totalUsers,
          totalModules: moduleStats.length
        },
        moduleStats: processedModuleStats,
        recentActivity: {
          users: recentUsers,
          questions: recentQuestions
        }
      }
    });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching statistics'
    });
  }
});

// Get all users (admin only)
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const users = await User.find()
      .select('-__v')
      .sort({ 'progress.lastActivity': -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments();

    res.json({
      success: true,
      data: {
        users,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalUsers: total
      }
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching users'
    });
  }
});

// Admin logout
router.post('/logout', requireAdmin, (req, res) => {
  req.session.isAdmin = false;
  res.json({
    success: true,
    message: 'Admin logged out successfully'
  });
});

export default router;
