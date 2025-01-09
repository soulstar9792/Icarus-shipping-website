import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';
import { FiSend, FiUser,  FiTrash2, FiX } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import states from '../../states.json';

const AddressForm = ({ type, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState(initialData);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1a1a1a] rounded-lg p-8 w-full max-w-3xl border border-[#333333]">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-white">
            {type === 'sender' ? 'From Address' : 'To Address'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#242424] border border-[#333333] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Company / Reference Number (optional)
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#242424] border border-[#333333] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Phone *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-[#242424] border border-[#333333] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Street *
            </label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-[#242424] border border-[#333333] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Street 2 (optional)
            </label>
            <input
              type="text"
              name="street2"
              value={formData.street2}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-[#242424] border border-[#333333] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#242424] border border-[#333333] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                State *
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#242424] border border-[#333333] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select state...</option>
                {states.map(state => (
                  <option key={state.abbreviation} value={state.abbreviation}>{state.state}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                ZIP *
              </label>
              <input
                type="text"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#242424] border border-[#333333] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Country *
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#242424] border border-[#333333] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="United States">United States</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Save Address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Address = () => {
  const user = useSelector(state => state.auth.user);
  const [isSenderModalOpen, setSenderModalOpen] = useState(false);
  const [isReceiverModalOpen, setReceiverModalOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);

  const initialAddressState = {
    name: '',
    company: '',
    phone: '',
    street: '',
    street2: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States'
  };

  const getSavedAddresss = async () => {
    try {
      const response = await axios.get(`https://lcarus-shipping-backend-ce6c088c70be.herokuapp.com/api/auth/get-address/${user._id}`, { 
        headers: { "Content-Type": "application/json" } 
      });
      setAddresses(response.data.savedAddress);
    } catch (e) {
      console.log("Error Occurred", e);
    }
  };

  useEffect(() => {
    getSavedAddresss();
  }, []);

  const handleSubmit = async (formData) => {
    try {
      console.log("the form data", formData); 
      const response = await axios.post(
        `https://lcarus-shipping-backend-ce6c088c70be.herokuapp.com/api/auth/save-address/${user._id}`,
        {  formData },
        { headers: { "Content-Type": "application/json" } }
      );
      setAddresses([...addresses, formData]);
      setSenderModalOpen(false);
      setReceiverModalOpen(false);
    } catch (e) {
      console.log("Error Occurred", e);
    }
  };

  const handleDelete = async (id) => {
        try {
          const response = await axios.post(
            `https://lcarus-shipping-backend-ce6c088c70be.herokuapp.com/api/auth/delete-address/${user._id}`,
            { id},
            { headers: { "Content-Type": "application/json" } }
          );
          setAddresses((addresses)=>addresses.filter((ad)=>ad._id!=id)); 
          console.log(response)
        } catch (error) {
          console.log("Error Occured ",error); 
        }
      }
      
  

  return (
    <div className="min-h-screen bg-custom-black p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <div>
          <h1 className="text-4xl font-bold text-white mb-4">Saved Addresses</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {addresses.map((address, index) => (
              <div
                key={index}
                className="bg-custom-black p-8 rounded-lg border border-[#333333] relative group hover:border-blue-500/50 transition-all"
              >
                <div className="absolute top-6 right-6">
                  <span className={`text-sm px-3 py-1.5 rounded-full ${
                    address.type === 'sender'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {address.type === 'sender' ? 'From' : 'To'}
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-white">{address.name}</h3>
                  <p className="text-gray-400 text-lg">{address.street}</p>
                  {address.street2 && <p className="text-gray-400 text-lg">{address.street2}</p>}
                  <p className="text-gray-400 text-lg">
                    {address.city}, {address.state} {address.zip}
                  </p>
                  <p className="text-gray-400 text-lg">{address.country}</p>
                </div>
                <div className="absolute bottom-6 right-6 flex space-x-4">
                  <button onClick={()=>handleDelete(address._id)} className="text-gray-400 hover:text-white transition-colors">
                    <FiTrash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <button
            onClick={() => setSenderModalOpen(true)}
            className="flex flex-col items-center justify-center p-12 bg-zinc-950 border border-[#333333] rounded-lg hover:border-blue-500/50 transition-all group relative"
          >
            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
            <FiSend className="w-12 h-12 text-blue-500 mb-6" />
            <h2 className="text-2xl font-semibold text-white mb-3">From Address</h2>
            <p className="text-gray-400 text-lg text-center">
              Enter the sender's address details
            </p>
          </button>

          <button
            onClick={() => setReceiverModalOpen(true)}
            className="flex flex-col items-center justify-center p-12 bg-zinc-950 border border-[#333333] rounded-lg hover:border-blue-500/50 transition-all group relative"
          >
            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
            <FiUser className="w-12 h-12 text-blue-500 mb-6" />
            <h2 className="text-2xl font-semibold text-white mb-3">To Address</h2>
            <p className="text-gray-400 text-lg text-center">
              Enter the recipient's address details
            </p>
          </button>
        </div>

        {isSenderModalOpen && (
          <AddressForm 
            type="sender"
            onClose={() => setSenderModalOpen(false)}
            onSubmit={handleSubmit}
            initialData={{...initialAddressState, type: 'sender'}}
          />
        )}

        {isReceiverModalOpen && (
          <AddressForm
            type="receiver"
            onClose={() => setReceiverModalOpen(false)}
            onSubmit={handleSubmit}
            initialData={{...initialAddressState, type: 'receiver'}}
          />
        )}
      </div>
    </div>
  );
};

export default Address;