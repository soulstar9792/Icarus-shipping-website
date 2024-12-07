import React, { useState, useRef, useEffect } from "react";

const FAQs = () => {
  const [faqs] = useState([
    {
      question: "What services do you offer?",
      answer: "We offer a variety of services including shipping, logistics management, and custom solutions to meet your needs.",
    },
    {
      question: "How can I contact customer support?",
      answer: "You can reach our customer support through our contact page, or by calling our support number available 24/7.",
    },
    {
      question: "Is there a money-back guarantee?",
      answer: "Yes! We offer a 30-day money-back guarantee on all of our services if you're not satisfied.",
    },
    {
      question: "Do you offer international shipping?",
      answer: "Absolutely! We provide international shipping options to many countries worldwide.",
    },
  ]);

  const [activeIndex, setActiveIndex] = useState(null);
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref]);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section ref={ref} className="py-10 md:py-20 px-4 md:px-10 bg-gradient-to-r from-green-600 to-teal-500">
      <h2 className={`text-3xl md:text-5xl font-bold text-center mb-8 md:mb-12 text-white ${isVisible ? 'animate__animated animate__fadeInDown' : ''}`}>
        Frequently Asked Questions
      </h2>
      <div className="max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <div key={index} className={`mb-4 rounded-lg shadow-lg transition-shadow duration-300 ${isVisible ? 'animate__animated animate__fadeInUp' : ''}`}>
            <button
              className="w-full text-left bg-white border-2 border-gray-300 rounded-lg p-4 md:p-6 hover:bg-gray-100 focus:outline-none"
              onClick={() => toggleFAQ(index)}
            >
              <h3 className="text-lg md:text-xl font-semibold text-gray-800">{faq.question}</h3>
            </button>
            {activeIndex === index && (
              <div className="p-4 md:p-6 bg-gray-100 border-t-2 border-gray-300 rounded-b-lg">
                <p className="text-gray-700 text-sm md:text-base">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQs;