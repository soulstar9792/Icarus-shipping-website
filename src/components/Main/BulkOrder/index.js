// src/components/Main/BulkOrder/index.js
import React from 'react';
import { useSelector } from 'react-redux';
import $GS from '../../../styles/constants';
import FileUpload from './FileUpload';
import DataTable from './DataTable';
import OrderSummary from './OrderSummary';
import Notification from '../../Notification';
import Modal from './Modal';
import DownloadSection from './DownloadSection'; // Import the new DownloadSection
import DropDownSection from './DropDownSection';
import { useBulkOrder } from './hooks/useBulkOrder';
import Loading from '../../Loading';
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
    orderId,
    loading,
    handleFileChange,
    handleSubmit,
    HandleCourierChange,
    setSelectedService,
    setSelectedProvider,
    setUploadedData,
    setNotification,
    setModalVisible,
    setOrderId,
    setFileData
  } = useBulkOrder(user);

  return (
    <div className={`px-4 max-w-[86vw] hide-scroll-bar h-[90vh] ${$GS.bgCustomBackground} md:px-10 py-10 md:py-10`}>
      
      {loading && <Loading />}
      <FileUpload 
        csvFile={csvFile}
        txtFile={txtFile}
        handleFileChange={handleFileChange}
      />

      {txtFile && 
        <DropDownSection
          courierType={courierType}
          availableServices={availableServices}
          selectedService={selectedService}
          selectedProvider={selectedProvider}
          HandleCourierChange={HandleCourierChange}
          setSelectedService={setSelectedService}
          setSelectedProvider={setSelectedProvider}
        />
        }

      {/* Conditional rendering based on file presence */}
      {csvFile || txtFile ? (
        <DataTable 
          uploadedData={uploadedData}
          txtFile={txtFile}
          courierType={courierType}
          selectedService={selectedService}
          setUploadedData={setUploadedData}
        />
      ) : (
        <DownloadSection />
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
        onClose={() => {
          setModalVisible(false);
          setFileData(null);
          setOrderId(null); // Add this line to reset orderId
        }}
        orderId={orderId}
      />
    </div>
  );
};

export default BulkOrder;