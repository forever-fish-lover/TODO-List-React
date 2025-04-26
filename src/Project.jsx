import React from 'react';

const Project = ({
  projects,
  currentProjectName,
  switchProject,
  createProject,
  renameProject,
  deleteProject
}) => {
  return (
    <div className="project-control">
      <select
        id="projectDropdown"
        value={currentProjectName}
        onChange={(e) => switchProject(e.target.value)}
      >
        {Object.keys(projects).map(name => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
      <button onClick={createProject}>Add Project</button>
      <button onClick={renameProject}>Rename Current Project</button>
      <button onClick={deleteProject}>Delete Current Project</button>
    </div>
  );
};

export default Project;
