import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaPencilAlt, FaSave, FaTrash, FaUpload } from "react-icons/fa";
import { useSelector } from 'react-redux';
import Papa from 'papaparse'
import { data } from 'autoprefixer';
function SKUManagement() {
  const [skuData, setSkuData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const user = useSelector(state => state.auth.user);
  
  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      setUploadLoading(true);
      
      Papa.parse(file,{
        header:true,
        skipEmptyLines:true,
        complete:async (result)=>{
          const parsedData = result.data; 
          const response = await axios.post("https://lcarus-shipping-backend-ce6c088c70be.herokuapp.com/api/auth/add-sku/"+user._id,{parsedData},{headers:{"Content-Type":"application/json"}});
          getSKU();

        },
        error:(err)=>{
          console.log("Error Occcured ",err);
        }
      })
      
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploadLoading(false);
    }
  };
  
  
  
  
  const handleEdit = (item) => {
    setEditingId(item._id);
    setEditForm({ ...item });
  };
  
  const handleSave = async () => {
    if (!editForm) return;
    
    try {
      await axios.post(
        `https://lcarus-shipping-backend-ce6c088c70be.herokuapp.com/api/auth/update-sku/${user._id}/${editForm._id}`,
        { skuData: editForm },
        { headers: { "Content-Type": "application/json" }}
      );
      
      setSkuData(prev => prev.map(item => item._id === editForm._id ? editForm : item));
      setEditingId(null);
      setEditForm(null);
    } catch (error) {
      console.error("Error saving SKU:", error);
    }
  };
  
  const handleDelete = async (id) => {
    try {
        await axios.post(
        `https://lcarus-shipping-backend-ce6c088c70be.herokuapp.com/api/auth/delete-sku/${id}`,
        { headers: { "Content-Type": "application/json" }}
      );
      setSkuData(prev => prev.filter(item => item._id !== id));
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
         console.log("Data from backedn : ",response.data)
        setSkuData(response.data.SkuData || []);
      } catch (error) {
        console.error("Error fetching SKU data:", error);
      }
    };
  
    useEffect(() => {
         getSKU();
    }, []);

  const handleChange = (e) => {
    if (!editForm) return;
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: name === 'sku' ? value : Number(value) || 0,
    }));
  };

  return (
    <div className="min-h-screen bg-custom-background text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">SKU Data Management</h1>
        
        <div className="bg-custom-background rounded-lg overflow-hidden mb-8">
          <table className="w-full">
            <thead>
              <tr className="bg-custom-background">
                <th className="px-4 py-3 text-left">SKU</th>
                <th className="px-4 py-3 text-left">Max Qty</th>
                <th className="px-4 py-3 text-left">Weight</th>
                <th className="px-4 py-3 text-left">Length</th>
                <th className="px-4 py-3 text-left">Width</th>
                <th className="px-4 py-3 text-left">Height</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {skuData.map(item => (
                <tr key={item._id} className="border-thin border-custom-border">
                  {editingId === item._id ? (
                    <>
                      <td><input type="text" name="sku" value={editForm?.sku} onChange={handleChange} className="bg-gray-700 px-2 py-1 rounded w-full text-white" /></td>
                      <td><input type="number" name="maxQty" value={editForm?.maxQty || 0} onChange={handleChange} className="bg-gray-700 px-2 py-1 rounded w-full text-white" /></td>
                      <td><input type="number" name="weight" value={editForm?.weight || 0} onChange={handleChange} className="bg-gray-700 px-2 py-1 rounded w-full text-white" /></td>
                      <td><input type="number" name="length" value={editForm?.length || 0} onChange={handleChange} className="bg-gray-700 px-2 py-1 rounded w-full text-white" /></td>
                      <td><input type="number" name="width" value={editForm?.width || 0} onChange={handleChange} className="bg-gray-700 px-2 py-1 rounded w-full text-white" /></td>
                      <td><input type="number" name="height" value={editForm?.height || 0} onChange={handleChange} className="bg-gray-700 px-2 py-1 rounded w-full text-white" /></td>
                      <td>
                        <button onClick={handleSave} className="p-2 hover:bg-gray-700 rounded-full"><FaSave size={20} className="text-green-500" /></button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{item.sku}</td>
                      <td>{item.maxQty}</td>
                      <td>{item.weight}</td>
                      <td>{item.length}</td>
                      <td>{item.width}</td>
                      <td>{item.height}</td>
                      <td>
                        <div className="flex gap-2">
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

        <div className="flex justify-center">
          <label className={`flex gap-2 items-center justify-center cursor-pointer rounded-small p-6 md:p-8 border-thin border-custom-border transition-shadow duration-300 bg-card-background group hover:border-hover-border hover:shadow-bright ${uploadLoading ? 'opacity-50' : ''}`}>
            {uploadLoading ? <div>Uploading...</div> : <><FaUpload size={24} /> Upload CSV File</>}
            <input type="file" accept=".csv" onChange={handleFileUpload} disabled={uploadLoading} className="hidden" />
          </label>
        </div>
      </div>
    </div>
  );
}

export default SKUManagement;
