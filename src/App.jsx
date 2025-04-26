import React, { useState, useEffect } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';

const App = () => {
  const [projects, setProjects] = useState({});
  const [currentProjectName, setCurrentProjectName] = useState('');
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [descInput, setDescInput] = useState('');
  const [dueInput, setDueInput] = useState('');
  const [priorityInput, setPriorityInput] = useState('Medium');

  useEffect(() => {
    const storedData = localStorage.getItem('todoData');
    if (storedData) {
      const { projects: storedProjects, currentProjectName: storedCurrentProjectName } = JSON.parse(storedData);
      setProjects(storedProjects || {});
      setCurrentProjectName(storedCurrentProjectName || '');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todoData', JSON.stringify({ projects, currentProjectName }));
  }, [projects, currentProjectName]);

  const handleProjectSwitch = (e) => {
    setCurrentProjectName(e.target.value);
  };

  const handleCreateProject = () => {
    const name = prompt('Enter project name:');
    if (name && !projects[name]) {
      setProjects(prevProjects => ({ ...prevProjects, [name]: { name, tasks: [] } }));
      setCurrentProjectName(name);
    }
  };

  const handleRenameProject = () => {
    if (!currentProjectName) {
      alert('Please select a project first.');
      return;
    }

    const newName = prompt('Enter new project name:', currentProjectName);
    if (newName && newName !== currentProjectName && !projects[newName]) {
      setProjects(prevProjects => {
        const newProjects = { ...prevProjects };
        newProjects[newName] = { ...newProjects[currentProjectName], name: newName };
        delete newProjects[currentProjectName];
        return newProjects;
      });
      setCurrentProjectName(newName);
    }
  };

  const handleDeleteProject = () => {
    if (!currentProjectName) {
      alert('Please select a project first.');
      return;
    }

    if (window.confirm(`Delete project "${currentProjectName}"?`)) {
      setProjects(prevProjects => {
        const newProjects = { ...prevProjects };
        delete newProjects[currentProjectName];
        
        // Set current project to the next available project, or reset it if none remain
        const remainingProjects = Object.keys(newProjects);
        if (remainingProjects.length > 0) {
          setCurrentProjectName(remainingProjects[0]); // Set to the first available project
        } else {
          setCurrentProjectName(''); // No projects left, clear the current project
        }

        return newProjects;
      });
    }
  };

  const handleAddTask = () => {
    // if (Object.keys(projects).length === 0) {
    //   alert("Please create a project first.");
    //   return;
    // }
    if (!currentProjectName) {
      alert('Please select a project first.');
      return;
    }

    if (!titleInput.trim()) return;

    const newTask = {
      id: uuidv4(),
      title: titleInput,
      description: descInput,
      dueDate: dueInput,
      priority: priorityInput,
      completed: false,
    };

    setProjects(prevProjects => ({
      ...prevProjects,
      [currentProjectName]: {
        ...prevProjects[currentProjectName],
        tasks: [...(prevProjects[currentProjectName]?.tasks || []), newTask],
      },
    }));

    setTitleInput('');
    setDescInput('');
    setDueInput('');
    setPriorityInput('Medium');
  };

  const handleTaskToggle = (taskId) => {
    setProjects(prevProjects => {
      const updatedTasks = prevProjects[currentProjectName].tasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );
      return {
        ...prevProjects,
        [currentProjectName]: { ...prevProjects[currentProjectName], tasks: updatedTasks },
      };
    });
  };

  const handleTaskDelete = (taskId) => {
    setProjects(prevProjects => {
      const updatedTasks = prevProjects[currentProjectName].tasks.filter(task => task.id !== taskId);
      return {
        ...prevProjects,
        [currentProjectName]: { ...prevProjects[currentProjectName], tasks: updatedTasks },
      };
    });
  };

  const sortedTasks = currentProjectName && projects[currentProjectName]
    ? [...projects[currentProjectName].tasks].sort((a, b) => {
      const priorityOrder = { High: 1, Medium: 2, Low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
    : [];

  const toggleSidebar = () => {
    setIsSidebarActive(!isSidebarActive);
  };

  // Fetch random activity from Bored API and set it to the task title input
  const fetchRandomActivity = async () => {
    try {
      const response = await fetch('https://bored.api.lewagon.com/api/activity');
      const data = await response.json();

      const randomActivity = data.activity;

      // Ensure activity is returned
      if (!randomActivity) {
        alert('No random activity found!');
        return;
      }

      // Set the random activity as the task title input
      setTitleInput(randomActivity);
    } catch (error) {
      alert("Failed to fetch activity.");
    }
  };

  return (
    <>
      <div id="sidebar" className={`sidebar ${isSidebarActive ? 'active' : ''}`}>
        <div className="sidebar-content">
          <h4><b>Project List</b></h4>
          <select id="projectDropdown" value={currentProjectName} onChange={handleProjectSwitch}>
            {/* If no projects, show the "Select a project" option */}
            {Object.keys(projects).length === 0 ? (
              <option value="">Select a project</option>
            ) : null}

            {/* Display the list of projects */}
            {Object.keys(projects).map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          <button onClick={handleCreateProject}>Add Project</button>
          <button onClick={handleRenameProject}>Rename Current Project</button>
          <button onClick={handleDeleteProject}>Delete Current Project</button>
        </div>
      </div>

      <div id="burger" className="burger" onClick={toggleSidebar}>
        &#9776;
      </div>

      <div className="container">
        <h1>TODO List</h1>
        {currentProjectName && <h2 id="currentProjectName">Current Project: {currentProjectName}</h2>} {/* Show the current project */}

        <div className="add-task-form">
          <input
            type="text"
            id="titleInput"
            placeholder="Task Title"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
          />
          <input
            type="text"
            id="descInput"
            placeholder="Description"
            value={descInput}
            onChange={(e) => setDescInput(e.target.value)}
          />
          <input
            type="date"
            id="dueInput"
            value={dueInput}
            onChange={(e) => setDueInput(e.target.value)}
          />
          <select
            id="priorityInput"
            value={priorityInput}
            onChange={(e) => setPriorityInput(e.target.value)}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <button onClick={handleAddTask} disabled={!currentProjectName}>
            Add Task
          </button>
          <button onClick={fetchRandomActivity}>Get Random Activity</button>
        </div>

        <ul id="taskList">
          {sortedTasks.map(task => (
            <li key={task.id} className={`priority-${task.priority.toLowerCase()}`}>
              <span
                style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
                onClick={() => handleTaskToggle(task.id)}
              >
                {task.title}
              </span>
              <div>{task.description}</div>
              <div>Due: {task.dueDate}</div>
              <div>Priority: {task.priority}</div>
              <button onClick={() => handleTaskDelete(task.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default App;
