import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; // Get user from Redux
import axios from "axios";
import Card from '../Utils/Card';
import Loading from '../Loading';
import $GS from "../../styles/constants";
import './BtcPayForm.css';

const BtcPayForm = () => {
  const [amount, setAmount] = useState(50);
  const [currency, setCurrency] = useState('USD');
  const [loading, setLoading] = useState(false);
  
  const currentUser = useSelector((state) => state.auth.user); // Get logged-in user
  
  useEffect(() => {
    // Check if the script is already in the document
    if (!document.getElementById('btcpay-script')) {
      const script = document.createElement('script');
      script.src = `${process.env.REACT_APP_BTCPAY_SERVER_URL}/modal/btcpay.js`;
      script.id = 'btcpay-script'; // Give the script an ID for further reference
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    // Get the userId from the currentUser or default to "guest"
    const userId = currentUser?._id || "guest";
    console.log('userId', currentUser);

    try {
        // Make a GET request to your backend top-up endpoint
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/payment/top-up/${userId}`, // Append userId directly to the URL
          {
            headers: { token: localStorage.getItem("token") },
          }
        );

        // Check if response is okay
        if (response.status !== 200) {
            console.error("Server error:", response.status, response.statusText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = response.data; // Directly use the response data
        console.log("Invoice Response:", data);

        if (!data || !data.id) {
            throw new Error("Invalid invoice response format");
        }

        if (window.btcpay) {
            window.btcpay.appendInvoiceFrame(data.id); // Use the invoiceId to append the frame
            window.btcpay.onModalWillLeave(function() {
              console.log("setLoading false");
              setLoading(false); // Set loading to false when the modal closes
          });
        } else {
            console.error("BTCPay script not loaded yet");
        }
      } catch (error) {
          console.error("Error creating invoice:", error);
      }
  };

  return (
    <div className="batch-orders-container px-4 md:px-10 py-10 md:py-20 bg-custom-background flex items-center justify-center">
      {loading && <Loading />}
      <Card className="w-full max-w-sm shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4">
          <h2 className={`${$GS.textHeading_2}`}>
            Top up with BTC
          </h2>
          <form className="btcpay-form btcpay-form--block" onSubmit={handleFormSubmit}>
            <div className="flex items-center mb-4 input-container">
              <input
                className={`${$GS.inputForm_2} flex-grow text-right mr-2`}
                type="number"
                name="amount"
                min="1"
                max="100000"
                value={amount}
                onChange={(e) => setAmount(Math.max(1, Math.min(100000, parseInt(e.target.value) || 0)))}
                style={{ width: '4em', letterSpacing: '10px' }}
              />
              <select
                name="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className={`${$GS.inputForm_2} w-20`}
              >
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
                <option value="EUR">EUR</option>
                <option value="BTC">BTC</option>
              </select>
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 mt-4 font-semibold w-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
              disabled={loading}
            >
              {loading ? 'Generating Invoice...' : 'Pay with BTCPay'}
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default BtcPayForm;