const CallControls = ({ onEndCall, onToggleAudio, onToggleVideo }) => {
    return (
        <div className="call-controls">
            <button onClick={onEndCall} className="p-2">End Call</button>
            <button onClick={onToggleAudio} className="p-2">Mute</button>
            <button onClick={onToggleVideo} className="p-2">Turn Off Video</button>
        </div>
    );
};

export default CallControls;
