// src/components/Main/Dashboard.js
import React from 'react';
import { useAuth } from '../../context/AuthContext'; // Adjust import to match your structure

const Dashboard = () => {
  const { currentUser } = useAuth(); // Accessing Auth context

  console.log("Current User in Dashboard", currentUser); // Log current user state

  // Mock data simulating fetched data from a backend
  const mockData = [
    { id: 1, title: 'Dashboard Item 1', description: 'Description for item 1' },
    { id: 2, title: 'Dashboard Item 2', description: 'Description for item 2' },
  ];

  return (
    <div>
      <h1>Dashboard</h1>
      <ul>
        {mockData.map(item => (
          <li key={item.id}>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;