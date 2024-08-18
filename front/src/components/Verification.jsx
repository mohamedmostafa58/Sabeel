/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "../css/Verification.module.css";
import Registration from "./Registration";

const Verification = () => {
  const [loading, setLoading] = useState(false);
  const [croppedFiles, setCroppedFiles] = useState([]);
  const { authToken, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const showLoader = () => {
    setLoading(true);
  };

  const hideLoader = () => {
    setLoading(false);
  };

  const setFolderName = (e) => {
    e.preventDefault();
    showLoader();
    const form = new FormData(e.target);
    const path = window.location.pathname;
    const segments = path.split("/");
    let userId = segments.pop() || segments.pop();
    userId = parseInt(userId, 10);

    if (isNaN(userId) || !isFinite(userId)) {
      userId = 0;
    }

    fetch(`/api/auth/upload/${userId}`, {
      method: "post",
      body: form,
    })
      .then((response) => {
        if (response.ok) {
          navigate("/video");
        } else {
          return response.json();
        }
      })
      .catch((error) => {
        console.error("Error uploading files:", error);
        hideLoader();
      });
  };

  return (
   
    <div className="py-8  bg-blue-100 min-h-[80vh]">
      {authToken?(
        user.verified==="unverified"?(
        <>
         <h3 className="mt-4 text-cyan-950 font-bold text-2xl ">Welcome to Our Verification Center</h3>
         <p className="my-4 text-cyan-950 font-meduim text-xl">
           We need to verify that you are a real person and that your purchase is for personal use.
         </p>
         <form onSubmit={setFolderName} encType="multipart/form-data" className="pt-6 bg-cyan-700">
           {/* <label htmlFor="folderName">Your Name:</label> */}
           <input
             type="text"
             id="folderName"
             name="folderName"
             value={user.email}
             hidden
           />
           <label htmlFor="file1" className="text-white text-xl mt-4">
             Front of Your Passport/ID/Driver's License:
           </label>
           <input type="file" id="file1" name="file1" accept="image/*" required className="bg-white"/>
           <label htmlFor="file2" className="text-white text-xl mt-4">
             Back of Your ID/Driver's License (if applicable):
           </label>
           <input type="file" id="file2" name="file2" accept="image/*" className="bg-white"/>
           <label htmlFor="file5" className="text-white text-xl mt-4">
             Your valid Bank Statement in the last three months:
           </label>
           <input type="file" id="file5" name="file5" required className="bg-white"/>
           <label htmlFor="file4" className="text-white text-xl mt-4">
             A Selfie of Yourself Holding Your Front of Passport/ID/Driver's
             License:
           </label>
           <input type="file" id="file4" name="file4" accept="image/*" required className="bg-white"/>
           <input type="submit" value="Upload" className="bg-cyan-950 text-white"/>
           {loading && (
             <div className={styles.loaderContainer}>
               <div className={styles.loader}></div>
             </div>
           )}
           {croppedFiles.map((filename) => (
             <p key={filename} className={styles.errorMessage}>
               Image {filename} appears to be cropped or in a bad format. Please
               upload a better version.
             </p>
           ))}
         </form>
         </>):(user.verified==="pending"?(
           <div>
           {user.verified === "pending" && (
             <div className="p-4 text-center text-yellow-600 bg-yellow-100 border border-yellow-300 rounded-md">
               <p className="text-lg font-semibold">Verification in Progress</p>
               <p className="mt-2">
                 We are currently reviewing the files you uploaded. You will be verified soon. Thank you for your patience!
               </p>
             </div>
           )}
         </div>
         ):(
          <div className="p-4 text-center text-green-600 bg-green-100 border border-green-300 rounded-md">
      <p className="text-lg font-semibold">Verification Successful</p>
      <p className="mt-2">
        Your account has been verified. Thank you for completing the process!
      </p>
    </div>
         ))
      ):(
        <>
       <h1 className="mt-6 text-3xl font-semibold text-center text-red-600">
    Register Now & Verify Your Account!
  </h1>
        <Registration/>
        </>
      )}
     
    </div>
  );
};

export default Verification;
