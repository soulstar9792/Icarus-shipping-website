import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; // Get user from Redux
import axios from 'axios';
import Loading from '../Loading';
import $GS from '../../styles/constants';

const BtcPayButton = () => {
  const [loading, setLoading] = useState(false);
  const currentUser = useSelector((state) => state.auth.user); // Get logged-in user

  useEffect(() => {
    if (!document.getElementById('btcpay-script')) {
      const script = document.createElement('script');
      script.src = `${process.env.REACT_APP_BTCPAY_SERVER_URL}/modal/btcpay.js`;
      script.id = 'btcpay-script'; // Give the script an ID for further reference
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  const handleButtonClick = async () => {
    setLoading(true);

    const userId = currentUser?._id || 'guest';
    
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/payment/top-up/${userId}`, 
        {
          headers: { token: localStorage.getItem('token') },
        }
      );

      if (response.status !== 200) throw new Error('Server error');

      const data = response.data;

      if (!data || !data.id) throw new Error('Invalid invoice response format');

      if (window.btcpay) {
        window.btcpay.appendInvoiceFrame(data.id);
        window.btcpay.onModalWillLeave(function () {
          setLoading(false); // Set loading to false when the modal closes
        });
      } else {
        console.error('BTCPay script not loaded yet');
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };

  return (
    <div className="flex items-center justify-center">
      {loading && <Loading />}
      <button
        onClick={handleButtonClick}
        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 mt-4 font-semibold transition duration-300 ease-in-out transform hover:scale-105"
        disabled={loading}
      >
        {loading ? 'Generating Invoice...' : 'Pay with BTCPay'}
      </button>
    </div>
  );
};

export default BtcPayButton;