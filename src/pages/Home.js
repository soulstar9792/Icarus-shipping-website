import React from 'react';
import LandingView from '../components/LandingView'; 
import HowItWorks from '../components/HowItWorks';
import WhyChooseUs from "../components/WhyChooseUs";
import PriceSection from '../components/PriceSection'; 
import FAQSection from '../components/FAQSection';
import CustomerFeedback from '../components/CustomerFeedback';
import ReadyToShip from '../components/ReadyToShip';
import Footer from '../components/Footer';

import 'animate.css';

const Home = () => {
  return (
    <div className="bg-dark-bg text-white">
      {/* Landing View Section */}
      <div id="landing"><LandingView /></div>

      {/* How To Section */}
      <div id="howitworks"><HowItWorks /></div> 

      {/* Why Choose Us Section */}
      <div id="whychooseus"><WhyChooseUs /></div>

      {/* Price Section */}
      <div id="price"><PriceSection /></div>

      {/* FAQ Section */}
      <div id="faq"><FAQSection /></div>

      {/* Customer Feedback Section */}
      <div id="feedback"><CustomerFeedback /></div>

      {/* Get Started Section */}
      <div id="readytoshop"><ReadyToShip /></div>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Home;