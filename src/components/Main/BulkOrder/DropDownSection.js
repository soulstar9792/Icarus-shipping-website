// Import required dependencies at the top of your component
import React from 'react';
import $GS from '../../../styles/constants';

const DropDownSection = ({
  courierType,
  HandleCourierChange,
  selectedService,
  setSelectedService,
  availableServices,
  selectedProvider,
  setSelectedProvider
}) => {
  return (
    <div className="mb-6">
        <label htmlFor="labelType" className={`${$GS.textNormal_1} mb-2`}>
        Label Type
        </label>
        <select
        id="labelType"
        value={courierType}
        onChange={HandleCourierChange}
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
                "USPSvEasyPost",
            ].map((provider, index) => (
                <option key={index} value={provider}>
                {provider}
                </option>
            ))}
            </select>
        </div>
        )}
    </div>
  );
};

export default DropDownSection;