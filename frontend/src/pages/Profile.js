import React, { useState, useEffect } from 'react';
import useAuthStore from '../stores/authStore';
import { API_URL } from '../services/api';

const DEFAULT_AVATAR = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
const DEFAULT_COVER = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';

const BACKEND_BASE_URL = API_URL.replace('/api', '');

const Profile = () => {
  const { user, updateProfile } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    bio: '',
    location: '',
    website: '',
    github: '',
    linkedin: '',
    twitter: '',
    avatar: null,
    coverImage: null
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        title: user.title || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        github: user.github || '',
        linkedin: user.linkedin || '',
        twitter: user.twitter || ''
      }));
      setAvatarPreview(user.avatar ? `${BACKEND_BASE_URL}/uploads/${user.avatar}` : DEFAULT_AVATAR);
      setCoverPreview(user.coverImage ? `${BACKEND_BASE_URL}/uploads/${user.coverImage}` : DEFAULT_COVER);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'avatar') {
          setAvatarPreview(reader.result);
          setFormData(prev => ({ ...prev, avatar: file }));
        } else {
          setCoverPreview(reader.result);
          setFormData(prev => ({ ...prev, coverImage: file }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const formDataToSend = new FormData();
      
      // Thêm các trường text
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && key !== 'avatar' && key !== 'coverImage') {
          // Đảm bảo giá trị là string
          formDataToSend.append(key, String(value));
        }
      });

      // Thêm file nếu có
      if (formData.avatar instanceof File) {
        formDataToSend.append('avatar', formData.avatar);
      }
      if (formData.coverImage instanceof File) {
        formDataToSend.append('coverImage', formData.coverImage);
      }

      // Log FormData contents
      console.log('FormData contents before sending:');
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      const response = await updateProfile(formDataToSend);
      console.log('Update profile response:', response);
      setSuccess('Profile updated successfully');
    } catch (err) {
      console.error('Update profile error:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-white">Profile Information</h3>
            <p className="mt-1 text-sm text-blue-100">
              Update your account's profile information and email address.
            </p>
          </div>

          <div className="px-4 py-5 sm:p-6">
            {error && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {success && (
              <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">{success}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Cover Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Cover Image</label>
                <div className="mt-1 flex items-center space-x-4">
                  <div className="relative w-full h-48 group">
                    <img
                      src={coverPreview}
                      alt="Cover Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">Click to change cover image</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, 'cover')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Avatar */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                <div className="mt-1 flex items-center space-x-4">
                  <div className="relative group">
                    <div className="h-32 w-32 rounded-full overflow-hidden ring-4 ring-blue-100">
                      <img
                        src={avatarPreview}
                        alt="Avatar Preview"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <span className="text-white text-sm">Change photo</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, 'avatar')}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-blue-200 rounded-md shadow-sm py-2 px-3 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Full Stack Developer"
                    className="mt-1 block w-full border border-blue-200 rounded-md shadow-sm py-2 px-3 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-blue-200 rounded-md shadow-sm py-2 px-3 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    id="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-blue-200 rounded-md shadow-sm py-2 px-3 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <textarea
                  name="bio"
                  id="bio"
                  rows={3}
                  value={formData.bio}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-blue-200 rounded-md shadow-sm py-2 px-3 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    id="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-blue-200 rounded-md shadow-sm py-2 px-3 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="github" className="block text-sm font-medium text-gray-700">
                    GitHub
                  </label>
                  <input
                    type="url"
                    name="github"
                    id="github"
                    value={formData.github}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-blue-200 rounded-md shadow-sm py-2 px-3 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    name="linkedin"
                    id="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-blue-200 rounded-md shadow-sm py-2 px-3 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="twitter" className="block text-sm font-medium text-gray-700">
                    Twitter
                  </label>
                  <input
                    type="url"
                    name="twitter"
                    id="twitter"
                    value={formData.twitter}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-blue-200 rounded-md shadow-sm py-2 px-3 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 