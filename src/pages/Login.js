// src/pages/Login.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading } = useSelector((state) => state.auth);
  const [errorMessage, setErrorMessage] = useState("");
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await dispatch(login({ email, password })).unwrap(); // Unwrap to check for errors
      navigate("/main/dashboard"); // Redirect to a different route after successful login
    } catch (err) {
      console.error("Login failed:", err.message);
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-custom-background">
      <div className="flex flex-col items-center bg-card-background rounded-lg p-10 md:p-12 border border-custom-border shadow-xl transition-all duration-300 hover:shadow-bright w-full max-w-md">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-text-emphasizing mb-4">
          Welcome Back!
        </h2>
        {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )}
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              className="block text-text-normal font-semibold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-4 border border-custom-border bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                console.log(email);
              }}
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-text-normal font-semibold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-4 border border-custom-border bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-4 bg-sapphire text-white rounded-md hover:bg-sapphire-hover transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="text-center mt-6">
          <p className="text-text-normal text-sm md:text-base">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-sapphire border-sapphire-hover font-semibold hover:text-sapphire-hover"
            >
              Register
            </Link>
          </p>
        </div>
        <div className="text-center mt-4">
          <Link
            to="/forgot-password"
            className="text-sapphire border-sapphire-hover hover:underline hover:text-sapphire-hover text-sm md:text-base"
          >
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
