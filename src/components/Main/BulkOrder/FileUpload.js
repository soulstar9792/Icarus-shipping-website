// src/components/Main/BulkOrder/FileUpload.js
import { FaUpload, FaDownload } from 'react-icons/fa';

const FileUpload = ({ handleFileChange }) => {
  return (
    <div className="mb-6 p-6">
      <div 
        className="border-2 border-dashed border-blue-400 p-4 text-center rounded-md cursor-pointer"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const files = e.dataTransfer.files;
          if (files.length > 0) {
            handleFileChange({ target: { files: [files[0]] } });
          }
        }}
        onClick={() => document.getElementById('file-upload').click()}
      >
        <FaUpload className="mx-auto text-blue-600 mb-2" size={32} />
        <p className="text-blue-600 font-medium">Drag & drop files or click to upload</p>
        <p className="text-sm text-gray-500 mt-1">Supports .CSV and .TXT files</p>
        <input
          id="file-upload"
          type="file"
          accept=".csv,.txt"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      <a
        href={`${process.env.REACT_APP_API_URL}/api/orders/file/template`}
        className="inline-flex items-center text-blue-600 hover:text-blue-500 mt-4"
        download
      >
        <FaDownload className="mr-2" />
        Download CSV Template
      </a>
    </div>
  );
};

export default FileUpload;