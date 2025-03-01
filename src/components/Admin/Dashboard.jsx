// src/components/Admin/Dashboard.js
import React, { useEffect, useState } from "react";
import { FaUsers, FaCog, FaClipboardList, FaMoneyBill } from "react-icons/fa"; // Import the necessary icons
import Card from "../Utils/Card"; // Import the Card component
import $GS from "../../styles/constants"; // Import your styles
import axios from "axios";
const Dashboard = () => {
  // Placeholder data for admin demonstration

  const [users, setUsers] = useState([]);
  const [apiBalance, setApiBalance] = useState(); 
  const [invoices, setInvoices] = useState([]); 
  const [loader,setLoader] = useState(false); 

  const getUser = () => {
    return axios.get(
      `${process.env.REACT_APP_API_URL}/api/auth/users`,
      {
        headers: { token: localStorage.getItem("token") },
      }
    );
  };
  useEffect(() => {
    getUser()
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const getApiBalance = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/api/balance`, {headers: {"Content-Type": "application/json"}}); 
      setApiBalance(response.data?.balance)
    } catch (error) {
      console.log("An Error Occured",error); 
    }
  }

   

  const getApiDeposit = async () => {
    try {
      setLoader(true); 
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/api/deposit`, {headers: {"Content-Type": "application/json"}}); 

     const invoicesArray = Object.values(response.data); 
     setInvoices(invoicesArray)
    } catch (error) {
      console.log("An Error Occured",error); 
    }finally{
      setLoader(false)
    }
  }

  useEffect(()=>{
    getApiBalance(); 
    getApiDeposit();
  },[]);
 

  const mockData = {
    totalUsers: users.length,
    totalOrders: 90,
    totalRevenue: 25000,
    totalPendingOrders: 5,
  };
  

  return (
    <div className="px-4 md:px-10 py-10 md:py-20 bg-custom-background">
      {/* Row for Total Users, Total Orders, Total Revenue, and Total Pending Orders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card>
          <div className="flex items-center">
            <FaUsers className={`${$GS.iconSize} text-custom-border mr-2`} />
            <div>
              <h3 className={`${$GS.textHeading_3}`}>Total Users</h3>
              <p className={`${$GS.textNormal_1}`}>{mockData.totalUsers}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <FaClipboardList
              className={`${$GS.iconSize} text-custom-border mr-2`}
            />
            <div>
              <h3 className={`${$GS.textHeading_3}`}>Total Orders</h3>
              <p className={`${$GS.textNormal_1}`}>{mockData.totalOrders}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <FaMoneyBill
              className={`${$GS.iconSize} text-custom-border mr-2`}
            />
            <div>
              <h3 className={`${$GS.textHeading_3}`}>Total Revenue</h3>
              <p className={`${$GS.textNormal_1}`}>${mockData.totalRevenue}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <FaCog className={`${$GS.iconSize} text-custom-border mr-2`} />
            <div>
              <h3 className={`${$GS.textHeading_3} truncate`}>Pending Orders</h3>
              <p className={`${$GS.textNormal_1}`}>
                {mockData.totalPendingOrders}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* API Balance  */}
      <Card className="bg-custom-background">
          <h2  className={`${$GS.textHeading_2} mb-4`}>API Balance : {apiBalance? "$"+apiBalance: "loading..."} </h2>
          {/* <h2  className={`${$GS.textHeading_2} mb-4`}>API Depostis  </h2>
          {loader? <p className={`${$GS.textHeading_2}`}>Loading...</p>:  <div className="w-full bg-custom-background p-4 rounded-lg">
            
            <div className="overflow-x-auto">
              <table className="w-full table-fixed">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-3 text-gray-400 w-40">No</th>
                    <th className="text-left p-3 text-gray-400 w-40">Invoice ID</th>
                    <th className="text-left p-3 text-gray-400 w-24">Amount</th>
                    <th className="text-left p-3 text-gray-400 w-44">Date Created</th>
                    <th className="text-left p-3 text-gray-400 w-32">Payment Method</th>
                    <th className="text-left p-3 text-gray-400 w-24">Status</th>
                    <th className="text-left p-3 text-gray-400 w-96">API Key</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice, ind) => (
                    <tr 
                      key={invoice.invoice_id} 
                      className="border-b border-custom-border hover:bg-gray-800"
                    >
                      <td className="p-3 text-gray-300 truncate">{ind + 1}</td>
                      <td className="p-3 text-gray-300 truncate">{invoice.invoice_id}</td>
                      <td className="p-3 text-gray-300">${invoice.amount_due_in_usd}</td>
                      <td className="p-3 text-gray-300">{invoice.date_created}</td>
                      <td className="p-3 text-gray-300">{invoice.payment_method.BTC? "BTC":"other"}</td>
                      <td className="p-3">
                        <span 
                          className={`px-2 py-1 rounded text-sm ${
                            invoice.payment_status === 'complete' 
                              ? 'bg-green-900 text-green-300' 
                              : 'bg-red-900 text-red-300'
                          }`}
                        >
                          {invoice.payment_status}
                        </span>
                      </td>
                      <td className="p-3 text-gray-300 truncate" title={invoice.api_key}>
                        {invoice.api_key}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>} */}
      </Card>
      {/* Further sections for admin */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-full bg-custom-background">
          <h2 className={`${$GS.textHeading_2} mb-4`}>Admin Actions</h2>
          <p className={`${$GS.textNormal_1} text-center`}>
            Manage users, oversee orders, and adjust settings.
          </p>
        </Card>
      </div> */}
    </div>
  );
};

export default Dashboard;
