import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: false,
    trim: true,
    lowercase: true
  },
  fullName: {
    type: String,
    required: false,
    trim: true
  },
  class: {
    type: String,
    required: false,
    enum: ['11th', '12th', 'Dropper', 'Graduate']
  },
  targetExam: {
    type: [String],
    enum: ['JEE Main', 'JEE Advanced', 'NEET', 'CUET', 'NDA', 'Other']
  },
  progress: {
    totalQuizzesTaken: {
      type: Number,
      default: 0
    },
    totalQuestionsAttempted: {
      type: Number,
      default: 0
    },
    totalCorrectAnswers: {
      type: Number,
      default: 0
    },
    accuracy: {
      type: Number,
      default: 0
    },
    averageTimePerQuestion: {
      type: Number,
      default: 0
    },
    strongTopics: [String],
    weakTopics: [String],
    lastActivity: {
      type: Date,
      default: Date.now
    }
  },
  quizHistory: [{
    module: String,
    type: String,
    score: Number,
    totalQuestions: Number,
    timeTaken: Number,
    accuracy: Number,
    date: {
      type: Date,
      default: Date.now
    },
    answers: [{
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
      },
      userAnswer: String,
      correctAnswer: String,
      isCorrect: Boolean,
      timeTaken: Number
    }]
  }],
  achievements: [{
    title: String,
    description: String,
    icon: String,
    unlockedAt: {
      type: Date,
      default: Date.now
    }
  }],
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'retro'],
      default: 'retro'
    },
    notifications: {
      type: Boolean,
      default: true
    },
    soundEffects: {
      type: Boolean,
      default: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field and progress before saving
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Calculate accuracy
  if (this.progress.totalQuestionsAttempted > 0) {
    this.progress.accuracy = (this.progress.totalCorrectAnswers / this.progress.totalQuestionsAttempted) * 100;
  }
  
  next();
});

// Methods
userSchema.methods.addQuizResult = function(quizData) {
  this.quizHistory.push(quizData);
  this.progress.totalQuizzesTaken += 1;
  this.progress.totalQuestionsAttempted += quizData.totalQuestions;
  this.progress.totalCorrectAnswers += quizData.answers.filter(a => a.isCorrect).length;
  this.progress.lastActivity = Date.now();
  
  return this.save();
};

userSchema.methods.updateProgress = function() {
  if (this.progress.totalQuestionsAttempted > 0) {
    this.progress.accuracy = (this.progress.totalCorrectAnswers / this.progress.totalQuestionsAttempted) * 100;
  }
  
  // Calculate average time per question
  const totalTime = this.quizHistory.reduce((sum, quiz) => sum + quiz.timeTaken, 0);
  if (this.progress.totalQuestionsAttempted > 0) {
    this.progress.averageTimePerQuestion = totalTime / this.progress.totalQuestionsAttempted;
  }
  
  return this.save();
};

const User = mongoose.model('User', userSchema);

export default mongoose.model('User', userSchema);
