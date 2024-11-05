const UserList = ({ connectedUsers, onVideoCall, onVoiceCall }) => {
    return (
        <div className="connected-users">
            <h2>Connected Users</h2>
            <ul id="userList">
                {Object.keys(connectedUsers).map((id) => (
                    <li key={id} id={`user-${id}`} className="flex justify-between">
                        {connectedUsers[id]}
                        <div className="call-actions">
                            <button onClick={() => onVideoCall(id)} className="p-1">
                                <i className="fa fa-video"></i>
                            </button>
                            <button onClick={() => onVoiceCall(id)} className="p-1">
                                <i className="fa fa-phone"></i>
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
