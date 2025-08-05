import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useUserStore } from './store/useUserStore';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { FormulaQuiz } from './pages/FormulaQuiz';
import { MockTest } from './pages/MockTest';
import { Results } from './pages/Results';
import { Performance } from './pages/Performance';

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useUserStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

function App() {
  const { isAuthenticated } = useUserStore();

  return (
    <div className="min-h-screen flex flex-col">
      {isAuthenticated && <Header />}
      
      <main className="flex-1">
        <Routes>
          <Route 
            path="/" 
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
          />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/formula-quiz"
            element={
              <ProtectedRoute>
                <FormulaQuiz />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/mock-test"
            element={
              <ProtectedRoute>
                <MockTest />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/results"
            element={
              <ProtectedRoute>
                <Results />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/performance"
            element={
              <ProtectedRoute>
                <Performance />
              </ProtectedRoute>
            }
          />
          
          {/* Catch all route - redirect to appropriate page */}
          <Route 
            path="*" 
            element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />} 
          />
        </Routes>
      </main>

      {isAuthenticated && <Footer />}
    </div>
  );
}

export default App;
