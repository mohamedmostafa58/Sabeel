import React, { useState } from "react";
import {  BsMenuButtonWideFill } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import style from "../css/Navbar.module.css";
import { motion } from "framer-motion";
import { logoutUser } from "../redux/authSlice";
const Header = () => {
  const [hidden, sethidden] = useState(true);
  const { authToken } = useSelector((state) => state.auth);
  const location = useLocation();
  const { pathname } = location;
  const dispatch=useDispatch();
  const logoutHandler = () => {
    dispatch(logoutUser());
  };
  return (
    <div
      className={`md:h-[100px] ${style.header} flex px-4 text-white md:items-center md:justify-between border-t-blue-500 border-t-[4px] md:flex-row flex-col justify-center gap-2 md:gap-0`}
    >
      <div
        className={`z-20 relative ${style.link} flex justify-between items-center`}
      >
        <Link to="/">
          <img
            src={logo}
            alt="logo"
            className={`h-[120px] w-[120px] z-10 cursor-pointer ${style.image1}`}
          />
        </Link>

        <IoMdClose
          className="  text-xl text-white cursor-pointer hover:text-2xl md:hidden"
          hidden={hidden}
          onClick={() => {
            sethidden(true);
          }}
        />
        <BsMenuButtonWideFill
          className="md:hidden text-xl"
          hidden={!hidden}
          onClick={() => {
            sethidden(false);
          }}
        />
      </div>
      <Link
        to="/verify"
        onClick={() => {
          sethidden(true);
        }}
        className={` font-semibold z-30 cursor-pointer text-white ${
          style.headerlink
        } text-center text-xl md:block ${
          hidden ? "hidden" : ""
        } hover:text-sky-600`}
      >
        VERIFICATION
      </Link>
      <Link to="/support"
        onClick={() => {
          sethidden(true);
        }}
        className={` font-semibold  z-30 cursor-pointer text-white  ${
          style.headerlink
        } text-center text-xl md:block ${
          hidden ? "hidden" : ""
        } hover:text-sky-600`}
      >
        SUPPORT
      </Link>
      <Link to="/aboutus"
        onClick={() => {
          sethidden(true);
        }}
        className={` font-semibold  z-30 cursor-pointer text-white  ${
          style.headerlink
        } text-center text-xl md:block ${
          hidden ? "hidden" : ""
        } hover:text-sky-600`}
      >
        ABOUT US
      </Link>

      <Link
        onClick={() => {
          sethidden(true);
        }}
        to={
          authToken ? "/wallet" : pathname === "/login" ? "/register" : "/login"
        }
        id={style.btn}
        className={`  z-30 cursor-pointer text-white  text-center text-xl md:block    ${
          hidden ? "hidden" : ""
        } hover:text-sky-500  my-4 animate-none !important`}
      >
        <span className="bg-sky-500 hover:bg-white rounded-[10px] p-2 px-4 text-xl font-bold">
          {authToken
            ? " MY WALLET"
            : pathname === "/login"
            ? "SIGN UP"
            : "LOGIN"}
        </span>
      </Link>
      
      {authToken&&(
        <div className="flex justify-center max-w-[100vw]">
         <motion.button
         whileTap={{ scale: 0.95 }}
         onClick={logoutHandler}
         className={` ${
          hidden ? "hidden" : ""
        } px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md md:block transition duration-300 ease-in-out shadow-md z-10 max-w-[200px]`}
       >
         Sign Out
       </motion.button>
       </div>
      )
      }
     
    </div>
  );
};

export default Header;
