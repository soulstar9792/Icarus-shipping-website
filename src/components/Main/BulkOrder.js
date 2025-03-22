// src/components/Main/BulkOrder.js
import React, { useEffect, useState } from "react";
import Card from "../Utils/Card";
import $GS from "../../styles/constants";
import { FaCheck, FaEdit, FaTimes, FaUpload, FaDownload } from "react-icons/fa";
import Papa from "papaparse";
import axios from "axios";
import Loading from "../Loading";
import Notification from "../Notification";
import LabelServicesType from "../../LabelServicesType.json";
import "./BulkOrder.css"; // Import custom CSS for styling.
import { useSelector } from "react-redux";

const BulkOrder = () => {
  const user = useSelector((state) => state.auth.user);
  const [csvFile, setCsvFile] = useState(null);
  const [txtFile, setTxtFile] = useState(null);
  const [courierType, setCourierType] = useState("");
  const [uploadedData, setUploadedData] = useState([]); // State for storing parsed CSV data
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    visible: false,
    message: "",
    type: "",
  });
  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility
  const [fileData, setFileData] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [senderAddress, setSenderAddress] = useState(null);
  const [availableServices, setAvailableServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [SkuData, setSkuData] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [editedData, setEditedData] = useState({});
  const handleEdit = (index) => {
    setEditingRow(index);
    setEditedData(uploadedData[index]);
  };

  const handleFieldChange = (field, value) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async (index) => {
    const newData = [...uploadedData];
    const dimensionFields = [
      "PackageWeight",
      "PackageLength",
      "PackageWidth",
      "PackageHeight",
    ];

    dimensionFields.forEach((field) => {
      if (editedData[field] !== "") {
        editedData[field] = parseFloat(editedData[field]) || null;
      }
    });

    newData[index] = { ...editedData };
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
      let existingSku = null;
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/auth/get-sku/${user._id}`,
          { headers: { "Content-Type": "application/json" } }
        );

        const SKUPresent = response.data.SkuData;
        existingSku = SKUPresent.find(
          (sku) => sku.sku === editedData.sku_number
        );
      } catch (error) {
        console.error("Error fetching SKUs:", error);
      }

      const parsedData = {
        sku: editedData.sku_number,
        maxQty: editedData.quantity || 1,
        weight: parseFloat(editedData.PackageWeight) || null,
        length: parseFloat(editedData.PackageLength) || null,
        width: parseFloat(editedData.PackageWidth) || null,
        height: parseFloat(editedData.PackageHeight) || null,
      };

      try {
        if (existingSku) {
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/auth/update-sku/${user._id}/${existingSku._id}`,
            { skuData: parsedData },
            { headers: { "Content-Type": "application/json" } }
          );

          if (response.status === 200) {
            setSkuData(response.data.updatedUserSKU);
          } else {
            console.error("Failed to update SKU:", response);
          }
        } else {
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/auth/add-sku/${user._id}`,
            { parsedData: [parsedData] },
            { headers: { "Content-Type": "application/json" } }
          );

          if (response.status === 200) {
            setSkuData((prev) => [...prev, { number: editedData.sku }]);
          } else {
            console.error("Failed to add SKU:", response);
          }
        }
      } catch (error) {
        console.error("Error with SKU operation:", error);
      }
    }
    setUploadedData(newData);
    if(txtFile){
    setNotification({
      visible: true,
      message: "SKU Data automatically updated",
      type: "success",
    });
    setTimeout(() => {
      setNotification({ ...notification, visible: false });
    }, 2000);
  }
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
          value={
            editedData[field] !== "undefined" && editedData[field] !== null
              ? editedData[field]
              : ""
          }
          onChange={(e) => handleFieldChange(field, e.target.value)}
          className="w-full p-1 border border-blue-400 bg-slate-600 rounded"
        />
      );
    }
    return value;
  };

  const validateRow = (row) => {
    const requiredFields = [
      "FromSenderName",
      "FromStreet1",
      "FromCity",
      "ToRecipientName",
      "ToStreet1",
      "ToCity",
      "PackageWeight",
      "ServiceName",
    ];

    const errors = requiredFields.reduce((acc, field) => {
      if (!row[field] || row[field].trim() === "") {
        acc.push(`${field} is required.`);
      }
      return acc;
    }, []);

    if (
      isNaN(parseFloat(row.PackageWeight)) ||
      parseFloat(row.PackageWeight) <= 0
    ) {
      errors.push("PackageWeight must be a positive number.");
    }
    return errors.length ? { isValid: false, errors } : { isValid: true };
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      if (user) {
        try {
          const [addressResponse, skuResponse] = await Promise.all([
            axios.get(
              `${process.env.REACT_APP_API_URL}/api/auth/get-address/${user._id}`
            ),
            axios.get(
              `${process.env.REACT_APP_API_URL}/api/auth/get-sku/${user._id}`
            ),
          ]);
          setSenderAddress(addressResponse.data?.savedAddress[0]);
          setSkuData(skuResponse.data.SkuData);
        } catch (error) {
          console.error("Error fetching initial data:", error);
          setNotification({
            visible: true,
            message: "Error loading initial data",
            type: "error",
          });
          setTimeout(() => {
            setNotification({ ...notification, visible: false });
          }, 2000);
        }
      }
    };
    fetchInitialData();
  }, [user]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log("file", file);
    if (file) {
      try {
        const fileType = file.name.split(".").pop();
        if (fileType === "csv") {
          setCsvFile(file);
          setTxtFile(null);
        } else if (fileType === "txt") {
          if (!senderAddress) {
            setNotification({
              visible: true,
              message: "Please Add a Address on the Address Tab",
              type: "error",
            });
            return;
          }
          setTxtFile(file);
          setCsvFile(null);
        }
        if (fileType === "csv") {
          if (file) {
            console.log("csv file", file);
            Papa.parse(file, {
              header: true,
              skipEmptyLines: true,
              complete: (results) => {
                const { data } = results;
                const invalidRows = [];
                const validData = [];
                console.log("results", results);
                data.forEach((row, index) => {
                  const validation = validateRow(row);
                  const rowWithErrors = { ...row, errors: validation.errors };

                  if (!validation.isValid) {
                    invalidRows.push({
                      rowIndex: index + 1,
                      errors: validation.errors,
                    });
                  }

                  validData.push(rowWithErrors);
                });

                if (invalidRows.length) {
                  setNotification({
                    visible: true,
                    message: `Some Fields Are Missing`,
                    type: "warning",
                  });
                  setTimeout(() => {
                    setNotification({ ...notification, visible: false });
                  }, 2000);
                } else {
                  setNotification({
                    visible: true,
                    message: "CSV file uploaded successfully!",
                    type: "success",
                  });
                  setTimeout(() => {
                    setNotification({ ...notification, visible: false });
                  }, 2000);
                }

                setUploadedData(validData);
              },
              error: (error) => {
                console.error("Error parsing CSV:", error);
                setNotification({
                  visible: true,
                  message: "Error parsing CSV file.",
                  type: "error",
                });
              },
            });
          }
        } else if (fileType === "txt") {
          if (file) {
            Papa.parse(file, {
              header: true,
              delimiter: "\t",
              skipEmptyLines: true,
              transformHeader: (header) => header.trim(),
              complete: (results) => {
                const { data } = results;

                const labelData = extractTxtLabelData(data);
                const splitData = splitDataByMaxQty(labelData);
                setNotification({
                  visible: true,
                  message: "File uploaded  successfully!",
                  type: "success",
                });
                setTimeout(() => {
                  setNotification({ ...notification, visible: false });
                }, 2000);

                setUploadedData(splitData);
              },
              error: (error) => {
                setNotification({
                  visible: true,
                  message: "Error Parsing file",
                  type: "error",
                });
                setTimeout(() => {
                  setNotification({ ...notification, visible: false });
                }, 2000);
                console.log("Error Parsing file", error);
              },
            });
          }
        }
      } catch (error) {
        console.log("Error Occured ", error);
      }
    }
  };

  const extractTxtLabelData = (data) => {
    return data.map((row) => ({
      courier: "selectedCourier",
      service_name: row.ServiceName
        ? row.ServiceName
        : selectedService || "N/A",
      manifested: false,

      FromSenderName: senderAddress?.name || "",
      FromPhone: senderAddress?.phone || "",
      FromCompany: senderAddress?.company || "",
      FromStreet1: senderAddress?.state || " ",
      FromStreet2: senderAddress?.address2 || "",
      FromCity: senderAddress?.city || " ",
      FromStateProvince: senderAddress?.state || " ",
      FromZipPostal: senderAddress?.zip || " ",
      FromCountry: senderAddress?.country || "",

      ToRecipientName: row["recipient-name"] || "",
      ToPhone: row["buyer-phone-number"].split("ext")[0] || "",
      ToCompany: row["buyer-company"] || "",
      ToStreet1: row["ship-address-1"] || "",
      ToStreet2: row["ship-address-2"] || "",
      ToCity: row["ship-city"] || "",
      ToStateProvince: row["ship-state"] || "",
      ToZipPostal: row["ship-postal-code"] || "",
      ToCountry: row["ship-country"] || "",

      sku_number: row["sku"] || "",
      order_item_id: row["order-item-id"] || "",
      provider: row["provider"] || selectedProvider,
      package_length: String(row.PackageLength) || null,
      package_width: String(row.PackageWidth) || null,
      package_height: String(row.PackageHeight) || null,
      package_weight: String(row.PackageWeight) || null,
      package_weight_unit: "LB",
      package_description: String(row.PackageDescription) || "",
      package_reference1: String(row.PackageReference1) || "",
      package_reference2: String(row.PackageReference2) || "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploadedData.length === 0) {
      setNotification({
        visible: true,
        message: "Please upload a file",
        type: "error",
      });
      setTimeout(() => {
        setNotification({ ...notification, visible: false });
      }, 2000);
      return;
    }
 
    if (courierType === "" && txtFile) {
      setNotification({
        visible: true,
        message: "Please select a courier type",
        type: "error",
      });
      setTimeout(() => {
        setNotification({ ...notification, visible: false });
      }, 2000);
      return;
    }
    if (!selectedService && txtFile) {
      setNotification({
        visible: true,
        message: "Please Select a Service",
        type: "error",
      });
      setTimeout(() => {
        setNotification({ ...notification, visible: false });
      }, 2000);
      return;
    }
    if (!selectedProvider && txtFile && courierType === "USPS") {
      setNotification({
        visible: true,
        message: "Please Select a Provider",
        type: "error",
      });
      setTimeout(() => {
        setNotification({ ...notification, visible: false });
      }, 2000);
      return;
    }
    if (user.balance <= 0) {
      setNotification({
        visible: true,
        message: "Inssuficient Balance",
        type: "error",
      });
      setTimeout(() => {
        setNotification({ ...notification, visible: false });
      }, 2000);
      return;
    }
    if(csvFile){
      const invalidRows = [];
      uploadedData.forEach((row, index) => {
        const validation = validateRow(row);
        
        if (!validation.isValid) {
          invalidRows.push({
            rowIndex: index + 1,
            errors: validation.errors,
          });
        }
        
      });
      if (invalidRows.length) {
        setNotification({
          visible: true,
          message: `Please fill the mising fields`,
          type: "warning",
        });
        setTimeout(() => {
          setNotification({ ...notification, visible: false });
        }, 2000);

      return; 
      }

    }
  
    if (txtFile) {  
      const missingFields = uploadedData.filter(
        (row) =>
          (!row.PackageLength || row.PackageLength === 'undefined') ||
          (!row.PackageHeight || row.PackageHeight === 'undefined') ||
          (!row.PackageWidth || row.PackageWidth === 'undefined') ||
          (!row.PackageWeight || row.PackageWeight === 'undefined') ||
          (!row.sku_number)
      );

      console.log("Missing fields: ",missingFields); 
      if (missingFields.length > 0) {
        console.log("missing")
        setNotification({
          visible: true,
          message: `Missing fields detected in ${missingFields.length} rows. Ensure all rows have length,weight, height, width and SKU.`,
          type: "error",
        });
        setTimeout(() => {
          setNotification({ ...notification, visible: false });
        }, 3000);
        return;
      }
    }
    setLoading(true);
    if (csvFile || txtFile) {
      const selectedCourier = courierType; // Get the selected courier type
      if (uploadedData) {
        const shipments = uploadedData.map((row) => {
          return {
            courier: selectedCourier || row.ServiceName.split(" ")[0],
            service_name: row.ServiceName ? row.ServiceName : selectedService, // Assuming you want to use `ServiceName` from the CSV
            manifested: false,
            sender: {
              ...(txtFile ? { order_id: row.sku_number } : {}),
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
              sku_number: txtFile ? row.sku_number : null,
              order_item_id: txtFile ? row.order_item_id : null,
              provider: txtFile ? selectedProvider : null,
              package_length: csvFile
                ? row.PackageLength
                : String(row.PackageLength),
              package_width: csvFile
                ? row.PackageWidth
                : String(row.PackageWidth),
              package_height: csvFile
                ? row.PackageHeight
                : String(row.PackageHeight),
              package_weight: csvFile
                ? row.PackageWeight
                : String(row.PackageWeight),
              package_weight_unit: "LB", // Assuming weight is in pounds
              package_description: row.PackageDescription,
              package_reference1: row.PackageReference1 || "", // Handling missing fields
              package_reference2: row.PackageReference2 || "", // Same as above
              order_item_quantity: String(row.quantity) || "1",
            },
          };
        });
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/orders/bulk/` +
              user._id,
            shipments,
            {
              headers: { "Content-Type": "application/json" },
            }
          );
          if (response.status != 200) {
            setNotification({
              visible: true,
              message: response.data.message,
              type: "error",
            });
            setTimeout(() => {
              setNotification({ ...notification, visible: false });
            }, 2000);
            return;
          }
          const result = await response.data;
          if (result.fileData) {
            // Assume the response contains a download Id
            setFileData(result.fileData);
            setModalVisible(true); // Show modal
          }
          console.log("Bulk Order creation result", result); 
          setLoading(false);
        } catch (error) {
          console.error("Error:", error);
          
          setLoading(false);
          error.response && error.response.data.data && setNotification({
            visible: true,
            message: error.response.data.data.message,
            type: "error",
          });
          setTimeout(() => {
            setNotification({ ...notification, visible: false });
          }, 2000);
          return;
        }
      }
    }
  };

  const handleDownload = async (fileName) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/orders/download/${fileName}`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      const contentDisposition = response.headers["content-disposition"];
      const fileNameFromResponse = contentDisposition
        ? contentDisposition.split("filename=")[1].replace(/"/g, "")
        : fileName;
      link.setAttribute("download", fileNameFromResponse);

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Error downloading file:", error.message);
    }
  };

  const getBulkCost = async () => {
    try {
      const selectedCourier = courierType;
      if (csvFile || (txtFile && courierType)) {
        const shipments = uploadedData.map((row) => {
          return {
            courier: selectedCourier,
            service_name: row.ServiceName || selectedService, // Assuming you want to use `ServiceName` from the CSV
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
              package_length: row.package_length,
              package_width: row.package_width,
              package_height: row.package_height,
              package_weight: row.package_weight,
              package_weight_unit: "LB", // Assuming weight is in pounds
              package_description: row.PackageDescription,
              package_reference1: row.PackageReference1 || "", // Handling missing fields
              package_reference2: row.PackageReference2 || "", // Same as above
            },
          };
        });

        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/orders/price/bulk`,
          { userId: user._id, shipments: shipments },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        setTotalPrice(response.data.totalPrice);
      }
    } catch (err) {
      console.log("Error Occured : ", err);
    }
  };

  useEffect(() => {
    if (csvFile || txtFile) {
      getBulkCost();
    }
  }, [csvFile, txtFile, selectedService, uploadedData]);

  const HandleCourierChange = (e) => {
    const selected = e.target.value;
    setCourierType(selected);

    const courierType = LabelServicesType.find(
      (courier) => courier.courier === selected
    );
    if (courierType) {
      const servicesList = Object.keys(courierType.services);
      setAvailableServices(servicesList);
    } else {
      setAvailableServices([]);
    }
  };

  const splitDataByMaxQty = (data) => {
    if (!data || !data.length) return [];
    const splitData = [];
    data.forEach((row) => {
      const totalQty = parseInt(row.quantity) || 1;
      const maxQty = 4;
      const numberOfLabels = Math.ceil(totalQty / maxQty);

      for (let i = 0; i < numberOfLabels; i++) {
        const remainingQty = totalQty - i * maxQty;
        const currentQty = Math.min(remainingQty, maxQty);

        splitData.push({
          ...row,
          quantity: currentQty || 1,
          maxQty: maxQty,
          totalQty: totalQty,
          PackageDescription: `${row.PackageDescription || "Package"} (Batch ${
            i + 1
          } of ${numberOfLabels})`,
        });
      }
    });

    return splitData;
  };

  const HandleSkuData = () => {
    if (!uploadedData.length || !SkuData.length) return;

    const skuMap = new Map(SkuData.map((item) => [item.sku, item]));

    const enrichedData = uploadedData.map((row) => {
      const skuDetails = skuMap.get(row.sku_number);

      if (!skuDetails && row.sku_number) {
      }

      return {
        ...row,
        PackageLength: skuDetails?.length ?? row.PackageLength ?? null,
        PackageWidth: skuDetails?.width ?? row.PackageWidth ?? null,
        PackageHeight: skuDetails?.height ?? row.PackageHeight ?? null,
        PackageWeight: skuDetails?.weight ?? row.PackageWeight ?? null,
        quantity: skuDetails?.maxQty ?? 1,
      };
    });

    if (JSON.stringify(enrichedData) !== JSON.stringify(uploadedData)) {
      setUploadedData(enrichedData);
    }
  };

  useEffect(() => {
    if (txtFile && uploadedData.length > 0 && SkuData.length > 0) {
      HandleSkuData();
    }
  }, [txtFile, uploadedData, SkuData]);

  return (
    <div className="px-4 max-w-[86vw] hide-scroll-bar h-[90vh] bg-custom-background  md:px-10 py-10 md:py-10 ">
      {loading ? (
        <Loading />
      ) : (
        <div>
          {/* CSV Upload Section */}
          <Card className="mb-6 p-6 ">
            <div
              className="border-2 border-dashed border-blue-400 p-4 text-center rounded-md cursor-pointer"
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                  const file = files[0];
                  const event = {
                    target: { files: [file] },
                  };
                  handleFileChange(event);
                }
              }}
              onClick={() => document.getElementById("file-upload").click()} // Trigger file input on click
            >
              <FaUpload className="mx-auto text-blue-600" size={40} />
              <p className="text-blue-600">
                Drag & drop your CSV or Amazon file here
              </p>
              <span className="inline-block text-blue-600">
                or <span className="underline">choose a file</span>
              </span>
              <input
                id="file-upload"
                type="file"
                accept=".csv , .txt"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            {csvFile || txtFile ? (
              <p className={` text-sm text-gray-500 mt-2`}>
                Uploaded File: {csvFile ? csvFile?.name : txtFile?.name}
              </p>
            ) : null}
          </Card>
          {txtFile && (
            <div className="mb-6">
              <label htmlFor="labelType" className={`${$GS.textNormal_1} mb-2`}>
                Label Type
              </label>
              <select
                id="labelType"
                value={courierType}
                onChange={()=>HandleCourierChange()}
                className="border border-custom-border p-2 w-full bg-transparent text-custom-text"
              >
                <option value="">Select Courier Type...</option>
                <option value="UPS">UPS</option>
                <option value="USPS">USPS</option>
              </select>
              <div className="content-end">
                <label htmlFor="serviceType" className={`${$GS.textNormal_1}`}>
                  Type
                </label>
                <select
                  id="serviceType"
                  className="border border-custom-border p-2 w-full bg-transparent text-custom-text rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-400"
                  disabled={!availableServices.length} // Disable if no services available
                  onChange={(e) => {
                    setSelectedService(e.target.value);
                  }}
                >
                  <option value="" className="text-gray-500">
                    Select a service...
                  </option>
                  {availableServices.map((service, index) => (
                    <option key={index} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>
              {courierType === "USPS" && (
                <div className="content-end">
                  <label htmlFor="Provider" className={`${$GS.textNormal_1}`}>
                    Provider
                  </label>
                  <select
                    id="Provider"
                    className="border border-custom-border p-2 w-full bg-transparent text-custom-text rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-400"
                    disabled={!selectedService}
                    onChange={(e) => {
                      setSelectedProvider(e.target.value);
                    }}
                  >
                    <option value="" className="text-gray-500">
                      Select a Provider...
                    </option>
                    {[
                      "USPSveVS",
                      "USPSvShippo",
                      "USPSvStore",
                      "USPSvUnbranded",
                    ].map((provider, index) => (
                      <option key={index} value={provider}>
                        {provider}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}
          {/* Data Table Section */}
          {txtFile || csvFile ? (
            <div className="relative overflow-x-auto">
              <div className="overflow-x-auto ">
                <div className="inline-block min-w-full align-middle">
                  <div
                    className="overflow-y-auto"
                    style={{ maxHeight: "40vh" }}
                  >
                    <table className="min-w-full border-separate border-spacing-0 border-custom-border text-sm">
                      <thead className="bg-custom-background text-custom-text">
                        <tr>
                          <th
                            colSpan="6"
                            className="sticky top-0 z-10 border border-custom-border p-4 text-left bg-custom-background h-14 whitespace-nowrap"
                          >
                            From
                          </th>
                          <th
                            colSpan="6"
                            className="sticky top-0 z-10 border border-custom-border p-4 text-left bg-custom-background h-14 whitespace-nowrap"
                          >
                            To
                          </th>
                          <th
                            colSpan="12"
                            className="sticky top-0 z-10 border border-custom-border p-4 text-left bg-custom-background h-14 whitespace-nowrap"
                          >
                            Package Info
                          </th>
                        </tr>
                        <tr className="bg-custom-background text-custom-text">
                          <th className="sticky top-14 z-10 min-w-[200px] border border-custom-border p-4 bg-custom-background h-14 whitespace-nowrap">
                            Type *
                          </th>
                          {txtFile && courierType === "USPS" && (
                            <th className="sticky min-w-[200px] top-14 z-10 border border-custom-border p-2 bg-custom-background h-14 whitespace-nowrap">
                              Provider
                            </th>
                          )}
                          {txtFile && (
                            <th className="sticky min-w-[200px] top-14 z-10 border border-custom-border p-2 bg-custom-background h-14 whitespace-nowrap">
                              SKU Number
                            </th>
                          )}
                          <th className="sticky top-14 z-10 min-w-[200px] border border-custom-border p-2 bg-custom-background h-14 whitespace-nowrap">
                            Name *
                          </th>
                          <th className="sticky top-14 z-10 min-w-[200px] border border-custom-border p-2 bg-custom-background h-14 whitespace-nowrap">
                            Company
                          </th>
                          <th className="sticky top-14 z-10 min-w-[120px] border border-custom-border p-2 bg-custom-background h-14 whitespace-nowrap">
                            State
                          </th>
                          <th className="sticky top-14 z-10 min-w-[200px] border border-custom-border p-2 bg-custom-background h-14 whitespace-nowrap">
                            Phone
                          </th>
                          <th className="sticky top-14 z-10 min-w-[250px] border border-custom-border p-2 bg-custom-background h-14 whitespace-nowrap">
                            Street *
                          </th>
                          <th className="sticky top-14 z-10 min-w-[250px] border border-custom-border p-2 bg-custom-background h-14 whitespace-nowrap">
                            Street 2
                          </th>
                          <th className="sticky top-14 z-10 min-w-[200px] border border-custom-border p-2 bg-custom-background h-14 whitespace-nowrap">
                            City
                          </th>
                          <th className="sticky top-14 z-10 min-w-[200px] border border-custom-border p-2 bg-custom-background h-14 whitespace-nowrap">
                            Name *
                          </th>
                          <th className="sticky top-14 z-10 min-w-[120px] border border-custom-border p-2 bg-custom-background h-14 whitespace-nowrap">
                            State
                          </th>
                          <th className="sticky top-14 z-10 min-w-[200px] border border-custom-border p-2 bg-custom-background h-14 whitespace-nowrap">
                            Company
                          </th>
                          <th className="sticky top-14 z-10 min-w-[200px] border border-custom-border p-2 bg-custom-background h-14 whitespace-nowrap">
                            Phone
                          </th>
                          <th className="sticky top-14 z-10 min-w-[250px] border border-custom-border p-2 bg-custom-background h-14 whitespace-nowrap">
                            Street *
                          </th>
                          <th className="sticky top-14 z-10 min-w-[250px] border border-custom-border p-2 bg-custom-background h-14 whitespace-nowrap">
                            Street 2
                          </th>
                          <th className="sticky top-14 z-10 min-w-[200px] border border-custom-border p-2 bg-custom-background h-14 whitespace-nowrap">
                            City
                          </th>
                          {txtFile && (
                            <th className="sticky top-14 z-10 min-w-[120px] border border-custom-border p-2 bg-custom-background h-14 whitespace-nowrap">
                              Quantity
                            </th>
                          )}
                          <th className="sticky top-14 z-10 min-w-[120px] border border-custom-border p-2 bg-custom-background h-14 whitespace-nowrap">
                            Weight *
                          </th>
                          <th className="sticky top-14 z-10 min-w-[120px] border border-custom-border p-2 bg-custom-background h-14 whitespace-nowrap">
                            Length
                          </th>
                          <th className="sticky top-14 z-10 min-w-[120px] border border-custom-border p-2 bg-custom-background h-14 whitespace-nowrap">
                            Width
                          </th>
                          <th className="sticky top-14 z-10 min-w-[120px] border border-custom-border p-2 bg-custom-background h-14 whitespace-nowrap">
                            Height
                          </th>
                          <th className="sticky top-14 z-10 min-w-[250px] border border-custom-border p-2 bg-custom-background h-14 whitespace-nowrap">
                            Description
                          </th>
                          <th className="sticky top-14 z-10 min-w-[120px] border border-custom-border p-2 bg-custom-background h-14 whitespace-nowrap">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {console.log(uploadedData)}
                        {uploadedData.map((row, index) => (
                          <tr
                            key={index}
                            className="bg-custom-background text-custom-text"
                          >
                            <td className="border border-custom-border p-2 break-words">
                              {txtFile && selectedService
                                ? selectedService
                                : renderTableCell(
                                    index,
                                    "ServiceName",
                                    row.ServiceName
                                  )}
                            </td>
                            {txtFile && courierType === "USPS" && (
                              <td className="border border-custom-border p-2 break-words">
                                {selectedProvider ? selectedProvider : "N/A"}
                              </td>
                            )}
                            {txtFile && (
                              <td className="border border-custom-border p-2 break-words">
                                {row.sku_number ? (
                                  renderTableCell(
                                    index,
                                    "sku_number",
                                    row.sku_number
                                  )
                                ) : (
                                  <p className="text-red-500">Missing</p>
                                )}
                              </td>
                            )}

                            <td className="border border-custom-border p-2 break-words">
                              {row.FromSenderName ? (
                                renderTableCell(
                                  index,
                                  "FromSenderName",
                                  row.FromSenderName
                                )
                              ) : (
                                <p className="text-red-500">Missing</p>
                              )}
                            </td>
                            <td className="border border-custom-border p-2 break-words">
                              {row.FromCompany
                                ? renderTableCell(
                                    index,
                                    "FromCompany",
                                    row.FromCompany
                                  )
                                : "N/A"}
                            </td>
                            <td className="border border-custom-border p-2 break-words">
                              {row.FromStateProvince
                                ? renderTableCell(
                                    index,
                                    "FromStateProvince",
                                    row.FromStateProvince
                                  )
                                : "N/A"}
                            </td>
                            <td className="border border-custom-border p-2 break-words">
                              {row.FromPhone
                                ? renderTableCell(
                                    index,
                                    "FromPhone",
                                    row.FromPhone
                                  )
                                : "N/A"}
                            </td>
                            <td className="border border-custom-border p-2 break-words">
                              {row.FromStreet1 ? (
                                renderTableCell(
                                  index,
                                  "FromStreet1",
                                  row.FromStreet1
                                )
                              ) : (
                                <p className="text-red-500">Missing</p>
                              )}
                            </td>
                            <td className="border border-custom-border p-2 break-words">
                              {row.ToStreet2
                                ? renderTableCell(
                                    index,
                                    "FromStreet2",
                                    row.FromStreet2
                                  )
                                : "N/A"}
                            </td>
                            <td className="border border-custom-border p-2 break-words">
                              {row.FromCity
                                ? renderTableCell(
                                    index,
                                    "FromCity",
                                    row.FromCity
                                  )
                                : "N/A"}
                            </td>
                            <td className="border border-custom-border p-2 break-words">
                              {row.ToRecipientName ? (
                                renderTableCell(
                                  index,
                                  "ToRecipientName",
                                  row.ToRecipientName
                                )
                              ) : (
                                <p className="text-red-500">Missing</p>
                              )}
                            </td>
                            <td className="border border-custom-border p-2 break-words">
                              {row.ToStateProvince
                                ? renderTableCell(
                                    index,
                                    "ToStateProvince",
                                    row.ToStateProvince
                                  )
                                : "N/A"}
                            </td>
                            <td className="border border-custom-border p-2 break-words">
                              {row.ToCompany
                                ? renderTableCell(
                                    index,
                                    "ToCompany",
                                    row.ToCompany
                                  )
                                : "N/A"}
                            </td>
                            <td className="border border-custom-border p-2 break-words">
                              {row.ToPhone
                                ? renderTableCell(index, "ToPhone", row.ToPhone)
                                : "N/A"}
                            </td>
                            <td className="border border-custom-border p-2 break-words">
                              {row.ToStreet1 ? (
                                renderTableCell(
                                  index,
                                  "ToStreet1",
                                  row.ToStreet1
                                )
                              ) : (
                                <p className="text-red-500">Missing</p>
                              )}
                            </td>
                            <td className="border border-custom-border p-2 break-words">
                              {row.ToStreet2
                                ? renderTableCell(
                                    index,
                                    "ToStreet2",
                                    row.ToStreet2
                                  )
                                : "N/A"}
                            </td>
                            <td className="border border-custom-border p-2 break-words">
                              {renderTableCell(index, "ToCity", row.ToCity)}
                            </td>
                            {txtFile && (
                              <td className="border border-custom-border p-2 break-words">
                                {renderTableCell(
                                  index,
                                  "quantity",
                                  row.quantity ? row.quantity : 1
                                )}
                              </td>
                            )}
                            <td className="border border-custom-border p-4 break-words">
                              {renderTableCell(
                                index,
                                row.package_weight &&
                                  row.package_weight !== "undefined" &&
                                  row.package_weight !== ""
                                  ? "package_weight"
                                  : "PackageWeight",
                                row.package_weight &&
                                  row.package_weight !== "undefined" &&
                                  row.package_weight !== "" ? (
                                  `${row.package_weight} lbs`
                                ) : row.PackageWeight &&
                                  row.PackageWeight !== "undefined" &&
                                  row.PackageWeight !== "" ? (
                                  `${row.PackageWeight} lbs`
                                ) : (
                                  <p className="text-red-500">Missing</p>
                                )
                              )}
                            </td>

                            <td className="border border-custom-border p-4 break-words">
                              {renderTableCell(
                                index,
                                row.package_length &&
                                  row.package_length !== "undefined" &&
                                  row.package_length !== ""
                                  ? "package_length"
                                  : "PackageLength",
                                row.package_length &&
                                  row.package_length !== "undefined" &&
                                  row.package_length !== "" ? (
                                  `${row.package_length} in`
                                ) : row.PackageLength &&
                                  row.PackageLength !== "undefined" &&
                                  row.PackageLength !== "" ? (
                                  `${row.PackageLength} in`
                                ) : (
                                  <p className="text-red-500">Missing</p>
                                )
                              )}
                            </td>

                            <td className="border border-custom-border p-4 break-words">
                              {renderTableCell(
                                index,
                                row.package_width &&
                                  row.package_width !== "undefined" &&
                                  row.package_width !== ""
                                  ? "package_width"
                                  : "PackageWidth",
                                row.package_width &&
                                  row.package_width !== "undefined" &&
                                  row.package_width !== "" ? (
                                  `${row.package_width} in`
                                ) : row.PackageWidth &&
                                  row.PackageWidth !== "undefined" &&
                                  row.PackageWidth !== "" ? (
                                  `${row.PackageWidth} in`
                                ) : (
                                  <p className="text-red-500">Missing</p>
                                )
                              )}
                            </td>

                            <td className="border border-custom-border p-4 break-words">
                              {renderTableCell(
                                index,
                                row.package_height &&
                                  row.package_height !== "undefined" &&
                                  row.package_height !== ""
                                  ? "package_height"
                                  : "PackageHeight",
                                row.package_height &&
                                  row.package_height !== "undefined" &&
                                  row.package_height !== "" ? (
                                  `${row.package_height} in`
                                ) : row.PackageHeight &&
                                  row.PackageHeight !== "undefined" &&
                                  row.PackageHeight !== "" ? (
                                  `${row.PackageHeight} in`
                                ) : (
                                  <p className="text-red-500">Missing</p>
                                )
                              )}
                            </td>

                            <td className="border border-custom-border p-4 break-words">
                              {renderTableCell(
                                index,
                                "PackageDescription",
                                row.PackageDescription &&
                                  row.PackageDescription !== "undefined" &&
                                  row.PackageDescription !== "" ? (
                                  row.PackageDescription
                                ) : (
                                  <p className="text-red-500">N/A</p>
                                )
                              )}
                            </td>

                            <td className="border border-custom-border p-4">
                              {editingRow === index ? (
                                <div className="flex space-x-2 justify-center">
                                  <button
                                    onClick={() => handleSave(index)}
                                    className="text-green-500 p-2"
                                  >
                                    <FaCheck />
                                  </button>
                                  <button
                                    onClick={handleCancel}
                                    className="text-red-500 p-2"
                                  >
                                    <FaTimes />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleEdit(index)}
                                  className="text-blue-500 bg-custom-background border border-gray-800 rounded-xl flex items-center gap-2 px-4 py-2 mx-auto"
                                >
                                  <FaEdit />
                                  <span className="font-semibold">Edit</span>
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Card>
              <p className={`${$GS.textNormal_1} text-center`}>
                <a
                  href={`${process.env.REACT_APP_API_URL}/api/orders/file/template`}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="text-blue-600 underline text-md hover:text-blue-500"
                >
                  <span>
                    <FaDownload
                      className="mx-auto mb-2 text-blue-600"
                      size={40}
                    />
                    Download Bulk Template CSV
                  </span>
                </a>
              </p>
            </Card>
          )}
          <div className="flex lg:flex-row justify-between items-center mt-8 flex-col">
            <p className={`${$GS.textHeading_3} m-8`}>
              Total Price: ${totalPrice.toFixed(2)}
            </p>
            <div className="flex justify-center">
              <button
                type="submit"
                onClick={handleSubmit}
                className={`${$GS.textHeading_3} cursor-pointer rounded-small p-6 md:p-8 border-thin border-custom-border transition-shadow duration-300 
                    bg-card-background group hover:border-hover-border hover:shadow-bright`}
              >
                Submit Bulk Order
              </button>
            </div>
            <div className="text-center text-xs text-gray-400">
              <p>
                © {new Date().getFullYear()} Sapphire Labels. All rights
                reserved.
              </p>
            </div>
          </div>
        </div>
      )}
      <Notification
        {...notification}
        onClose={() => setNotification({ ...notification, visible: false })}
      />
      <Modal
        fileData={fileData}
        isVisible={modalVisible}
        message="Your orders have been submitted successfully!"
        onClose={() => setModalVisible(false)}
        onDownload={handleDownload}
      />
    </div>
  );
};

export default BulkOrder;

const Modal = ({ fileData, isVisible, message, onClose, onDownload }) => {
  if (!isVisible) return null;

  return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-20 transition-opacity duration-300">
          <Card>
              <h2 className={`${$GS.textFormHeading_2} text-hover-text mb-4`}>
                  {message}
              </h2>
              <div className="flex justify-end">
                {fileData.pdfName && (
                  <button
                      onClick={() => onDownload(fileData.pdfName)}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md transition-colors duration-200 mr-2"
                  >
                      Download PDF
                  </button>)
                  }
                {fileData.resultCSVName && (
                  <button
                      onClick={() => onDownload(fileData.resultCSVName)}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md transition-colors duration-200 mr-2"
                  >
                      Download Result CSV
                  </button>)
                  }
                {fileData.autoConfirmCSVName && (
                  <button
                      onClick={() => onDownload(fileData.autoConfirmCSVName)}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md transition-colors duration-200 mr-2"
                  >
                      Download AutoConfirm CSV
                  </button>)
                }
                  <button
                      onClick={onClose}
                      className="bg-gray-300 hover:bg-gray-200 text-black px-4 py-2 rounded-md transition-colors duration-200"
                  >
                      Close
                  </button>
          </div>
              </Card>
      </div>
  );
};