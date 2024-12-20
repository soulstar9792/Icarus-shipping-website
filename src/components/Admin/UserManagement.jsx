// src/components/Admin/UserManagement.js
import React, { useEffect, useState } from 'react';
import Card from '../Utils/Card'; // Ensure you have a Card component
import $GS from '../../styles/constants'; // Import your styles

const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', services: ['Service A'], hasAccess: true },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', services: ['Service B'], hasAccess: false },
  ]);

  const handleRoleChange = (id, newRole) => {
    setUsers(users.map(user => user.id === id ? { ...user, role: newRole } : user));
  };

  const toggleAccess = (id) => {
    setUsers(users.map(user => user.id === id ? { ...user, hasAccess: !user.hasAccess } : user));
  };

  return (
    <div className="px-4 md:px-10 py-10 md:py-20 bg-custom-background">
      <h2 className={`${$GS.textHeading_2} mb-6`}>User Management</h2>

      {/* User List */}
      <Card>
        <h3 className={`${$GS.textHeading_3} mb-4`}>User List</h3>
        <table className="min-w-full bg-transparent border border-custom-border">
          <thead>
            <tr className="bg-custom-background text-white text-left">
              <th className="px-4 py-2 border-b border-custom-border">ID</th>
              <th className="px-4 py-2 border-b border-custom-border">Name</th>
              <th className="px-4 py-2 border-b border-custom-border">Email</th>
              <th className="px-4 py-2 border-b border-custom-border">Role</th>
              <th className="px-4 py-2 border-b border-custom-border">Services</th>
              <th className="px-4 py-2 border-b border-custom-border">Access</th>
              <th className="px-4 py-2 border-b border-custom-border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-900">
                <td className={`border-b border-custom-border px-4 py-2 ${$GS.textNormal_1}`}>{user.id}</td>
                <td className={`border-b border-custom-border px-4 py-2 ${$GS.textNormal_1}`}>{user.name}</td>
                <td className={`border-b border-custom-border px-4 py-2 ${$GS.textNormal_1}`}>{user.email}</td>
                <td className={`border-b border-custom-border px-4 py-2 ${$GS.textNormal_1}`}>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className={`${$GS.inputStyle} px-4 py-2 rounded-md bg-gray-900 border border-custom-border`}
                  >
                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
                  </select>
                </td>
                <td className={`border-b border-custom-border px-4 py-2 ${$GS.textNormal_1}`}>{user.services.join(', ')}</td>
                <td className={`border-b border-custom-border px-4 py-2`}>
                  <button
                    onClick={() => toggleAccess(user.id)}
                    className={`${$GS.buttonStyle} rounded-md py-1 px-3 ${user.hasAccess ? 'bg-green-500 hover:bg-green-700' : 'bg-red-500 hover:bg-red-700'}`}
                  >
                    {user.hasAccess ? 'Access Granted' : 'Access Revoked'}
                  </button>
                </td>
                <td className={`border-b border-custom-border px-4 py-2`}>
                  <button className={`${$GS.buttonStyle} rounded-md py-1 px-3 bg-red-500 hover:bg-red-700 ml-2`}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default UserManagement;