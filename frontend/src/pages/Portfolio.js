import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { projectsService, API_URL } from '../services/api';

// Default avatar image
const DEFAULT_AVATAR = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
const DEFAULT_COVER = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';

const BACKEND_BASE_URL = API_URL.replace('/api', '');

function Portfolio() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const handleDeleteProject = async (projectId) => {
    try {
      if (!isAuthenticated) {
        navigate('/signin');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/signin');
        return;
      }

      await projectsService.delete(projectId);
      const response = await projectsService.getAll();
      if (response && Array.isArray(response.data)) {
        const projectsWithAbsoluteUrls = response.data.map(project => ({
          ...project,
          imageUrl: project.image ? `${BACKEND_BASE_URL}/uploads/${project.image}` : null
        }));
        setProjects(projectsWithAbsoluteUrls);
      }
    } catch (err) {
      console.error('Error deleting project:', err);
      if (err.response?.status === 401) {
        navigate('/signin');
      } else {
        setError('Failed to delete project');
      }
    }
  };

  useEffect(() => {
    console.log('Portfolio component mounted. User data:', user);
    const fetchProjects = async () => {
      if (!isAuthenticated) {
        navigate('/signin');
        return;
      }

      try {
        console.log('Fetching projects...');
        const response = await projectsService.getAll();
        console.log('Projects fetched raw response:', response);
        if (response && Array.isArray(response.data)) {
          const projectsWithAbsoluteUrls = response.data.map(project => {
            console.log('Portfolio: Raw project object from backend:', project);
            console.log('Original project image:', project.image);
            const imageUrl = project.image ? `${BACKEND_BASE_URL}/uploads/${project.image}` : null;
            const projectWithUrl = {
              ...project,
              imageUrl: imageUrl
            };
            console.log('Transformed imageUrl:', projectWithUrl.imageUrl);
            return projectWithUrl;
          });
          setProjects(projectsWithAbsoluteUrls);
          console.log('Projects state updated:', projectsWithAbsoluteUrls);
        } else {
          setProjects([]);
          console.log('No projects found or unexpected response format.');
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        if (err.response?.status === 401) {
          navigate('/signin');
        } else {
          setError('Failed to fetch projects');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [isAuthenticated, navigate, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Cover Image */}
      <div className="relative h-64 sm:h-80 md:h-96">
        <img
          src={user?.coverImage ? `${BACKEND_BASE_URL}/uploads/${user.coverImage}` : DEFAULT_COVER}
          alt="Cover"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = DEFAULT_COVER;
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Profile Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-24 sm:-mt-32">
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              {/* Avatar */}
              <div className="relative">
                <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img
                    src={user?.avatar ? `${BACKEND_BASE_URL}/uploads/${user.avatar}` : DEFAULT_AVATAR}
                    alt={user?.name || 'User'}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_AVATAR;
                    }}
                  />
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl font-bold text-gray-900">{user?.name || 'User'}</h1>
                <p className="mt-1 text-xl text-gray-600">{user?.title || 'Developer'}</p>
                
                {/* Contact Info */}
                <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-4">
                  {user?.email && (
                    <a
                      href={`mailto:${user.email}`}
                      className="inline-flex items-center text-gray-600 hover:text-gray-900"
                    >
                      <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {user.email}
                    </a>
                  )}
                  {user?.location && (
                    <span className="inline-flex items-center text-gray-600">
                      <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {user.location}
                    </span>
                  )}
                </div>

                {/* Social Links */}
                <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-4">
                  {user?.github && (
                    <a
                      href={user.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                    </a>
                  )}
                  {user?.linkedin && (
                    <a
                      href={user.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </a>
                  )}
                  {user?.twitter && (
                    <a
                      href={user.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </a>
                  )}
                </div>

                {/* Bio */}
                <div className="mt-6">
                  <h2 className="text-lg font-semibold text-gray-900">About</h2>
                  <p className="mt-2 text-gray-600">
                    {user?.bio || 'No bio available. Add your bio in the profile settings.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">My Projects</h2>
          <div className="text-center mb-8">
            <button
              onClick={() => navigate('/projects')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Projects
            </button>
          </div>
          
          {projects.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-500">No projects found. Start by adding some projects!</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white overflow-hidden shadow rounded-lg cursor-pointer transform transition duration-300 hover:scale-105"
                  onClick={() => {
                    console.log('Portfolio: Navigating to project with ID:', project.id);
                    navigate(`/projects/view/${project.id}`);
                  }}
                >
                  {console.log('Rendering project image:', project.imageUrl)}
                  {project.imageUrl && (
                    <div className="relative pb-48">
                      <img
                        className="absolute h-full w-full object-cover"
                        src={project.imageUrl}
                        alt={project.name}
                        onError={(e) => {
                          console.error('Image failed to load:', project.imageUrl);
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                        }}
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {project.name}
                      </h3>
                      <span className="text-sm text-gray-500">
                        By {project.User?.name || 'Unknown'}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      {project.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200"
                        >
                          Demo
                        </a>
                      )}
                      {project.repositoryUrl && (
                        <a
                          href={project.repositoryUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
                        >
                          Repository
                        </a>
                      )}
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/projects/edit/${project.id}`);
                        }}
                        className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Portfolio; 