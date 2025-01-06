// src/components/Main/BulkOrder.js
import React, { useState } from 'react';
import Card from '../Utils/Card'; 
import $GS from '../../styles/constants'; 
import { FaUpload } from 'react-icons/fa'; 
import Papa from 'papaparse'; 
import axios from 'axios';
import Loading from '../Loading';
import Notification from '../Notification';

import './BulkOrder.css'; // Import custom CSS for styling.

const BulkOrder = () => {
  const [csvFile, setCsvFile] = useState(null);
  const [courierType, setCourierType] = useState('');
  const [uploadedData, setUploadedData] = useState([]); // State for storing parsed CSV data
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ visible: false, message: "", type: "" });
  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility
  const [fileName, setFileName] = useState(null); // Store data needed for downloading

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setCsvFile(file);

    // Parse CSV file
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setUploadedData(results.data);
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
        },
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (courierType === "") {
      setNotification({ visible: true, message: "Please select a courier type", type: "error" });
      setTimeout(() => {
        setNotification({ ...notification, visible: false });
      }, 2000);
      return;
    }
    if (uploadedData.length === 0) {
      setNotification({ visible: true, message: "Please upload a CSV file", type: "error" });
      setTimeout(() => {
        setNotification({ ...notification, visible: false });
      }, 2000);
      return;
    }
    setLoading(true);
    const selectedCourier = courierType; // Get the selected courier type
    const shipments = uploadedData.map((row) => {
      return {
        courier: selectedCourier,
        service_name: row.ServiceName, // Assuming you want to use `ServiceName` from the CSV
        manifested: false,
        sender: {
          sender_name: row.FromSenderName,
          sender_phone: row.FromPhone,
          sender_company: row.FromCompany,
          sender_address1: row.FromStreet1,
          sender_address2: row.FromStreet2,
          sender_city: row.FromCity,
          sender_state_province: row.FromStateProvince,
          sender_zip_postal: row.FromZipPostal,
          sender_country: row.FromCountry,
        },
        receiver: {
          receiver_name: row.ToRecipientName,
          receiver_phone: row.ToPhone,
          receiver_company: row.ToCompany,
          receiver_address1: row.ToStreet1,
          receiver_address2: row.ToStreet2,
          receiver_city: row.ToCity,
          receiver_state_province: row.ToStateProvince,
          receiver_zip_postal: row.ToZipPostal,
          receiver_country: row.ToCountry,
        },
        package: {
          package_length: row.PackageLength,
          package_width: row.PackageWidth,
          package_height: row.PackageHeight,
          package_weight: row.PackageWeight,
          package_weight_unit: "LB", // Assuming weight is in pounds
          package_description: row.PackageDescription,
          package_reference1: row.PackageReference1 || "", // Handling missing fields
          package_reference2: row.PackageReference2 || "", // Same as above
        },
      };
    });
    try {
      const response = await axios.post('https://lcarus-shipping-backend-ce6c088c70be.herokuapp.com/api/orders/bulk', shipments, {
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await response.data;
      if (result.fileName) { // Assume the response contains a download Id
        setFileName(result.fileName); 
        setModalVisible(true); // Show modal
      }
      console.log(result);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get(`https://lcarus-shipping-backend-ce6c088c70be.herokuapp.com/api/orders/download/${fileName}`, {
        responseType: 'blob', // Important for downloading files
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'label.pdf'); // Set the file name for download
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Close modal after download
      setModalVisible(false);
    } catch (error) {
      console.error('Error downloading PDF:', error.message);
    }
  };

  return (
    <div className="px-4 md:px-10 py-10 md:py-20 bg-custom-background">
      {loading ? (
        <Loading />
      ) : (
        <div>
          <div className="mb-6">
            <label htmlFor="labelType" className={`${$GS.textNormal_1} mb-2`}>Label Type</label>
            <select
              id="labelType"
              value={courierType}
              onChange={(e) => setCourierType(e.target.value)}
              className="border border-custom-border p-2 w-full bg-transparent text-custom-text"
            >
              <option value="">Select Courier Type...</option>
              <option value="UPS">UPS</option>
              <option value="USPS">USPS</option>
            </select>
          </div>

          {/* CSV Upload Section */}
          <Card className="mb-6 p-6">
            <h2 className={`${$GS.textHeading_2} mb-4`}>Upload CSV Template</h2>
            <div
              className="border-2 border-dashed border-blue-400 p-6 text-center rounded-md cursor-pointer"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const files = e.dataTransfer.files;
                if (files.length) {
                  const file = files[0];
                  setCsvFile(file);
                  // Parse CV file
                  Papa.parse(file, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                      setUploadedData(results.data);
                    },
                  });
                }
              }}
              onClick={() => document.getElementById('file-upload').click()} // Trigger file input on click
            >
              <FaUpload className="mx-auto mb-2 text-blue-600" size={40} />
              <p className="text-blue-600">Drag & drop your CSV file here</p>
              <span className="inline-block mt-2 text-blue-600">
                or <span className="underline">choose a file</span>
              </span>
              <input
                id="file-upload"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            {csvFile && (
              <p className={`${$GS.textNormal_1} mt-2`}>Uploaded File: {csvFile.name}</p>
            )}
          </Card>

          {/* Data Table Section */}
          <Card>
            <h2 className={`${$GS.textHeading_2} mb-4`}>Uploaded Data</h2>
            <div className="overflow-x-auto max-h-96">
              <table className="min-w-full border-separate border-spacing-0 border-custom-border">
                <thead className="bg-custom-background text-custom-text sticky top-0 z-30 border border-custom-border">
                  <tr>
                    <th colSpan="6" className="border border-custom-border p-2 text-left">From</th>
                    <th colSpan="6" className="border border-custom-border p-2 text-left">To</th>
                    <th colSpan="6" className="border border-custom-border p-2 text-left">Package Info</th>
                  </tr>
                  <tr className="bg-custom-background text-custom-text">
                    {/* From Section */}
                    <th className="border border-custom-border p-2">Name *</th>
                    <th className="border border-custom-border p-2">Company</th>
                    <th className="border border-custom-border p-2">Phone</th>
                    <th className="border border-custom-border p-2">Street *</th>
                    <th className="border border-custom-border p-2">Street 2</th>
                    <th className="border border-custom-border p-2">City</th>
                    {/* To Section */}
                    <th className="border border-custom-border p-2">Name *</th>
                    <th className="border border-custom-border p-2">Company</th>
                    <th className="border border-custom-border p-2">Phone</th>
                    <th className="border border-custom-border p-2">Street *</th>
                    <th className="border border-custom-border p-2">Street 2</th>
                    <th className="border border-custom-border p-2">City</th>
                    {/* Package Info Section */}
                    <th className="border border-custom-border p-2">Type *</th>
                    <th className="border border-custom-border p-2">Weight *</th>
                    <th className="border border-custom-border p-2">Length</th>
                    <th className="border border-custom-border p-2">Width</th>
                    <th className="border border-custom-border p-2">Height</th>
                    <th className="border border-custom-border p-2">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {uploadedData.map((row, index) => (
                    <tr key={index} className="bg-custom-background text-custom-text">
                      {/* From Section */}
                      <td className="border border-custom-border p-2">{row.FromSenderName}</td>
                      <td className="border border-custom-border p-2">{row.FromCompany}</td>
                      <td className="border border-custom-border p-2">{row.FromPhone}</td>
                      <td className="border border-custom-border p-2">{row.FromStreet1}</td>
                      <td className="border border-custom-border p-2">{row.FromStreet2}</td>
                      <td className="border border-custom-border p-2">{row.FromCity}</td>
                      {/* To Section */}
                      <td className="border border-custom-border p-2">{row.ToRecipientName}</td>
                      <td className="border border-custom-border p-2">{row.ToCompany}</td>
                      <td className="border border-custom-border p-2">{row.ToPhone}</td>
                      <td className="border border-custom-border p-2">{row.ToStreet1}</td>
                      <td className="border border-custom-border p-2">{row.ToStreet2}</td>
                      <td className="border border-custom-border p-2">{row.ToCity}</td>
                      {/* Package Info Section */}
                      <td className="border border-custom-border p-2">{row.ServiceName}</td>
                      <td className="border border-custom-border p-2">{row.PackageWeight} lbs</td>
                      <td className="border border-custom-border p-2">{row.PackageLength} in</td>
                      <td className="border border-custom-border p-2">{row.PackageWidth} in</td>
                      <td className="border border-custom-border p-2">{row.PackageHeight} in</td>
                      <td className="border border-custom-border p-2">{row.PackageDescription}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <div className="flex justify-between items-center mt-8">
            <p className={`${$GS.textHeading_2} m-8`}>Total Price: $24.00</p>
            <div className="flex justify-center">
              <button type="submit" onClick={handleSubmit} className={`${$GS.textHeading_2} cursor-pointer rounded-small p-6 md:p-8 border-thin border-custom-border transition-shadow duration-300 
                    bg-card-background group hover:border-hover-border hover:shadow-bright`}>Submit Bulk Order</button>

            </div>
            <div className="text-center text-sm text-gray-400">
              <p>© {new Date().getFullYear()} Icarus Ships. All rights reserved.</p>
            </div>
          </div>
        </div>)}
      <Notification {...notification} onClose={() => setNotification({ ...notification, visible: false })} />
      <Modal
        isVisible={modalVisible}
        message="Your orders have been submitted successfully!"
        onClose={() => setModalVisible(false)}
        onDownload={handleDownload}
      />
    </div>
  );
};

export default BulkOrder;


const Modal = ({ isVisible, message, onClose, onDownload }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-4 shadow-lg">
        <h2 className="text-lg font-bold mb-4">{message}</h2>
        <button
          onClick={onDownload}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Download PDF
        </button>
        <button
          onClick={onClose}
          className="bg-gray-300 text-black px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};
