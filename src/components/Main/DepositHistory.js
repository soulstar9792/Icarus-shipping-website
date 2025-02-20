// src/components/DepositHistory.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Card from "../Utils/Card"; // Ensure you import the Card component
import $GS from "../../styles/constants"; // Import your styles
import Loading from "../Loading"; // Import any loading component

const DepositHistory = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const currentUser = useSelector((state) => state.auth.user);
  const userId = currentUser?._id;

  useEffect(() => {
    const fetchDepositHistory = async () => {
      if (!userId) return; // Do not fetch if no user ID.
      try {
        const response = await axios.get(
          `https://lcarus-shipping-backend-ce6c088c70be.herokuapp.com/api/payment/payment-history/${userId}`,
          {
            headers: { token: localStorage.getItem("token") },
          }
        );
        setDeposits(response.data.payments);
      } catch (err) {
        setError("Failed to load deposit history");
        console.error("Error fetching deposit history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDepositHistory();
  }, [userId]); // This useEffect will run when userId changes.

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="deposit-history-container px-4 md:px-10 py-10 md:py-20 bg-custom-background">
      <Card>
        <h2 className={`${$GS.textHeading_2} mb-4`}>Deposit History</h2>
        {deposits.length === 0 ? (
          <p>No deposits found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead className="bg-custom-background text-custom-text sticky top-0 z-30 border border-custom-border">
                <tr>
                  <th className="border border-custom-border p-2">Date</th>
                  <th className="border border-custom-border p-2">Amount</th>
                  <th className="border border-custom-border p-2">Method</th>
                  <th className="border border-custom-border p-2">Status</th>
                </tr>
              </thead>
              <tbody className="bg-custom-background text-custom-text">
                {deposits.map((deposit) => (
                  <tr key={deposit._id} className="text-center">
                    <td className="border border-custom-border p-2">
                      {new Date(deposit.date).toLocaleString()}
                    </td>
                    <td className="border border-custom-border p-2">
                      {deposit.amount} BTC
                    </td>
                    <td className="border border-custom-border p-2">
                      {deposit.paymentMethod}
                    </td>
                    <td
                      className={`border border-custom-border p-2 font-semibold ${
                        deposit.status === "Completed"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {deposit.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DepositHistory;