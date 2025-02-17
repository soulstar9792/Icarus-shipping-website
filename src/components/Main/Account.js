import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Card from "../Utils/Card";
import $GS from "../../styles/constants";

const Account = () => {
  const currentUser = useSelector((state) => state.auth.user); // Get user from Redux store

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Populate the form with user data when available
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        email: currentUser.email || "",
        password: "", // Leave password empty for security reasons
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to submit form data to your API or service
  };

  return (
    <div className="account-container px-4 md:px-10 py-10 md:py-20 bg-custom-background">
      <Card>
        <h2 className={`${$GS.textHeading_2} mb-4`}>Manage Your Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className={`${$GS.textNormal_1} mb-2 block`} htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border border-custom-border p-2 w-full bg-transparent text-custom-text"
              required
            />
          </div>
          <div className="mb-4">
            <label className={`${$GS.textNormal_1} mb-2 block`} htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border border-custom-border p-2 w-full bg-transparent text-custom-text"
              required
              disabled // Prevent email changes
            />
          </div>
          <div className="mb-4">
            <label
              className={`${$GS.textNormal_1} mb-2 block`}
              htmlFor="password"
            >
              Password (Leave empty to keep unchanged)
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="border border-custom-border p-2 w-full bg-transparent text-custom-text"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Update Account
          </button>
        </form>
      </Card>
    </div>
  );
};

export default Account;
