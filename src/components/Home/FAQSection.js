import React, { useState, useRef, useEffect } from "react";
import Card from '../Utils/Card'; // Adjust the import path as per your folder structure

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
    <section ref={ref} className="py-10 md:py-20 px-4 md:px-10 bg-custom-background relative overflow-hidden">
      <h2
        className={`text-3xl md:text-5xl font-bold text-center mb-8 md:mb-12 text-text-emphasizing cursor-pointer transition-all duration-300 ${
          isVisible ? 'animate__animated animate__fadeInDown' : ''
        } hover:text-shadow`}
      >
        Frequently Asked Questions
      </h2>
      <div className="max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <div key={index} className={`mb-4 transition-shadow duration-300 ${isVisible ? 'animate__animated animate__fadeInUp' : ''}`}>
            <Card className={`p-4 md:p-6 bg-transparent border border-custom-border rounded-sm shadow-lg 
              ${activeIndex === index ? 'bg-gray-100 border-hover-border shadow-bright' : ''} 
              hover:bg-transparent hover:border-hover-border hover:shadow-bright`}>
              <div
                className="w-full text-left transition-all duration-300"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className={`text-lg md:text-xl font-semibold text-text-normal`}>
                  {faq.question}
                </h3>
                <span className={`text-gray-500 ${activeIndex === index ? 'hidden' : 'block'}`}>+</span>
                <span className={`text-gray-500 ${activeIndex === index ? 'block' : 'hidden'}`}>–</span>
              </div>
            </Card>
            {activeIndex === index && (
              <Card className="p-4 md:p-6 bg-transparent border border-hover-border shadow-bright rounded-sm mt-2">
                <p className="text-hover-text text-sm md:text-base text-left">
                  {faq.answer}
                </p>
              </Card>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQs;