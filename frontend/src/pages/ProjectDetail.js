import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectsService, API_URL } from '../../src/services/api';

const BACKEND_BASE_URL = API_URL.replace('/api', '');

function ProjectDetail() {
  const { id } = useParams();
  console.log('ProjectDetail: id from useParams', id);
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        console.log('ProjectDetail: Fetching project with ID:', id);
        const response = await projectsService.getById(id);
        if (response && response.data) {
          const fetchedProject = {
            ...response.data,
            imageUrl: response.data.image ? `${BACKEND_BASE_URL}/uploads/${response.data.image.replace(/^\/uploads\/+|\/+/g, '')}` : null,
          };
          setProject(fetchedProject);
        } else {
          setError('Project not found');
        }
      } catch (err) {
        console.error('Error fetching project details:', err);
        setError('Failed to load project details.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading project details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600">{error}</p>
        <button onClick={() => navigate('/portfolio')} className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Go to Portfolio</button>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Project not found.</p>
        <button onClick={() => navigate('/portfolio')} className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Go to Portfolio</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <button
        onClick={() => navigate(-1)} // Go back to previous page
        className="mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
      >
        &larr; Back to Portfolio
      </button>

      {project.imageUrl && (
        <div className="mb-6 relative h-96 w-full rounded-lg overflow-hidden">
          <img src={project.imageUrl} alt={project.title} className="object-cover w-full h-full" />
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Project Title</h2>
        <p className="text-gray-700 text-lg">{project.title}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Description</h2>
        <p className="text-gray-700 text-lg">{project.description}</p>
      </div>

      {project.technologies && project.technologies.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Technologies Used</h2>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech, index) => (
              <span key={index} className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-4 mb-6">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 rounded-full text-base font-medium bg-blue-100 text-blue-800 hover:bg-blue-200"
          >
            Demo URL
          </a>
        )}
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 rounded-full text-base font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
          >
            Repository URL
          </a>
        )}
      </div>

      {/* Add more project details here as needed */}
    </div>
  );
}

export default ProjectDetail; 