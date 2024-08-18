import { motion } from "framer-motion";

const Privacy = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-5xl font-bold text-gray-900 mb-12">Privacy Policy</h1>

      {/* Main Content */}
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl text-left">
        {/* Introduction */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Introduction</h2>
          <p className="text-gray-700 text-lg">
            Your privacy is critically important to us. This Privacy Policy outlines how we collect, use, and protect your personal information when you use our services.
          </p>
        </section>

        {/* Information Collection */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Information We Collect</h2>
          <ul className="list-disc list-inside text-gray-700 text-lg">
            <li>Personal identification information (Name, email address, phone number, etc.)</li>
            <li>Log data (IP address, browser type, etc.)</li>
            <li>Cookies and usage data</li>
          </ul>
        </section>

        {/* Information Usage */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">How We Use Information</h2>
          <p className="text-gray-700 text-lg">
            The information we collect is used to provide and improve our services, to contact you, and for security purposes.
          </p>
        </section>

        {/* Information Protection */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">How We Protect Your Information</h2>
          <p className="text-gray-700 text-lg">
            We implement a variety of security measures to maintain the safety of your personal information. However, please be aware that no method of transmission over the Internet, or method of electronic storage is 100% secure.
          </p>
        </section>

        {/* Changes to Policy */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Changes to This Policy</h2>
          <p className="text-gray-700 text-lg">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
          </p>
        </section>

        {/* Contact Information */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
          <p className="text-gray-700 text-lg">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <a  href="/support" className="text-red-700 text-xl mt-2 text-center underline block">
           suppor
          </a>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
