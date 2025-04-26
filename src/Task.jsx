import React from 'react';

const Task = ({ task, toggleComplete, deleteTask }) => {
  return (
    <li className={`priority-${task.priority.toLowerCase()}`}>
      <span
        className={task.completed ? 'completed' : ''}
        onClick={() => toggleComplete(task.id)}
      >
        {task.title}
      </span>
      <div>{task.description}</div>
      <div>Due: {task.dueDate}</div>
      <div>Priority: {task.priority}</div>
      <button onClick={() => deleteTask(task.id)}>Delete</button>
    </li>
  );
};

export default Task;
