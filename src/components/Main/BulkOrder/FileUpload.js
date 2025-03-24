// src/components/Main/BulkOrder/FileUpload.js
import React from 'react';
import { FaUpload, FaDownload } from 'react-icons/fa';
import $GS from '../../../styles/constants'; // Ensure to import any necessary styles/constants

const FileUpload = ({ csvFile, txtFile, handleFileChange }) => {
  return (
    <div className={`${$GS.card} mb-6 p-6`}>
      <div 
        className={`border-2 border-dashed border-blue-400 p-4 text-center rounded-md cursor-pointer`}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const files = e.dataTransfer.files;
          if (files.length > 0) {
            handleFileChange({ target: { files: [files[0]] } });
          }
        }}
        onClick={() => document.getElementById('file-upload').click()} // Trigger file input on click
      >
        <FaUpload className="mx-auto text-blue-600 mb-2" size={32} />
        <p className="text-blue-600 font-medium">Drag & drop your CSV or Amazon file here</p>
        <span className="inline-block text-blue-600">
          or <span className="underline">choose a file</span>
        </span>
        <input
          id="file-upload"
          type="file"
          accept=".csv, .txt"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      {(csvFile || txtFile) && 
        <p className={`text-sm text-gray-500 mt-2`}>
          Uploaded File: {csvFile ? csvFile?.name : txtFile?.name}
        </p>
      }
    </div>
  );
};

export default FileUpload;