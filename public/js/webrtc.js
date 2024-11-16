const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const localVideo = document.createElement('video');
localVideo.muted = true; // Mute local video to avoid feedback

// WebRTC configuration with STUN servers
const configuration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' },
    ]
};

let localStream;
const peers = {};
let localPeerId;
let isAudioEnabled = true;
let isVideoEnabled = true;
let isScreenSharing = false;

// Get user media
async function setupMediaStream() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        addVideoStream(localVideo, localStream);

        localPeerId = generateUserId(); // Store local user ID
        socket.emit('join-room', ROOM_ID, localPeerId);

        socket.on('user-connected', (userId) => {
            console.log('New user connected:', userId);
            // Only initiate connection if our ID is greater (to avoid double connections)
            if (localPeerId > userId) {
                connectToNewUser(userId, localStream);
            }
            updateParticipantCount();
        });

        // Add error handling for peer connection
        socket.on('user-signal', async ({ userId, signal }) => {
            try {
                await handleUserSignal(userId, signal);
            } catch (error) {
                console.error('Error handling user signal:', error);
            }
        });
    } catch (error) {
        console.error('Error accessing media devices:', error);
        // Add user feedback for media access errors
        alert('Unable to access camera or microphone. Please check your permissions.');
    }
}
function connectToNewUser(userId, stream) {
    if (peers[userId]) {
        console.log('Peer connection already exists for:', userId);
        return;
    }

    console.log('Creating new peer connection for:', userId);
    const peer = new RTCPeerConnection(configuration);
    peers[userId] = peer;

    // Add connection state logging
    peer.onconnectionstatechange = () => {
        console.log(`Connection state for peer ${userId}:`, peer.connectionState);
    };

    peer.oniceconnectionstatechange = () => {
        console.log(`ICE connection state for peer ${userId}:`, peer.iceConnectionState);
    };

    stream.getTracks().forEach((track) => {
        console.log('Adding track to peer:', track.kind);
        peer.addTrack(track, stream);
    });

    // Improved error handling for peer connection
    try {
        peer.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('signal', {
                    userId: userId,
                    signal: { type: 'ice-candidate', candidate: event.candidate }
                });
            }
        };

        peer.ontrack = (event) => {
            console.log('Received remote track:', event.track.kind);
            const video = document.createElement('video');
            video.setAttribute('data-peer-id', userId);
            addVideoStream(video, event.streams[0]);
        };

        // Create and send offer with error handling
        peer.createOffer()
            .then(offer => peer.setLocalDescription(offer))
            .then(() => {
                socket.emit('signal', {
                    userId: userId,
                    signal: { type: 'offer', sdp: peer.localDescription }
                });
            })
            .catch(error => console.error('Error creating offer:', error));
    } catch (error) {
        console.error('Error in peer connection setup:', error);
    }
}
async function handleUserSignal(userId, signal) {
    try {
        let peer = peers[userId];
        
        // Create peer if it doesn't exist and we receive an offer
        if (!peer && signal.type === 'offer') {
            peer = new RTCPeerConnection(configuration);
            peers[userId] = peer;
            
            // Set up peer event handlers
            peer.ontrack = (event) => {
                const video = document.createElement('video');
                video.setAttribute('data-peer-id', userId);
                addVideoStream(video, event.streams[0]);
            };
            
            // Add local stream
            localStream.getTracks().forEach(track => peer.addTrack(track, localStream));
        }

        if (!peer) return;

        switch (signal.type) {
            case 'offer':
                await peer.setRemoteDescription(new RTCSessionDescription(signal.sdp));
                const answer = await peer.createAnswer();
                await peer.setLocalDescription(answer);
                socket.emit('signal', {
                    userId: userId,
                    signal: { type: 'answer', sdp: answer }
                });
                break;
                
            case 'answer':
                await peer.setRemoteDescription(new RTCSessionDescription(signal.sdp));
                break;
                
            case 'ice-candidate':
                if (peer.remoteDescription) {
                    await peer.addIceCandidate(new RTCIceCandidate(signal.candidate));
                }
                break;
        }
    } catch (error) {
        console.error('Error handling signal:', error);
    }
}

function addVideoStream(video, stream) {
    if (!stream) {
        console.error('No stream provided to addVideoStream');
        return;
    }

    try {
        video.srcObject = stream;
        video.addEventListener('loadedmetadata', () => {
            video.play().catch(error => {
                console.error('Error playing video:', error);
            });
        });
        
        // Add error handling for video playback
        video.onerror = (error) => {
            console.error('Video error:', error);
        };
        
        videoGrid.appendChild(video);
        updateParticipantCount();
    } catch (error) {
        console.error('Error adding video stream:', error);
    }
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
