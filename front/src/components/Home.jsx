import { motion } from "framer-motion";
import { useState } from "react";
import {  useSelector } from "react-redux";
import style from "../css/home.module.css";
import AdminDashboard from "./AdminDashboard";
import { Link } from "react-router-dom";

const Home = () => {
  const user = useSelector((state) => state.auth.user);
  const [copied, setCopied] = useState(false);


  const copyToClipboard = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/register?ref=${user.referralLink}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {user.role === "admin" ? (
        
        <AdminDashboard />
        
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full min-h-[100vh] p-6 bg-white shadow-lg rounded-lg"
        >
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h1 className="text-3xl font-bold mb-4 md:mb-0 text-gray-800">
              Welcome, {user.username}!
            </h1>
            {/* <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={logoutHandler}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition duration-300 ease-in-out shadow-md"
            >
              Sign Out
            </motion.button> */}
          </div>
          <Link to="/wallet">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-6 rounded-lg shadow-md mb-8 w-[300px]"
          >
           
            <p className="font-bold text-lg">Current Balance</p>
            <p className="text-3xl font-bold mt-2">${user.wallet}</p>
          </motion.div>
          </Link>

          <div className="mb-8 text-center flex flex-col items-center justify-center gap-2">
            <p className="mb-6 text-2xl font-bold text-gray-800 text-center">
              🌟 Exciting News! 🌟
            </p>
            <p className="mb-6 text-lg text-gray-700 text-center lg:w-[500px] font-bold">
              Boost your balance effortlessly by sharing your unique referral
              link. Earn a rewarding{" "}
              <span className="font-semibold text-green-600">$1</span> for every
              friend who signs up and gets verified. Seize this opportunity to
              increase your earnings—start sharing today!
            </p>
            <div className="relative flex flex-col md:flex-row items-center lg:w-[600px] mx-auto">
              <input
                type="text"
                readOnly
                value={`${window.location.origin}/register?ref=${user.referralLink}`}
                className="w-full md:w-2/3 bg-gray-200 p-[13px] rounded-md border-2 border-blue-500 mb-0 md:mb-0 md:mr-4 text-sm font-medium text-gray-700"
                id={style.input}
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={copyToClipboard}
                className="absolute right-0 top-0 md:relative md:right-[100px] md:top-[-10px] md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition duration-300 ease-in-out shadow-md"
              >
                {copied ? "Copied!" : "Copy"}
              </motion.button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-12 p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-md text-center"
          >
            <p className="text-2xl font-semibold mb-2">
              Buy, sell, and swap seamlessly.
            </p>
            <p className="text-lg mb-4">
              Bring together your wallets. See your digital collectibles. Say
              hello to the new way to crypto.
            </p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Home;
