import { useEffect, useRef } from 'react';

const VideoCall = ({ localVideoRef, remoteVideoRef }) => {
    return (
        <div className="videos">
            <div className="local-video">
                <video ref={localVideoRef} autoPlay muted playsInline className="border" />
            </div>
            <div className="remote-video">
                <video ref={remoteVideoRef} autoPlay playsInline className="border" />
            </div>
        </div>
    );
};

export default VideoCall;
