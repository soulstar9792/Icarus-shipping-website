// src/components/Main/OrderLabel.js
import React, { useEffect, useState } from "react";
import Card from "../Utils/Card"; // Ensure you have a Card component
import $GS from "../../styles/constants"; // Import your styles
import LabelServicesType from "../../LabelServicesType.json";
import states from "../../states.json";
import axios from "axios";
import Notification from "../Notification";
import { jsPDF } from "jspdf";
import { useSelector } from "react-redux";

const Modal = ({ isVisible, onClose, imageData }) => {
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.addImage(imageData, "PNG", 10, 10, 190, 0);
    doc.save("label.pdf");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded-lg">
        <h2 className="text-lg font-bold mb-2">Label Image</h2>
        <img
          src={imageData}
          width={400}
          height={600}
          alt="Label"
          className="mb-4"
        />
        <div className="flex justify-end">
          <button onClick={onClose} className="mr-2 p-2 bg-gray-300 rounded">
            Close
          </button>
          <button
            onClick={handleDownloadPDF}
            className="p-2 bg-blue-600 text-white rounded"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

const OrderLabel = () => {
  const user = useSelector((state) => state.auth.user);
  const [price, setPrice] = useState(0);
  const [selectedCourier, setSelectedCourier] = useState("");
  const [availableServices, setAvailableServices] = useState([]);
  const [notification, setNotification] = useState({
    visible: false,
    message: "",
    type: "",
  });
  const [service, setService] = useState("");
  const [sender, setSender] = useState({
    name: "",
    phone: "",
    company: "",
    address1: "",
    address2: "",
    city: "",
    state: "TE",
    zip: "",
    country: "US", // Default country
  });
  const [savedAddress, setSavedAddress] = useState([]);

  const [receiver, setReceiver] = useState({
    name: "",
    phone: "",
    company: "",
    address1: "",
    address2: "",
    city: "",
    state: "CA",
    zip: "",
    country: "US", // Default country
  });

  const [packageDetails, setPackageDetails] = useState({
    length: "",
    width: "",
    height: "",
    weight: "",
    description: "",
    reference1: "",
    reference2: "",
  });

  const couriers = [
    { id: 1, name: "UPS" },
    { id: 2, name: "USPS" },
  ];
  const [modalVisible, setModalVisible] = useState(false); // for modal visibility
  const [labelImage, setLabelImage] = useState(""); // hold label image base64
  const [selectedProvider, setSelectedProvider] = useState(null);

  const handleCourierChange = (e) => {
    const selected = e.target.value;
    setSelectedCourier(selected);
    console.log(selectedCourier);

    const selectedCourierData = LabelServicesType.find(
      (courier) => courier.courier === selected
    );
    if (selectedCourierData) {
      const servicesList = Object.keys(selectedCourierData.services);
      setAvailableServices(servicesList);
    } else {
      setAvailableServices([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedCourier === "") {
      setNotification({
        visible: true,
        message: "Please select a courier",
        type: "error",
      });
      setTimeout(() => {
        setNotification({ ...notification, visible: false });
      }, 2000)
      return;
    }
    if (service === "") {
      setNotification({
        visible: true,
        message: "Please select a service",
        type: "error",
      });
      setTimeout(() => {
        setNotification({ ...notification, visible: false });
      }, 2000)
      return;
    }
    if (!selectedProvider) {
      setNotification({
        visible: true,
        message: "Please select a Provider",
        type: "error",
      });
      setTimeout(() => {
        setNotification({ ...notification, visible: false });
      }, 2000)
      return;
    }

    const shipmentData = {
      user_id: user._id,
      courier: selectedCourier,
      service_name: service,
      ...(selectedCourier === "USPS" && { version: selectedProvider }),
      manifested: false,
      sender: {
        sender_name: sender.name,
        sender_phone: sender.phone,
        sender_company: sender.company,
        sender_address1: sender.address1,
        sender_address2: sender.address2,
        sender_city: sender.city,
        sender_state_province: sender.state,
        sender_zip_postal: sender.zip,
        sender_country: sender.country,
      },
      receiver: {
        receiver_name: receiver.name,
        receiver_phone: receiver.phone,
        receiver_company: receiver.company,
        receiver_address1: receiver.address1,
        receiver_address2: receiver.address2,
        receiver_city: receiver.city,
        receiver_state_province: receiver.state,
        receiver_zip_postal: receiver.zip,
        receiver_country: receiver.country,
      },
      package: {
        package_length: packageDetails.length,
        package_width: packageDetails.width,
        package_height: packageDetails.height,
        package_weight: packageDetails.weight,
        package_weight_unit: "LB",
        package_description: packageDetails.description,
        package_reference1: packageDetails.reference1,
        package_reference2: packageDetails.reference2,
      },
    };
    console.log(shipmentData);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/orders",
        shipmentData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const result = await response.data;

      setLabelImage(result.data.image);
      console.log(result, result.data.base64_encoded_image);

      setModalVisible(true); // Show the modal
      setNotification({
        visible: true,
        message: "Order label created successfully!",
        type: "success",
      });
      console.log(result);
    } catch (error) {
      // Formatted error message
      const errorMsg =
        error.response?.data?.message || "An Unknown Error Occurred";
      const formattedMsg = errorMsg.split(":")[1]?.trim() || errorMsg;
      const FinalMsg =
        formattedMsg?.charAt(0).toUpperCase() + formattedMsg?.slice(1) ||
        errorMsg;
      setNotification({ visible: true, message: FinalMsg, type: "error" });
      console.error("Error:", error);
    }
  };

  const getServiceCost = async (userId, courier, service) => {
    console.log("the service ", service);
    const res = await axios.post(
      "http://localhost:5000/api/orders/price/single",
      { userId, courier, service },
      { headers: { "Content-Type": "application/json" } }
    );
    setPrice(res.data.price);
  };
  useEffect(() => {
    if (selectedCourier) {
      if (service) {
        getServiceCost(user._id, selectedCourier, service);
      }
    }
  }, [selectedCourier, service]);

  const getSavedAddress = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/auth/get-address/${user._id}`,
        {},
        { headers: { "Content-Type": "application/json" } }
      );
      setSavedAddress(response.data.savedAddress);
    } catch (e) {
      console.log("Error Occurred");
    }
  };

  const HandleSelectChangeSender = (e) => {
    if (e.target.value) {
      const selectedOption = JSON.parse(e.target.value);
      for (const address of savedAddress) {
        if (
          address.city == selectedOption.city &&
          address.phone === selectedOption.phone
        ) {
          setSender({
            name: address.name || "",
            phone: address.phone || "",
            company: address.company || "",
            address1: address.street || "",
            address2: address.street2 || "",
            city: address.city || "",
            state: address.state || "",
            zip: address.zip || "",
            country: address.country || "",
          });
        }
      }
    }
  };

  const HandleSelectChangeReceiver = (e) => {
    if (e.target.value) {
      const selectedOption = JSON.parse(e.target.value);
      for (const address of savedAddress) {
        if (
          address.city == selectedOption.city &&
          address.phone === selectedOption.phone
        ) {
          setReceiver({
            name: address.name || "",
            phone: address.phone || "",
            company: address.company || "",
            address1: address.street || "",
            address2: address.street2 || "",
            city: address.city || "",
            state: address.state || "",
            zip: address.zip || "",
            country: address.country || "",
          });
        }
      }
    }
  };

  return (
    <div className="px-4 md:px-10 py-4 md:pt-10 bg-custom-background">
      <form onSubmit={handleSubmit}>
        {/* Responsive grid for cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Notification
            {...notification}
            onClose={() => setNotification({ ...notification, visible: false })}
          />
          {/* Package Information Card */}
          <Card className="col-span-1">
            <h2 className={`${$GS.textFormHeading_1} mb-4`}>Package Information</h2>
            <div className="mb-1">
              <div className="flex content-center">
                <label
                  htmlFor="courier"
                  className={`${$GS.textBase} pt-2`}
                >
                  Courier * &nbsp;
                </label>
                <div className="inline-block grow mt-1">
                  <select
                    id="courier"
                    className={`${$GS.inputForm_1}`}
                    value={selectedCourier}
                    onChange={handleCourierChange}
                  >
                    <option value="" className="text-gray-500">
                      Select a courier...
                    </option>
                    {couriers.map((courier) => (
                      <option key={courier.id} value={courier.name}>
                        {courier.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="content-end">
                <label htmlFor="serviceType" className={`${$GS.textBase}`}>
                  Type
                </label>
                <select
                  id="serviceType"
                  className={`${$GS.inputForm_1}`}
                  disabled={!availableServices.length} // Disable if no services available
                  onChange={(e) => {
                    setService(e.target.value);
                    console.log(e.target.value);
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
              {selectedCourier === "USPS" && (<div className="content-end">
                <label htmlFor="Provider" className={`${$GS.textBase}`}>
                  Provider
                </label>
                <select
                  id="Provider"
                  className={`${$GS.inputForm_1}`}
                  disabled={!selectedCourier}
                  onChange={(e) => {
                    setSelectedProvider(e.target.value);
                  }}
                >
                  <option value="" className="text-gray-500">
                    Select a Provider...
                  </option>
                  {["USPSveVS", "USPSvShippo", "USPSvStore", "USPSvUnbranded"].map((provider, index) => (
                    <option key={index} value={provider}>
                      {provider}
                    </option>
                  ))}
                </select>
              </div>)}

              <div>
                <label
                  htmlFor="packageWeight"
                  className={`${$GS.textBase}`}
                >
                  Package Weight
                </label>
                <input
                  id="packageWeight"
                  type="number"
                  className={$GS.inputForm_1}
                  placeholder="0 lbs"
                  value={packageDetails.weight}
                  onChange={(e) =>
                    setPackageDetails({
                      ...packageDetails,
                      weight: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            {/* Dimensions */}
            <h3 className={`${$GS.textBase} mt-4 text-center`}>
              Dimensions (optional)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="length" className={`${$GS.textBase}`}>
                  Length * (in)
                </label>
                <input
                  id="length"
                  type="number"
                  className={$GS.inputForm_1}
                  placeholder="0 in"
                  value={packageDetails.length}
                  onChange={(e) =>
                    setPackageDetails({
                      ...packageDetails,
                      length: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label htmlFor="width" className={`${$GS.textBase}`}>
                  Width * (in)
                </label>
                <input
                  id="width"
                  type="number"
                  className={$GS.inputForm_1}
                  placeholder="0 in"
                  value={packageDetails.width}
                  onChange={(e) =>
                    setPackageDetails({
                      ...packageDetails,
                      width: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label htmlFor="height" className={`${$GS.textBase}`}>
                  Height * (in)
                </label>
                <input
                  id="height"
                  type="number"
                  className={$GS.inputForm_1}
                  placeholder="0 in"
                  value={packageDetails.height}
                  onChange={(e) =>
                    setPackageDetails({
                      ...packageDetails,
                      height: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            <label htmlFor="description" className={`${$GS.textBase} mt-3`}>
              Description (optional)
            </label>
            <textarea
              id="description"
              className={$GS.inputForm_1}
              placeholder="Enter package information"
              value={packageDetails.description}
              onChange={(e) =>
                setPackageDetails({
                  ...packageDetails,
                  description: e.target.value,
                })
              }
            />

            {/* References */}
            <div className="flex justify-between mt-4">
              <div className="w-1/2 pr-2">
                <label htmlFor="reference1" className={`${$GS.textBase}`}>
                  Reference 1 (optional)
                </label>
                <input
                  id="reference1"
                  type="text"
                  className={$GS.inputForm_1}
                  placeholder="Enter first reference number"
                  value={packageDetails.reference1}
                  onChange={(e) =>
                    setPackageDetails({
                      ...packageDetails,
                      reference1: e.target.value,
                    })
                  }
                />
              </div>
              <div className="w-1/2 pl-2">
                <label htmlFor="reference2" className={`${$GS.textBase}`}>
                  Reference 2 (optional)
                </label>
                <input
                  id="reference2"
                  type="text"
                  className={$GS.inputForm_1}
                  placeholder="Enter second reference number"
                  value={packageDetails.reference2}
                  onChange={(e) =>
                    setPackageDetails({
                      ...packageDetails,
                      reference2: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* Require Signature Checkboxes */}
            <h3 className={`${$GS.textBase} mt-4`}>
              Require Signature
            </h3>
            <div className="flex items-center">
            <label className="flex items-center text-s1 text-text-normal">
              <input type="checkbox" className="mr-2" /> Require a signature on
              delivery
            </label>&nbsp;&nbsp;&nbsp;
            <label className="flex items-center text-s1 text-text-normal">
              <input type="checkbox" className="mr-2" /> Saturday Delivery
            </label>
            </div>
          </Card>

          {/* From Address Card */}
          <Card className="col-span-1">
            <h2 className={`${$GS.textFormHeading_1} mb-4`}>From Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="content-end">
                <label htmlFor="fromAddress" className={`${$GS.textBase}`}>
                  Saved Address
                </label>
                <select
                  onClick={getSavedAddress}
                  onChange={HandleSelectChangeSender}
                  id="fromAddress"
                  className={$GS.inputForm_1}
                >
                  <option value={""}>Select a saved address...</option>

                  {savedAddress.map((ad, i) => {
                    const optionData = JSON.stringify({
                      city: ad.city,
                      phone: ad.phone,
                    });
                    return (
                      <option key={i} value={optionData} className="font-bold">
                        {" "}
                        {ad.address_id}...
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <label htmlFor="fromCountry" className={`${$GS.textBase}`}>
                  Country *
                </label>
                <input
                  id="fromCountry"
                  type="text"
                  className={$GS.inputForm_1}
                  defaultValue="United States"
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="content-end">
                <label htmlFor="nameFrom" className={`${$GS.textBase}`}>
                  Name *
                </label>
                <input
                  id="nameFrom"
                  type="text"
                  className={$GS.inputForm_1}
                  placeholder="Name"
                  value={sender.name}
                  onChange={(e) =>
                    setSender({ ...sender, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label htmlFor="companyFrom" className={`${$GS.textBase}`}>
                  Company / Reference Number (optional)
                </label>
                <input
                  id="companyFrom"
                  type="text"
                  className={$GS.inputForm_1}
                  placeholder="Company"
                  value={sender.company}
                  onChange={(e) =>
                    setSender({ ...sender, company: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="content-end">
                <label htmlFor="phoneFrom" className={`${$GS.textBase}`}>
                  Phone *
                </label>
                <input
                  id="phoneFrom"
                  type="text"
                  className={$GS.inputForm_1}
                  placeholder="Phone"
                  value={sender.phone}
                  onChange={(e) =>
                    setSender({ ...sender, phone: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label htmlFor="streetFrom" className={`${$GS.textBase}`}>
                  Street *
                </label>
                <input
                  id="streetFrom"
                  type="text"
                  className={$GS.inputForm_1}
                  placeholder="Street"
                  value={sender.address1}
                  onChange={(e) =>
                    setSender({ ...sender, address1: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="content-end">
                <label htmlFor="street2From" className={`${$GS.textBase}`}>
                  Street 2 (optional)
                </label>
                <input
                  id="street2From"
                  type="text"
                  className={$GS.inputForm_1}
                  placeholder="Street 2"
                  value={sender.address2}
                  onChange={(e) =>
                    setSender({ ...sender, address2: e.target.value })
                  }
                />
              </div>
              <div>
                <label htmlFor="cityFrom" className={`${$GS.textBase}`}>
                  City *
                </label>
                <input
                  id="cityFrom"
                  type="text"
                  className={$GS.inputForm_1}
                  placeholder="City"
                  value={sender.city}
                  onChange={(e) =>
                    setSender({ ...sender, city: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="content-end">
                <label htmlFor="stateFrom" className={`${$GS.textBase}`}>
                  State
                </label>
                <select
                  id="stateFrom"
                  className={$GS.inputForm_1}
                  value={sender.state}
                  onChange={(e) =>
                    setSender({ ...sender, state: e.target.value })
                  }
                >
                  <option value={""}>Select state...</option>
                  {states.map((state) => (
                    <option key={state.abbreviation} value={state.abbreviation}>
                      {state.state}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="zipFrom" className={`${$GS.textBase}`}>
                  Zip *
                </label>
                <input
                  id="zipFrom"
                  type="text"
                  className={$GS.inputForm_1}
                  placeholder="Zip"
                  value={sender.zip}
                  onChange={(e) =>
                    setSender({ ...sender, zip: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </Card>

          {/* To Address Card */}
          <Card className="col-span-1">
            <h2 className={`${$GS.textFormHeading_1} mb-4`}>To Address</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="content-end">
                <label htmlFor="toAddress" className={`${$GS.textBase}`}>
                  Saved Address
                </label>
                <select
                  onClick={getSavedAddress}
                  onChange={HandleSelectChangeReceiver}
                  id="fromAddress"
                  className={$GS.inputForm_1}
                >
                  <option value={""}>Select a saved address...</option>
                  {savedAddress.map((ad, i) => {
                    const optionData = JSON.stringify({
                      city: ad.city,
                      phone: ad.phone,
                    });
                    return (
                      <option key={i} value={optionData}>
                        {ad.address_id}...
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label htmlFor="toCountry" className={`${$GS.textBase}`}>
                  Country *
                </label>
                <input
                  id="toCountry"
                  type="text"
                  className={$GS.inputForm_1}
                  defaultValue="United States"
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="content-end">
                <label htmlFor="nameTo" className={`${$GS.textBase}`}>
                  Name *
                </label>
                <input
                  id="nameTo"
                  type="text"
                  className={$GS.inputForm_1}
                  placeholder="Name"
                  value={receiver.name}
                  onChange={(e) =>
                    setReceiver({ ...receiver, name: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label htmlFor="companyTo" className={`${$GS.textBase}`}>
                  Company / Reference Number (optional)
                </label>
                <input
                  id="companyTo"
                  type="text"
                  className={$GS.inputForm_1}
                  placeholder="Company"
                  value={receiver.company}
                  onChange={(e) =>
                    setReceiver({ ...receiver, company: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="content-end">
                <label htmlFor="phoneTo" className={`${$GS.textBase}`}>
                  Phone *
                </label>
                <input
                  id="phoneTo"
                  type="text"
                  className={$GS.inputForm_1}
                  placeholder="Phone"
                  value={receiver.phone}
                  onChange={(e) =>
                    setReceiver({ ...receiver, phone: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label htmlFor="streetTo" className={`${$GS.textBase}`}>
                  Street *
                </label>
                <input
                  id="streetTo"
                  type="text"
                  className={$GS.inputForm_1}
                  placeholder="Street"
                  value={receiver.address1}
                  onChange={(e) =>
                    setReceiver({ ...receiver, address1: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="content-end">
                <label htmlFor="street2To" className={`${$GS.textBase}`}>
                  Street 2 (optional)
                </label>
                <input
                  id="street2To"
                  type="text"
                  className={$GS.inputForm_1}
                  placeholder="Street 2"
                  value={receiver.address2}
                  onChange={(e) =>
                    setReceiver({ ...receiver, address2: e.target.value })
                  }
                />
              </div>

              <div>
                <label htmlFor="cityTo" className={`${$GS.textBase}`}>
                  City *
                </label>
                <input
                  id="cityTo"
                  type="text"
                  className={$GS.inputForm_1}
                  placeholder="City"
                  value={receiver.city}
                  onChange={(e) =>
                    setReceiver({ ...receiver, city: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="content-end">
                <label htmlFor="stateTo" className={`${$GS.textBase}`}>
                  State
                </label>
                <select
                  id="stateTo"
                  className={$GS.inputForm_1}
                  value={receiver.state}
                  onChange={(e) =>
                    setReceiver({ ...receiver, state: e.target.value })
                  }
                >
                  <option value={""}>Select state...</option>
                  {states.map((state) => (
                    <option key={state.abbreviation} value={state.abbreviation}>
                      {state.state}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="zipTo" className={`${$GS.textBase}`}>
                  Zip *
                </label>
                <input
                  id="zipTo"
                  type="text"
                  className={$GS.inputForm_1}
                  placeholder="Zip"
                  value={receiver.zip}
                  onChange={(e) =>
                    setReceiver({ ...receiver, zip: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </Card>
        </div>
        {/* Price And Submit Section */}-
        
        <div className="flex lg:flex-row justify-between items-center flex-col">
          <p className={`${$GS.textFormHeading_1} mt-4 w-[300px]`}>Price: ${price}</p><button
              type="submit"
              className={`${$GS.textFormHeading_2} cursor-pointer rounded-small p-4 px-12 border-thin border-custom-border transition-shadow duration-300
                    bg-card-background group hover:border-hover-border hover:shadow-bright`}
            >
              Order Label
            </button>
          <div className="text-center text-sm text-gray-400 w-[300px]">
            <p>
              © {new Date().getFullYear()} Icarus Ships. All rights reserved.
            </p>
          </div>
        </div>
      </form>
      <Modal
        imageData={`data:image/png;base64,${labelImage}`}
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </div>
  );
};

export default OrderLabel;
