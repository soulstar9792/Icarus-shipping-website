// src/components/Main/BulkOrder/DownloadSection.js
import React from 'react';
import { FaDownload } from 'react-icons/fa';
import Card from '../../Utils/Card';
import $GS from '../../../styles/constants'; // Ensure this path is correct

const DownloadSection = () => {
  return (
    <Card>
      <p className={`${$GS.textNormal_1} text-center`}>
        <a
          href={`${process.env.REACT_APP_API_URL}/api/orders/file/template`}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="text-blue-600 underline text-md hover:text-blue-500"
        >
          <span>
            <FaDownload
              className="mx-auto mb-2 text-blue-600"
              size={40}
            />
            Download Bulk Template CSV
          </span>
        </a>
      </p>
    </Card>
  );
};

export default DownloadSection;