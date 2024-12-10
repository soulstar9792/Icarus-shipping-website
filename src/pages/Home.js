// src/pages/Home.js
import React from 'react';
import { useSectionContext } from '../context/SectionContext'; // Import the context
import LandingView from '../components/LandingView'; 
import HowItWorks from '../components/HowItWorks';
import WhyChooseUs from "../components/WhyChooseUs";
import ClearPricing from '../components/ClearPricing'; 
import FAQSection from '../components/FAQSection';
import CustomerFeedback from '../components/CustomerFeedback';
import ReadyToShip from '../components/ReadyToShip';
import Footer from '../components/Footer';

import 'animate.css';

const Home = () => {
  const {
    refs: {
      landingViewRef,
      howItWorksRef,
      whyChooseUsRef,
      clearPricingRef,
      faqRef,
      customerFeedbackRef,
      readyToShipRef,
    }
  } = useSectionContext(); // Get the refs from context

  return (
    <div className="bg-dark-bg text-white pt-[60px]">
      <div ref={landingViewRef} id='landing-view'>
        <LandingView />
      </div>

      <div ref={howItWorksRef}>
        <HowItWorks />
      </div>

      <div ref={whyChooseUsRef}>
        <WhyChooseUs />
      </div>

      <div ref={clearPricingRef}>
        <ClearPricing />
      </div>

      <div ref={faqRef}>
        <FAQSection />
      </div>

      <div ref={customerFeedbackRef}>
        <CustomerFeedback />
      </div>

      <div ref={readyToShipRef}>
        <ReadyToShip />
      </div>

      <Footer />
    </div>
  );
};

export default Home;