// src/components/Main/BulkOrder/OrderSummary.js
import React from "react";
import $GS from "../../../styles/constants";

const OrderSummary = ({ totalPrice, handleSubmit }) => {
  return (
    <div className="flex lg:flex-row justify-between items-center mt-8 flex-col">
      <p className={`${$GS.textHeading_3} m-8`}>
        Total Price: ${totalPrice.toFixed(2)}
      </p>
      <div className="flex justify-center">
        <button
          type="submit"
          onClick={handleSubmit}
          className={`${$GS.textHeading_3} cursor-pointer rounded-small p-6 md:p-8 border-thin border-custom-border transition-shadow duration-300 
              bg-card-background group hover:border-hover-border hover:shadow-bright`}
        >
          Submit Bulk Order
        </button>
      </div>
      <div className="text-center text-xs text-gray-400">
        <p>
          © {new Date().getFullYear()} Sapphire Labels. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default OrderSummary;
