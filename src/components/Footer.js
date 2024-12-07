import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Links Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul>
            <li><a href="#landing" className="hover:underline">Home</a></li>
            <li><a href="#howitworks" className="hover:underline">How It Works</a></li>
            <li><a href="#whychooseus" className="hover:underline">Why Choose Us</a></li>
            <li><a href="#price" className="hover:underline">Pricing</a></li>
            <li><a href="#faq" className="hover:underline">FAQs</a></li>
            <li><a href="#feedback" className="hover:underline">Customer Feedback</a></li>
            <li><a href="#readytoshop" className="hover:underline">Ready to Ship</a></li>
          </ul>
        </div>

        {/* Contact Information and Social Media section... */}
      </div>

      {/* Newsletter Subscription and Copyright info */}
    </footer>
  );
};

export default Footer;