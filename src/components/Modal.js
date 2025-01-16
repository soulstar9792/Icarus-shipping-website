import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "./Modal.css"; // Ensure your styles are imported

const Modal = ({ isVisible, onClose, imageData }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);

      // Remove the animation class after the animation is done
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300); // Adjust the time to match your CSS animation duration

      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.addImage(imageData, "PNG", 10, 10, 190, 0);
    doc.save("label.pdf");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className={`bg-white p-4 rounded-lg transition-transform duration-300 ${
          isAnimating ? "scale-100" : "scale-95"
        }`}
      >
        <h2 className="text-lg font-bold mb-2">Label Image</h2>
        <img
          src={imageData}
          width={400}
          height={500}
          alt="Label"
          className="mb-4"
        />
        <div className="flex justify-end">
          <button onClick={onClose} className="mr-2 p-2 bg-gray-300 rounded">
            Close
          </button>
          <button
            onClick={handleDownloadPDF}
            className="p-2 bg-blue-600 text-white rounded"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
