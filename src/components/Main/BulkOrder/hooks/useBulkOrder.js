// src/components/Main/BulkOrder/hooks/useBulkOrder.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import { 
  validateRow,
  extractTxtLabelData,
  splitDataByMaxQty
} from '../../../../utils/bulkOrderUtils';
import LabelServicesType from '../../../../LabelServicesType.json';

export const useBulkOrder = (user) => {
  const [state, setState] = useState({
    csvFile: null,
    txtFile: null,
    uploadedData: [],
    totalPrice: 0,
    loading: false,
    notification: { visible: false, message: "", type: "" },
    modalVisible: false,
    fileData: {},
    senderAddress: null,
    availableServices: [],
    selectedService: null,
    selectedProvider: null,
    courierType: "",
    SkuData: []
  });
  // Original price calculation logic
  const getBulkCost = async () => {
    try {
      if (!state.uploadedData.length) return;

      const shipments = state.uploadedData.map(row => ({
        courier: state.courierType || row.ServiceName?.split(" ")[0],
        service_name: state.selectedService || row.ServiceName,
        sender: {
          sender_name: row.FromSenderName,
          sender_phone: row.FromPhone,
          sender_address1: row.FromStreet1,
          sender_city: row.FromCity,
          sender_state_province: row.FromStateProvince,
          sender_zip_postal: row.FromZipPostal,
          sender_country: row.FromCountry,
        },
        receiver: {
          receiver_name: row.ToRecipientName,
          receiver_phone: row.ToPhone,
          receiver_address1: row.ToStreet1,
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
          package_weight_unit: "LB"
        }
      }));

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/orders/price/bulk`,
        { userId: user?._id, shipments }
      );
      
      setState(prev => ({ 
        ...prev, 
        totalPrice: response.data.totalPrice 
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        notification: {
          visible: true,
          message: err.response?.data?.message || "Price calculation failed",
          type: "error"
        }
      }));
    }
  };

  // Original file handling logic
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (file.name.endsWith(".txt") && !state.senderAddress) {
        setState(prev => ({
          ...prev,
          notification: {
            visible: true,
            message: "Please add an address first",
            type: "error"
          }
        }));
        return;
      }

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const processedData = file.name.endsWith(".csv") 
            ? processCSV(results.data)
            : processTXT(results.data);
          setUploadedData(processedData);

          setState(prev => ({
            ...prev,
            [file.name.endsWith(".csv") ? "csvFile" : "txtFile"]: file
          }));
        },
        error: (error) => {
          setState(prev => ({
            ...prev,
            notification: {
              visible: true,
              message: "Error parsing file",
              type: "error"
            }
          }));
        }
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        notification: {
          visible: true,
          message: "File processing failed",
          type: "error"
        }
      }));
    }
  };

  // Original CSV processing
  const processCSV = (data) => {
    const invalidRows = [];
    const validData = data.map((row, index) => {
      row.quantity = row.PackageReference1 || "1";
      row.skuNumber = row.PackageReference2 || null;
      const validation = validateRow(row, true);
      if (!validation.isValid) invalidRows.push({ rowIndex: index + 1, errors: validation.errors });
      return { ...row, errors: validation.errors };
    });

    if (invalidRows.length > 0) {
      setState(prev => ({
        ...prev,
        notification: {
          visible: true,
          message: `${invalidRows.length} rows have validation errors`,
          type: "warning"
        }
      }));
    }
    return validData;
  };

  // Original TXT processing
  const processTXT = (data) => {
    const labelData = extractTxtLabelData(data, state.senderAddress);
    return splitDataByMaxQty(labelData);
  };

  // Original submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const shipments = state.uploadedData.map(row => ({
        courier: state.courierType,
        service_name: state.selectedService,
        manifested: false,
        sender: {
          order_id: row.orderId,
          sender_name: row.FromSenderName,
          sender_phone: row.FromPhone,
          sender_address1: row.FromStreet1,
          sender_city: row.FromCity,
          sender_state_province: row.FromStateProvince,
          sender_zip_postal: row.FromZipPostal,
          sender_country: row.FromCountry,
        },
        receiver: {
          receiver_name: row.ToRecipientName,
          receiver_phone: row.ToPhone,
          receiver_address1: row.ToStreet1,
          receiver_city: row.ToCity,
          receiver_state_province: row.ToStateProvince,
          receiver_zip_postal: row.ToZipPostal,
          receiver_country: row.ToCountry,
        },
        package: {
          order_item_id: String(row.orderItemId),
          quantity: String(row.quantity),
          sku_number: state.txtFile ? row.skuNumber : null,

          package_length: String(row.PackageLength),
          package_width: String(row.PackageWidth),
          package_height: String(row.PackageHeight),
          package_weight: String(row.PackageWeight),
          package_weight_unit: "LB",
        }
      }));

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/orders/bulk/${user._id}`,
        shipments
      );

      setState(prev => ({
        ...prev,
        loading: false,
        fileData: response.data.fileData,
        modalVisible: true
      }));

    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        notification: {
          visible: true,
          message: error.response?.data?.data?.message || "Submission failed",
          type: "error"
        }
      }));
    }
  };

  // Original courier change handler
  const HandleCourierChange = (e) => {
    const selected = e.target.value;
    
    const courierType = LabelServicesType.find(
      (courier) => courier.courier === selected
      );
    const servicesList = Object.keys(courierType.services);
    
    // update uploaded data's courier to the selected courier.
    let updatedData = state.uploadedData.map((row) => ({...row, courier: selected}));
    setState(prev => ({
      ...prev,
      courierType: selected,
      availableServices: servicesList,
      selectedService: null,
      selectedProvider: null,
      uploadedData: updatedData
    }));
  };

  // Update uploadedData's Weight, Length, Width, Height, Description to SkuData if the SKU is already registered. If not, add the SKU to the registered SKUs.
  const setUploadedData = (data) => {
    
        // update uploaded data's weight, length, width, height if the sku is already registered.
        let updatedData = data.map((row) => {
          
          row.courier = state.courierType || null;
          row.service_name = state.selectedService || null;
          row.provider = state.selectedProvider || null;

          const sku = state.SkuData.find((sku) => sku.sku === row.skuNumber);
          if (sku) {
            return {
              ...row,
              PackageWeight: sku.weight,
              PackageLength: sku.length,
              PackageWidth: sku.width,
              PackageHeight: sku.height,
              PackageDescription: sku.description,
            };
          }
          return row;
        });
        setState(prev => ({
          ...prev,
          uploadedData: updatedData
        }))
  };      

  // setSelectedService
  const setSelectedService = (ServiceName) => {
    // update uploaded data's weight, length, width, height if the sku is already registered.
    let updatedData = state.uploadedData.map((row) => ({ ...row, ServiceName}));
    setState(prev => ({
      ...prev,
      uploadedData: updatedData,
      selectedService: ServiceName
    }))
  }

  // setSelectedService
  const setSelectedProvider = (provider) => {
    // update uploaded data's weight, length, width, height if the sku is already registered.
    let updatedData = state.uploadedData.map((row) => ({ ...row, provider}));
    setState(prev => ({
      ...prev,
      uploadedData: updatedData,
      selectedProvider: provider
    }))
  }

  // Original useEffect for initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [addressRes, skuRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/auth/get-address/${user._id}`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/auth/get-sku/${user._id}`)
        ]);

        setState(prev => ({
          ...prev,
          senderAddress: addressRes.data?.savedAddress?.[0],
          SkuData: skuRes.data?.SkuData || []
        }));

      } catch (error) {
        setState(prev => ({
          ...prev,
          notification: {
            visible: true,
            message: "Error loading initial data",
            type: "error"
          }
        }));
      }
    };
    
    if (user) fetchInitialData();
  }, [user]);

  // Original price calculation trigger
  useEffect(() => {
    if (state.csvFile || state.txtFile) {
      getBulkCost();
    }
  }, [state.csvFile, state.txtFile, state.selectedService, state.uploadedData]);

  return {
    ...state,
    handleFileChange,
    handleSubmit,
    HandleCourierChange,
    setSelectedService,
    setSelectedProvider,
    setUploadedData,
    setNotification: (notification) => setState(prev => ({ ...prev, notification })),
    setModalVisible: (visible) => setState(prev => ({ ...prev, modalVisible: visible }))
  };
};