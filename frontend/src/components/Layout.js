import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import useAuthStore from '../stores/authStore';

function Layout() {
  const { isAuthenticated, isAuthChecked } = useAuthStore();

  if (!isAuthChecked) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <p className="text-lg text-blue-800">Loading authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout; 