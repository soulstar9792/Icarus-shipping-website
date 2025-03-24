// src/components/Main/BulkOrder/index.js
import React from 'react';
import { useSelector } from 'react-redux';
import { FaDownload } from 'react-icons/fa';
import $GS from '../../../styles/constants';
import FileUpload from './FileUpload';
import DataTable from './DataTable';
import OrderSummary from './OrderSummary';
import Notification from '../../Notification';
import Modal from './Modal';
import { useBulkOrder } from './hooks/useBulkOrder';
import './BulkOrder.css';

const BulkOrder = () => {
  const user = useSelector(state => state.auth.user);
  const {
    csvFile,
    txtFile,
    uploadedData,
    totalPrice,
    notification,
    modalVisible,
    fileData,
    courierType,
    availableServices,
    selectedService,
    selectedProvider,
    handleFileChange,
    handleSubmit,
    HandleCourierChange,
    setSelectedService,
    setSelectedProvider,
    setUploadedData,
    setNotification,
    setModalVisible
  } = useBulkOrder(user);

  return (
    <div className={`px-4 max-w-[86vw] hide-scroll-bar h-[90vh] ${$GS.bgCustomBackground} md:px-10 py-10 md:py-10`}>
      <FileUpload 
        csvFile={csvFile}
        txtFile={txtFile}
        handleFileChange={handleFileChange}
      />

      {txtFile && (
        <div className={`${$GS.card} text-center p-6`}>
          <label className={`${$GS.textNormal1} mb-2`}>Courier Type</label>
          <select
            value={courierType}
            onChange={HandleCourierChange}
            className={`${$GS.inputField} ${$GS.borderCustom}`}
          >
            <option value="">Select Courier...</option>
            <option value="UPS">UPS</option>
            <option value="USPS">USPS</option>
          </select>

          <label className={`${$GS.textNormal1} mt-4`}>Service Type</label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className={`${$GS.inputField} ${$GS.borderCustom} mt-2`}
          >
            <option value="">Select Service...</option>
            {availableServices.map(service => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>

          {courierType === "USPS" && (
            <>
              <label className={`${$GS.textNormal1} mt-4`}>Provider</label>
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className={`${$GS.inputField} ${$GS.borderCustom} mt-2`}
              >
                <option value="">Select Provider...</option>
                {["USPSveVS", "USPSvShippo", "USPSvStore", "USPSvUnbranded"].map(provider => (
                  <option key={provider} value={provider}>{provider}</option>
                ))}
              </select>
            </>
          )}
        </div>
      )}

       {/* Conditional rendering based on file presence */}
       {csvFile || txtFile ? (
        <DataTable 
          uploadedData={uploadedData}
          txtFile={txtFile}
          courierType={courierType}
          setUploadedData={setUploadedData}
        />
      ) : (
        <div className={`${$GS.card} text-center p-6`}>
          <p className={`${$GS.textNormal1} mb-4`}>
            <a
              href={`${process.env.REACT_APP_API_URL}/api/orders/file/template`}
              className="text-blue-600 hover:text-blue-500 underline"
              download
            >
              <FaDownload className="inline-block mr-2" />
              Download Bulk Template CSV
            </a>
          </p>
          <p className={`${$GS.textSmall} text-gray-500`}>
            File Format: CSV with columns for sender/receiver info, package details, and service type
          </p>
        </div>
      )}

      <OrderSummary 
        totalPrice={totalPrice} 
        handleSubmit={handleSubmit}
      />

      <Notification
        {...notification}
        onClose={() => setNotification({ ...notification, visible: false })}
      />
      
      <Modal 
        fileData={fileData} 
        isVisible={modalVisible} 
        onClose={() => setModalVisible(false)}
      />
    </div>
  );
};

export default BulkOrder;