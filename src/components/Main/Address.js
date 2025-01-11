import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';
import { FiPlus, FiX, FiHome, FiMapPin, FiSend, FiUser, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import states from '../../states.json';
import $GS from '../../styles/constants'; // Import your styles

const AddressForm = ({ type, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const hasErrors = Object.values(errors).some((value)=>{return value && value.trim!=''});
    if(!hasErrors){
    onSubmit(formData);
    }
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "Name is required.";
        }
        break;
      case "phone":
        if (!/^\d+$/.test(value)) {
          error = "Phone number must contain only digits.";
        }
        break;
      case "street":
        if (!value.trim()) {
          error = "Street is required.";
        }
        break;
      case "city":
        if (!value.trim()) {
          error = "City is required.";
        }
        break;
      case "state":
        if (!value) {
          error = "State is required.";
        }
        break;
      case "zip":
        if (!/^\d{5}(-\d{4})?$/.test(value)) {
          error = "ZIP code must be valid (e.g., 12345 or 12345-6789).";
        }
        break;
      case "country":
        if (!value.trim()) {
          error = "Country is required.";
        }
        break;
      default:
        break;
    }

    return error;
  };

  const ErrorhandleChange = (e) => {
    const { name, value } = e.target;

    // Validate field on change
    const error = validateField(name, value);

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));

    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const CombinedHandler =(e)=>{
    handleChange(e);
    ErrorhandleChange(e);
  }
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1a1a1a] rounded-lg p-8 w-full max-w-3xl border border-[#333333]">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-white">
           Add Address
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
            onChange={CombinedHandler}
            className="w-full px-3 py-2 bg-[#242424] border border-[#333333] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Company / Reference Number (optional)
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={CombinedHandler}
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
          onChange={CombinedHandler}
          className="w-full px-3 py-2 bg-[#242424] border border-[#333333] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Street *
        </label>
        <input
          type="text"
          name="street"
          value={formData.street}
          onChange={CombinedHandler}
          className="w-full px-3 py-2 bg-[#242424] border border-[#333333] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Street 2 (optional)
        </label>
        <input
          type="text"
          name="street2"
          value={formData.street2}
          onChange={CombinedHandler}
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
            onChange={CombinedHandler}
            className="w-full px-3 py-2 bg-[#242424] border border-[#333333] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            State *
          </label>
          <select
            name="state"
            value={formData.state}
            onChange={CombinedHandler}
            className="w-full px-3 py-2 bg-[#242424] border border-[#333333] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select state...</option>
            {states.map((state) => (
              <option key={state.abbreviation} value={state.abbreviation}>
                {state.state}
              </option>
            ))}
          </select>
          {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
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
            onChange={CombinedHandler}
            className="w-full px-3 py-2 bg-[#242424] border border-[#333333] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          {errors.zip && <p className="text-red-500 text-sm mt-1">{errors.zip}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Country *
          </label>
          <select
            name="country"
            value={formData.country}
            onChange={CombinedHandler}
            className="w-full px-3 py-2 bg-[#242424] border border-[#333333] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="United States">United States</option>
          </select>
          {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
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
  const [isAddressModalOpen, setAddressModalOpen] = useState(false);
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
      setAddressModalOpen(false);
    } catch (e) {
      console.log("Error Occurred", e);
    }
  };

  const handleDelete = async (id) => {
        try {
          console.log(id)
          const response = await axios.post(
            `https://lcarus-shipping-backend-ce6c088c70be.herokuapp.com/api/auth/delete-address/${user._id}`,
            {id},
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
  <div className="overflow-x-auto">
    <table className="min-w-full bg-transparent border border-custom-border">
      <thead>
        <tr className="bg-custom-background text-white text-left">
          <th className="px-2 py-2 border-b border-custom-border text-sm md:text-base">Name</th>
          <th className="px-2 py-2 border-b border-custom-border text-sm md:text-base">Company</th>
          <th className="px-2 py-2 border-b border-custom-border text-sm md:text-base">Phone</th>
          <th className="px-2 py-2 border-b border-custom-border text-sm md:text-base">Street</th>
          <th className="px-2 py-2 border-b border-custom-border text-sm md:text-base">City</th>
          <th className="px-2 py-2 border-b border-custom-border text-sm md:text-base">State</th>
          <th className="px-2 py-2 border-b border-custom-border text-sm md:text-base">ZIP</th>
          <th className="px-2 py-2 border-b border-custom-border text-sm md:text-base">Actions</th>
        </tr>
      </thead>
      <tbody>
        {addresses.length > 0 ? (
          addresses.map((address) => (
            <tr key={address._id} className="hover:bg-gray-900">
              <td className="border-b border-custom-border px-2 py-2 text-sm md:text-base text-white">{address.name}</td>
              <td className="border-b border-custom-border px-2 py-2 text-sm md:text-base text-white">{address.company || 'N/A'}</td>
              <td className="border-b border-custom-border px-2 py-2 text-sm md:text-base text-white">{address.phone}</td>
              <td className="border-b border-custom-border px-2 py-2 text-sm md:text-base text-white">
                {address.street}
                {address.street2 && `, ${address.street2}`}
              </td>
              <td className="border-b border-custom-border px-2 py-2 text-sm md:text-base text-white">{address.city}</td>
              <td className="border-b border-custom-border px-2 py-2 text-sm md:text-base text-white">{address.state}</td>
              <td className="border-b border-custom-border px-2 py-2 text-sm md:text-base text-white">{address.zip}</td>
              <td className="border-b border-custom-border px-2 py-2 text-sm md:text-base text-white">
                <button
                  onClick={() => handleDelete(address._id)}
                  className="px-5 py-2 flex gap-2 items-center   bg-red-500 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete <FiTrash2 />
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="8" className="text-center px-2 py-4 text-gray-400">
              No saved addresses found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>


        <div className="grid place-items-center">
          <button
            onClick={() => setAddressModalOpen(true)}
            className="flex flex-col items-center w-96 justify-center px-12 py-6 bg-card-background border-thin border-custom-border  rounded-lg hover:border-hover-border hover:shadow-bright transition-all group relative"
          >
            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
            <FiSend className="w-12 h-12 text-blue-500 mb-6" />
            <h2 className="text-2xl font-semibold text-white mb-3">           Add Address
            </h2>
            <p className="text-gray-400 text-lg text-center">
              Enter the Your address details
            </p>
          </button>
        </div>

        {isAddressModalOpen && (
          <AddressForm 
            type="sender"
            onClose={() => setAddressModalOpen(false)}
            onSubmit={handleSubmit}
            initialData={{...initialAddressState, type: 'sender'}}
          />
        )}

      </div>
    </div>
  );
};

export default Address;