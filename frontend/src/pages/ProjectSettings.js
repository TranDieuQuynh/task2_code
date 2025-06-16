import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { projectsService } from '../services/api';
import useAuthStore from '../stores/authStore';

const ProjectSettings = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isAuthenticated } = useAuthStore();
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    title: '',
    technologies: '',
    demoUrl: '',
    repositoryUrl: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showSessionModal, setShowSessionModal] = useState(false);

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      if (!isAuthenticated) {
        navigate('/signin');
        return;
      }
      await fetchProjects();
      
      // Nếu có ID trong URL, load project đó
      if (id) {
        try {
          const response = await projectsService.getById(id);
          if (response && response.data) {
            const project = response.data;
            setFormData({
              name: project.name || '',
              description: project.description || '',
              title: project.title || '',
              technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : '',
              demoUrl: project.demoUrl || '',
              repositoryUrl: project.repositoryUrl || '',
              image: null
            });
            setImagePreview(project.image ? `${process.env.REACT_APP_API_URL}/uploads/${project.image}` : null);
            setEditingId(id);
          }
        } catch (err) {
          console.error('Error fetching project:', err);
          setError('Failed to load project details');
        }
      }
    };
    checkAuthAndFetch();
  }, [isAuthenticated, navigate, id]);

  const fetchProjects = async () => {
    try {
      const response = await projectsService.getAll();
      if (response && Array.isArray(response.projects)) {
        setProjects(response.projects);
      } else {
        setProjects([]);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      if (err.response?.status === 401) {
        setShowSessionModal(true);
      } else {
        setError('Failed to fetch projects');
      }
      setProjects([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const formDataToSend = new FormData();
      
      // Thêm các trường dữ liệu vào FormData
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('title', formData.title);

      // Xử lý technologies: chuyển chuỗi thành mảng và append từng phần tử
      const technologiesArray = formData.technologies
        .split(',')
        .map(tech => tech.trim())
        .filter(tech => tech !== ''); // Lọc bỏ chuỗi rỗng

      technologiesArray.forEach(tech => {
        formDataToSend.append('technologies', tech);
      });

      if (formData.demoUrl) {
        formDataToSend.append('demoUrl', formData.demoUrl);
      }
      if (formData.repositoryUrl) {
        formDataToSend.append('repositoryUrl', formData.repositoryUrl);
      }
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      let response;
      if (editingId) {
        response = await projectsService.update(editingId, formDataToSend);
        setSuccess('Project updated successfully');
      } else {
        response = await projectsService.create(formDataToSend);
        setSuccess('Project created successfully');
        // Thêm project mới vào danh sách ngay lập tức
        if (response && response.project) {
          setProjects(prevProjects => [...prevProjects, response.project]);
        }
      }

      // Reset form
      setFormData({
        name: '',
        description: '',
        title: '',
        technologies: '',
        demoUrl: '',
        repositoryUrl: '',
        image: null
      });
      setImagePreview(null);
      setEditingId(null);

      // Chỉ fetch lại danh sách nếu đang edit project
      if (editingId) {
        await fetchProjects();
      }
    } catch (err) {
      console.error('Error saving project:', err);
      if (err.response?.status === 401) {
        setShowSessionModal(true);
      } else {
        setError(err.response?.data?.message || 'Failed to save project');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (project) => {
    setFormData({
      name: project.name,
      description: project.description,
      title: project.title || '',
      technologies: project.technologies || '',
      demoUrl: project.demoUrl || '',
      repositoryUrl: project.repositoryUrl || '',
      image: null
    });
    setImagePreview(project.image);
    setEditingId(project.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectsService.delete(id);
        setSuccess('Project deleted successfully');
        fetchProjects();
      } catch (err) {
        setError('Failed to delete project');
      }
    }
  };

  const handleReSignIn = () => {
    setShowSessionModal(false);
    navigate('/signin');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Session Expired Modal */}
      {showSessionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Session Expired</h3>
            <p className="text-gray-600 mb-6">
              Your session has expired. Please sign in again to continue.
            </p>
            <div className="flex justify-end">
              <button
                onClick={handleReSignIn}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Sign In Again
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Project Settings</h1>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Edit Project' : 'Add New Project'}
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Technologies (comma-separated)
                </label>
                <input
                  type="text"
                  name="technologies"
                  value={formData.technologies}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
                  placeholder="e.g., React, Node.js, MongoDB"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
                  rows="4"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Demo URL
                </label>
                <input
                  type="url"
                  value={formData.demoUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, demoUrl: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Repository URL
                </label>
                <input
                  type="url"
                  value={formData.repositoryUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, repositoryUrl: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Image
                </label>
                <div className="mt-1 flex items-center space-x-4">
                  {imagePreview && (
                    <div className="relative w-32 h-32">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setFormData(prev => ({ ...prev, image: null }));
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setFormData({
                        name: '',
                        description: '',
                        title: '',
                        technologies: '',
                        demoUrl: '',
                        repositoryUrl: '',
                        image: null
                      });
                      setImagePreview(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : editingId ? 'Update Project' : 'Add Project'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Projects List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {project.imageUrl && (
                <img
                  src={project.imageUrl}
                  alt={project.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200"
                    >
                      Demo
                    </a>
                  )}
                  {project.repositoryUrl && (
                    <a
                      href={project.repositoryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200"
                    >
                      Repository
                    </a>
                  )}
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleEdit(project)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectSettings;