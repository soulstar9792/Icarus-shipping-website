import React, { useState } from "react";
import { FaChevronDown, FaChevronUp, FaSearch } from "react-icons/fa";

// Sample FAQ Data
const faqData = [
  {
    question: "How fast do the labels get delivered?",
    answer: "Our service is instant."
  },
  {
    question: "Are there bulk/reseller discounts?",
    answer: "Contact our support at @IcarusShipHelp on Telegram."
  },
  {
    question: "How can I deposit?",
    answer: "You can deposit directly with crypto via our website, or you can contact our support @IcarusShipHelp on Telegram for manual payments."
  }
];

const FAQSection = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleFAQ = index => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const filteredFAQs = faqData.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="py-20 bg-white text-gray-800">
      <h2 className="text-5xl text-center mb-12 font-bold">Frequently Asked Questions</h2>
      
      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden shadow">
          <input
            type="text"
            className="flex-grow px-4 py-2 focus:outline-none"
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <button className="p-2 bg-gray-200 hover:bg-gray-300 transition duration-150">
            <FaSearch />
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((item, index) => (
              <div key={index} className="border-b border-gray-300 mb-4">
                <div 
                  className="flex justify-between items-center py-4 cursor-pointer hover:bg-gray-100 transition duration-150" 
                  onClick={() => toggleFAQ(index)}
                >
                  <h3 className="text-xl font-semibold text-black">{item.question}</h3>
                  {
                    expandedIndex === index ? (
                      <FaChevronUp className="text-xl text-gray-600" />
                    ) : (
                      <FaChevronDown className="text-xl text-gray-600" />
                    )
                  }
                </div>
                {expandedIndex === index && (
                  <p className="text-lg text-gray-700 mb-4">{item.answer}</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-lg text-gray-700 mb-4">No results found.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;