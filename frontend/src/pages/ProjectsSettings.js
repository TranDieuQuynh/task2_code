import React, { useState } from 'react';

function ProjectsSettings() {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: '',
      description: '',
      technologies: '',
      link: '',
      image: null
    }
  ]);

  const handleProjectChange = (index, field, value) => {
    const updatedProjects = [...projects];
    updatedProjects[index] = {
      ...updatedProjects[index],
      [field]: value
    };
    setProjects(updatedProjects);
  };

  const addProject = () => {
    setProjects([
      ...projects,
      {
        id: projects.length + 1,
        name: '',
        description: '',
        technologies: '',
        link: '',
        image: null
      }
    ]);
  };

  const removeProject = (index) => {
    const updatedProjects = projects.filter((_, i) => i !== index);
    setProjects(updatedProjects);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement projects update logic
    console.log('Update projects:', projects);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Projects Settings
            </h3>
            <div className="mt-5">
              <form onSubmit={handleSubmit} className="space-y-6">
                {projects.map((project, index) => (
                  <div key={project.id} className="border-b border-gray-200 pb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-md font-medium text-gray-900">
                        Project {index + 1}
                      </h4>
                      {projects.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeProject(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label htmlFor={`project-name-${index}`} className="block text-sm font-medium text-gray-700">
                          Project Name
                        </label>
                        <input
                          type="text"
                          id={`project-name-${index}`}
                          value={project.name}
                          onChange={(e) => handleProjectChange(index, 'name', e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label htmlFor={`project-description-${index}`} className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <textarea
                          id={`project-description-${index}`}
                          rows={3}
                          value={project.description}
                          onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label htmlFor={`project-technologies-${index}`} className="block text-sm font-medium text-gray-700">
                          Technologies
                        </label>
                        <input
                          type="text"
                          id={`project-technologies-${index}`}
                          value={project.technologies}
                          onChange={(e) => handleProjectChange(index, 'technologies', e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="e.g., React, Node.js, MongoDB"
                        />
                      </div>

                      <div>
                        <label htmlFor={`project-link-${index}`} className="block text-sm font-medium text-gray-700">
                          Project Link
                        </label>
                        <input
                          type="url"
                          id={`project-link-${index}`}
                          value={project.link}
                          onChange={(e) => handleProjectChange(index, 'link', e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Project Image</label>
                        <div className="mt-1 flex items-center">
                          <span className="inline-block h-24 w-24 rounded-lg overflow-hidden bg-gray-100">
                            {/* TODO: Add project image preview */}
                          </span>
                          <button
                            type="button"
                            className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Change
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={addProject}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add Project
                  </button>

                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectsSettings; 