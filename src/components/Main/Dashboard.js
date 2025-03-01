// src/components/Main/Dashboard.js
import React, { useEffect, useState } from "react";
import {
  FaDollarSign,
  FaArrowUp,
  FaFileAlt,
  FaShoppingCart,
} from "react-icons/fa"; // Importing icons
import Card from "../Utils/Card"; // Ensure you have a Card component
import $GS from "../../styles/constants"; // Import your styles
import { useSelector } from "react-redux";
import axios from "axios";

const Dashboard = () => {
  // Placeholder data for demonstration
  const mockData = {
    balance: 5000,
    totalDeposited: 2000,
    totalOrders: 15,
    totalSpent: 1200,
    recentOrders: [
      { type: "Order 1", from: "User A", to: "Service X", status: "Completed" },
      { type: "Order 2", from: "User B", to: "Service Y", status: "Pending" },
    ],
    recentDeposits: [
      { amount: 500, date: "2023-10-01" },
      { amount: 800, date: "2023-09-28" },
    ],
  };

  const [orders, setOrders] = useState([]);
  // Get the user
  const user = useSelector((state) => state.auth.user);

  // Fetch the Order
  useEffect(() => {
    if (user) {
      const fetchOrders = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/orders/${user._id}`
          );
          setOrders(response.data.orders);
        } catch (e) {
          console.log("The Error", e);
        }
      };
      fetchOrders();
    }
  }, [user, user?.balance]);
  return (
    <div className="px-4 md:px-10 py-10 md:py-20 bg-custom-background">
      {/* Row for Balance, Total Deposited, Total Orders, and Total Spent */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <Card>
        <div className="flex items-center min-w-0">
          <div className="flex-shrink-0 mr-2">
            <FaDollarSign className={`${$GS.iconSize} text-custom-border`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`${$GS.textHeading_3} truncate`}>Balance</h3>
            <p className={`${$GS.textNormal_1}`}>
              ${user?.balance?.toFixed(2) || user.balance}
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center min-w-0">
          <div className="flex-shrink-0 mr-2">
            <FaArrowUp className={`${$GS.iconSize} text-custom-border`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`${$GS.textHeading_3} truncate`}>Total Deposited</h3>
            <p className={`${$GS.textNormal_1}`}>
              {user?.totalDeposit
                ? "$" + user?.totalDeposit?.toFixed(2)
                : "-----"}
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center min-w-0">
          <div className="flex-shrink-0 mr-2">
            <FaShoppingCart className={`${$GS.iconSize} text-custom-border`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`${$GS.textHeading_3} truncate`}>Total Orders</h3>
            <p className={`${$GS.textNormal_1}`}>{orders?.length}</p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center min-w-0">
          <div className="flex-shrink-0 mr-2">
            <FaFileAlt className={`${$GS.iconSize} text-custom-border`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`${$GS.textHeading_3} truncate`}>Total Spent</h3>
            <p className={`${$GS.textNormal_1}`}>
              {user?.totalSpent
                ? "$" + user?.totalSpent?.toFixed(2)
                : "-----"}
            </p>
          </div>
        </div>
      </Card>
    </div>
      {/* Recent Orders and Recent Deposits in cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent Orders Card */}
        <Card className="col-span-2 bg-custom-background ">
          <h2 className={`${$GS.textHeading_2} mb-4`}>Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full w-full bg-transparent border border-custom-border overflow-x-auto">
              <thead>
                <tr className="bg-custom-background text-white text-left">
                  <th className="px-4 py-2 border-b border-custom-border">
                    Type
                  </th>
                  <th className="px-4 py-2 border-b border-custom-border">
                    From
                  </th>
                  <th className="px-4 py-2 border-b border-custom-border">
                    To
                  </th>
                  <th className="px-4 py-2 border-b border-custom-border">
                    Tracking ID{" "}
                  </th>
                  <th className="px-4 py-2 border-b border-custom-border">
                    {" "}
                    Date{" "}
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders?.map((order, index) => (
                  <tr key={index} className="hover:border-hover-border">
                    <td
                      className={`border-b border-custom-border px-4 py-2 ${$GS.textNormal_1}`}
                    >
                      {order?.courier}
                    </td>
                    <td
                      className={`border-b border-custom-border px-4 py-2 ${$GS.textNormal_1}`}
                    >
                      {order?.sender.sender_name}
                    </td>
                    <td
                      className={`border-b border-custom-border px-4 py-2 ${$GS.textNormal_1}`}
                    >
                      {order?.receiver.receiver_name}
                    </td>
                    <td
                      className={`border-b border-custom-border px-4 py-2 ${$GS.textNormal_1}`}
                    >
                      {order?.tracking_number}
                    </td>
                    <td
                      className={`border-b border-custom-border px-4 py-2 ${$GS.textNormal_1}`}
                    >
                      {order?.createdAt.split("T")[0]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Recent Deposits Card */}
        <Card className="bg-custom-background">
          <h2 className={`${$GS.textHeading_2} mb-4`}>Recent Deposits</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-transparent border border-custom-border">
              <thead className=" overflow-x-auto">
                <tr className="bg-custom-background text-white text-left">
                  <th className="px-4 py-2 border-b border-custom-border">
                    Amount
                  </th>
                  <th className="px-4 py-2 border-b border-custom-border">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockData.recentDeposits.map((deposit, index) => (
                  <tr key={index} className="hover:border-hover-border">
                    <td
                      className={`border-b border-custom-border px-4 py-2 ${$GS.textNormal_1}`}
                    >
                      ${deposit.amount}
                    </td>
                    <td
                      className={`border-b border-custom-border px-4 py-2 ${$GS.textNormal_1}`}
                    >
                      {deposit.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
