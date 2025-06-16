import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import ProjectSettings from './pages/ProjectSettings';
import Portfolio from './pages/Portfolio';
import Profile from './pages/Profile';
import ProjectDetail from './pages/ProjectDetail';
import ResetPassword from './pages/ResetPassword';
import useAuthStore from './stores/authStore';

// PrivateRoute component
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isAuthChecked } = useAuthStore();

  console.log('PrivateRoute: isAuthenticated=', isAuthenticated, ', isAuthChecked=', isAuthChecked);

  if (!isAuthChecked) {
    console.log('PrivateRoute: Authentication check not yet complete. Displaying loading.');
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <p className="text-lg text-blue-800">Loading authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('PrivateRoute: Authentication checked and failed. Redirecting to signin.');
    return <Navigate to="/signin" />;
  }

  console.log('PrivateRoute: Authenticated and check complete. Rendering children.');
  return children;
};

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <div className="min-h-screen bg-blue-50">
        <Header />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            {/* Public routes */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected routes */}
            <Route
              path="/projects"
              element={
                <PrivateRoute>
                  <ProjectSettings />
                </PrivateRoute>
              }
            />
            <Route
              path="/projects/edit/:id"
              element={
                <PrivateRoute>
                  <ProjectSettings />
                </PrivateRoute>
              }
            />
            <Route
              path="/projects/view/:id"
              element={
                <PrivateRoute>
                  <ProjectDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/portfolio"
              element={
                <PrivateRoute>
                  <Portfolio />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />

            {/* Redirect root to signin */}
            <Route path="/" element={<Navigate to="/signin" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 