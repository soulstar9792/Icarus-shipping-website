import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUser = () => {
    return axios.get('https://lcarus-shipping-backend-ce6c088c70be.herokuapp.com/api/auth/users', {
      headers: { 'token': localStorage.getItem('token') },
    });
  };

  useEffect(() => {
    getUser().then(res => {
      setUsers(res.data);
      setLoading(false);
    }).catch(err => {
      console.log(err);
      setLoading(false);
    });
  }, []);

  const handleCostChange = async (userId, service, costType, value) => {
    try {
      // Optimistically update the state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId
            ? {
                ...user,
                services: user.services.map((serviceObj) => ({
                  ...serviceObj,
                  services: {
                    ...serviceObj.services,
                    [service]: {
                      ...serviceObj.services[service],
                      [costType]: value, // Update the specific cost
                    },
                  },
                })),
              }
            : user
        )
      );
  
      // Make the API call
      const response = await axios.post(
        `https://lcarus-shipping-backend-ce6c088c70be.herokuapp.com/api/orders/service-price/${userId}`,
        {
          service,
          costType,
          value,
        }
      );
  
      console.log("Response from server:", response.data);
    } catch (err) {
      console.error("Error updating cost:", err);
    }
  };
  

  return (
    <div className="min-h-screen bg-custom-background text-white p-8">
      <h2 className="text-2xl font-bold mb-6">Set Service Prices</h2>
      {loading ? (
        <div className="flex justify-center items-center">Loading...</div>
      ) : (
          <div>
            <div className="overflow-x-auto">
            <h2 className="text-2xl font-bold p-2 ">UPS Services </h2>
          <table className="w-full border-collapse bg-black">
            <thead>
              <tr className="bg-black">
                <th className="px-6 py-3 text-left border border-gray-600">User</th>
                {users[0]?.services[0]?.services && Object.keys(users[0].services[0].services).map(service => 
                  <th key={service} className="px-6 py-3 text-left border border-gray-600" colSpan={2}>{service}</th>
                )}
              </tr>
              
              <tr className="bg-black">
                <th className="px-6 py-3 text-left border border-gray-600"></th>
                {users[0]?.services[0]?.services && Object.keys(users[0].services[0].services).map(service => [
                  <th key={`${service}-standard`} className="px-6 py-3 text-left border border-gray-600">Standard</th>,
                  <th key={`${service}-manifested`} className="px-6 py-3 text-left border border-gray-600">Manifested</th>
                ])}
              </tr>
              <tr className="bg-gray-800">
    <th className="px-6 py-3 text-left border border-gray-600">Standard Prices</th>
    {users[0]?.services[0]?.services && Object.keys(users[0].services[0].services).map(service => [
      <td key={`${service}-static-standard`} className="px-6 py-3 text-center border border-gray-600">

        0.5 
      </td>,
      <td key={`${service}-static-manifested`} className="px-6 py-3 text-center border border-gray-600">
        0.9
      </td>
    ])}
  </tr>
</thead>
            <tbody>
              
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-black">
                  <td className="px-6 py-4 border border-black">{user.name}</td>
                  {Object.entries(user.services[0]?.services || {}).map(([service, prices]) => [
                    <td key={`${user._id}-${service}-standard`} className="px-6 py-4 border border-black">
                      <input
                        type="number"
                        value={prices.standard_cost || ''}
                        onChange={(e) => handleCostChange(user._id, service, 'standard_cost', e.target.value)}
                        className="w-24 px-2 py-1 bg-gray-700 border border-gray-600 rounded"
                      />
                    </td>,
                    <td key={`${user._id}-${service}-manifested`} className="px-6 py-4 border border-gray-600">
                      <input
                        type="number"
                        value={prices.manifested_cost || ''}
                        onChange={(e) => handleCostChange(user._id, service, 'manifested_cost', e.target.value)}
                        className="w-24 px-2 py-1 bg-gray-700 border border-gray-600 rounded"
                      />
                    </td>
                  ])}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-12 overflow-x-auto">
            <h2 className="text-2xl font-bold p-2 ">USPS Services </h2>
          <table className="w-full border-collapse bg-black">
            <thead>
              <tr className="bg-black">
                <th className="px-6 py-3 text-left border border-gray-600">User</th>
                {users[1]?.services[1]?.services && Object.keys(users[1].services[1].services).map(service => 
                  <th key={service} className="px-6 py-3 text-left border border-gray-600" colSpan={2}>{service}</th>
                )}
              </tr>
              <tr className="bg-black">
                <th className="px-6 py-3 text-left border border-gray-600"></th>
                {users[1]?.services[1]?.services && Object.keys(users[1].services[1].services).map(service => [
                  <th key={`${service}-standard`} className="px-6 py-3 text-left border border-gray-600">Standard</th>,
                  <th key={`${service}-manifested`} className="px-6 py-3 text-left border border-gray-600">Manifested</th>
                ])}
              </tr>
              <tr className="bg-black">
                <th className="px-6 py-3 text-left border border-gray-600"></th>
                {users[0]?.services[0]?.services && Object.keys(users[0].services[0].services).map(service => [
                  <th key={`${service}-standard`} className="px-6 py-3 text-left border border-gray-600">Standard</th>,
                  <th key={`${service}-manifested`} className="px-6 py-3 text-left border border-gray-600">Manifested</th>
                ])}
              </tr>
              <tr className="bg-gray-800">
    <th className="px-6 py-3 text-left border border-gray-600">Standard Prices</th>
    {users[0]?.services[0]?.services && Object.keys(users[0].services[0].services).map(service => [
      <td key={`${service}-static-standard`} className="px-6 py-3 text-center border border-gray-600">
        0.1
      </td>,
      <td key={`${service}-static-manifested`} className="px-6 py-3 text-center border border-gray-600">
        0
      </td>
    ])}
  </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-black">
                  <td className="px-6 py-4 border border-black">{user.name}</td>
                  {Object.entries(user.services[1]?.services || {}).map(([service, prices]) => [
                    <td key={`${user._id}-${service}-standard`} className="px-6 py-4 border border-black">
                        
                      <input
                        type="number"
                        value={prices.standard_cost}
                        onChange={(e) => handleCostChange(user._id, service, 'standard_cost', e.target.value)}
                        className="w-24 px-2 py-1 bg-gray-700 border border-gray-600 rounded"
                      />
                    </td>,
                    <td key={`${user._id}-${service}-manifested`} className="px-6 py-4 border border-gray-600">
                      <input
                        type="number"
                        value={prices.manifested_cost}
                        onChange={(e) => handleCostChange(user._id, service, 'manifested_cost', e.target.value)}
                        className="w-24 px-2 py-1 bg-gray-700 border border-gray-600 rounded"
                      />
                    </td>
                  ])}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
          </div>
      )}
    </div>
  );
}

export default App;