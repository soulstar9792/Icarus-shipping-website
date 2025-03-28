import React, { useEffect, useState } from "react";
import { FaDollarSign, FaArrowUp, FaFileAlt, FaShoppingCart } from "react-icons/fa";
import Card from "../Utils/Card";
import $GS from "../../styles/constants";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { updateUser } from '../../redux/authSlice';  // Import the new action

const Dashboard = () => {
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentDeposits, setRecentDeposits] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);

  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const fetchDashboardData = async () => {
        try {
          const [ordersRes, depositsRes, totalOrdersRes, userRes] = await Promise.all([
            axios.get(`${process.env.REACT_APP_API_URL}/api/orders/recent/${user._id}`,
              {
                headers: { token: localStorage.getItem("token") },
              }),
            axios.get(`${process.env.REACT_APP_API_URL}/api/payment/recent-deposits/${user._id}`,
              {
                headers: { token: localStorage.getItem("token") },
              }),
            axios.get(`${process.env.REACT_APP_API_URL}/api/orders/total/${user._id}`,
              {
                headers: { token: localStorage.getItem("token") },
              }),
            axios.get(`${process.env.REACT_APP_API_URL}/api/auth/verify`,
              {
                headers: { token: localStorage.getItem("token") },
              }),
          ]);
          setRecentOrders(ordersRes.data.recentOrders);
          setRecentDeposits(depositsRes.data);
          setTotalOrders(totalOrdersRes.data.totalOrders);
          
          // Update user data in Redux store
          dispatch(updateUser(userRes.data.user));
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        }
      };
      
      fetchDashboardData();
    }
  }, [user, dispatch]);

  return (
    <div className="px-4 md:px-10 py-10 md:py-10 bg-custom-background">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card>
          <div className="flex items-center min-w-0">
            <div className="flex-shrink-0 mr-6">
              <FaDollarSign className={`${$GS.iconSize} text-custom-border group-hover:text-hover-text`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`${$GS.textHeading_3} truncate`}>Balance</h3>
              <p className={`${$GS.textHeading_3}`}>${user?.balance?.toFixed(2) || "-----"}</p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center min-w-0">
            <div className="flex-shrink-0 mr-6">
              <FaArrowUp className={`${$GS.iconSize} text-custom-border group-hover:text-hover-text`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`${$GS.textHeading_3} truncate`}>Total Deposit</h3>
              <p className={`${$GS.textHeading_3}`}>{user?.totalDeposit ? "$" + user.totalDeposit.toFixed(2) : "$0"}</p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center min-w-0">
            <div className="flex-shrink-0 mr-6">
              <FaShoppingCart className={`${$GS.iconSize} text-custom-border group-hover:text-hover-text`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`${$GS.textHeading_3} truncate`}>Total Orders</h3>
              <p className={`${$GS.textHeading_3}`}>{totalOrders}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center min-w-0">
            <div className="flex-shrink-0 mr-6">
              <FaFileAlt className={`${$GS.iconSize} text-custom-border group-hover:text-hover-text`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`${$GS.textHeading_3} truncate`}>Total Spent</h3>
              <p className={`${$GS.textHeading_3}`}>{user?.totalSpent ? "$" + user?.totalSpent?.toFixed(2) : "$0"}</p>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-2 bg-custom-background">
          <h2 className={`${$GS.textHeading_2} mb-4`}>Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-transparent">
              <thead>
                <tr className="bg-custom-background text-text-normal text-left">
                  <th className="px-4 py-2 border-b border-custom-border">Type</th>
                  <th className="px-4 py-2 border-b border-custom-border">From</th>
                  <th className="px-4 py-2 border-b border-custom-border">To</th>
                  <th className="px-4 py-2 border-b border-custom-border">Tracking ID</th>
                  <th className="px-4 py-2 border-b border-custom-border">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <>
                    {Array(2).fill(null).map((_, index) => (
                      <tr key={index} className="h-10">
                        <td className={`px-4 ${$GS.textNormal_1}`}>&nbsp;</td>
                        <td className={`px-4 ${$GS.textNormal_1}`}>&nbsp;</td>
                        <td className={`px-4 ${$GS.textNormal_1}`}>&nbsp;</td>
                        <td className={`px-4 ${$GS.textNormal_1}`}>&nbsp;</td>
                        <td className={`px-4 ${$GS.textNormal_1}`}>&nbsp;</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan="5" className={`text-center px-4 py-2 ${$GS.textNormal_3}`}>
                        <div className="flex items-center justify-center gap-2">
                          <FaFileAlt />
                          No orders found
                        </div>
                      </td>
                    </tr>
                    {Array(2).fill(null).map((_, index) => (
                      <tr key={index} className="h-10">
                        <td className={`px-4 ${$GS.textNormal_1}`}>&nbsp;</td>
                        <td className={`px-4 ${$GS.textNormal_1}`}>&nbsp;</td>
                        <td className={`px-4 ${$GS.textNormal_1}`}>&nbsp;</td>
                        <td className={`px-4 ${$GS.textNormal_1}`}>&nbsp;</td>
                        <td className={`px-4 ${$GS.textNormal_1}`}>&nbsp;</td>
                      </tr>
                    ))}
                  </>
                ) : (
                  Array(5).fill(null).map((_, index) => {
                    const order = recentOrders[index];
                    return (
                      <tr key={index} className="hover:border-hover-border h-10">
                        <td className={`border-b border-custom-border px-4 py-2 ${$GS.textNormal_1}`}>
                          {order?.courier || '-'}
                        </td>
                        <td className={`border-b border-custom-border px-4 py-2 ${$GS.textNormal_1}`}>
                          {order?.sender.sender_name || '-'}
                        </td>
                        <td className={`border-b border-custom-border px-4 py-2 ${$GS.textNormal_1}`}>
                          {order?.receiver.receiver_name || '-'}
                        </td>
                        <td className={`border-b border-custom-border px-4 py-2 ${$GS.textNormal_1}`}>
                          {order?.tracking_number || '-'}
                        </td>
                        <td className={`border-b border-custom-border px-4 py-2 ${$GS.textNormal_1}`}>
                          {order?.createdAt ? order.createdAt.split("T")[0] : '-'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="bg-custom-background">
          <h2 className={`${$GS.textHeading_2} mb-4`}>Recent Deposits</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-transparent">
              <thead>
                <tr className="bg-custom-background text-text-normal text-left">
                  <th className="px-4 py-2 border-b border-custom-border">Amount</th>
                  <th className="px-4 py-2 border-b border-custom-border">Date</th>
                  <th className="px-4 py-2 border-b border-custom-border">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentDeposits.length === 0 ? (
                  <>
                  {Array(2).fill(null).map((_, index) => (
                    <tr key={index} className="h-10">
                      <td className={`px-4 ${$GS.textNormal_1}`}>&nbsp;</td>
                      <td className={`px-4 ${$GS.textNormal_1}`}>&nbsp;</td>
                      <td className={`px-4 ${$GS.textNormal_1}`}>&nbsp;</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="3" className={`text-center px-4 py-2 ${$GS.textNormal_3}`}>
                      <div className="flex items-center justify-center gap-2">
                        <FaFileAlt />
                        No deposit found
                      </div>
                    </td>
                  </tr>
                  {Array(2).fill(null).map((_, index) => (
                    <tr key={index} className="h-10">
                      <td className={`px-4 ${$GS.textNormal_1}`}>&nbsp;</td>
                      <td className={`px-4 ${$GS.textNormal_1}`}>&nbsp;</td>
                      <td className={`px-4 ${$GS.textNormal_1}`}>&nbsp;</td>
                    </tr>
                  ))}
                </>
                ) : (
                  Array(5).fill(null).map((_, index) => {
                    const deposit = recentDeposits[index];
                    return (
                      <tr key={index} className="hover:border-hover-border h-10">
                        <td className={`border-b border-custom-border px-4 ${$GS.textNormal_1}`}>
                          ${deposit?.amount || '-'}
                        </td>
                        <td className={`border-b border-custom-border px-4 ${$GS.textNormal_1}`}>
                          {deposit ? new Date(deposit.createdTime * 1000).toLocaleString() : '-'}
                        </td>
                        <td className={`border-b border-custom-border px-4 font-semibold ${
                          deposit?.status === "Settled"
                            ? "text-blue-600"
                            : deposit?.status === "Expired"
                              ? "text-yellow-600"
                              : deposit?.status
                                ? "text-green-600"
                                : ""
                        }`}>
                          {deposit?.status || '-'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;