import React, { useState, useEffect } from "react";
import Card from "../../Utils/Card";

const Modal = ({ fileData, isVisible, onClose, orderId }) => {
  const [processedCount, setProcessedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  // SVG Download Icon component
  const DownloadIcon = () => (
    <svg
      fill="currentColor"
      viewBox="0 0 512 512"
      className="mr-2 w-5 h-5"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M216 0h80c13.3 0 24 10.7 24 24v168h87.7c17.8 0 26.7 21.5 14.1 34.1L269.7 378.3c-7.5 7.5-19.8 7.5-27.3 0L90.1 226.1c-12.6-12.6-3.7-34.1 14.1-34.1H192V24c0-13.3 10.7-24 24-24zm296 376v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h146.7l49 49c20.1 20.1 52.5 20.1 72.6 0l49-49H488c13.3 0 24 10.7 24 24z"></path>
    </svg>
  );

  // Download links configuration
  const downloadLinks = [
    { 
      key: 'pdf',
      name: fileData?.pdfName,
      label: 'PDF Labels'
    },
    {
      key: 'result-csv',
      name: fileData?.resultCSVName,
      label: 'Result CSV'
    },
    {
      key: 'auto-confirm',
      name: fileData?.autoConfirmCSVName,
      label: 'Auto-Confirm CSV'
    }
  ];

  // Progress calculation
  const progressPercentage = totalCount > 0 
    ? Math.round((processedCount / totalCount) * 100)
    : 0;

  useEffect(() => {
    if (!isVisible || !orderId) return;

    const fetchProgress = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/orders/bulk/progress/${orderId}`
        );
        const data = await response.json();
        setProcessedCount(data.processedCount);
        setTotalCount(data.totalCount);
      } catch (error) {
        console.error("Error fetching progress:", error);
      }
    };

    const interval = setInterval(fetchProgress, 1000);
    fetchProgress();
    return () => clearInterval(interval);
  }, [isVisible, orderId]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-20">
      <Card className="w-[600px]">
        <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">
          {fileData?.pdfName 
            ? "Order Processed Successfully!"
            : "Processing Bulk Order"}
        </h2>

        {/* Progress Section */}
        <div className="w-full mb-4">
          <div className="flex justify-between text-gray-300 text-sm font-medium mb-2">
            <div className="flex items-center">
              {processedCount === 0 || processedCount < totalCount ? (
                <svg className="animate-spin h-5 w-5 text-blue-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            <span>{processedCount} of {totalCount} labels processed</span>
            </div>
            <span>{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`bg-blue-600 h-3 rounded-full ${progressPercentage > 0 ? 'transition-all duration-500' : ''}`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Download Links */}
        <div className="flex flex-wrap gap-3 justify-center">
          {downloadLinks.map(({ key, name, label }) => (
            name && (
              <a
                key={key}
                href={`${process.env.REACT_APP_API_URL}/api/orders/download/${name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded-lg flex items-center shadow-md transition-transform duration-300 hover:scale-105 text-ssm"
              >
                <DownloadIcon />
                {label}
              </a>
            )
          ))}
          <button
            onClick={() => {
              setProcessedCount(0);
              setTotalCount(0);
              onClose();
            }}
            className="bg-gray-300 hover:bg-gray-400 text-black px-3 py-1.5 rounded-md text-sm"
          >
            Close
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Modal;