const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const localVideo = document.createElement('video');
localVideo.muted = true; // Mute local video to avoid feedback

// WebRTC configuration with STUN servers
const configuration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
    ]
};

let localStream;
const peers = {};
let isAudioEnabled = true;
let isVideoEnabled = true;
let isScreenSharing = false;

// Get user media
async function setupMediaStream() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        addVideoStream(localVideo, localStream);

        const userId = generateUserId();
        socket.emit('join-room', ROOM_ID, userId);

       
        
        socket.on('user-connected', (userId) => {
            connectToNewUser(userId, localStream);
            updateParticipantCount();
        });

        socket.on('user-disconnected', (userId) => {
            if (peers[userId]) peers[userId].close();
            delete peers[userId];
            updateParticipantCount();
        });

        socket.on('existing-users', (users) => {
            users.forEach((userId) => connectToNewUser(userId, localStream));
            updateParticipantCount(users.length + 1); // +1 for current user
        });
        
        socket.on('user-signal', async ({ userId, signal }) => {
            handleUserSignal(userId, signal);
        });
    } catch (error) {
        console.error('Error accessing media devices:', error);
    }
}

function connectToNewUser(userId, stream) {
    const peer = new RTCPeerConnection(configuration);
    peers[userId] = peer;

    stream.getTracks().forEach((track) => peer.addTrack(track, stream));

    peer.onicecandidate = (event) => {
        if (event.candidate) {
            socket.emit('signal', {
                userId: userId,
                signal: { type: 'ice-candidate', candidate: event.candidate }
            });
        }
    };

    peer.ontrack = (event) => {
        const video = document.createElement('video');
        video.setAttribute('data-peer-id', userId);
        addVideoStream(video, event.streams[0]);
    };

    peer.createOffer().then((offer) => peer.setLocalDescription(offer)).then(() => {
        socket.emit('signal', { userId: userId, signal: { type: 'offer', sdp: peer.localDescription } });
    });
}

async function handleUserSignal(userId, signal) {
    const peer = peers[userId];
    if (!peer) return;

    if (signal.type === 'offer') {
        await peer.setRemoteDescription(new RTCSessionDescription(signal.sdp));
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        socket.emit('signal', { userId: userId, signal: { type: 'answer', sdp: answer } });
    } else if (signal.type === 'answer') {
        await peer.setRemoteDescription(new RTCSessionDescription(signal.sdp));
    } else if (signal.type === 'ice-candidate') {
        await peer.addIceCandidate(new RTCIceCandidate(signal.candidate));
    }
}

function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => video.play());
    videoGrid.appendChild(video);
    updateParticipantCount();
}

function toggleAudio() {
    isAudioEnabled = !isAudioEnabled;
    localStream.getAudioTracks().forEach((track) => (track.enabled = isAudioEnabled));
    updateButtons();
}

function toggleVideo() {
    isVideoEnabled = !isVideoEnabled;
    localStream.getVideoTracks().forEach((track) => (track.enabled = isVideoEnabled));
    updateButtons();
}

function toggleScreenShare() {
    if (!isScreenSharing) {
        navigator.mediaDevices.getDisplayMedia({ video: true }).then((screenStream) => {
            const screenTrack = screenStream.getVideoTracks()[0];
            replaceTrack(screenTrack);
            screenTrack.onended = () => toggleScreenShare(); // Stop sharing when track ends
            isScreenSharing = true;
            updateButtons();
        });
    } else {
        const videoTrack = localStream.getVideoTracks()[0];
        replaceTrack(videoTrack);
        isScreenSharing = false;
        updateButtons();
    }
}

function replaceTrack(newTrack) {
    Object.values(peers).forEach((peer) => {
        const sender = peer.getSenders().find((s) => s.track.kind === newTrack.kind);
        if (sender) sender.replaceTrack(newTrack);
    });
}

function leaveMeeting() {
    Object.values(peers).forEach((peer) => peer.close());
    socket.emit('leave-room', ROOM_ID);
    window.location.href = '/';
}

function generateUserId() {
    return Math.random().toString(36).substring(2, 15);
}

function updateParticipantCount(count = Object.keys(peers).length + 1) {
    document.getElementById('participantCount').innerText = `${count} Participants`;
}

function updateButtons() {
    document.getElementById('audioBtn').classList.toggle('btn-danger', !isAudioEnabled);
    document.getElementById('videoBtn').classList.toggle('btn-danger', !isVideoEnabled);
    document.getElementById('screenBtn').classList.toggle('btn-danger', isScreenSharing);
}

// Initialize media stream on load
setupMediaStream();
