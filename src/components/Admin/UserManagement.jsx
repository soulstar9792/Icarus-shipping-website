// src/components/Admin/UserManagement.js
import React, { useEffect, useState } from 'react';
import Card from '../Utils/Card'; // Ensure you have a Card component
import $GS from '../../styles/constants'; // Import your styles
import axios from 'axios';

const UserManagement = () => {

  const [users, setUsers] = useState([]);
  const getUser = () => {
    return axios.get('https://lcarus-shipping-backend-ce6c088c70be.herokuapp.com/api/auth/users', {
      headers: { 'token': localStorage.getItem('token') },
    });
  }
  useEffect(() => {
    getUser().then(res => {
      setUsers(res.data);
      console.log(users);
    }).catch(err => {
      console.log(err);
    })
  }, []);


  const handleRoleChange = (id, newRole) => {
    axios.post(`http://localhost:5000/api/auth/users/role/${id}`, 
      { user_role: newRole }, // Pass the user_role in the request body
      {
        headers: { 'token': localStorage.getItem('token') }, // Include headers here
      }
    )
    .then(res => {
      console.log(res);
      setUsers(users.map(user => user._id === id ? { ...user, user_role: newRole } : user));
    })
    .catch(err => {
      console.log(err);
    });
  };

  const toggleAccess = (id, activation) => {
    console.log(id, activation);
    axios.post(`https://lcarus-shipping-backend-ce6c088c70be.herokuapp.com/auth/users/activation/${id}`, 
      { activation : activation == 'Allow' ? 'block' : 'allow' }, // Pass the user_activation in the request body
      {
        headers: { 'token': localStorage.getItem('token') }, // Include headers here
      }
    )
    .then(res => {
      console.log(res);
      setUsers(users.map(user => user._id === id ? { ...user, activation: activation == 'Allow' ? 'block' : 'allow' } : user));
    })
    .catch(err => {
      console.log(err);
    });
  };

  const deleteUser = (id) => {
    axios.delete(`http://localhost:5000/api/auth/users/${id}`, {
      headers: { 'token': localStorage.getItem('token') },
    })
    .then(res => {
      console.log(res);
      setUsers(users.filter(user => user._id !== id));
    })
    .catch(err => {
      console.log(err);
    });
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
            {users.map((user) => {
              return (
                <tr key={user.id} className="hover:bg-gray-900">
                  <td className={`border-b border-custom-border px-4 py-2 ${$GS.textNormal_1}`}>{user._id}</td>
                  <td className={`border-b border-custom-border px-4 py-2 ${$GS.textNormal_1}`}>{user.name}</td>
                  <td className={`border-b border-custom-border px-4 py-2 ${$GS.textNormal_1}`}>{user.email}</td>
                  <td className={`border-b border-custom-border px-4 py-2 ${$GS.textNormal_1}`}>
                    <select
                      value={user.user_role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className={`${$GS.inputStyle} px-4 py-2 rounded-md bg-gray-900 border border-custom-border`}
                    >
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                    </select>
                  </td>
                  <td className={`border-b border-custom-border px-4 py-2 ${$GS.textNormal_1}`}>service1</td>
                  <td className={`border-b border-custom-border px-4 py-2`}>
                    <button
                      onClick={(e) => toggleAccess(user._id, e.target.innerHTML)}
                      className={`${$GS.buttonStyle} rounded-md py-1 px-3 ${user.activation === 'allow' ? 'bg-green-500 hover:bg-green-700' : 'bg-red-500 hover:bg-red-700'}`}
                    >
                      {user.activation === 'allow' ? 'Allow' : 'Block'}
                    </button>
                  </td>
                  <td className={`border-b border-custom-border px-4 py-2`}>
                    <button className={`${$GS.buttonStyle} rounded-md py-1 px-3 bg-red-500 hover:bg-red-700 ml-2`} onClick={() => deleteUser(user._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              )
            }
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default UserManagement;