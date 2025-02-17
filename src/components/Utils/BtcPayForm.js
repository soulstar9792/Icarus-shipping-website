import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; // Get user from Redux
import Card from '../Utils/Card';
import Loading from '../Loading';
import $GS from "../../styles/constants";
import './BtcPayForm.css';

const BtcPayForm = () => {
  const [price, setPrice] = useState(50);
  const [currency, setCurrency] = useState('USD');
  const [loading, setLoading] = useState(false);
  
  const currentUser = useSelector((state) => state.auth.user); // Get logged-in user
  
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://btcpay.sapphirelabels.com/modal/btcpay.js";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const requestData = {
      storeId: "78hA938PtM5PXfz9HRviwptXd5ek8Hg53i9LM7FdzgET",
      price,
      currency,
      jsonResponse: true,
      notifyEmail: "Sapphirewholesaling@gmail.com",
      metadata: {
        userId: currentUser?.id || "guest",
        email: currentUser?.email || "unknown",
      },
    };

    try {
      const response = await fetch('https://btcpay.sapphirelabels.com/api/v1/invoices', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      console.log("Invoice Response:", data);

      if (!data || !data.invoiceId) {
        throw new Error("Invalid invoice response format");
      }

      if (window.btcpay) {
        window.btcpay.appendInvoiceFrame(data.invoiceId);
      } else {
        console.error("BTCPay script not loaded yet");
      }
    } catch (error) {
      console.error("Error creating invoice:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="batch-orders-container px-4 md:px-10 py-10 md:py-20 bg-custom-background flex items-center justify-center">
      {loading && <Loading />}
      <Card className="w-full max-w-sm shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-custom-text text-center">
            Pay with BTC
          </h2>
          <form className="btcpay-form btcpay-form--block" onSubmit={handleFormSubmit}>
            <div className="flex items-center mb-4 input-container">
              <input
                className={`${$GS.inputForm_2} flex-grow text-right mr-2`}
                type="number"
                name="price"
                min="1"
                max="100000"
                value={price}
                onChange={(e) => setPrice(Math.max(1, Math.min(100000, parseInt(e.target.value) || 0)))}
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
