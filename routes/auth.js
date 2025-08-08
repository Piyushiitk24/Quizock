import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Username is required'
      });
    }

    // Find or create user
    let user = await User.findOne({ username: username.toLowerCase() });
    
    if (!user) {
      user = new User({
        username: username.toLowerCase(),
        fullName: username
      });
      await user.save();
    }

    // Update last activity
    user.progress.lastActivity = Date.now();
    await user.save();

    // Store user in session
    req.session.user = {
      id: user._id,
      username: user.username,
      fullName: user.fullName
    };

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        progress: user.progress
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Get dashboard data
router.get('/dashboard/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    const user = await User.findOne({ username: username.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get recent quiz history (last 10)
    const recentQuizzes = user.quizHistory
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

    // Calculate streak (consecutive days with activity)
    const calculateStreak = () => {
      const today = new Date();
      let streak = 0;
      let currentDate = new Date(today);
      
      for (let i = 0; i < 30; i++) {
        const hasActivity = user.quizHistory.some(quiz => {
          const quizDate = new Date(quiz.date);
          return quizDate.toDateString() === currentDate.toDateString();
        });
        
        if (hasActivity) {
          streak++;
        } else if (i > 0) {
          break;
        }
        
        currentDate.setDate(currentDate.getDate() - 1);
      }
      
      return streak;
    };

    res.json({
      success: true,
      data: {
        user: {
          username: user.username,
          fullName: user.fullName,
          class: user.class,
          targetExam: user.targetExam
        },
        progress: user.progress,
        recentQuizzes,
        streak: calculateStreak(),
        achievements: user.achievements
      }
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching dashboard data'
    });
  }
});

// Record quiz attempt
router.post('/attempt', async (req, res) => {
  try {
    const { username, quizData } = req.body;
    
    const user = await User.findOne({ username: username.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.addQuizResult(quizData);
    await user.updateProgress();

    res.json({
      success: true,
      message: 'Quiz attempt recorded successfully',
      progress: user.progress
    });

  } catch (error) {
    console.error('Record attempt error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error recording quiz attempt'
    });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const topUsers = await User.find({})
      .select('username fullName progress.totalQuizzesTaken progress.accuracy progress.totalCorrectAnswers')
      .sort({ 'progress.totalCorrectAnswers': -1 })
      .limit(10);

    const leaderboard = topUsers.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      fullName: user.fullName,
      quizzesTaken: user.progress.totalQuizzesTaken,
      accuracy: Math.round(user.progress.accuracy),
      correctAnswers: user.progress.totalCorrectAnswers
    }));

    res.json({
      success: true,
      data: leaderboard
    });

  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching leaderboard'
    });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error logging out'
      });
    }
    
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  });
});

export default router;
