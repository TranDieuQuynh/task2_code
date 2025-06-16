import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

function ForgotPassword() {
  const store = useAuthStore();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await store.forgotPassword(email);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Forgot password error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl">
        {/* Left side - Info section */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-12 flex items-center justify-center">
          <div className="text-white">
            <div className="mb-8">
              <h2 className="text-4xl font-bold mb-4">Forgot Password?</h2>
              <p className="text-lg text-blue-100">
                Don't worry! It happens. Please enter the email address associated with your account.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Email Instructions</h3>
                  <p className="text-blue-100">We'll send you a link to reset your password</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Secure Process</h3>
                  <p className="text-blue-100">Your account security is our top priority</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Forgot Password form */}
        <div className="w-full md:w-1/2 bg-white p-12 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="flex items-center mb-8">
              <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
              <h3 className="text-2xl font-semibold text-gray-800">BlueCyber</h3>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password</h1>
            <p className="text-gray-600 mb-8">Enter your email address and we'll send you a link to reset your password.</p>

            {store.error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6" role="alert">
                <span className="block sm:inline">{store.error}</span>
              </div>
            )}

            {isSubmitted ? (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-6" role="alert">
                <p className="font-medium">Check your email</p>
                <p className="text-sm mt-1">We've sent password reset instructions to your email address.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={store.isLoading}
                  className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
                >
                  {store.isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            )}

            <div className="mt-8 text-center">
              <Link to="/signin" className="text-blue-600 hover:text-blue-500 font-medium">
                Back to sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword; 