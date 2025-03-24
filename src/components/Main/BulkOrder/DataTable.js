// src/components/Main/BulkOrder/DataTable.js
import React from 'react';
import TableRow from './TableRow';
import $GS from '../../../styles/constants';
import './BulkOrder.css';

const DataTable = ({ uploadedData, txtFile, courierType, setUploadedData }) => {
  return (
    <div className="relative overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-y-auto" style={{ maxHeight: '40vh' }}>
          <table className="min-w-full border-separate border-spacing-0 border-custom-border text-sm">
            <thead className="bg-custom-background text-custom-text">
              <tr>
                <th colSpan="6" className={`${$GS.borderCustom} sticky top-0 z-10`}>From</th>
                <th colSpan="6" className="sticky top-0 z-10 border p-4 text-left h-14">To</th>
                <th colSpan="12" className="sticky top-0 z-10 border p-4 text-left h-14">Package Info</th>
              </tr>
              {/* Add original table header columns here */}
            </thead>
            <tbody>
              {uploadedData.map((row, index) => (
                <TableRow
                  key={index}
                  index={index}
                  row={row}
                  txtFile={txtFile}
                  courierType={courierType}
                  setUploadedData={setUploadedData}
                  uploadedData={uploadedData} // Added missing prop
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataTable;