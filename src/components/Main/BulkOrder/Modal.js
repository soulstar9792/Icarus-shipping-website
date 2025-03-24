// src/components/Main/BulkOrder/Modal.js
import { FaDownload, FaTimes } from 'react-icons/fa';
import $GS from '../../../styles/constants';
import Card from '../../Utils/Card';

const Modal = ({ fileData, isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-20">
      <Card>
        <h2 className={`${$GS.textHeading_2}`}>Order Processed Successfully!</h2>
        <div className="flex flex-wrap gap-2">
          {fileData.pdfName && (
            <button
              onClick={() => window.open(`${process.env.REACT_APP_API_URL}/api/orders/download/${fileData.pdfName}`, '_blank')}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md flex items-center"
            >
              <FaDownload className="mr-2" />
              PDF Labels
            </button>
          )}
          {fileData.resultCSVName && (
            <button
              onClick={() => window.open(`${process.env.REACT_APP_API_URL}/api/orders/download/${fileData.resultCSVName}`, '_blank')}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md flex items-center"
            >
              <FaDownload className="mr-2" />
              Result CSV
            </button>
          )}
          {fileData.autoConfirmCSVName && (
            <button
              onClick={() => window.open(`${process.env.REACT_APP_API_URL}/api/orders/download/${fileData.autoConfirmCSVName}`, '_blank')}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md flex items-center"
            >
              <FaDownload className="mr-2" />
              Auto-Confirm CSV
            </button>
          )}
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-md"
          >
            Close
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Modal;