import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (name && email && password && confirmPassword ) {
      try {
        const response = await fetch('https://lcarus-shipping-backend-ce6c088c70be.1111111herokuapp.com/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, confirmPassword }),
        });
        const data = await response.json();

        if (response.ok) {
          console.log('Registration successful'); // Handle success
          navigate('/login'); // Redirect to login on success
        } else {
          setError(data.message || 'Registration failed');
        }
      } catch (err) {
        setError('An error occurred. Please try again.');
      }
    } else {
      setError('Please fill in all fields');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-custom-background">
      <div className="flex flex-col items-center bg-card-background rounded-lg p-10 md:p-12 border border-custom-border shadow-xl transition-all duration-300 
                      hover:shadow-bright w-full max-w-md"> 
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-text-emphasizing mb-4">Create an Account</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form className='w-full' onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-text-normal font-semibold mb-2" htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              className="w-full p-4 border border-custom-border bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-text-normal font-semibold mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="w-full p-4 border border-custom-border bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-text-normal font-semibold mb-2" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="w-full p-4 border border-custom-border bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-8">
            <label className="block text-text-normal font-semibold mb-2" htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full p-4 border border-custom-border bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full p-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
            Register
          </button>
        </form>
        <div className="text-center mt-6">
          <p className="text-text-normal text-sm md:text-base">Already have an account? <Link to="/login" className="text-purple-600 font-semibold">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;