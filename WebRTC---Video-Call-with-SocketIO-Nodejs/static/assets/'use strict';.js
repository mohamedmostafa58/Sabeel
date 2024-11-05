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
let ringtone = new Audio('/assets/ringtone.mp3');
let callTimeout;

const videoConstraints = {
    video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 30, max: 60 },
        facingMode: 'user'
    },
    audio: true,
};

const voiceConstraints = {
    video: false,
    audio: true
};

let pcConfig = {
    iceServers: [
        {
          urls: "stun:stun.relay.metered.ca:80",
        },
        {
          urls: "turn:global.relay.metered.ca:80",
          username: "98e1c18b80f4bb76bd78c072",
          credential: "4C+h9dXbUtIx2PbX",
        },
        {
          urls: "turn:global.relay.metered.ca:80?transport=tcp",
          username: "98e1c18b80f4bb76bd78c072",
          credential: "4C+h9dXbUtIx2PbX",
        },
        {
          urls: "turn:global.relay.metered.ca:443",
          username: "98e1c18b80f4bb76bd78c072",
          credential: "4C+h9dXbUtIx2PbX",
        },
        {
          urls: "turns:global.relay.metered.ca:443?transport=tcp",
          username: "98e1c18b80f4bb76bd78c072",
          credential: "4C+h9dXbUtIx2PbX",
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
            name: myName
        }
    });

    socket.on('newCall', data => {
        otherUser = data.caller;
        remoteRTCMessage = data.rtcMessage;
        const callType = data.callType;

        document.getElementById("callerName").innerHTML = otherUser;
        document.getElementById("call").style.display = "none";
        document.getElementById("answer").style.display = "block";
        ringtone.play();

        if (callType === 'voice') {
            document.getElementById("answerVoice").style.display = "block";
            document.getElementById("answerVideo").style.display = "none";
        } else if (callType === 'video') {
            document.getElementById("answerVoice").style.display = "none";
            document.getElementById("answerVideo").style.display = "block";
        }

        callTimeout = setTimeout(() => {
            stopCall();
            resetUI();
        }, 45000);
    });

    socket.on('callAnswered', data => {
        console.log("call answerede")
        remoteRTCMessage = data.rtcMessage;
        peerConnection.setRemoteDescription(new RTCSessionDescription(remoteRTCMessage));
        document.getElementById("calling").style.display = "none";
        callProgress();
    });

    socket.on('ICEcandidate', data => {
        let message = data.rtcMessage;        console.log(data);

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

function startVoiceCall() {
    otherUser = document.getElementById("callName").value;
    beReady(voiceConstraints)
        .then(() => processCall(otherUser, 'voice'));
}

function startVideoCall() {
    otherUser = document.getElementById("callName").value;
    beReady(videoConstraints)
        .then(() => processCall(otherUser, 'video'));
}
function answerVoiceCall() {
    clearTimeout(callTimeout);
    ringtone.pause();

    beReady(voiceConstraints)
        .then(() => processAccept());

    document.getElementById("answer").style.display = "none";
}
function answerVideoCall() {
    clearTimeout(callTimeout);
    ringtone.pause();

    beReady(videoConstraints)
        .then(() => processAccept());

    document.getElementById("answer").style.display = "none";
}

async function beReady(constraints) {
    return navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            localStream = stream;
                localVideo.srcObject = stream;
                localVideo.autoplay = true;
                localVideo.muted = true;
            
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

function processCall(userName, callType) {
    peerConnection.createOffer().then(sessionDescription => {
        sessionDescription.sdp = setMediaBitrates(sessionDescription.sdp);
        peerConnection.setLocalDescription(sessionDescription);
        sendCall({
            name: userName,
            rtcMessage: sessionDescription,
            type: callType
        });

        document.getElementById("call").style.display = "none";
        document.getElementById("otherUserNameCA").innerHTML = otherUser;
        document.getElementById("calling").style.display = "block";
    }).catch(error => {
        console.error("Error creating offer:", error);
    });
}

function sendCall(data) {
    socket.emit("call", data);
}

function processAccept() {
    peerConnection.setRemoteDescription(new RTCSessionDescription(remoteRTCMessage));
    peerConnection.createAnswer().then(sessionDescription => {
        sessionDescription.sdp = setMediaBitrates(sessionDescription.sdp);
        peerConnection.setLocalDescription(sessionDescription);
        console.log("hello from process")
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

function answerCall(data) {
    socket.emit("answerCall", data);
    callProgress();
}

function stopCall() {
    clearTimeout(callTimeout);
    if (localStream) localStream.getTracks().forEach(track => track.stop());
    if (peerConnection) peerConnection.close();
    peerConnection = null;
    resetUI();
    callInProgress = false;
}

function resetUI() {
    document.getElementById("call").style.display = "block";
    document.getElementById("answer").style.display = "none";
    document.getElementById("inCall").style.display = "none";
    document.getElementById("calling").style.display = "none";
    document.getElementById("videos").style.display = "none";
    document.getElementById("localVideo").srcObject = null;
    document.getElementById("remoteVideo").srcObject = null;
    ringtone.pause();
}

function callProgress() {
    document.getElementById("videos").style.display = "block";
    document.getElementById("otherUserNameC").innerHTML = otherUser;
    document.getElementById("inCall").style.display = "block";
    callInProgress = true;
}

function setMediaBitrates(sdp) {
    return sdp.replace(/(m=video.*\r\n)/g, '$1b=AS:1000\r\n')
              .replace(/(m=audio.*\r\n)/g, '$1b=AS:64\r\n');
}

function createPeerConnection() {
    try {
        peerConnection = new RTCPeerConnection(pcConfig, {
            optional: [{ RtpDataChannels: false }]
        });
        peerConnection.onicecandidate = handleIceCandidate;
        peerConnection.onaddstream = handleRemoteStreamAdded;
        peerConnection.onremovestream = handleRemoteStreamRemoved;
    } catch (e) {
        console.error("Failed to create PeerConnection: " + e.message);
        return;
    }
}

function handleIceCandidate(event) {
    if (event.candidate) {
        sendICE({
            rtcMessage: {
                type: 'candidate',
                label: event.candidate.sdpMLineIndex,
                id: event.candidate.sdpMid,
                candidate: event.candidate.candidate
            }
        });
    }
}

function sendICE(data) {
    socket.emit("ICEcandidate", data);
}

function handleRemoteStreamAdded(event) {
    console.log(event.stream)
    remoteStream = event.stream;
    remoteVideo.srcObject = remoteStream;
    remoteVideo.autoplay = true;
}

function handleRemoteStreamRemoved() {
    remoteVideo.srcObject = null;
}
//////////////////////////

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="/assets/logo.png" type="image/png" />
    <title>Voice & Video Call</title>
    <link rel="stylesheet" href="/assets/call.css">

    <script src='/socket.io/socket.io.js'></script>
    <style>
        body {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding-top: 24px;
            min-height: 90vh;
        }

        .dialWrapper {
            margin-top: 20px;
        }

        .dialActionButton {
            width: 100px;
            padding: 10px;
            margin: 5px;
            font-size: medium;
            cursor: pointer;
        }

        .itemWrapper {
            margin-bottom: 20px;
        }

        video {
            width: 500px;
        }

        #videos video {
            width: 300px;
            margin: 10px;
        }

        #localVideo {
            position: absolute;
            top: 0;
            right: 0;
            width: 150px;
            padding: 20px;
        }
    </style>

    <script>
        let myName; // Store the user's name
    </script>
</head>

<body>
    <div>
        <div>
            <!-- Input username and login -->
            <div id="userName">
                <div style="display: flex; flex-direction: column; align-items: center; width: 300px;">
                    <input placeholder="What should we call you?" style="text-align:center; height: 50px; font-size: xx-large;" type="text" id="userNameInput">
                    <div style="height: 5px;"></div>
                    <button onclick="login()" class="actionButton">Login</button>
                </div>
            </div>

            <!-- Display logged-in user information -->
            <div id="userInfo">
                <div style="display: flex; flex-direction: column; align-items: center; width: 300px;">
                    <h1>Hello, <span id="nameHere"></span></h1>
                </div>
            </div>

            <!-- Call options: Voice and Video -->
            <div id="call" style="display: none;">
                <div class="dialWrapper">
                    <input placeholder="Whom to call?" style="text-align:center; height: 50px; font-size: xx-large;" type="text" id="callName">
                    <div class="dialNumpadHWrapper">
                        <div class="dialNumber">
                            <button class="dialActionButton" onclick="startVoiceCall()">Voice Call</button>
                        </div>
                        <div class="dialNumber">
                            <button class="dialActionButton" onclick="startVideoCall()">Video Call</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Incoming call section -->
            <div id="answer" style="display: none;">
                <div class="incomingWrapper">
                    <div class="itemWrapper">
                        <h2>Incoming Call from <span id="callerName"></span></h2>
                    </div>
                    <div class="itemWrapper">
                        <img id="profileImageA" style="padding: 30px; width: 140px; height: 140px;" src="/assets/profile.png" alt="">
                    </div>
                    <div class="itemWrapper">
                        <h2 style="line-height: 0px;">This is a <span id="callTypeDisplay"></span> call</h2>
                    </div>
                    <div class="itemWrapper" style="display: flex; flex-direction: row;">
                        <button id="answerVoice" class="actionButton" onclick="answerVoiceCall()" style="display: none;">Answer Voice Call</button>
                        <button id="answerVideo" class="actionButton" onclick="answerVideoCall()" style="display: none;">Answer Video Call</button>
                    </div>
                </div>
            </div>

            <!-- Outgoing call section -->
            <div id="calling" style="display: none;">
                <div class="incomingWrapper">
                    <div class="itemWrapper">
                        <h2>Calling</h2>
                    </div>
                    <div class="itemWrapper">
                        <img id="profileImageCA" style="padding: 30px; width: 140px; height: 140px;" src="/assets/profile.png" alt="">
                    </div>
                    <div class="itemWrapper">
                        <h3 style="line-height: 0px;"><span id="otherUserNameCA"></span></h3>
                    </div>
                </div>
            </div>

            <!-- In-progress call section -->
            <div id="inCall" style="display: none;">
                <div class="incomingWrapper">
                    <div class="itemWrapper">
                        <h3>On Call With</h3>
                        <h2 style="line-height: 0px;"><span id="otherUserNameC"></span></h2>
                    </div>
                    <button class="actionButton" onclick="stopCall()">Stop Call</button>
                </div>
            </div>

            <br>

            <!-- Local and remote video elements -->
            <div id="videos" style="display: none;">
                <div id="localVideoWrapper">
                    <video id="localVideo" autoplay muted playsinline></video>
                </div>
                <div id="remoteVideoDiv">
                    <video id="remoteVideo" autoplay playsinline></video>
                </div>
            </div>
        </div>
    </div>

    <script src="/assets/call.js"></script>

    <script>
        // Initial page setup - hide sections until needed
        document.getElementById("userInfo").style.display = "none";
        document.getElementById("answer").style.display = "none";
        document.getElementById("inCall").style.display = "none";
        document.getElementById("calling").style.display = "none";
        document.getElementById("videos").style.display = "none";

        // Login function
        function login() {
            let userName = document.getElementById("userNameInput").value;
            myName = userName;
            document.getElementById("userName").style.display = "none";
            document.getElementById("call").style.display = "block";

            document.getElementById("nameHere").innerHTML = userName;
            document.getElementById("userInfo").style.display = "block";

            connectSocket(); // Initialize socket connection
        }

        // Additional functions for call handling should be defined in call.js
    </script>
</body>

</html>










[
        {
          urls: "stun:stun.relay.metered.ca:80",
        },
        {
          urls: "turn:global.relay.metered.ca:80",
          username: "98e1c18b80f4bb76bd78c072",
          credential: "4C+h9dXbUtIx2PbX",
        },
        {
          urls: "turn:global.relay.metered.ca:80?transport=tcp",
          username: "98e1c18b80f4bb76bd78c072",
          credential: "4C+h9dXbUtIx2PbX",
        },
        {
          urls: "turn:global.relay.metered.ca:443",
          username: "98e1c18b80f4bb76bd78c072",
          credential: "4C+h9dXbUtIx2PbX",
        },
        {
          urls: "turns:global.relay.metered.ca:443?transport=tcp",
          username: "98e1c18b80f4bb76bd78c072",
          credential: "4C+h9dXbUtIx2PbX",
        },
    ]