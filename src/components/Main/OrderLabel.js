// src/components/Main/OrderLabel.js
import React, { useEffect, useState } from 'react';
import Card from '../Utils/Card'; // Ensure you have a Card component
import $GS from '../../styles/constants'; // Import your styles
import LabelServicesType from '../../LabelServicesType.json';
import states from '../../states.json';
import axios from 'axios';
import Notification from '../Notification';
import { jsPDF } from 'jspdf';
import { useSelector } from 'react-redux';

const Modal = ({ isVisible, onClose, imageData }) => {
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.addImage(imageData, 'PNG', 10, 10, 190, 0); 
    doc.save('label.pdf');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded-lg">
        <h2 className="text-lg font-bold mb-2">Label Image</h2>
        <img src={imageData} width={500} height={800} alt="Label" className="mb-4" />
        <div className="flex justify-end">
          <button onClick={onClose} className="mr-2 p-2 bg-gray-300 rounded">Close</button>
          <button onClick={handleDownloadPDF} className="p-2 bg-blue-600 text-white rounded">Download PDF</button>
        </div>
      </div>
    </div>
  );
};

const OrderLabel = () => {
  const user = useSelector(state => state.auth.user);  
  const [selectedCourier, setSelectedCourier] = useState("");
  const [availableServices, setAvailableServices] = useState([]);
  const [notification, setNotification] = useState({ visible: false, message: "", type: "" });
  const [service, setService] = useState("");
  const [price, setPrice] = useState(0); 
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
    { id: 2, name: "USPS" }
  ];

  const [modalVisible, setModalVisible] = useState(false); // for modal visibility
  const [labelImage, setLabelImage] = useState(""); // hold label image base64

  const handleCourierChange = (e) => {
    const selected = e.target.value;
    setSelectedCourier(selected);

    const selectedCourierData = LabelServicesType.find(courier => courier.courier === selected);
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
      setNotification({ visible: true, message: "Please select a courier", type: "error" });
      return;
    }
    if (service === "") {
      setNotification({ visible: true, message: "Please select a service", type: "error" });
      return;
    }
    const shipmentData = {
      user_id: user._id,
      courier: selectedCourier,
      service_name: service,
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
    try {
      const response = await axios.post('https://lcarus-shipping-backend-ce6c088c70be.herokuapp.com/api/orders', shipmentData, {
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await response.data;
      setLabelImage(result.data.image);
      // console.log(result, result.data.base64_encoded_image);
      
      setModalVisible(true); // Show the modal
      setNotification({ visible: true, message: "Order label created successfully!", type: "success" });

    } catch (error) {
      // Formatted error message 
      const errorMsg =error.response?.data?.message || "An Unknown Error Occured";
      const formattedMsg =errorMsg.split(":")[1]?.trim();
      const FinalMsg = formattedMsg.charAt(0).toUpperCase() +formattedMsg.slice(1);
      
      setNotification({visible:true,message:FinalMsg,type:"error"})
      console.error('Error:', error);
    }
  };

  const getServiceCost = async(userId,courier,service)=>{
     const res = await axios.post("https://lcarus-shipping-backend-ce6c088c70be.herokuapp.com/orders/price/single",{userId,courier,service},{headers:{'Content-Type' : 'application/json'}} );
      setPrice(res.data.price);
  }
  useEffect(()=>{
    if(selectedCourier){
      if(service){
    getServiceCost(user._id,selectedCourier,service); 
      }
    }
  },[selectedCourier,service])

  return (
    <div className="px-4 md:px-10 py-10 md:py-20 bg-custom-background">
      <form onSubmit={handleSubmit}>
        {/* Responsive grid for cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Notification {...notification} onClose={() => setNotification({ ...notification, visible: false })} />
          {/* Package Information Card */}
          <Card className="col-span-1">
            <h2 className={`${$GS.textHeading_2} mb-4`}>Package Information</h2>
            <div className="mb-4">
              <label htmlFor="courier" className={`${$GS.textNormal_1} pt-2 block`}>Select Courier *</label>
              <select
                id="courier"
                className="border border-custom-border p-2 w-full bg-transparent text-custom-text rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-400"
                value={selectedCourier}
                onChange={handleCourierChange}
              >
                <option value="" className="text-gray-500">Select a courier...</option>
                {couriers.map(courier => (
                  <option key={courier.id} value={courier.name}>
                    {courier.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="content-end">
                <label htmlFor="serviceType" className={`${$GS.textNormal_1}`}>Type</label>
                <select
                  id="serviceType"
                  className="border border-custom-border p-2 w-full bg-transparent text-custom-text rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-400"
                  disabled={!availableServices.length} // Disable if no services available
                  onChange={(e) => { setService(e.target.value); console.log(e.target.value) }}
                >
                  <option value="" className="text-gray-500">Select a service...</option>
                  {availableServices.map((service, index) => (
                    <option key={index} value={service}>{service}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="packageWeight" className={`${$GS.textNormal_1}`}>Package Weight</label>
                <input id="packageWeight" type="number"
                  className="border border-custom-border p-2 w-full bg-transparent text-custom-text"
                  placeholder="0 lbs"
                  value={packageDetails.weight}
                  onChange={(e) => setPackageDetails({ ...packageDetails, weight: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Dimensions */}
            <h3 className={`${$GS.textHeading_3} mt-4 mb-2`}>Dimensions (optional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="length" className={`${$GS.textNormal_1}`}>Length * (in)</label>
                <input id="length" type="number"
                  className="border border-custom-border p-2 w-full bg-transparent text-custom-text"
                  placeholder="0 in"
                  value={packageDetails.length}
                  onChange={(e) => setPackageDetails({ ...packageDetails, length: e.target.value })}
                  required
                />
              </div>
              <div>
                <label htmlFor="width" className={`${$GS.textNormal_1}`}>Width * (in)</label>
                <input id="width" type="number"
                  className="border border-custom-border p-2 w-full bg-transparent text-custom-text"
                  placeholder="0 in"
                  value={packageDetails.width}
                  onChange={(e) => setPackageDetails({ ...packageDetails, width: e.target.value })}
                  required
                />
              </div>
              <div>
                <label htmlFor="height" className={`${$GS.textNormal_1}`}>Height * (in)</label>
                <input id="height" type="number"
                  className="border border-custom-border p-2 w-full bg-transparent text-custom-text"
                  placeholder="0 in"
                  value={packageDetails.height}
                  onChange={(e) => setPackageDetails({ ...packageDetails, height: e.target.value })}
                  required
                />
              </div>
            </div>

            <label htmlFor="description" className={`${$GS.textNormal_1} mt-4`}>Description (optional)</label>
            <textarea id="description"
              className="border border-custom-border p-2 w-full bg-transparent text-custom-text"
              placeholder="Enter package information"
              value={packageDetails.description}
              onChange={(e) => setPackageDetails({ ...packageDetails, description: e.target.value })}
            />

            {/* References */}
            <div className="flex justify-between mt-4">
              <div className="w-1/2 pr-2">
                <label htmlFor="reference1" className={`${$GS.textNormal_1}`}>Reference 1 (optional)</label>
                <input id="reference1" type="text"
                  className="border border-custom-border p-2 w-full bg-transparent text-custom-text"
                  placeholder="Enter first reference number"
                  value={packageDetails.reference1}
                  onChange={(e) => setPackageDetails({ ...packageDetails, reference1: e.target.value })}
                />
              </div>
              <div className="w-1/2 pl-2">
                <label htmlFor="reference2" className={`${$GS.textNormal_1}`}>Reference 2 (optional)</label>
                <input id="reference2" type="text"
                  className="border border-custom-border p-2 w-full bg-transparent text-custom-text"
                  placeholder="Enter second reference number"
                  value={packageDetails.reference2}
                  onChange={(e) => setPackageDetails({ ...packageDetails, reference2: e.target.value })}
                />
              </div>
            </div>

            {/* Require Signature Checkboxes */}
            <h3 className={`${$GS.textHeading_3} mt-6 mb-2`}>Require Signature</h3>
            <label className="flex items-center text-custom-text">
              <input type="checkbox" className="mr-2" /> Require a signature on delivery
            </label>
            <label className="flex items-center text-custom-text mt-1">
              <input type="checkbox" className="mr-2" /> Saturday Delivery
            </label>
          </Card>

          {/* From Address Card */}
          <Card className="col-span-1">
            <h2 className={`${$GS.textHeading_2} mb-4`}>From Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="content-end">
                <label htmlFor="fromAddress" className={`${$GS.textNormal_1}`}>Saved Address</label>
                <select id="fromAddress" className="border border-custom-border p-2 w-full bg-transparent text-custom-text">
                  <option>Select a saved address...</option>
                </select>
              </div>
              <div>
                <label htmlFor="fromCountry" className={`${$GS.textNormal_1}`}>Country *</label>
                <input id="fromCountry" type="text"
                  className="border border-custom-border p-2 w-full bg-transparent text-custom-text"
                  defaultValue="United States" readOnly />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="content-end">
                <label htmlFor="nameFrom" className={`${$GS.textNormal_1}`}>Name *</label>
                <input id="nameFrom" type="text"
                  className="border border-custom-border p-2 w-full bg-transparent text-custom-text"
                  placeholder="Name"
                  value={sender.name}
                  onChange={(e) => setSender({ ...sender, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label htmlFor="companyFrom" className={`${$GS.textNormal_1}`}>Company / Reference Number (optional)</label>
                <input id="companyFrom" type="text"
                  className="border border-custom-border p-2 w-full bg-transparent text-custom-text"
                  placeholder="Company"
                  value={sender.company}
                  onChange={(e) => setSender({ ...sender, company: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="content-end">
                <label htmlFor="phoneFrom" className={`${$GS.textNormal_1}`}>Phone *</label>
                <input id="phoneFrom" type="text"
                  className="border border-custom-border p-2 w-full bg-transparent text-custom-text"
                  placeholder="Phone"
                  value={sender.phone}
                  onChange={(e) => setSender({ ...sender, phone: e.target.value })}
                  required
                />
              </div>
              <div>
                <label htmlFor="streetFrom" className={`${$GS.textNormal_1}`}>Street *</label>
                <input id="streetFrom" type="text"
                  className="border border-custom-border p-2 w-full bg-transparent text-custom-text"
                  placeholder="Street"
                  value={sender.address1}
                  onChange={(e) => setSender({ ...sender, address1: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="content-end">
                <label htmlFor="street2From" className={`${$GS.textNormal_1}`}>Street 2 (optional)</label>
                <input id="street2From" type="text"
                  className="border border-custom-border p-2 w-full bg-transparent text-custom-text"
                  placeholder="Street 2"
                  value={sender.address2}
                  onChange={(e) => setSender({ ...sender, address2: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="cityFrom" className={`${$GS.textNormal_1}`}>City *</label>
                <input id="cityFrom" type="text"
                  className="border border-custom-border p-2 w-full bg-transparent text-custom-text"
                  placeholder="City"
                  value={sender.city}
                  onChange={(e) => setSender({ ...sender, city: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="content-end">
                <label htmlFor="stateFrom" className={`${$GS.textNormal_1}`}>State</label>
                <select id="stateFrom" className="border border-custom-border p-2 w-full bg-transparent text-custom-text"
                  value={sender.state}
                  onChange={(e) => setSender({ ...sender, state: e.target.value })}>
                  <option value={""}>Select state...</option>
                  {states.map(state => (
                    <option key={state.abbreviation} value={state.abbreviation}>{state.state}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="zipFrom" className={`${$GS.textNormal_1}`}>Zip *</label>
                <input id="zipFrom" type="text"
                  className="border border-custom-border p-2 w-full bg-transparent text-custom-text"
                  placeholder="Zip"
                  value={sender.zip}
                  onChange={(e) => setSender({ ...sender, zip: e.target.value })}
                  required
                />
              </div>
            </div>
          </Card>

          {/* To Address Card */}
          <Card className="col-span-1">
            <h2 className={`${$GS.textHeading_2} mb-4`}>To Address</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="content-end">
                <label htmlFor="toAddress" className={`${$GS.textNormal_1}`}>Saved Address</label>
                <select id="toAddress" className="border border-custom-border p-2 w-full bg-transparent text-custom-text">
                  <option>Select a saved address...</option>
                </select>
              </div>

              <div>
                <label htmlFor="toCountry" className={`${$GS.textNormal_1}`}>Country *</label>
                <input id="toCountry" type="text"
                  className="border border-custom-border p-2 w-full bg-transparent text-custom-text"
                  defaultValue="United States" readOnly />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="content-end">
                <label htmlFor="nameTo" className={`${$GS.textNormal_1}`}>Name *</label>
                <input id="nameTo" type="text"
                  className="border border-custom-border p-2 w-full bg-transparent text-custom-text"
                  placeholder="Name"
                  value={receiver.name}
                  onChange={(e) => setReceiver({ ...receiver, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label htmlFor="companyTo" className={`${$GS.textNormal_1}`}>Company / Reference Number (optional)</label>
                <input id="companyTo" type="text"
                  className="border border-custom-border p-2 w-full bg-transparent text-custom-text"
                  placeholder="Company"
                  value={receiver.company}
                  onChange={(e) => setReceiver({ ...receiver, company: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="content-end">
                <label htmlFor="phoneTo" className={`${$GS.textNormal_1}`}>Phone *</label>
                <input id="phoneTo" type="text"
                  className="border border-custom-border p-2 w-full bg-transparent text-custom-text"
                  placeholder="Phone"
                  value={receiver.phone}
                  onChange={(e) => setReceiver({ ...receiver, phone: e.target.value })}
                  required
                />
              </div>

              <div>
                <label htmlFor="streetTo" className={`${$GS.textNormal_1}`}>Street *</label>
                <input id="streetTo" type="text"
                  className="border border-custom-border p-2 w-full bg-transparent text-custom-text"
                  placeholder="Street"
                  value={receiver.address1}
                  onChange={(e) => setReceiver({ ...receiver, address1: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="content-end">
                <label htmlFor="street2To" className={`${$GS.textNormal_1}`}>Street 2 (optional)</label>
                <input id="street2To" type="text"
                  className="border border-custom-border p-2 w-full bg-transparent text-custom-text"
                  placeholder="Street 2"
                  value={receiver.address2}
                  onChange={(e) => setReceiver({ ...receiver, address2: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="cityTo" className={`${$GS.textNormal_1}`}>City *</label>
                <input id="cityTo" type="text"
                  className="border border-custom-border p-2 w-full bg-transparent text-custom-text"
                  placeholder="City"
                  value={receiver.city}
                  onChange={(e) => setReceiver({ ...receiver, city: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="content-end">
                <label htmlFor="stateTo" className={`${$GS.textNormal_1}`}>State</label>
                <select id="stateTo" className="border border-custom-border p-2 w-full bg-transparent text-custom-text"
                  value={receiver.state}
                  onChange={(e) => setReceiver({ ...receiver, state: e.target.value })}>
                  <option value={""}>Select state...</option>
                  {states.map(state => (
                    <option key={state.abbreviation} value={state.abbreviation}>{state.state}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="zipTo" className={`${$GS.textNormal_1}`}>Zip *</label>
                <input id="zipTo" type="text"
                  className="border border-custom-border p-2 w-full bg-transparent text-custom-text"
                  placeholder="Zip"
                  value={receiver.zip}
                  onChange={(e) => setReceiver({ ...receiver, zip: e.target.value })}
                  required
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Price And Submit Section */}
        <div className="flex lg:flex-row justify-between items-center mt-8 flex-col">
          <p className={`${$GS.textHeading_2} m-8`}>Price: ${price}</p>
          <div className="flex justify-center">
            <button type="submit" className={`${$GS.textHeading_2} cursor-pointer rounded-small p-6 md:p-8 border-thin border-custom-border transition-shadow duration-300 
                    bg-card-background group hover:border-hover-border hover:shadow-bright`}>Order Label</button>
          </div>
          <div className="text-center text-sm text-gray-400">
            <p>© {new Date().getFullYear()} Icarus Ships. All rights reserved.</p>
          </div>
        </div>
      </form>
      <Modal imageData={`data:image/png;base64,${labelImage}`} isVisible={modalVisible} onClose={() => setModalVisible(false)} />
    </div>
  );
};

export default OrderLabel;