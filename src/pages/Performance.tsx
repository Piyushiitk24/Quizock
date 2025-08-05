import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useUserStore } from '../store/useUserStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const Performance: React.FC = () => {
  const navigate = useNavigate();
  const { getPerformanceRecords } = useUserStore();
  const records = getPerformanceRecords();

  // Prepare chart data
  const chartData = records
    .slice()
    .reverse() // Show oldest first for timeline
    .map((record, index) => ({
      attempt: index + 1,
      score: record.score,
      percentage: Math.round((record.score / record.totalQuestions) * 100),
      date: new Date(record.date).toLocaleDateString(),
      quizName: record.quizName,
    }));

  // Calculate statistics
  const totalQuizzes = records.length;
  const averageScore = totalQuizzes > 0 
    ? records.reduce((sum, record) => sum + (record.score / record.totalQuestions) * 100, 0) / totalQuizzes
    : 0;
  const bestScore = totalQuizzes > 0 
    ? Math.max(...records.map(record => (record.score / record.totalQuestions) * 100))
    : 0;
  const recentScore = totalQuizzes > 0 
    ? (records[0].score / records[0].totalQuestions) * 100
    : 0;

  if (totalQuizzes === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <div className="text-6xl mb-6">📊</div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Performance Dashboard
            </h1>
            <p className="text-white/80 mb-8">
              No quiz attempts yet. Start with a quiz to see your progress here!
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate('/formula-quiz')}>
                Start Formula Quiz
              </Button>
              <Button variant="secondary" onClick={() => navigate('/mock-test')}>
                Take Mock Test
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Performance Dashboard
          </h1>
          <p className="text-white/80">
            Track your learning progress and identify areas for improvement
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {totalQuizzes}
            </div>
            <div className="text-white/80">Total Quizzes</div>
          </Card>

          <Card className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {averageScore.toFixed(1)}%
            </div>
            <div className="text-white/80">Average Score</div>
          </Card>

          <Card className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {bestScore.toFixed(1)}%
            </div>
            <div className="text-white/80">Best Score</div>
          </Card>

          <Card className="text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              {recentScore.toFixed(1)}%
            </div>
            <div className="text-white/80">Recent Score</div>
          </Card>
        </div>

        {/* Progress Chart */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Score Progress Over Time
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="attempt" 
                  stroke="rgba(255,255,255,0.7)"
                  tick={{ fill: 'rgba(255,255,255,0.7)' }}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.7)"
                  tick={{ fill: 'rgba(255,255,255,0.7)' }}
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                  formatter={(value: number) => [`${value}%`, 'Score']}
                  labelFormatter={(label: number) => `Attempt ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="percentage" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Detailed History */}
        <Card>
          <h2 className="text-2xl font-bold text-white mb-6">
            Quiz History
          </h2>
          <div className="space-y-4">
            {records.map((record, index) => {
              const percentage = Math.round((record.score / record.totalQuestions) * 100);
              const date = new Date(record.date);
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
                      ${percentage >= 80 
                        ? 'bg-green-600 text-white' 
                        : percentage >= 60 
                          ? 'bg-yellow-600 text-white'
                          : 'bg-red-600 text-white'
                      }
                    `}>
                      {percentage}%
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-white">
                        {record.quizName}
                      </h3>
                      <p className="text-white/60 text-sm">
                        {date.toLocaleDateString()} at {date.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-white font-semibold">
                      {record.score} / {record.totalQuestions}
                    </div>
                    {record.timeTaken && (
                      <div className="text-white/60 text-sm">
                        {Math.floor(record.timeTaken / 60)}:{(record.timeTaken % 60).toString().padStart(2, '0')}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>

        <div className="text-center mt-8">
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
