import React, { useState } from 'react';
import { FaCheck, FaEdit, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { useSelector } from 'react-redux';
import $GS from '../../../styles/constants';
import './BulkOrder.css';

const TableRow = ({ row, index, setUploadedData, uploadedData, txtFile, selectedService, selectedProvider, courierType }) => {
  const user = useSelector((state) => state.auth.user);
  const [editingRow, setEditingRow] = useState(null);
  const [editedData, setEditedData] = useState({});

  const handleEdit = (index) => {
    setEditingRow(index);
    setEditedData(uploadedData[index]);
  };

  const handleFieldChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async (index) => {
    const newData = [...uploadedData];
    const dimensionFields = [
      "PackageWeight",
      "PackageLength",
      "PackageWidth",
      "PackageHeight"
    ];

    // Convert numeric fields
    dimensionFields.forEach((field) => {
      if (editedData[field] !== "") {
        editedData[field] = parseFloat(editedData[field]) || null;
      }
    });

    newData[index] = { ...editedData };

    // Original SKU update logic
    if (editedData.skuNumber) {
      const rowsWithSameSku = uploadedData.filter(
        (row, idx) => idx !== index && row.skuNumber === editedData.skuNumber
      );

      rowsWithSameSku.forEach((row) => {
        const rowIndex = newData.findIndex((item) => item === row);
        if (rowIndex > -1) {
          dimensionFields.forEach((field) => {
            if (editedData[field] !== "") {
              newData[rowIndex][field] = editedData[field];
            }
          });
        }
      });

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/auth/get-sku/${user._id}`
        );
        const SKUPresent = response.data.SkuData;
        const existingSku = SKUPresent.find(
          (sku) => sku.sku === editedData.skuNumber
        );

        const parsedData = {
          sku: editedData.skuNumber,
          maxQty: editedData.quantity || 1,
          weight: parseFloat(editedData.PackageWeight) || null,
          length: parseFloat(editedData.PackageLength) || null,
          width: parseFloat(editedData.PackageWidth) || null,
          height: parseFloat(editedData.PackageHeight) || null,
        };

        if (existingSku) {
          await axios.post(
            `${process.env.REACT_APP_API_URL}/api/auth/update-sku/${user._id}/${existingSku._id}`,
            { skuData: parsedData }
          );
        } else {
          await axios.post(
            `${process.env.REACT_APP_API_URL}/api/auth/add-sku/${user._id}`,
            { parsedData: [parsedData] }
          );
        }
      } catch (error) {
        console.error("SKU operation error:", error);
      }
    }

    setUploadedData(newData);
    setEditingRow(null);
    setEditedData({});
  };

  const handleCancel = () => {
    setEditingRow(null);
    setEditedData({});
  };

  const renderTableCell = (index, field, value) => {
    if (editingRow === index) {
      return (
        <input
          type="text"
          value={editedData[field] ?? ""}
          onChange={(e) => handleFieldChange(field, e.target.value)}
          className="w-full p-1 border border-blue-400 bg-slate-600 rounded"
        />
      );
    }
    return value || <p className="text-red-500">Missing</p>;
  };

  return (
    <tr className="bg-custom-background text-custom-text">
      <td className="border border-custom-border p-2 break-words">
        {renderTableCell(index, "ServiceName", row.ServiceName)}
      </td>
      {courierType === "USPS" && (
        <td className="border border-custom-border p-2 break-words">
        {renderTableCell(index, "provider", row.provider)}
        </td>
      )}

      {/* Sender fields */}
      <td className="border border-custom-border p-2 break-words">
        {renderTableCell(index, "FromSenderName", row.FromSenderName)}
      </td>
      <td className="border border-custom-border p-2 break-words">
        {renderTableCell(index, "FromPhone", row.FromPhone || "N/A")}
      </td>
      <td className="border border-custom-border p-2 break-words">
        {renderTableCell(index, "FromCompany", row.FromCompany || "N/A")}
      </td>
      <td className="border border-custom-border p-2 break-words">
        {renderTableCell(index, "FromStreet1", row.FromStreet1)}
      </td>
      <td className="border border-custom-border p-2 break-words">
        {renderTableCell(index, "FromStreet2", row.FromStreet2 || "N/A")}
      </td>
      <td className="border border-custom-border p-2 break-words">
        {renderTableCell(index, "FromCity", row.FromCity)}
      </td>
      <td className="border border-custom-border p-2 break-words">
        {renderTableCell(index, "FromStateProvince", row.FromStateProvince)}
      </td>
      <td className="border border-custom-border p-2 break-words">
        {renderTableCell(index, "FromZipPostal", row.FromZipPostal)}
      </td>
      <td className="border border-custom-border p-2 break-words">
        {renderTableCell(index, "FromCountry", row.FromCountry)}
      </td>
      
      {/* Receiver fields */}
      <td className="border border-custom-border p-2 break-words">
        {renderTableCell(index, "ToRecipientName", row.ToRecipientName)}
      </td>
      <td className="border border-custom-border p-2 break-words">
        {renderTableCell(index, "ToPhone", row.ToPhone || "N/A")}
      </td>
      <td className="border border-custom-border p-2 break-words">
        {renderTableCell(index, "ToCompany", row.ToCompany || "N/A")}
      </td>
      <td className="border border-custom-border p-2 break-words">
        {renderTableCell(index, "ToStreet1", row.ToStreet1)}
      </td>
      <td className="border border-custom-border p-2 break-words">
        {renderTableCell(index, "ToStreet2", row.ToStreet2 || "N/A")}
      </td>
      <td className="border border-custom-border p-2 break-words">
        {renderTableCell(index, "ToCity", row.ToCity)}
      </td>
      <td className="border border-custom-border p-2 break-words">
        {renderTableCell(index, "ToStateProvince", row.ToStateProvince)}
      </td>
      <td className="border border-custom-border p-2 break-words">
        {renderTableCell(index, "ToZipPostal", row.ToZipPostal)}
      </td>
      <td className="border border-custom-border p-2 break-words">
        {renderTableCell(index, "ToCountry", row.ToCountry)}
      </td>      

      <td className="border border-custom-border p-2 break-words">
        {renderTableCell(index, "PackageWeight", row.PackageWeight)}
      </td>
      <td className="border border-custom-border p-2 break-words">
        {renderTableCell(index, "PackageLength", row.PackageLength)}
      </td>
      <td className="border border-custom-border p-2 break-words">
        {renderTableCell(index, "PackageWidth", row.PackageWidth)}
      </td>
      <td className="border border-custom-border p-2 break-words">
        {renderTableCell(index, "PackageHeight", row.PackageHeight)}
      </td>
      <td className="border border-custom-border p-2 break-words">
        {renderTableCell(index, "PackageDescription", row.PackageDescription || "N/A")}
      </td>

      <td className="border border-custom-border p-2 break-words">
        {renderTableCell(index, "quantity", row.quantity)}
      </td>
      <td className="border border-custom-border p-2 break-words">
        {renderTableCell(index, "skuNumber", row.skuNumber || "N/A")}
      </td>

      {/* Actions */}
      <td className={`border border-custom-border p-2 break-words`}>
        {editingRow === index ? (
          <div className="flex space-x-2 justify-center">
            <button onClick={() => handleSave(index)} className="text-green-500 p-2"><FaCheck /></button>
            <button onClick={handleCancel} className="text-red-500 p-2"><FaTimes /></button>
          </div>
        ) : (
          <button onClick={() => handleEdit(index)} className="text-blue-500 bg-custom-background border border-gray-800 rounded-xl flex items-center gap-2 px-4 py-2 mx-auto">
            <FaEdit /><span className="font-semibold">Edit</span>
          </button>
        )}
      </td>
    </tr>
  );
};

export default TableRow;