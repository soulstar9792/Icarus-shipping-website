// src/context/AuthContext.js
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const login = (user) => {
    console.log("---AuthContext:login---", user);
    setCurrentUser(user); // Update the user in state
  };

  const logout = () => {
    setCurrentUser(null); // Clear user on logout
  };
  console.log("---AuthContext---", currentUser,children);
  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext); // Custom hook to use Auth context
};