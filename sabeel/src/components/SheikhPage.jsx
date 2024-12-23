import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
const SOCKET_SERVER_URL = 'https://deversecrypto.live';
import {Phone} from 'lucide-react'
const SheikhPage = ({username,handleLogout}) => {
  console.log(username,"megha")
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate=useNavigate();
  const [isCalling, setIsCalling] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callee,setCallee]=useState("");
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const peerConnection = useRef(null);
  const ringtone=useRef(null);
  const ringtoneTimeout=useRef(null);
  //handle call 
  const pcConfig = {
    iceServers: [
        {
            urls: 'stun:stun.deversecrypto.live:3478',
        },
        {
            urls: 'turn:turn.deversecrypto.live:3478',
            username: 'tanta',
            credential: 'tantawy58',
        },
    ],
};
const sdpConstraints = {
  offerToReceiveAudio: true,
  offerToReceiveVideo: true
};

  const videoConstraints = {
    video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 30, max: 60 },
        facingMode: 'user'
    },
    audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 48000,
        sampleSize: 16,
        latency: 0, 
        channelCount: 1
    }
};

  function call(name) {
    setIsCalling(true)
    setCallee(name);
    beReady(videoConstraints)
        .then(bool => {
            processCall(name, 'video')
        }
      )}
  function beReady(constrains) {
    return navigator.mediaDevices.getUserMedia(constrains)
        .then(stream => {
          localStreamRef.current.srcObject = stream;
          localStreamRef.current.autoplay = true;
          localStreamRef.current.muted = true;
            return createConnectionAndAddStream();
        })
        .catch(e => {
            console.log(e);
        });
}
function createConnectionAndAddStream() {
  createPeerConnection();
  peerConnection.current.addStream(localStreamRef.current);
  return true;
}
function createPeerConnection() {
  try {
      peerConnection = new RTCPeerConnection(pcConfig, {
          optional: [{ RtpDataChannels: false }],
      });
      peerConnection.current.onicecandidate = handleIceCandidate;
      peerConnection.current.onaddstream = handleRemoteStreamAdded;
      peerConnection.current.onremovestream = handleRemoteStreamRemoved;
      console.log('Created RTCPeerConnection');
  } catch (e) {
      console.error('Failed to create PeerConnection:', e);
  }
}
// window.onbeforeunload = function () {
//   if (callInProgress) {
//       stop();
//   }
// };
function handleRemoteStreamAdded(event) {
  remoteStream = event.stream;
  remoteVideo.srcObject = remoteStream;
  remoteVideo.autoplay = true;
}

function handleRemoteStreamRemoved(event) {
  remoteVideo.srcObject = null;
  localVideo.srcObject = null;
}
function handleIceCandidate(event) {
  if (event.candidate) {
      sendICEcandidate({
          user: callee,
          rtcMessage: {
              label: event.candidate.sdpMLineIndex,
              id: event.candidate.sdpMid,
              candidate: event.candidate.candidate
          }
      });
  } else {
      console.log('End of candidates.');
  }
}
function sendICEcandidate(data) {
  socket.emit("ICEcandidate", data);
}
function processCall(userName, callType) {
  peerConnection.current.createOffer().then((sessionDescription) => {
      sessionDescription.sdp = setMediaBitrates(sessionDescription.sdp);
      peerConnection.setLocalDescription(sessionDescription);
      sendCall({
          name: userName,
          rtcMessage: sessionDescription,
          type: callType
      });
  }).catch((error) => {
      console.error("Error creating offer:", error);
  });
}
function setMediaBitrates(sdp) {
  return sdp.replace(/(m=video.*\r\n)/g, '$1b=AS:2000\r\n')
      .replace(/(m=audio.*\r\n)/g, '$1b=AS:128\r\n');
}
function sendCall(data) {
  socket.emit("call", data);
  // document.getElementById("otherUserNameCA").innerHTML = otherUser;
  // document.getElementById("calling").style.display = "block";
  playRingtone();
}
function playRingtone() {
  ringtone = new Audio('ringtone.mp3');
  ringtone.current.loop = true;
  ringtone.current.play();

  ringtoneTimeout = setTimeout(() => {
      stopRingtone();
  }, 15000);
}
  function stopRingtone() {
    if (ringtone.current) {
        ringtone.current.pause();
        ringtone.current.currentTime = 0;
        ringtone.current=null
    }
    if (ringtoneTimeout.current) {
        clearTimeout(ringtoneTimeout.current);
        ringtoneTimeout.current=null
    }
}
  // Fetch students from the API
const fetchStudents = async () => {
  try {
    const response = await fetch(`${SOCKET_SERVER_URL}/connectedStudent`); 
    const data = await response.json();
    
    if (data.connectedUsers) {
      setStudents(data.connectedUsers);
    } else {
      setError("No students data found.");
    }
    
  } catch (error) {
    console.error("Error fetching students:", error);
    setError("Can't get students now!");
  } finally {
    setLoading(false); // Ensure loading is false after fetch
  }
};

// Fetch students on initial mount
useEffect(() => {
  const socket = io.connect(SOCKET_SERVER_URL, {
    query: {
        name: `Sheikh ${username}`,
    }
});
  fetchStudents();

  // Listen for changes in connected users
  socket.on('connectedUsersUpdated', (connectedUsers) => {
    setStudents(connectedUsers);
  });
  socket.on('ICEcandidate', data => {
    let message = data.rtcMessage;
    let candidate = new RTCIceCandidate({
        sdpMLineIndex: message.label,
        candidate: message.candidate
    });

    if (peerConnection) {
        peerConnection.addIceCandidate(candidate);
    } else {
        iceCandidatesFromCaller.push(candidate);
    }
});
  // Cleanup on unmount
  return () => {
    socket.off('connectedUsersUpdated');
    socket.disconnect();
  };
}, []);
  useEffect(() => {
    console.log("Students state updated:", students);
  }, [students]);
  return (
    <div className="bg-slate-50 min-h-screen flex justify-center items-center w-full h-full">
    <div className="bg-white flex w-full h-full divide-x-2 divide-slate-200">
      <button onClick={()=>{
        handleLogout();
      }}  className="fixed top-4 right-4 bg-red-500 text-white py-2 px-4 rounded shadow hover:bg-red-800 transition duration-200">تسجيل الخروج</button>
      {/* Left Call Section */}
      <aside className="bg-indigo-50 flex flex-col items-center p-6 w-1/2">
          <h2 className="text-2xl font-semibold text-indigo-900 mb-4">الاتصال</h2>
          <div className="bg-white/80 rounded-lg shadow-inner w-full h-full flex items-center justify-center">
            {isCalling || callAccepted ? (
              <div className="video-container">
                <video ref={localStreamRef} autoPlay playsInline muted className="local-video" />
                <video ref={remoteStreamRef} autoPlay playsInline className="remote-video" />
              </div>
            ) : (
              <p className="text-slate-600 text-lg">واجهة الاتصال هنا</p>
            )}
          </div>
        </aside>

      {/* Right Content Section */}
      <div className="flex-1 bg-white p-8 text-right rtl">
        {/* Greeting Message */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-semibold text-indigo-950 mb-4">
            أهلاً شيخنا الفاضل
          </h1>
          <p className="text-xl text-indigo-800">
          الطلاب الراغبين فى التسميع الان
          </p>
        </header>

        {/* Loading/Error Handling */}
        {loading && (
          <p className="text-center text-slate-500">جاري التحميل...</p>
        )}
        {error && (
          <p className="text-center text-red-600 text-xl">يوجد عطل بالسيرفر</p>
        )}

        {/* Students List */}
        {!loading && !error && (
          <section className="space-y-6">
            {students.length > 0 ? (
              students.map((student, index) => (
                <div
                  key={index}
                  className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:border-indigo-200"
                >
                  {/* Student Name */}
                  <h3 className="text-xl font-semibold text-slate-900 mb-2 text-right flex items-center justify-end gap-2">
                    <span>{student.name}</span>
                    <span className="text-slate-400 text-sm">: اسم الطالب</span>
                  </h3>

                  {/* Memorization Details */}
                  <p className="text-slate-600 text-md leading-relaxed text-right mb-6">
                    يريد التسميع من{' '}
                    <strong className="text-indigo-700">
                      {student.startSora} آية {student.startAya}
                    </strong>{' '}
                    إلى{' '}
                    <strong className="text-indigo-700">
                      {student.endSora} آية {student.endAya}
                    </strong>
                  </p>

                  {/* Call Button */}
                  <div className="w-full">
                    <button  onClick={()=>{
                      call(student.name)
                    }}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium shadow-sm hover:bg-indigo-700 transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center gap-2">
                      <Phone size={18} className="inline-block" />
                      <span>بدء الاتصال</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-500">
                لا يوجد طلاب متاحين الآن
              </p>
            )}
          </section>
        )}
      </div>
    </div>
  </div>

  
  
  );
};

export default SheikhPage;
