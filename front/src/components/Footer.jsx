// Footer.jsx
import React from "react";

const Footer = () => {
  // Get the current year
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <p className="text-center md:text-left text-sm text-white">
            © {currentYear} Your Company. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="/privacy" className="hover:underline">
              Privacy Policy
            </a>
            
            <a href="/support" className="hover:underline">
              Contact Us
            </a>
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-lg font-semibold mb-2 text-white">
            Buy, sell, and swap seamlessly.
          </p>
          <p className="text-base text-white">
            Bring together your wallets. See your digital collectibles. Say
            hello to the new way to crypto.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
