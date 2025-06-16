import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

function ChooseNewPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { updatePassword, error, isLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    const token = new URLSearchParams(location.search).get('token');
    const success = await updatePassword(token, formData.password);
    if (success) {
      navigate('/signin');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl">
        {/* Left side - Info section */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-12 flex items-center justify-center">
          <div className="max-w-md text-white">
            <div className="mb-8">
              <h2 className="text-4xl font-bold mb-4">Easy Portfolio for Developer</h2>
              <p className="text-lg text-blue-100">
                As a web developer, having a portfolio is essential for showcasing your technical skills and attracting potential clients. A portfolio is a museum of your work, with past tech stacks, case studies, and your work history.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Secure Password</h3>
                  <p className="text-blue-100">Create a strong password to protect your account</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Password Requirements</h3>
                  <p className="text-blue-100">Follow our password guidelines for better security</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Choose New Password form */}
        <div className="w-full md:w-1/2 bg-white p-12 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="flex items-center mb-8">
              <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
              <h3 className="text-2xl font-semibold text-gray-800">BlueCyber</h3>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose New Password</h1>
            <p className="text-gray-600 mb-8">Please enter your new password below.</p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter new password"
                  required
                />
                <div className="mt-2 text-sm text-gray-500">
                  <p className="mb-1">Password must contain:</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <div className="flex items-center">
                      <span className={`w-4 h-4 mr-1 ${formData.password.match(/[a-z]/) ? 'text-green-500' : 'text-gray-400'}`}>
                        {formData.password.match(/[a-z]/) ? '✓' : '○'}
                      </span>
                      One lowercase character
                    </div>
                    <div className="flex items-center">
                      <span className={`w-4 h-4 mr-1 ${formData.password.match(/[A-Z]/) ? 'text-green-500' : 'text-gray-400'}`}>
                        {formData.password.match(/[A-Z]/) ? '✓' : '○'}
                      </span>
                      One uppercase character
                    </div>
                    <div className="flex items-center">
                      <span className={`w-4 h-4 mr-1 ${formData.password.match(/[0-9]/) ? 'text-green-500' : 'text-gray-400'}`}>
                        {formData.password.match(/[0-9]/) ? '✓' : '○'}
                      </span>
                      One number
                    </div>
                    <div className="flex items-center">
                      <span className={`w-4 h-4 mr-1 ${formData.password.match(/[!@#$%^&*(),.?":{}|<>]/) ? 'text-green-500' : 'text-gray-400'}`}>
                        {formData.password.match(/[!@#$%^&*(),.?":{}|<>]/) ? '✓' : '○'}
                      </span>
                      One special character
                    </div>
                    <div className="flex items-center">
                      <span className={`w-4 h-4 mr-1 ${formData.password.length >= 8 ? 'text-green-500' : 'text-gray-400'}`}>
                        {formData.password.length >= 8 ? '✓' : '○'}
                      </span>
                      8 characters minimum
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
              >
                {isLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>

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

export default ChooseNewPassword; 