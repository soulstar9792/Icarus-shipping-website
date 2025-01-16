import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaPencilAlt, FaSave, FaTrash, FaUpload } from "react-icons/fa";
import { useSelector } from 'react-redux';
import Papa from 'papaparse'
import Notification from '../Notification';
import { CiCirclePlus } from 'react-icons/ci';
import { BiX } from 'react-icons/bi';
function SKUManagement() {
  const [skuData, setSkuData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [notification, setNotification] = useState({ visible: false, message: "", type: "" });
  const [uploadLoading, setUploadLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [newSku, setNewSku] = useState({
    sku: '',
    maxQty: '',
    weight: '',
    length: '',
    width: '',
    height: ''
  });

  const user = useSelector(state => state.auth.user);

  const validateSku = (data) => {
    const errors = {};
    if (!data.sku || data.sku.trim() === '') {
      errors.sku = 'SKU is required';
    }
    if (!data.maxQty || data.maxQty <= 0) {
      errors.maxQty = 'Max Quantity must be greater than 0';
    }
    if (!data.weight || data.weight <= 0) {
      errors.weight = 'Weight must be greater than 0';
    }
    if (!data.length || data.length <= 0) {
      errors.length = 'Length must be greater than 0';
    }
    if (!data.width || data.width <= 0) {
      errors.width = 'Width must be greater than 0';
    }
    if (!data.height || data.height <= 0) {
      errors.height = 'Height must be greater than 0';
    }
    return errors;
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      setUploadLoading(true);
      
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (result) => {
          const parsedData = result.data;
          
          
          
          const response = await axios.post(
            `https://lcarus-shipping-backend-ce6c088c70be.herokuapp.com/api/auth/add-sku/${user._id}`,
            { parsedData },
            { headers: { "Content-Type": "application/json" }}
          );
          await getSKU();
          
        },
        error: (err) => {
          console.error("Error parsing CSV:", err);
        }
      });
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setNotification({
        visible:true,
        message: 'CSV Uploaded Succesfully ',
        type:"success"
      })
      setTimeout(() => {
        setNotification({ ...notification, visible: false });
      }, 2000);
      setUploadLoading(false);
    }
  };
  
  const handleEdit = (item) => {
    setEditingId(item._id);
    setEditForm({ ...item });
    setErrors({});
  };

  const handleSave = async () => {
    if (!editForm) return;

    const validationErrors = validateSku(editForm);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await axios.post(
        `https://lcarus-shipping-backend-ce6c088c70be.herokuapp.com/api/auth/update-sku/${user._id}/${editForm._id}`,
        { skuData: editForm },
        { headers: { "Content-Type": "application/json" }}
      );
      
      await getSKU();
      setEditingId(null);
      setEditForm(null);
      setErrors({});
    } catch (error) {
      console.error("Error saving SKU:", error);
    }
  };

  const handleDelete = async (id) => {
      try {
        await axios.post(
          `https://lcarus-shipping-backend-ce6c088c70be.herokuapp.com/api/auth/delete-sku/${id}`,
          {},
          { headers: { "Content-Type": "application/json" }}
        );
        await getSKU();
        setNotification({
          visible:true,
          message:"SKU Deleted Succesfuly",
          type:"success"
        })
        setTimeout(()=>{
          setNotification({...notification,visible:false})
        },2000)
      } catch (error) {
        console.error("Error deleting SKU:", error);
      }
  };

  const getSKU = async () => {
    try {
      const response = await axios.get(
        `https://lcarus-shipping-backend-ce6c088c70be.herokuapp.com/api/auth/get-sku/${user._id}`,
        {
          headers: { "Content-Type": "application/json" }
        }
      );
      setSkuData(response.data.SkuData || []);
    } catch (error) {
      console.error("Error fetching SKU data:", error);
    }
  };

  useEffect(() => {
    getSKU();
  }, []);

  const handleAddNewSku = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateSku(newSku);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      console.log("Sending new SKU data:", newSku);
      const response = await axios.post(
        `https://lcarus-shipping-backend-ce6c088c70be.herokuapp.com/api/auth/add-sku/${user._id}`,
        { parsedData: [newSku] },
        { headers: { "Content-Type": "application/json" }}
      );
      
      console.log("Response from server:", response.data);
      await getSKU();
      setIsModalOpen(false);
      setNewSku({
        sku: '',
        maxQty: '',
        weight: '',
        length: '',
        width: '',
        height: ''
      });
      setErrors({});
      setNotification({
        visible:true,
        message:"New SKU Data Added",
        type:'success'
      })
      setTimeout(()=>[
        setNotification({...notification,visible:false})
      ],2000)
    } catch (error) {
      console.error("Error adding new SKU:", error);  
    }
  };

  const handleChange = (e) => {
    if (!editForm) return;
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: name === 'sku' ? value : value === '' ? '' : Number(value) || 0,
    }));
    // Clear error for this field when user starts typing
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleNewSkuChange = (e) => {
    const { name, value } = e.target;
    setNewSku(prev => ({
      ...prev,
      [name]: name === 'sku' ? value : value === '' ? '' : Number(value) || 0,
    }));
    // Clear error for this field when user starts typing
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="min-h-screen bg-custom-background text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">SKU Data Management</h1>
        
        <div className=" overflow-hidden mb-8">
          <table className="w-full bg-transparent border border-custom-border ">
            <thead >
              <tr className="bg-custom-background text-white text-left">
                <th className="px-2 py-2 border-b border-custom-border text-sm md:text-base ">SKU</th>
                <th className="px-2 py-2 border-b border-custom-border text-sm md:text-base text-right">Max Qty</th>
                <th className="px-2 py-2 border-b border-custom-border text-sm md:text-base text-right">Weight</th>
                <th className="px-2 py-2 border-b border-custom-border text-sm md:text-base text-right">Length</th>
                <th className="px-2 py-2 border-b border-custom-border text-sm md:text-base text-right">Width</th>
                <th className="px-2 py-2 border-b border-custom-border text-sm md:text-base text-right">Height</th>
                <th className="px-2 py-2 border-b border-custom-border text-sm md:text-base text-right">Actions</th>
              </tr>
            </thead>
            <tbody className='border-custom-border '>
              {skuData.map(item => (
                <tr key={item._id} className="border-thin border-custom-border">
                  {editingId === item._id ? (
                    <>
                      <td className='border-b  border-custom-border px-2 py-2 text-sm md:text-base text-white'><input type="text" name="sku" value={editForm?.sku} onChange={handleChange} className="bg-gray-700 px-2 py-1 rounded w-full text-white" /></td>
                      <td className='border-b  border-custom-border px-2 py-2 text-sm md:text-base text-white'><input type="number" name="maxQty" value={editForm?.maxQty || ''} onChange={handleChange} className="bg-gray-700 px-2 py-1 rounded w-full  text-white" /></td>
                      <td className='border-b  border-custom-border px-2 py-2 text-sm md:text-base text-white'><input type="number" name="weight" value={editForm?.weight || ''} onChange={handleChange} className="bg-gray-700 px-2 py-1 rounded w-full text-white" /></td>
                      <td className='border-b  border-custom-border px-2 py-2 text-sm md:text-base text-white'><input type="number" name="length" value={editForm?.length || ''} onChange={handleChange} className="bg-gray-700 px-2 py-1 rounded w-full text-white" /></td>
                      <td className='border-b  border-custom-border px-2 py-2 text-sm md:text-base text-white'><input type="number" name="width" value={editForm?.width || ''} onChange={handleChange} className="bg-gray-700 px-2 py-1 rounded w-full text-white" /></td>
                      <td className='border-b  border-custom-border px-2 py-2 text-sm md:text-base text-white'><input type="number" name="height" value={editForm?.height || ''} onChange={handleChange} className="bg-gray-700 px-2 py-1 rounded w-full text-white" /></td>
                      <td>
                        <button onClick={handleSave} className="p-2 hover:bg-gray-700 rounded-full"><FaSave size={20} className="text-green-500" /></button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className='border-b  border-custom-border px-3 py-4 text-sm md:text-base text-white'>{item.sku}</td > 
                      <td className='border-b text-right  border-custom-border px-3 py-4 text-sm md:text-base text-white ' >{item.maxQty}</td>
                      <td className='border-b text-right  border-custom-border px-3 py-4 text-sm md:text-base text-white ' >{item.weight}</td>
                      <td className='border-b text-right  border-custom-border px-3 py-4 text-sm md:text-base text-white ' >{item.length}</td>
                      <td className='border-b text-right  border-custom-border px-3 py-4 text-sm md:text-base text-white ' >{item.width}</td>
                      <td className='border-b text-right  border-custom-border px-3 py-4 text-sm md:text-base text-white ' >{item.height}</td>
                      <td>
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEdit(item)} className="p-2 hover:bg-gray-700 rounded-full"><FaPencilAlt size={20} className="text-blue-500" /></button>
                          <button onClick={() => handleDelete(item._id)} className="p-2 hover:bg-gray-700 rounded-full"><FaTrash size={20} className="text-red-500" /></button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex gap-8 justify-center">
          <label 
            onClick={() => setIsModalOpen(true)}
            className="flex gap-2 items-center justify-center cursor-pointer rounded-small p-6 md:p-8 border-thin border-custom-border transition-shadow duration-300 bg-card-background group hover:border-hover-border hover:shadow-bright"
          >
            <CiCirclePlus size={40} className="font-bold" />
            <button className="font-semibold">Add New SKU</button>
          </label>
          
          <label className={`flex gap-2 items-center justify-center cursor-pointer rounded-small p-6 md:p-8 border-thin border-custom-border transition-shadow duration-300 bg-card-background group hover:border-hover-border hover:shadow-bright ${uploadLoading ? 'opacity-50' : ''}`}>
            {uploadLoading ? <div>Uploading...</div> : <><FaUpload size={24} /> Upload CSV File</>}
            <input type="file" accept=".csv" onChange={handleFileUpload} disabled={uploadLoading} className="hidden" />
          </label>
        </div>

        <Notification {...notification} onClose={() => setNotification({ ...notification, visible: false })} />
        {/* Add New SKU Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-custom-background border border-custom-border rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Add New SKU</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-700 rounded-full"
                >
                  <BiX size={20} />
                </button>
              </div>

              <form onSubmit={handleAddNewSku}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">SKU</label>
                    <input
                      type="text"
                      name="sku"
                      value={newSku.sku}
                      onChange={handleNewSkuChange}
                      className="w-full bg-gray-700 border border-custom-border rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Max Quantity</label>
                      <input
                        type="number"
                        name="maxQty"
                        value={newSku.maxQty}
                        onChange={handleNewSkuChange}
                        className="w-full bg-gray-700 border border-custom-border rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Weight</label>
                      <input
                        type="number"
                        name="weight"
                        value={newSku.weight}
                        onChange={handleNewSkuChange}
                        className="w-full bg-gray-700 border border-custom-border rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Length</label>
                      <input
                        type="number"
                        name="length"
                        value={newSku.length}
                        onChange={handleNewSkuChange}
                        className="w-full bg-gray-700 border border-custom-border rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Width</label>
                      <input
                        type="number"
                        name="width"
                        value={newSku.width}
                        onChange={handleNewSkuChange}
                        className="w-full bg-gray-700 border border-custom-border rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Height</label>
                      <input
                        type="number"
                        name="height"
                        value={newSku.height}
                        onChange={handleNewSkuChange}
                        className="w-full bg-gray-700 border border-custom-border rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 border border-custom-border rounded hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      Add SKU
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SKUManagement; 