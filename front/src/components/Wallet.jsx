import { motion } from "framer-motion";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Wallet = () => {
  const { authToken, user } = useSelector((state) => state.auth);
  const navigate=useNavigate();
  useEffect(()=>{
    if(!authToken){
      navigate("/")
    }
  })
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50  max-w-[100vw]">
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-6 rounded-lg shadow-lg mb-8 w-[350px] text-center min-h-[200px] flex flex-col gap-5 items-center justify-center"
      >
        <p className="font-bold text-xl">Current Balance</p>
        <p className="text-4xl font-bold mt-4">${user.wallet}</p>
      </motion.div>
     
        <div className="flex flex-row gap-4 ">
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="bg-cyan-950 text-white py-2  rounded-md shadow-md mt-4 mb-8 px-8"
        >
          Buy 
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="bg-cyan-950 text-white py-2  rounded-md shadow-md mt-4 mb-8 px-6"
        >
          Swap
        </motion.button>
        </div>
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-12 p-6  shadow-md text-center min-w[900vw]"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-2">
          Manage Your Wallet
        </h2>
        <p className="text-black  ">
          Keep track of your transactions, monitor your balance, 
         and manage your investments with confidence.
        </p>
          </motion.div>
      <div className="text-center max-w-md">
        <div className="text-gray-700">
          {user.verified !== "verified" && (
            <p className="text-red-500 font-semibold">
              Please verify your account to start dealing securely.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wallet;
