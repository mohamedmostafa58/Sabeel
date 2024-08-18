import React, { useEffect, useState } from "react";

const Payment = ({ pay }) => {
  const [paymentLink, setPaymentLink] = useState(null);
  const [paid, setPaid] = useState(pay > 0);
  useEffect(() => {
    const verifyPayment = async () => {
      if (pay > 0) {
        try {
          const response = await fetch(
            `https://deversecrypto.live/usdtpayment/${pay}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json", // Ensure sending JSON
              },
            }
          );

          if (!response.ok) {
            console.log("error");
          } else {
            const responseData = await response.json(); // Parse the response data

            const link = responseData.paymentLink; // Extract the payment link
            setPaymentLink(link);
          }

          // Update state with the extracted link
        } catch (error) {
          console.log("Error during verification:", error); // Error handling
        }
      }
    };

    verifyPayment(); // Trigger the POST request
  }, [pay]); // Dependency array ensures useEffect runs when 'pay' changes

  return (
    <>
      {paymentLink ? (
        <div className="w-[100vw] h-[100vh] flex items-center justify-center flex-col gap-3">
          <a
            href={paymentLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-[250px] h-[50px] bg-red-950 text-white font-semibold text-xl flex justify-center items-center text-center rounded-[7px]"
          >
            proced to payment
          </a>
          <div className="my-4 text-center ">
            {" "}
            We will soon verify your identity. you can now proceed to make a
            payment.{" "}
          </div>
        </div>
      ) : paid ? (
        <div className="w-[100vw] h-[100vh] flex items-center justify-center ">
          <div className="w-[250px] h-[50px] bg-red-950 text-white font-semibold text-xl flex justify-center items-center text-center rounded-[7px]">
            uploading...
          </div>
        </div>
      ) : (
        <div className="w-[100vw] h-[100vh] flex items-center justify-center ">
          <div className="w-[250px] h-[50px] bg-red-950 text-white font-semibold text-xl flex justify-center items-center text-center rounded-[7px]">
            Thanks for Verification
          </div>
        </div>
      )}
    </>
  );
};

export default Payment;
