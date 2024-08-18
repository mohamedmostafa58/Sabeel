import { useEffect, useRef } from "react";
import styles from "./Startinstructions.module.css";
import logo from "./logo.png";
const Startinstructions = ({ setstart }) => {
  const videoRef = useRef(null);
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.setAttribute("playsinline", true);
    }
  }, []);
  return (
    <div className="  flex  items-center flex-col gap-4  min-h-[100vh]">
      <video
        ref={videoRef}
        src="intro.mp4"
        className={styles.intro}
        autoPlay
        controls
      />
      <div className={` bg-cyan-600 ${styles.container} mb-4`}>
        <div >
          <h2 className="text-red-700 text-xl font-bold">CAPTURE A SHORT VIDEO:</h2>
        </div>
        <p className="text-white">
          please follow the on-screen instructions
          <span>
            If the camera fails to open, please grant permission for the browser
            to access the camera in the settings.
          </span>{" "}
          This activity will run for 25 seconds.
        </p>
        <button
          onClick={() => {
            setstart(true);
          }}
          className={`${styles.bttn} bg-cyan-950 text-white mt-2`}
        >
          Start
        </button>
      </div>
    </div>
  );
};

export default Startinstructions;
