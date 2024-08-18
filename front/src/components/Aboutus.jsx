import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Aboutus = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">About Us</h1>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 max-w-4xl">
        {/* Our Mission */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-8 rounded-lg shadow-lg flex items-center justify-center text-center"
        >
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg">
              To provide a seamless and secure platform for managing your digital assets. We strive to innovate and offer the best financial solutions for our users.
            </p>
          </div>
        </motion.div>

        {/* Our Vision */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-8 rounded-lg shadow-lg flex items-center justify-center text-center"
        >
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
            <p className="text-lg">
              To become the leading platform in digital finance, empowering users to achieve financial freedom through innovative technology.
            </p>
          </div>
        </motion.div>

        {/* Our Values */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-8 rounded-lg shadow-lg flex items-center justify-center text-center"
        >
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Values</h2>
            <p className="text-lg">
              Integrity, innovation, and customer satisfaction are at the core of everything we do. We are committed to delivering excellence in all our services.
            </p>
          </div>
        </motion.div>

        {/* Our Team */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-pink-500 to-orange-500 text-white p-8 rounded-lg shadow-lg flex items-center justify-center text-center"
        >
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Team</h2>
            <p className="text-lg">
              A group of dedicated professionals with expertise in finance, technology, and customer service, working together to bring you the best experience.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Contact Us */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        className="bg-cyan-950 text-white py-3 px-8 rounded-md shadow-md mt-12"
      >
        <Link to="/support">Contact Us</Link>
        
      </motion.button>
    </div>
  );
};

export default Aboutus;
