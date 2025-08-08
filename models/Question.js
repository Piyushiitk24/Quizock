import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  module: {
    type: String,
    required: true,
    enum: ['Trigonometry', 'Algebra', 'Calculus', 'Geometry', 'Statistics']
  },
  chapter: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard']
  },
  type: {
    type: String,
    required: true,
    enum: ['MCQ', 'Numerical', 'True/False']
  },
  question: {
    type: String,
    required: true
  },
  options: {
    A: String,
    B: String,
    C: String,
    D: String
  },
  correctAnswer: {
    type: String,
    required: true
  },
  explanation: {
    type: String,
    required: true
  },
  marks: {
    type: Number,
    default: 1
  },
  timeLimit: {
    type: Number,
    default: 120 // seconds
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
questionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Question = mongoose.model('Question', questionSchema);

export default mongoose.model('Question', questionSchema);
