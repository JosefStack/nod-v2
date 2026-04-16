import { getSocket } from "@/lib/socket";
import { useAuthStore } from "@/store/useAuthStore";
import { useCallback, useEffect, useRef, useState } from "react";




const ICE_SERVERS = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
    ],
};


export type CallState = "idle" | "connected" | "calling" | "failed";

interface IncomingCallData {
    callerId: string;
    callerName: string;
    callerAvatar: string;
    offer: RTCSessionDescription;
}


const useWebRTC = () => {

    const socket = getSocket();
    const { user } = useAuthStore();


    const [callState, setCallState] = useState<CallState>("idle");
    const [incomingCall, setIncomingCall] = useState<IncomingCallData | null>(null);
    const [activeCallUserId, setActiveCallUserId] = useState<string | null>(null);
    const [isMuted, setIsMuted] = useState<boolean>(false);
    const [isCameraOff, setIsCameraOff] = useState<boolean>(false);


    const pcRef = useRef<RTCPeerConnection | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);


    const cleanup = useCallback(() => {
        localStreamRef.current?.getTracks().forEach(track => track.stop());
        localStreamRef.current = null;

        pcRef.current?.close();
        pcRef.current = null;

        if (localVideoRef.current) localVideoRef.current.srcObject = null;
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;


        setCallState("idle");
        setActiveCallUserId(null);
        setIncomingCall(null);
        setIsMuted(false);
        setIsCameraOff(false);

    }, [])

    const getLocalStream = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        });


        localStreamRef.current = stream;

        if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
        }

        return stream;
    }, []);


    const createPeerConnection = useCallback((targetUserId: string) => {
        const pc = new RTCPeerConnection(ICE_SERVERS);

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket?.emit("ice_candidate", {
                    targetUserId,
                    candidate: event.candidate
                })
            };
        };

        pc.ontrack = (event) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
            };
        };

        pc.onconnectionstatechange = () => {
            console.log("Connection state: ", pc.connectionState)

            if (pc.connectionState === "connected") {
                setCallState("connected");
            };

            if (pc.connectionState === "disconnected" ||
                pc.connectionState === "failed" ||
                pc.connectionState === "closed"
            ) {
                cleanup();
            }
        }

        pcRef.current = pc;
        return pc;
    }, [socket, cleanup]);


    const addLocalTracks = useCallback((pc: RTCPeerConnection, stream: MediaStream) => {
        stream.getTracks().forEach(track => {
            pc.addTrack(track, stream);
        })
    }, []);


    const startCall = useCallback(async (targetUserId: string) => {

        if (!socket) return;

        try {
            setCallState("calling");
            setActiveCallUserId(targetUserId);

            const stream = await getLocalStream();

            const pc = createPeerConnection(targetUserId);

            addLocalTracks(pc, stream);

            const offer = await pc.createOffer();

            await pc.setLocalDescription(offer);

            socket.emit("call_user", { targetUserId, offer });

        } catch (err) {
            console.error("Failed to start call: ", err);
            cleanup();
        }


    }, [socket, getLocalStream, createPeerConnection, addLocalTracks, cleanup]);


    const acceptCall = useCallback(async () => {

        if (!socket || !incomingCall) return;

        try {
            setCallState("connected");
            setActiveCallUserId(incomingCall.callerId);

            const stream = await getLocalStream();

            const pc = createPeerConnection(incomingCall.callerId);

            addLocalTracks(pc, stream);

            await pc.setRemoteDescription(
                new RTCSessionDescription(incomingCall.offer)
            );

            const answer = await pc.createAnswer();

            await pc.setLocalDescription(answer);

            socket.emit("call_accepted", {
                targetUserId: incomingCall.callerId,
                answer,
            })

        } catch (err) {
            console.error("Faile to accept call: ", err);
            cleanup();
        };

    }, [socket, cleanup, createPeerConnection, addLocalTracks, getLocalStream]);


    const rejectCall = useCallback(() => {

        if (!socket || !incomingCall) return;

        socket.emit("call_rejected", {
            targetUserId: incomingCall.callerId
        });
        setIncomingCall(null);
        setCallState("idle");

    }, [socket, incomingCall]);


    const endCall = useCallback(() => {
        
        if (!socket || !activeCallUserId) return;

        socket.emit("call_ended", {
            targetUserId: activeCallUserId
        });

        cleanup();

    }, [socket, activeCallUserId, cleanup])


    const toggleMute = useCallback(() => {

        if (!localStreamRef.current) return;
        localStreamRef.current.getAudioTracks().forEach(track => {
            track.enabled = !track.enabled;
        });
        
        setIsMuted(prev => !prev);

    }, []);


    const toggleCamera = useCallback(() => {
        
        if (!localStreamRef.current) return;
        localStreamRef.current.getVideoTracks().forEach(track => {
            track.enabled = !track.enabled;
        });

        setIsCameraOff(prev => !prev);

    }, []);


    
    // socket event listeners

    useEffect(() => {

    });



};


export default useWebRTC;