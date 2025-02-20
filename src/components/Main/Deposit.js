import React from "react";
import BtcPayForm from "../Utils/BtcPayForm";
import DepositHistory from "./DepositHistory";

const Deposit = ({ userId }) => {
  return (
    <div className="deposit-container p-6">      
      {/* BTC Payment Form */}
      <BtcPayForm />
      
      {/* User Deposit History */}
      <div className="mt-6">
        <DepositHistory userId={userId} />
      </div>
    </div>
  );
};

export default Deposit;
