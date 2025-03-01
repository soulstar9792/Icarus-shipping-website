import React from "react";
import BtcPayButton from "../Utils/BtcPayButton";
import DepositHistory from "./DepositHistory";

const Deposit = ({ userId }) => {
  return (
    <div className="deposit-container p-6">
      {/* BTC Payment Button */}
      <BtcPayButton />

      <DepositHistory userId={userId} />
    </div>
  );
};

export default Deposit;
