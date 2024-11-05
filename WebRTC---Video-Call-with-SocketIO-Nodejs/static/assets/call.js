'use strict';

const baseURL = "/";

let localVideo = document.querySelector('#localVideo');
let remoteVideo = document.querySelector('#remoteVideo');

let otherUser;
let remoteRTCMessage;

let iceCandidatesFromCaller = [];
let peerConnection;
let remoteStream;
let localStream;

let callInProgress = false;
let ringtone;
let ringtoneTimeout;
let connectedUsers = {};
let myId;
function videoCall(id) {
    let userToCall = document.getElementById(id).textContent;
    otherUser = userToCall;

    beReady(videoConstraints)
        .then(bool => {
            processCall(userToCall,'video')
        })
}
function voiceCall(id) {
    let userToCall = document.getElementById(id).textContent;
    otherUser = userToCall;

    beReady(voiceConstraints)
        .then(bool => {
            processCall(userToCall,'voice')
        })
}
function answerVoice() {
    console.log("voice")
    stopRingtone();

    beReady(voiceConstraints)
        .then(bool => {
            processAccept();
        })

    document.getElementById("answer").style.display = "none";
    document.getElementById("answerVoice").style.display = "none";
}
function answerVideo() {
    stopRingtone();

    beReady(videoConstraints)
        .then(bool => {
            processAccept();
        })

    document.getElementById("answer").style.display = "none";
    document.getElementById("answerVideo").style.display = "none";

}


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
        sampleSize: 16
    }
};
const voiceConstraints={
    video:false,
    audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 48000,
        sampleSize: 16
    }
}
let pcConfig = {
    iceServers:  [
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

let sdpConstraints = {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true
};

let socket;
function connectSocket() {
    socket = io.connect(baseURL, {
        query: {
            name: myName,
            startSora:"البقرة",
            startAya:130,
            endSora:"البقرة",
            endAya:150

        }
    });
    socket.on('newCall', data => {
        otherUser = data.caller;
        remoteRTCMessage = data.rtcMessage;
        document.getElementById("callerName").innerHTML = otherUser;
        // document.getElementById("call").style.display = "none";
        document.getElementById("answer").style.display = "block"
        data.callType=="voice"?(document.getElementById("answerVoice").style.display = "block"):
        (document.getElementById("answerVideo").style.display = "block");
        playRingtone();
    });
    socket.on('callEnded', data => {
        console.log("Call ended by", data.from);
        endCall();
    });

    socket.on('callAnswered', data => {
        remoteRTCMessage = data.rtcMessage;
        peerConnection.setRemoteDescription(new RTCSessionDescription(remoteRTCMessage));

        document.getElementById("calling").style.display = "none";

        callProgress();
        stopRingtone();
    });
    socket.on('user_connected', (data) => {
        myId=socket.id;
        connectedUsers[data.id] = data.name;
        updateUserList();
    });

    socket.on('user_disconnected', (userId) => {
        console.log("disconected")
        delete connectedUsers[userId]
        updateUserList();
    });

    socket.on('all_users', (users) => {
        myId=socket.id;
        connectedUsers = users;
        updateUserList();
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
}
function updateUserList() {
    const userList = document.getElementById('userList');
    userList.innerHTML = '';
    delete connectedUsers[ myId];
    for (let id in connectedUsers) {
        console.log( connectedUsers[id])
        const li = document.createElement('li');
        li.textContent = connectedUsers[id];
        li.id = `user-${id}`;
        // Add call buttons for each user
        const callActions = document.createElement('div');
        callActions.classList.add('call-actions');

        const videoCallBtn = document.createElement('button');
        videoCallBtn.innerHTML = '<i class="fa fa-video"></i>';
        videoCallBtn.onclick = () => {
            videoCall(li.id);
        };

        const voiceCallBtn = document.createElement('button');
        voiceCallBtn.innerHTML = '<i class="fa fa-phone"></i>';
        voiceCallBtn.onclick = () => {
            voiceCall(li.id);
        };

        callActions.appendChild(videoCallBtn);
        callActions.appendChild(voiceCallBtn);
        li.appendChild(callActions);

        userList.appendChild(li);
    }
}

function sendCall(data) {
    socket.emit("call", data);

    // document.getElementById("call").style.display = "none";
    document.getElementById("otherUserNameCA").innerHTML = otherUser;
    document.getElementById("calling").style.display = "block";
    playRingtone();
}

function answerCall(data) {
    socket.emit("answerCall", data);
    callProgress();
}

function sendICEcandidate(data) {
    socket.emit("ICEcandidate", data);
}

function beReady(constrains) {
    return navigator.mediaDevices.getUserMedia(constrains)
        .then(stream => {
            localStream = stream;
            
            localVideo.srcObject = stream;
            localVideo.autoplay = true;
            localVideo.muted = true;
            localVideo.style.transform = 'scaleX(-1)';
            return createConnectionAndAddStream();
        })
        .catch(e => {
            alert('getUserMedia() error: ' + e.name);
        });
}

function createConnectionAndAddStream() {
    createPeerConnection();
    peerConnection.addStream(localStream);
    return true;
}

function processCall(userName,callType) {
    console.log(callType)
    peerConnection.createOffer().then((sessionDescription) => {
        sessionDescription.sdp = setMediaBitrates(sessionDescription.sdp);
        peerConnection.setLocalDescription(sessionDescription);
        sendCall({
            name: userName,
            rtcMessage: sessionDescription,
            type:callType
        });
    }).catch((error) => {
        console.error("Error creating offer:", error);
    });
}

function processAccept() {
    peerConnection.setRemoteDescription(new RTCSessionDescription(remoteRTCMessage));
    peerConnection.createAnswer().then((sessionDescription) => {
        sessionDescription.sdp = setMediaBitrates(sessionDescription.sdp);
        peerConnection.setLocalDescription(sessionDescription);

        if (iceCandidatesFromCaller.length > 0) {
            iceCandidatesFromCaller.forEach(candidate => {
                peerConnection.addIceCandidate(candidate).catch(error => {
                    console.error(error);
                });
            });
            iceCandidatesFromCaller = [];
        }

        answerCall({
            caller: otherUser,
            rtcMessage: sessionDescription
        });

    }).catch(error => {
        console.error("Error creating answer:", error);
    });
}

function createPeerConnection() {
    try {
        peerConnection = new RTCPeerConnection(pcConfig, {
            optional: [{ RtpDataChannels: false }],
        });

        peerConnection.onicecandidate = handleIceCandidate;
        peerConnection.onaddstream = handleRemoteStreamAdded;
        peerConnection.onremovestream = handleRemoteStreamRemoved;

        console.log('Created RTCPeerConnection');
    } catch (e) {
        console.error('Failed to create PeerConnection:', e);
        alert('Cannot create RTCPeerConnection object.');
    }
}

function handleIceCandidate(event) {
    if (event.candidate) {
        sendICEcandidate({
            user: otherUser,
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

function handleRemoteStreamAdded(event) {
    remoteStream = event.stream;
    remoteVideo.srcObject = remoteStream;
    remoteVideo.autoplay = true;
}

function handleRemoteStreamRemoved(event) {
    remoteVideo.srcObject = null;
    localVideo.srcObject = null;
}

window.onbeforeunload = function () {
    if (callInProgress) {
        stop();
    }
};

function stop() {
    localStream.getTracks().forEach(track => track.stop());
    callInProgress = false;
    peerConnection.close();
    peerConnection = null;
    if (otherUser) {
        socket.emit('endCall', { otherUser: otherUser });
    }
    resetUI();
    stopRingtone();
}
function endCall() {
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
    }
    callInProgress = false;
    if (peerConnection) {
        peerConnection.close();
    }
    peerConnection = null;
    resetUI();
    stopRingtone();
}
function resetUI() {
    // document.getElementById("call").style.display = "block";
    document.getElementById("answer").style.display = "none";
    document.getElementById("answerVideo").style.display = "none";
    document.getElementById("answerVoice").style.display = "none";
    document.getElementById("inCall").style.display = "none";
    document.getElementById("calling").style.display = "none";
    document.getElementById("endVideoButton").style.display = "none";
    document.getElementById("videos").style.display = "none";
    otherUser = null;
}

function callProgress() {
    document.getElementById("videos").style.display = "block";
    document.getElementById("otherUserNameC").innerHTML = otherUser;
    document.getElementById("inCall").style.display = "block";
    document.getElementById("endVideoButton").style.display = "inline-block";
    callInProgress = true;
}

function setMediaBitrates(sdp) {
    return sdp.replace(/(m=video.*\r\n)/g, '$1b=AS:2000\r\n')
              .replace(/(m=audio.*\r\n)/g, '$1b=AS:128\r\n');
}

function playRingtone() {
    ringtone = new Audio('/assets/ringtone.mp3');
    ringtone.loop = true;
    ringtone.play();
    
    ringtoneTimeout = setTimeout(() => {
        stopRingtone();
        resetUI();
    }, 45000);
}

function stopRingtone() {
    if (ringtone) {
        ringtone.pause();
        ringtone.currentTime = 0;
    }
    if (ringtoneTimeout) {
        clearTimeout(ringtoneTimeout);
    }
}

function toggleAudio() {
    if (localStream) {
        const audioTrack = localStream.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            document.getElementById("toggleAudio").innerText = audioTrack.enabled ? "Mute" : "Unmute";
        }
    }
}

function toggleVideo() {
    if (localStream) {
        const videoTrack = localStream.getVideoTracks()[0];
        if (videoTrack) {
            videoTrack.enabled = !videoTrack.enabled;
            document.getElementById("toggleVideo").innerText = videoTrack.enabled ? "Turn Off Video" : "Turn On Video";
        }
    }
}