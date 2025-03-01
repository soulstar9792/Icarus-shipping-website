// src/components/Admin/UserManagement.js
import React, { useEffect, useState } from "react";
import Card from "../Utils/Card"; // Ensure you have a Card component
import $GS from "../../styles/constants"; // Import your styles
import axios from "axios";
import Loading from "../Loading";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility
  const [selectedUser, setSelectedUser] = useState(null); // State to hold currently selected user for update
  const [newBalance, setNewBalance] = useState(""); // State for balance input

  const getUser = () => {
    return axios.get(
      `${process.env.REACT_APP_API_URL}/api/auth/users`,
      {
        headers: { token: localStorage.getItem("token") },
      }
    );
  };

  useEffect(() => {
    getUser()
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const handleRoleChange = (id, newRole) => {
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/api/auth/users/role/${id}`,
        { user_role: newRole },
        {
          headers: { token: localStorage.getItem("token") },
        }
      )
      .then((res) => {
        setUsers(
          users.map((user) =>
            user._id === id ? { ...user, user_role: newRole } : user
          )
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleBalanceChange = (id, balance) => {
    // Update the state immediately for better user experience
    setUsers(
      users.map((user) => (user._id === id ? { ...user, balance } : user))
    );
    return balance;
  };
  const handleSubmitUpdate = (id, balance) => {
    setUsers(
      users.map((user) => (user._id === id ? { ...user, balance } : user))
    );
    setNewBalance(balance); // Store the balance temporarily
    setShowModal(true); // Show modal
    setSelectedUser(id); // Set the selected user
  };

  const confirmBalanceUpdate = () => {
    if (selectedUser) {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/api/auth/users/balance/${selectedUser}`,
          { balance: newBalance },
          {
            headers: { token: localStorage.getItem("token") },
          }
        )
        .then((res) => {
          setUsers(
            users.map((user) =>
              user._id === selectedUser
                ? { ...user, balance: newBalance }
                : user
            )
          );
          setShowModal(false); // Close modal after updating
          setNewBalance(""); // Reset balance
          setSelectedUser(null); // Reset selected user
        })
        .catch((err) => {
          console.log(err);
          setShowModal(false); // Close modal even on error
        });
    }
  };

  const toggleAccess = (id, activation) => {
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/api/auth/users/activation/${id}`,
        { activation: activation === "Allow" ? "block" : "allow" },
        {
          headers: { token: localStorage.getItem("token") },
        }
      )
      .then((res) => {
        setUsers(
          users.map((user) =>
            user._id === id
              ? {
                  ...user,
                  activation: activation === "Allow" ? "block" : "allow",
                }
              : user
          )
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteUser = (id) => {
    axios
      .delete(
        `${process.env.REACT_APP_API_URL}/api/auth/users/${id}`,
        {
          headers: { token: localStorage.getItem("token") },
        }
      )
      .then((res) => {
        setUsers(users.filter((user) => user._id !== id));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="px-4 md:px-10 py-10 md:py-20 bg-custom-background">
      <h2 className={`${$GS.textHeading_2} mb-6`}>User Management</h2>

      {/* User List */}
      {loading ? (
        <Loading />
      ) : (
        <Card>
          <h3 className={`${$GS.textHeading_3} mb-4`}>User List</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-transparent border border-custom-border">
              <thead>
                <tr className="bg-custom-background text-white text-left">
                  <th className="px-2 py-2 border-b border-custom-border text-sm md:text-base">
                    ID
                  </th>
                  <th className="px-2 py-2 border-b border-custom-border text-sm md:text-base">
                    Name
                  </th>
                  <th className="px-2 py-2 border-b border-custom-border text-sm md:text-base">
                    Email
                  </th>
                  <th className="px-2 py-2 border-b border-custom-border text-sm md:text-base">
                    Role
                  </th>
                  <th className="px-2 py-2 border-b border-custom-border text-sm md:text-base">
                    Services
                  </th>
                  <th className="px-2 py-2 border-b border-custom-border text-sm md:text-base">
                    Balance
                  </th>
                  <th className="px-2 py-2 border-b border-custom-border text-sm md:text-base"></th>
                  <th className="px-2 py-2 border-b border-custom-border text-sm md:text-base">
                    Access
                  </th>
                  <th className="px-2 py-2 border-b border-custom-border text-sm md:text-base">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  return (
                    <tr key={user._id} className="hover:bg-gray-900">
                      <td
                        className={`border-b border-custom-border px-2 py-2 text-sm md:text-base ${$GS.textNormal_1}`}
                      >
                        {user._id}
                      </td>
                      <td
                        className={`border-b border-custom-border px-2 py-2 text-sm md:text-base ${$GS.textNormal_1}`}
                      >
                        {user.name}
                      </td>
                      <td
                        className={`border-b border-custom-border px-2 py-2 text-sm md:text-base ${$GS.textNormal_1}`}
                      >
                        {user.email}
                      </td>
                      <td
                        className={`border-b border-custom-border px-2 py-2 text-sm md:text-base ${$GS.textNormal_1}`}
                      >
                        <select
                          value={user.user_role}
                          onChange={(e) =>
                            handleRoleChange(user._id, e.target.value)
                          }
                          className={`${$GS.inputStyle} bg-gray-900 border border-custom-border px-2 py-1 rounded-md`}
                        >
                          <option value="admin">Admin</option>
                          <option value="user">User</option>
                        </select>
                      </td>
                      <td
                        className={`border-b border-custom-border px-2 py-2 text-sm md:text-base ${$GS.textNormal_1}`}
                      >
                        service1
                      </td>
                      <td
                        className={`border-b border-custom-border px-2 py-2 text-sm md:text-base ${$GS.textNormal_1}`}
                      >
                        <input
                          type="text"
                          value={user.balance}
                          onChange={(e) =>
                            handleBalanceChange(user._id, e.target.value)
                          }
                          className={`${$GS.inputStyle} bg-gray-900 border border-custom-border px-2 py-1 rounded-md w-[100px]`}
                        />
                      </td>
                      <td
                        className={`border-b border-custom-border px-2 py-2 text-sm md:text-base ${$GS.textNormal_1}`}
                      >
                        <button
                          className={`${$GS.buttonStyle} rounded-md py-1 px-2 bg-blue-500 hover:bg-blue-700 ml-1`}
                          onClick={() =>
                            handleSubmitUpdate(user._id, user.balance)
                          }
                        >
                          Update
                        </button>
                      </td>
                      <td className={`border-b border-custom-border px-2 py-2`}>
                        <button
                          onClick={(e) =>
                            toggleAccess(user._id, e.target.innerHTML)
                          }
                          className={`${$GS.buttonStyle} rounded-md py-1 px-2 ${
                            user.activation === "allow"
                              ? "bg-green-500 hover:bg-green-700"
                              : "bg-red-500 hover:bg-red-700"
                          }`}
                        >
                          {user.activation === "allow" ? "Allow" : "Block"}
                        </button>
                      </td>
                      <td className={`border-b border-custom-border px-2 py-2`}>
                        <button
                          className={`${$GS.buttonStyle} rounded-md py-1 px-2 bg-red-500 hover:bg-red-700 ml-1`}
                          onClick={() => deleteUser(user._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      <ConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmBalanceUpdate}
        balance={newBalance}
      />
    </div>
  );
};

export default UserManagement;

const ConfirmModal = ({ isOpen, onClose, onConfirm, balance }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
      <div className="bg-white rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Confirm Balance Update</h3>
        <p>
          Are you sure you want to update the balance to{" "}
          <strong>${balance}</strong>?
        </p>
        <div className="mt-6 flex justify-between">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={onConfirm}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};
