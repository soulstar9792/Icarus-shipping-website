// src/components/Orders.js
import React, { useEffect, useState } from 'react';
import Card from '../Utils/Card'; // Ensure you have a Card component
import $GS from '../../styles/constants'; // Import your styles
import axios from 'axios';
import Loading from '../Loading'; // Import Loading component
import jsPDF from 'jspdf';
import Modal from '../Modal';
import { useSelector } from 'react-redux';

const Orders = () => {
  const user = useSelector(state => state.auth.user);
  const [orders, setOrders] = useState([]); // State to store orders
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [error, setError] = useState(null); // State to manage error
  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility
  const [currentImage, setCurrentImage] = useState(''); // State to store current image
  console.log(user);

  const getOrders = () => {
    return axios.get('http://localhost:5000/api/orders/'+ user._id, {
      headers: { 'token': localStorage.getItem('token') },
    });
  };


  useEffect(() => {
    getOrders().then(res => {
      setLoading(true)
      setOrders(res.data.orders);
      console.log(res.data.orders);
      setLoading(false);
    }).catch(err => {
      setError(err);
      setLoading(false);
    });
  }, []);
  const handleImageClick = (imageBase64) => {
    setCurrentImage(imageBase64);
    setModalVisible(true);
  };

  const downloadImageAsPDF = () => {
    const doc = new jsPDF();
    doc.addImage(currentImage, 'JPEG', 10, 10, 180, 160);
    doc.save('download.pdf');
  };

  return (
    <div className="orders-container px-4 md:px-10 py-10 md:py-20 bg-custom-background">
      <Card>
        <h2 className={`${$GS.textHeading_2} mb-4`}>Orders List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 border-custom-border">
            <thead className="bg-custom-background text-custom-text sticky top-0 z-30 border border-custom-border">
              <tr>
                <th className="border border-custom-border p-2">No</th>
                <th className="border border-custom-border p-2">Service</th>
                <th className="border border-custom-border p-2">Image</th>
                <th className="border border-custom-border p-2">Sender</th>
                <th className="border border-custom-border p-2">Receiver</th>
                <th className="border border-custom-border p-2">Tracking Number</th>
                <th className="border border-custom-border p-2">Added</th>
              </tr>
            </thead>
            <tbody className="bg-custom-background text-custom-text">
              {orders.map(order => (
                <tr key={order._id}>
                  <td className="border border-custom-border p-2">{order._id}</td>
                  <td className="border border-custom-border p-2">{order.service_name}</td>
                  <td className="border border-custom-border p-2" onClick={() => handleImageClick(order.image)}>
                    <img
                      src={`data:image/jpeg;base64,${order.image}`} // Adjust the format if necessary
                      alt="Order"

                      style={{ cursor: 'pointer', width: '70px', height: '100px' }} // Adjust size as needed
                    />
                  </td>
                  <td className="border border-custom-border p-2">{order.sender.sender_name} <br /> <span className='text-sm text-gray-500'>{order.sender.sender_company}</span></td>
                  <td className="border border-custom-border p-2">{order.receiver.receiver_name} <br /> <span className='text-sm text-gray-500'>{order.receiver.receiver_company}</span></td>
                  <td className="border border-custom-border p-2">{order.tracking_number}</td>
                  <td className="border border-custom-border p-2">{order.createdAt}</td>
                </tr>
              ))}
              {/* Add more rows here if necessary */}
            </tbody>
          </table>
        </div>
      </Card>
      {/* <Modal imageData={currentImage} isVisible={modalVisible} onClose={() => setModalVisible(false)} /> */}
      {modalVisible && <Modal isVisible={modalVisible} onClose={() => setModalVisible(false)} imageData={`data:image/png;base64,${currentImage}`} />}
      {loading && <Loading />}
    </div>
  );
};

export default Orders;