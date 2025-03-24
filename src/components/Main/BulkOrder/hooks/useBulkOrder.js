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

          setState(prev => ({
            ...prev,
            [file.name.endsWith(".csv") ? "csvFile" : "txtFile"]: file,
            uploadedData: processedData
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
          order_id: state.txtFile ? row.sku_number : null,
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
          sku_number: state.txtFile ? row.sku_number : null,
          package_length: row.PackageLength,
          package_width: row.PackageWidth,
          package_height: row.PackageHeight,
          package_weight: row.PackageWeight,
          package_weight_unit: "LB",
          order_item_quantity: String(row.quantity) || "1"
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
          message: error.response?.data?.message || "Submission failed",
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
    
    setState(prev => ({
      ...prev,
      courierType: selected,
      availableServices: courierType?.services || [],
      selectedService: null,
      selectedProvider: null
    }));
  };

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
    setSelectedService: (service) => setState(prev => ({ ...prev, selectedService: service })),
    setSelectedProvider: (provider) => setState(prev => ({ ...prev, selectedProvider: provider })),
    setUploadedData: (data) => setState(prev => ({ ...prev, uploadedData: data })),
    setNotification: (notification) => setState(prev => ({ ...prev, notification })),
    setModalVisible: (visible) => setState(prev => ({ ...prev, modalVisible: visible }))
  };
};