import React, { useState, useEffect } from 'react';
 import Card from '../Utils/Card'; // Assuming you have this
 import Loading from '../Loading'; // Assuming you have this
 import $GS from "../../styles/constants"; // Import your styles
 import './BtcPayForm.css'; // Create this CSS file

 const BtcPayForm = () => {
   const [price, setPrice] = useState(50);
   const [currency, setCurrency] = useState('USD');
   const [loading, setLoading] = useState(false);

   useEffect(() => {
     const script = document.createElement('script');
     script.src = "https://btcpay.sapphirelabels.com/modal/btcpay.js";
     document.getElementsByTagName('head')[0].append(script);
   }, []);

   const handleFormSubmit = async (event) => {
     event.preventDefault();
     setLoading(true);
     const formData = new FormData();
     formData.append('storeId', '78hA938PtM5PXfz9HRviwptXd5ek8Hg53i9LM7FdzgET');
     formData.append('jsonResponse', 'true');
     formData.append('notifyEmail', 'Sapphirewholesaling@gmail.com');
     formData.append('price', price);
     formData.append('currency', currency);

     try {
       const response = await fetch('https://btcpay.sapphirelabels.com/api/v1/invoices', {
         method: 'POST',
         body: formData,
       });

       if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
       }

       const data = await response.json();
       window.btcpay.appendInvoiceFrame(data.invoiceId);
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
             <input type="hidden" name="storeId" value="78hA938PtM5PXfz9HRviwptXd5ek8Hg53i9LM7FdzgET" />
             <input type="hidden" name="jsonResponse" value="true" />
             <input type="hidden" name="notifyEmail" value="Sapphirewholesaling@gmail.com" />
             <div className="flex items-center mb-4 input-container"> {/* Added input-container class */}
               <input
                 className={`${$GS.inputForm_2} flex-grow text-right mr-2`} // Removed mr-2 and pr-4
                 type="number"
                 name="price"
                 min="1"
                 max="100000"
                 value={price}
                 onChange={(e) => {
                   const newValue = parseInt(e.target.value);
                   setPrice(isNaN(newValue) ? 0 : Math.max(1, Math.min(100000, newValue)));
                 }}
                 style={{ width: '4em', letterSpacing: '10px' }}
               />
               <select
                 name="currency"
                 value={currency}
                 onChange={(e) => setCurrency(e.target.value)}
                 className={`${$GS.inputForm_2} w-20`} // Removed mr-2 and pr-4
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