import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { FiX, FiSend, FiX as FiClose } from "react-icons/fi";
import { useSelector } from "react-redux";
import states from "../../states.json";
import { FaCheck, FaPencilAlt, FaTimes, FaTrash } from "react-icons/fa";

const AddressForm = ({ onClose, onSubmit, initialData, savedAddress }) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const hasErrors = Object.values(errors).some(
      (value) => value && value.trim() !== ""
    );

    const isDuplicate = savedAddress.some(
      (addr) => addr.address_id === formData.address_id
    );
    if (isDuplicate) {
      setErrors((prev) => ({
        ...prev,
        address_id:
          "This Address ID already exists. Please use a different one.",
      }));
      return;
    }

    if (!hasErrors) {
      onSubmit(formData);
    }
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "address_id":
        if (!value.trim()) {
          error = "Address Id is required";
          break;
        }
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
  const CombinedHandler = (e) => {
    handleChange(e);
    ErrorhandleChange(e);
  };
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1a1a1a] rounded-lg p-8 w-full max-w-3xl border border-[#333333]">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-white">Add Address</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Address ID *
              </label>
              <input
                type="text"
                name="address_id"
                value={formData.address_id}
                onChange={CombinedHandler}
                className="w-full px-3 py-2 bg-[#242424] border border-[#333333] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              {errors.address_id && (
                <p className="text-red-500 text-sm mt-1">{errors.address_id}</p>
              )}
            </div>
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
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            <div>
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
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={CombinedHandler}
                className="w-full px-3 py-2 bg-[#242424] border border-[#333333] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
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
            {errors.street && (
              <p className="text-red-500 text-sm mt-1">{errors.street}</p>
            )}
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
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city}</p>
              )}
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
              {errors.state && (
                <p className="text-red-500 text-sm mt-1">{errors.state}</p>
              )}
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
              {errors.zip && (
                <p className="text-red-500 text-sm mt-1">{errors.zip}</p>
              )}
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
              {errors.country && (
                <p className="text-red-500 text-sm mt-1">{errors.country}</p>
              )}
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

const EditableCell = ({
  value,
  onChange,
  name,
  type = "text",
  options = null,
}) => {
  return type === "select" ? (
    <select
      value={value}
      onChange={(e) => onChange(name, e.target.value)}
      className="w-full bg-[#242424] border border-[#333333] rounded px-2 py-1 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <>
        <option value="">Select state...</option>
        {states.map((state) => (
          <option key={state.abbreviation} value={state.abbreviation}>
            {state.state}
          </option>
        ))}
      </>
    </select>
  ) : (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(name, e.target.value)}
      className="w-full bg-[#242424] border border-[#333333] rounded px-2 py-1 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};

const Address = () => {
  const user = useSelector((state) => state.auth.user);
  const [isAddressModalOpen, setAddressModalOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [editError, setEditError] = useState("");

  const initialAddressState = {
    address_id: "",
    name: "",
    company: "",
    phone: "",
    street: "",
    street2: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
  };

  const getSavedAddresss = async () => {
    if (!user) {
      return;
    }
    try {
      const response = await axios.get(
        `https://lcarus-shipping-backend-ce6c088c70be.herokuapp.com/api/auth/get-address/${user._id}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (
        JSON.stringify(response.data.savedAddress) !== JSON.stringify(addresses)
      ) {
        setAddresses(response.data.savedAddress);
      }
    } catch (e) {
      console.log("Error Occurred", e);
    }
  };

  useEffect(() => {
    if (user) {
      getSavedAddresss();
    }
  }, [user]);

  const handleSubmit = async (formData) => {
    try {
      const response = await axios.post(
        `https://lcarus-shipping-backend-ce6c088c70be.herokuapp.com/api/auth/save-address/${user._id}`,
        { formData },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Received Data", response.data);
      const newAddress = response.data.savedAddresss;
      setAddresses((prev) => [...prev, newAddress]);
      setAddressModalOpen(false);
      getSavedAddresss();
    } catch (e) {
      console.log("Error Occurred", e);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.post(
        `https://lcarus-shipping-backend-ce6c088c70be.herokuapp.com/api/auth/delete-address/${user._id}`,
        { id },
        { headers: { "Content-Type": "application/json" } }
      );
      setAddresses((addresses) => addresses.filter((ad) => ad._id != id));
    } catch (error) {
      console.log("Error Occured ", error);
    }
  };

  const handleEdit = (address) => {
    setEditingId(address._id);
    setEditData({ ...address });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleSaveEdit = async () => {
    const isDuplicate = addresses.some(
      (addr) =>
        addr.address_id === editData.address_id && addr._id !== editData._id
    );

    if (isDuplicate) {
      setEditError(
        "This Address ID already exists. Please use a different one."
      );
      return;
    }

    try {
      const response = await axios.post(
        `https://lcarus-shipping-backend-ce6c088c70be.herokuapp.com/api/auth/update-address/${user._id}/${editData._id}`,
        { formData: editData },
        { headers: { "Content-Type": "application/json" } }
      );

      setAddresses(response.data.updatedAddress);
      setEditingId(null);
      setEditData({});
      setEditError("");
    } catch (error) {
      console.log("Error Occurred ", error);
      setEditError("Failed to save changes. Please try again.");
    }
  };

  const handleFieldChange = (name, value) => {
    setEditError("");

    if (name === "address_id") {
      const isDuplicate = addresses.some(
        (addr) => addr.address_id === value && addr._id !== editData._id
      );

      if (isDuplicate) {
        setEditError(
          "This Address ID already exists. Please use a different one."
        );
        return;
      }
    }

    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-custom-black p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Saved Addresses
          </h1>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-transparent border border-custom-border">
              <thead>
                <tr className="bg-custom-background text-white text-left">
                  <th className="px-2 py-2 border-b border-custom-border text-sm md:text-base">
                    Address ID
                  </th>
                  <th className="px-2 py-2 border-b border-custom-border text-sm md:text-base">
                    Name
                  </th>
                  <th className="px-2 py-2 border-b border-custom-border text-sm md:text-base">
                    Company
                  </th>
                  <th className="px-2 py-2 border-b border-custom-border text-sm md:text-base">
                    Phone
                  </th>
                  <th className="px-2 py-2 border-b border-custom-border text-sm md:text-base">
                    Street
                  </th>
                  <th className="px-2 py-2 border-b border-custom-border text-sm md:text-base">
                    City
                  </th>
                  <th className="px-2 py-2 border-b border-custom-border text-sm md:text-base">
                    State
                  </th>
                  <th className="px-2 py-2 border-b border-custom-border text-sm md:text-base">
                    ZIP
                  </th>
                  <th className="px-2 py-2 border-b border-custom-border text-sm md:text-base">
                    Country
                  </th>
                  <th className="px-2 py-2 border-b border-custom-border text-sm md:text-base">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {addresses?.length > 0 ? (
                  addresses.map((address, index) => (
                    <tr key={address._id} className="hover:bg-gray-900">
                      <td
                        className={`border-b ${
                          index === 0 && "bg-gray-800/80"
                        } border-custom-border px-2 py-2 text-sm md:text-base text-white`}
                      >
                        {editingId === address?._id ? (
                          <EditableCell
                            value={editData.address_id}
                            onChange={handleFieldChange}
                            name="address_id"
                          />
                        ) : (
                          address.address_id
                        )}
                      </td>
                      <td
                        className={`border-b ${
                          index === 0 && "bg-gray-800/80"
                        } border-custom-border px-2 py-2 text-sm md:text-base text-white`}
                      >
                        {editingId === address._id ? (
                          <EditableCell
                            value={editData.name}
                            onChange={handleFieldChange}
                            name="name"
                          />
                        ) : (
                          address.name
                        )}
                      </td>
                      <td
                        className={`border-b ${
                          index === 0 && "bg-gray-800/80"
                        } border-custom-border px-2 py-2 text-sm md:text-base text-white`}
                      >
                        {editingId === address._id ? (
                          <EditableCell
                            value={editData.company}
                            onChange={handleFieldChange}
                            name="company"
                          />
                        ) : (
                          address.company || "N/A"
                        )}
                      </td>
                      <td
                        className={`border-b ${
                          index === 0 && "bg-gray-800/80"
                        } border-custom-border px-2 py-2 text-sm md:text-base text-white`}
                      >
                        {editingId === address._id ? (
                          <EditableCell
                            value={editData.phone}
                            onChange={handleFieldChange}
                            name="phone"
                          />
                        ) : (
                          address.phone
                        )}
                      </td>
                      <td
                        className={`border-b ${
                          index === 0 && "bg-gray-800/80"
                        } border-custom-border px-2 py-2 text-sm md:text-base text-white`}
                      >
                        {editingId === address._id ? (
                          <EditableCell
                            value={editData.street}
                            onChange={handleFieldChange}
                            name="street"
                          />
                        ) : (
                          <>
                            {address.street}
                            {address.street2 && `, ${address.street2}`}
                          </>
                        )}
                      </td>
                      <td
                        className={`border-b ${
                          index === 0 && "bg-gray-800/80"
                        } border-custom-border px-2 py-2 text-sm md:text-base text-white`}
                      >
                        {editingId === address._id ? (
                          <EditableCell
                            value={editData.city}
                            onChange={handleFieldChange}
                            name="city"
                          />
                        ) : (
                          address.city
                        )}
                      </td>
                      <td
                        className={`border-b ${
                          index === 0 && "bg-gray-800/80"
                        } border-custom-border px-2 py-2 text-sm md:text-base text-white`}
                      >
                        {editingId === address._id ? (
                          <EditableCell
                            value={editData.state}
                            onChange={handleFieldChange}
                            name="state"
                            type="select"
                          />
                        ) : (
                          address.state
                        )}
                      </td>
                      <td
                        className={`border-b ${
                          index === 0 && "bg-gray-800/80"
                        } border-custom-border px-2 py-2 text-sm md:text-base text-white`}
                      >
                        {editingId === address._id ? (
                          <EditableCell
                            value={editData.zip}
                            onChange={handleFieldChange}
                            name="zip"
                          />
                        ) : (
                          address.zip
                        )}
                      </td>
                      <td
                        className={`border-b ${
                          index === 0 && "bg-gray-800/80"
                        } border-custom-border px-2 py-2 text-sm md:text-base text-white`}
                      >
                        {editingId === address._id ? (
                          <EditableCell
                            value={editData.country}
                            onChange={handleFieldChange}
                            name="country"
                          />
                        ) : (
                          address.country
                        )}
                      </td>
                      <td
                        className={`border-b ${
                          index === 0 && "bg-gray-800/80"
                        } border-custom-border px-2 py-2 text-sm md:text-base text-white`}
                      >
                        <div className="flex items-center gap-2">
                          {editingId === address._id ? (
                            <>
                              <button
                                onClick={handleSaveEdit}
                                className={`text-green-500 p-2 ${
                                  editError
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                                disabled={!!editError}
                              >
                                <FaCheck />
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="text-red-500 p-2"
                              >
                                <FaTimes />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEdit(address)}
                                className="p-2 hover:bg-gray-700 rounded-full"
                              >
                                <FaPencilAlt
                                  size={20}
                                  className="text-blue-500"
                                />
                              </button>
                              <button
                                onClick={() => handleDelete(address._id)}
                                className="p-2 hover:bg-gray-700 rounded-full"
                              >
                                <FaTrash size={20} className="text-red-500" />
                              </button>
                            </>
                          )}
                          {index === 0 && !editData && (
                            <span className="ml-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                              User's Address
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="9"
                      className="text-center px-2 py-4 text-gray-400"
                    >
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
            className="flex flex-col items-center w-96 justify-center px-12 py-6 bg-card-background border-thin border-custom-border rounded-lg hover:border-hover-border hover:shadow-bright transition-all group relative"
          >
            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
            <FiSend className="w-12 h-12 text-blue-500 mb-6" />
            <h2 className="text-2xl font-semibold text-white mb-3">
              Add Address
            </h2>
            <p className="text-gray-400 text-lg text-center">
              Enter your address details
            </p>
          </button>
        </div>

        {isAddressModalOpen && (
          <AddressForm
            onClose={() => setAddressModalOpen(false)}
            onSubmit={handleSubmit}
            initialData={{ ...initialAddressState, type: "sender" }}
            savedAddress={addresses}
          />
        )}
      </div>
    </div>
  );
};

export default Address;
