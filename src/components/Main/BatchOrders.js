// src/components/BatchOrders.js
import React, { useState, useEffect } from "react";
import Card from "../Utils/Card"; // Ensure you have a Card component
import $GS from "../../styles/constants"; // Import your styles
import axios from "axios";
import { useSelector } from "react-redux";
import Loading from "../Loading";
const BatchOrders = () => {
  const user = useSelector((state) => state.auth.user);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;
  const [batchOrdersData, setBatchOrdersData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility
  const [loading, setLoading] = useState(true); // State to manage loading status

  const getBatchOrders = () => {
    return axios.get(
      `${process.env.REACT_APP_API_URL}/api/orders/bulk/` +
        user._id,
      {
        headers: { token: localStorage.getItem("token") },
      }
    );
  };
  useEffect(() => {
    getBatchOrders().then((res) => {
      setLoading(true);
      setBatchOrdersData(res.data.reverse());
      setLoading(false);
      // console.log(res.data);
    });
  }, []);

  // Determine the current orders to display
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = batchOrdersData.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  // Calculate total pages
  const totalPages = Math.ceil(batchOrdersData.length / ordersPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleDownload = async (fileName) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/orders/download/${fileName}`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      const contentDisposition = response.headers["content-disposition"];
      const fileNameFromResponse = contentDisposition
        ? contentDisposition.split("filename=")[1].replace(/"/g, "")
        : fileName;
      link.setAttribute("download", fileNameFromResponse);

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Error downloading file:", error.message);
    }
  };
  return (
    <div className="batch-orders-container px-4 md:px-10 py-10 md:py-20 bg-custom-background">
      {loading && <Loading />}
      <Card>
        <h2 className={`${$GS.textHeading_2} mb-4`}>Batch Orders List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 border-custom-border text-center">
            <thead className="bg-custom-background text-custom-text sticky top-0 z-30 border border-custom-border">
              <tr>
                <th className="border border-custom-border p-2">No</th>
                <th className="border border-custom-border p-2">Created Date</th>
                <th className="border border-custom-border p-2">Courier</th>
                <th className="border border-custom-border p-2">Label Count</th>
                <th className="border border-custom-border p-2">Price</th>
                <th className="border border-custom-border p-2">Download</th>
              </tr>
            </thead>
            <tbody className="bg-custom-background text-custom-text">
              {currentOrders.map((order, i) => (
                <tr key={order._id}>
                  <td className="border border-custom-border p-2">
                    {i+1}
                  </td>
                  <td className="border border-custom-border p-2">
                    {order.createdAt}
                  </td>
                  <td className="border border-custom-border p-2">
                    {order.courier}
                  </td>
                  <td className="border border-custom-border p-2">
                    {order.bulkOrderData.orders.length}
                  </td>
                  <td className="border border-custom-border p-2">${order.bulkOrderData.cost}</td>
                  <td className="border border-custom-border p-2">
                    {order.pdfName && <button
                      className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 border1 border-blue-600 mx-1 bg-blue-700 font-bold`}
                      onClick={() => handleDownload(order.pdfName)}
                    >
                      PDF
                    </button>}
                    {order.resultCSVName && <button
                      className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 border1 border-blue-600 mx-1 bg-blue-700 font-bold`}
                      onClick={() => handleDownload(order.resultCSVName)}
                    >
                      Result CSV
                    </button>}
                    {order.autoConfirmCSVName && <button
                      className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 border1 border-blue-600 mx-1 bg-blue-700 font-bold`}
                      onClick={() => handleDownload(order.autoConfirmCSVName)}
                    >
                      Auto Confirm CSV
                    </button>}
                  </td>
                </tr>
              ))}
              {/* Add more rows here as necessary */}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() =>
              handlePageChange(currentPage > 1 ? currentPage - 1 : 1)
            }
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 border-${
                currentPage === index + 1 ? "2" : "1"
              } border-blue-600 mx-1 ${
                currentPage === index + 1
                  ? "bg-blue-700 font-bold"
                  : "bg-blue-400 hover:bg-blue-500"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() =>
              handlePageChange(
                currentPage < totalPages ? currentPage + 1 : totalPages
              )
            }
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </Card>
    </div>
  );
};

export default BatchOrders;
