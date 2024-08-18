import html2canvas from "html2canvas";
import React, { useEffect, useRef, useState } from "react";
import Instructions from "../Instructions";
import Loader from "../Loader";
// import Payment from "../Payment";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Video.module.css";
import { fetchUserByToken } from "../../redux/authSlice";
const Video = () => {
  //variablessetFacestep
  const [facestep, setFacestep] = useState(-1);

  const [stream, setStream] = useState(null);
  const [start, setStart] = useState(false);
  const [startRecord, setStartRecord] = useState(false);
  const [isrecording, setIsrecording] = useState(false);
  const [supported, setSupported] = useState(true);
  const [done, setDone] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [eror, setEror] = useState(false);
  const videoRef = useRef(null);
  const intervalRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);
  const { authToken, user } = useSelector((state) => state.auth);
  const dispatch=useDispatch();
  //convert data to url
  const dataURLtoBlob = (dataURL) => {
    const byteString = atob(dataURL.split(",")[1]);
    const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };
  //serverImageServer
  const sendImageToServer = (file) => {
    setStart(false);
    const formData = new FormData();
    formData.append("image", file);
    fetch(`/api/auth/detect-faces/${facestep}`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.hasFace) {
          setFacestep((facestep) => (facestep < 3 ? facestep + 1 : facestep));
          setStart(true);
        } else {
          setStart(true);
        }
      })
      .catch((error) => {
        setStart(true);
      });
  };
  //start video function
  const startVideo = async () => {
    let userMedia;
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        userMedia = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { max: 640 },
            height: { max: 640 },
            facingMode: "user",
          },
          audio: {
            echoCancellation: true,
          },
        });
      } else if (navigator.getUserMedia) {
        userMedia = await new Promise((resolve, reject) => {
          navigator.getUserMedia(
            {
              video: {
                mandatory: {
                  maxWidth: 640,
                  maxHeight: 480,
                },
              },
              audio: true,
            },
            resolve,
            reject
          );
        });
      } else {
        navigator.getMedia =
          navigator.getUserMedia ||
          navigator.webkitGetUserMedia ||
          navigator.mozGetUserMedia ||
          navigator.msGetUserMedia;
        userMedia = await navigator.getMedia({
          video: {
            width: { max: 640 },
            height: { max: 480 },
          },
          audio: {
            echoCancellation: true,
          },
        });
      }

      if (videoRef.current) {
        videoRef.current.srcObject = userMedia;
        videoRef.current.setAttribute("playsinline", true);
        setStartRecord(true);
      } else {
        setSupported(false);
      }
      setStream(userMedia);
      setStart(true);
    } catch (e) {
      setSupported(false);
    }
  };
  //catpture frame function
  const captureFrame = () => {
    if (facestep < 3) {
      html2canvas(document.getElementById("container"), {
        imageSmoothingEnabled: true,
      }).then((canvas) => {
        const imageDataURL = canvas.toDataURL("image/png");
        const blob = dataURLtoBlob(imageDataURL);
        const file = new File([blob], "captured-image.png", {
          type: "image/png",
        });
        sendImageToServer(file);
      });
    } else {
      return;
    }
  };
  // Start video when component mounts
  useEffect(() => {
    startVideo();
  }, []);
  //capture and detect
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (start && facestep < 3 && facestep !== -1) {
        captureFrame();
      }
    }, 500);

    return () => clearInterval(intervalRef.current);
  }, [start, facestep]);
  //clearinterval after verify
  useEffect(() => {
    if (facestep > 3) {
      clearInterval(intervalRef.current);
    }
  }, [facestep]);
  //record the video
  //record helper functions
  const stopRecording = async () => {
    if (mediaRecorderRef.current) {
      const stopPromise = new Promise((resolve) => {
        mediaRecorderRef.current.addEventListener("stop", resolve);
      });

      mediaRecorderRef.current.stop();

      await stopPromise;

      mediaRecorderRef.current.removeEventListener(
        "dataavailable",
        handleDataAvailable
      );
    }
    setIsrecording(false);
    setStartRecord(false);
  };

  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      recordedChunks.current = [...recordedChunks.current, event.data];
      setDone(true);
    }
  };
  useEffect(() => {
    if (startRecord && !isrecording) {
      setIsrecording(true);
      if (videoRef.current) {
        let mimeType;

        if (MediaRecorder.isTypeSupported("video/mp4")) {
          mimeType = "video/mp4";
        } else if (MediaRecorder.isTypeSupported("video/webm")) {
          mimeType = "video/webm";
        } else {
          console.error("No supported video format found");
          return;
        }

        mediaRecorderRef.current = new MediaRecorder(
          videoRef.current.srcObject,
          {
            mimeType: mimeType,
          }
        );
        mediaRecorderRef.current.addEventListener(
          "dataavailable",
          handleDataAvailable
        );
        mediaRecorderRef.current.start();
      }

      const timeout = setTimeout(() => {
        stopRecording();
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
        videoRef.current = null;
      }, 25000);
      const variableTimeout = setTimeout(() => {
        setFacestep(0);
      }, 8000);
      // settimeoutid(timeout);
    }
  }, [startRecord, isrecording, stream]);
  //-send data
  useEffect(() => {
    if (done && recordedChunks.current.length > 0) {
      const sendData = () => {
        let mimeType;
        let fileExtension;

        if (MediaRecorder.isTypeSupported("video/mp4")) {
          mimeType = "video/mp4";
          fileExtension = ".mp4";
        } else if (MediaRecorder.isTypeSupported("video/webm")) {
          mimeType = "video/webm";
          fileExtension = ".webm";
        } else {
          console.error("No supported video format found");
          return;
        }

        const recordedBlob = new Blob(recordedChunks.current, {
          type: mimeType,
        });
        const fileName = "video" + fileExtension;
        const urlParams = new URLSearchParams(window.location.search);
        let folderName = user.email.split("@")[0];
        if (!folderName) {
          folderName = "default";
        }

        const formData = new FormData();
        formData.append("folderName", folderName);
        formData.append("video", recordedBlob, fileName);
        fetch("/api/auth/save-video", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${authToken}`, 
          },
          body: formData,
        })
          .then(function (response) {
            if (response.ok) {
              setUploaded(true);
              dispatch(fetchUserByToken(authToken));
            } else {
              setEror(true);
              console.error(
                "Failed to send video. Server returned status:",
                response.status
              );
            }
          })
          .catch(function (error) {
            console.error("Error sending video:", error);
            setEror(true);
          });
      };
      sendData();
    }
  }, [done]);
  if (supported) {
    if (done && eror) {
      return (
        <div className="w-[100vw] h-[100vh] flex items-center justify-center ">
          <div className=" w-[250px] h-[70px] bg-red-950 text-white text-xl flex justify-center items-center text-center font-semibold">
            Error Uploading Your Video please Try Again
          </div>
        </div>
      );
    } else if (done && uploaded) {
      return <div className="p-4 text-center text-yellow-600 bg-yellow-100 border border-yellow-300 rounded-md">
      <p className="text-lg font-semibold">Verification in Progress</p>
      <p className="mt-2">
        We are currently reviewing the files you uploaded. You will be verified soon. Thank you for your patience!
      </p>
    </div>;
    } else if (done && !uploaded) {
      return <Loader />;
    }
    return (
      <div className="flex justify-center items-center gap-6 flex-col w-[100vw] h-[100vh]  ">
        <video
          ref={videoRef}
          autoPlay
          className={styles.video}
          id="container"
        />
        <Instructions facestep={facestep} setFacestep={setFacestep} />
      </div>
    );
  } else {
    return (
      <div className="w-[100vw] h-[100vh] flex items-center justify-center ">
        <div className=" text-red-950 text-2xl font-semibold flex justify-center items-center px-2 text-center">
          Please grant permission for the browser to access your camera and
          microphone.
        </div>
      </div>
    );
  }
};

export default Video;
