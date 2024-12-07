import React from "react";

const HowItWorks = () => {
  return (
    <section className="py-20 px-10 bg-gray-900">
      <h2 className="text-4xl text-center mb-8 animate__animated animate__fadeInDown">
        How It Works
      </h2>
      <p className="text-center mb-12 animate__animated animate__fadeIn" style={{ animationDelay: '0.5s' }}>
        Follow these simple steps to get started with our ships services.
      </p>

      <div className="flex flex-col md:flex-row justify-around items-baseline space-y-8 md:space-y-0 md:space-x-8">
        {/* Step 1 */}
        <div
          className="flex flex-col items-center bg-gray-800 rounded-lg p-6 shadow-lg animate__animated animate__fadeIn hover:bg-gray-700 transition duration-300"
          style={{ animationDelay: '0.5s' }}
        >
          <div className="text-6xl mb-4" aria-label="Fund Your Account Icon">💰</div>
          <h3 className="text-xl font-bold mb-2">STEP 01</h3>
          <h4 className="text-lg mb-4">Fund Your Account</h4>
          <p className="text-center">Deposit through Crypto or CashApp</p>
        </div>

        {/* Step 2 */}
        <div
          className="flex flex-col items-center bg-gray-800 rounded-lg p-6 shadow-lg animate__animated animate__fadeIn hover:bg-gray-700 transition duration-300"
          style={{ animationDelay: '1s' }} // Updated for Step 2
        >
          <div className="text-6xl mb-4" aria-label="Select Service Icon">📦</div>
          <h3 className="text-xl font-bold mb-2">STEP 02</h3>
          <h4 className="text-lg mb-4">Select Service</h4>
          <p className="text-center">Pick between which carrier fits your needs.</p>
        </div>

        {/* Step 3 */}
        <div
          className="flex flex-col items-center bg-gray-800 rounded-lg p-6 shadow-lg animate__animated animate__fadeIn hover:bg-gray-700 transition duration-300"
          style={{ animationDelay: '1.5s' }} // Updated for Step 3
        >
          <div className="text-6xl mb-4" aria-label="Ship Instantly Icon">🚚</div>
          <h3 className="text-xl font-bold mb-2">STEP 03</h3>
          <h4 className="text-lg mb-4">Ship Instantly</h4>
          <p className="text-center">Print, slap on your label, and send it out!</p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;