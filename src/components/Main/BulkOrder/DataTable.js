// src/components/Main/BulkOrder/DataTable.js
import React from 'react';
import TableRow from './TableRow';
import $GS from '../../../styles/constants';
import './BulkOrder.css';

const DataTable = ({ uploadedData, txtFile, courierType, setUploadedData, selectedService }) => {
  return (
    <div className="relative overflow-x-auto">
    <div className="overflow-x-auto ">
      <div className="inline-block min-w-full align-middle">
        <div
          className="overflow-y-auto"
          style={{ maxHeight: "40vh" }}
        >
          <table className="min-w-full border-separate border-spacing-0 border-custom-border text-sm">
            <thead className="bg-custom-background text-custom-text">
              <tr>
                <th
                  colSpan={courierType === "USPS" ? "2": "1"}
                  className="sticky top-0 z-10 border border-custom-border p-4 text-left bg-custom-background h-14 whitespace-nowrap"
                >
                  Service
                </th>
                <th
                  colSpan="9"
                  className="sticky top-0 z-10 border border-custom-border p-4 text-left bg-custom-background h-14 whitespace-nowrap"
                >
                  From
                </th>
                <th
                  colSpan="9"
                  className="sticky top-0 z-10 border border-custom-border p-4 text-left bg-custom-background h-14 whitespace-nowrap"
                >
                  To
                </th>
                <th
                  colSpan="7"
                  className="sticky top-0 z-10 border border-custom-border p-4 text-left bg-custom-background h-14 whitespace-nowrap"
                >
                  Package Info
                </th>
              </tr>
              <tr className="bg-custom-background text-custom-text">
                <th className="sticky top-14 z-10 min-w-[200px] border border-custom-border p-4 bg-custom-background h-14 whitespace-nowrap">
                  Type *
                </th>
                {courierType === "USPS" && (
                  <th className="sticky min-w-[200px] top-14 z-10 border border-custom-border p-2 bg-custom-background h-14 whitespace-nowrap">
                    Provider
                  </th>
                )}
                <th className="sticky top-14 z-10 min-w-[200px] border border-custom-border p-2 bg-custom-background h-14 whitespace-nowrap">
                  Name *
                </th>
                <th className="sticky top-14 z-10 min-w-[200px] border border-custom-border p-2 bg-custom-background h-14 whitespace-nowrap">
                  Phone
                </th>
                <th className="sticky top-14 z-10 min-w-[200px] border border-custom-border p-2 bg-custom-background h-14 whitespace-nowrap">
                  Company
                </th>
                <th className="sticky top-14 z-10 min-w-[250px] border border-custom-border p-2 bg-custom-background h-14 whitespace-nowrap">
                  Street *
                </th>
                <th className="sticky top-14 z-10 min-w-[250px] border border-custom-border p-2 bg-custom-background h-14 whitespace-nowrap">
                  Street 2
                </th>
                <th className="sticky top-14 z-10 min-w-[200px] border border-custom-border p-2 bg-custom-background h-14 whitespace-nowrap">
                  City *
                </th>
                <th className="sticky top-14 z-10 min-w-[120px] border border-custom-border p-2 bg-custom-background h-14 whitespace-nowrap">
                  State *
                </th>
                <th className="sticky top-14 z-10 min-w-[250px] border border-custom-border p-2 bg-custom-background h-14 whitespace-nowrap">
                  Zip *
                </th>
                <th className="sticky top-14 z-10 min-w-[200px] border border-custom-border p-2 bg-custom-background h-14 whitespace-nowrap">
                  Country *
                </th>

                <th className="sticky top-14 z-10 min-w-[200px] border border-custom-border p-2 bg-custom-background h-14 whitespace-nowrap">
                  Name *
                </th>
                <th className="sticky top-14 z-10 min-w-[200px] border border-custom-border p-2 bg-custom-background h-14 whitespace-nowrap">
                  Phone
                </th>
                <th className="sticky top-14 z-10 min-w-[200px] border border-custom-border p-2 bg-custom-background h-14 whitespace-nowrap">
                  Company
                </th>
                <th className="sticky top-14 z-10 min-w-[250px] border border-custom-border p-2 bg-custom-background h-14 whitespace-nowrap">
                  Street *
                </th>
                <th className="sticky top-14 z-10 min-w-[250px] border border-custom-border p-2 bg-custom-background h-14 whitespace-nowrap">
                  Street 2
                </th>
                <th className="sticky top-14 z-10 min-w-[200px] border border-custom-border p-2 bg-custom-background h-14 whitespace-nowrap">
                  City *
                </th>
                <th className="sticky top-14 z-10 min-w-[120px] border border-custom-border p-2 bg-custom-background h-14 whitespace-nowrap">
                  State *
                </th>
                <th className="sticky top-14 z-10 min-w-[250px] border border-custom-border p-2 bg-custom-background h-14 whitespace-nowrap">
                  Zip *
                </th>
                <th className="sticky top-14 z-10 min-w-[200px] border border-custom-border p-2 bg-custom-background h-14 whitespace-nowrap">
                  Country * 
                </th>
              
                <th className="sticky top-14 z-10 min-w-[120px] border border-custom-border p-2 bg-custom-background h-14 whitespace-nowrap">
                  Length *
                </th>
                <th className="sticky top-14 z-10 min-w-[120px] border border-custom-border p-2 bg-custom-background h-14 whitespace-nowrap">
                  Width *
                </th>
                <th className="sticky top-14 z-10 min-w-[120px] border border-custom-border p-2 bg-custom-background h-14 whitespace-nowrap">
                  Height *
                </th>
                <th className="sticky top-14 z-10 min-w-[120px] border border-custom-border p-2 bg-custom-background h-14 whitespace-nowrap">
                  Weight *
                </th>
                <th className="sticky top-14 z-10 min-w-[250px] border border-custom-border p-2 bg-custom-background h-14 whitespace-nowrap">
                  Description
                </th>
                
                <th className="sticky top-14 z-10 min-w-[120px] border border-custom-border p-2 bg-custom-background h-14 whitespace-nowrap">
                  Quantity
                </th>
                
                <th className="sticky min-w-[200px] top-14 z-10 border border-custom-border p-2 bg-custom-background h-14 whitespace-nowrap">
                  SKU Number
                </th>
                
                <th className="sticky top-14 z-10 min-w-[120px] border border-custom-border p-2 bg-custom-background h-14 whitespace-nowrap">
                  Actions
                </th>
              </tr>
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
                  selectedService={selectedService}
                  uploadedData={uploadedData} // Added missing prop
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  );
};

export default DataTable;