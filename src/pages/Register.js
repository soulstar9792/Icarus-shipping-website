import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (name && email && password && confirmPassword) {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/auth/register`,
          { name, email, password, confirmPassword }
        );
        if (response.data.ok) {
          console.log("Registration successful");
          navigate("/login");
        } else {
          setError(response.data.message || "Registration failed");
        }
      } catch (err) {
        setError(
          err.response.data.message || "An error occurred. Please try again."
        );
      }
    } else {
      setError("Please fill in all fields");
    }
  };

  return (
    <div className="flex  items-center justify-center min-h-screen bg-custom-background p-4">
      <div className="flex mt-20 flex-col items-center bg-card-background rounded-lg p-8 border border-custom-border shadow-xl transition-all duration-300 hover:shadow-bright h-fit w-[450px]">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-text-emphasizing mb-6">
          Create an Account
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form className="w-full space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              className="block text-text-normal font-semibold mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full p-3 border border-custom-border bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              className="block text-text-normal font-semibold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 border border-custom-border bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              className="block text-text-normal font-semibold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-3 border border-custom-border bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              className="block text-text-normal font-semibold mb-2"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full p-3 border border-custom-border bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-4 mt-6 bg-sapphire text-white rounded-md hover:bg-sapphire-hover transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            Register
          </button>
        </form>
        <div className="text-center mt-6">
          <p className="text-text-normal text-base">
            Already have an account?{" "}
            <Link to="/login" className="text-sapphire font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;