// src/components/Main/BulkOrder/TableRow.js
import React, { useState } from 'react';
import { FaCheck, FaEdit, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { useSelector } from 'react-redux';
import $GS from '../../../styles/constants';
import './BulkOrder.css';

const TableRow = ({ row, index, setUploadedData, uploadedData }) => {
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
    if (editedData.sku_number) {
      const rowsWithSameSku = uploadedData.filter(
        (row, idx) => idx !== index && row.sku_number === editedData.sku_number
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
          (sku) => sku.sku === editedData.sku_number
        );

        const parsedData = {
          sku: editedData.sku_number,
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
    return value;
  };

  return (
    <tr className={`${$GS.bgCustomBackground} ${$GS.textCustomText}`}>
      <td className={`${$GS.borderCustom} p-2`}>
        {renderTableCell(index, "ServiceName", row.ServiceName)}
      </td>

      {/* SKU Number */}
      <td className={`${$GS.borderCustom} p-2`}>
        {renderTableCell(index, "sku_number", row.sku_number)}
      </td>

      {/* Sender Name */}
      <td className={`${$GS.borderCustom} p-2`}>
        {renderTableCell(index, "FromSenderName", row.FromSenderName)}
      </td>

      {/* Package Weight */}
      <td className={`${$GS.borderCustom} p-2`}>
        {editingRow === index ? (
          renderTableCell(index, "PackageWeight", row.PackageWeight)
        ) : (
          `${row.PackageWeight} lbs`
        )}
      </td>

      {/* Package Dimensions */}
      <td className={`${$GS.borderCustom} p-2`}>
        {editingRow === index ? (
          <>
            {renderTableCell(index, "PackageLength", row.PackageLength)} x
            {renderTableCell(index, "PackageWidth", row.PackageWidth)} x
            {renderTableCell(index, "PackageHeight", row.PackageHeight)}
          </>
        ) : (
          `${row.PackageLength}" x ${row.PackageWidth}" x ${row.PackageHeight}"`
        )}
      </td>

      {/* Actions */}
        <td className={`${$GS.borderCustom} p-4`}>
        {editingRow === index ? (
          <div className="flex space-x-2 justify-center">
            <button
              onClick={() => handleSave(index)}
              className={`${$GS.buttonPrimary} p-2`}
            >
              <FaCheck />
            </button>
            <button
              onClick={handleCancel}
              className={`${$GS.buttonDanger} p-2`}
            >
              <FaTimes />
            </button>
          </div>
        ) : (
          <button
            onClick={() => handleEdit(index)}
            className={`${$GS.buttonSecondary} rounded-xl px-4 py-2`}
          >
            <FaEdit />
            <span className={`${$GS.textButton} ml-2`}>Edit</span>
          </button>
        )}
      </td>
    </tr>
  );
};

export default TableRow;