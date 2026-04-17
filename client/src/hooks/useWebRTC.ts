import { getSocket } from "@/lib/socket";
import { useCallback, useEffect, useRef, useState } from "react";




const ICE_SERVERS = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        {
            urls: "turn:openrelay.metered.ca:80",
            username: "openrelayproject",
            credential: "openrelayproject",
        },
        {
            urls: "turn:openrelay.metered.ca:443",
            username: "openrelayproject",
            credential: "openrelayproject",
        },
        {
            urls: "turn:openrelay.metered.ca:443?transport=tcp",
            username: "openrelayproject",
            credential: "openrelayproject",
        },
    ],
};


export type CallState = "idle" | "connected" | "calling" | "failed" | "incoming";

interface IncomingCallData {
    callerId: string;
    callerName: string;
    callerAvatar: string;
    offer: RTCSessionDescription;
}


const useWebRTC = () => {

    const socket = getSocket();



    const [callState, setCallState] = useState<CallState>("idle");
    const [incomingCall, setIncomingCall] = useState<IncomingCallData | null>(null);
    const [activeCallUserId, setActiveCallUserId] = useState<string | null>(null);
    const [isMuted, setIsMuted] = useState<boolean>(false);
    const [isCameraOff, setIsCameraOff] = useState<boolean>(false);


    const pcRef = useRef<RTCPeerConnection | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

    const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);



    const cleanup = useCallback(() => {

        console.log("cleanup() triggered");

        pendingCandidatesRef.current = []

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

        console.log("getLocalStream() triggered");



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

        console.log("createPeerConnection() triggered");

        const pc = new RTCPeerConnection(ICE_SERVERS);

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                console.log("ICE candidate found:", event.candidate.type);

                socket?.emit("ice_candidate", {
                    targetUserId,
                    candidate: event.candidate
                })
            } else {
                console.log("ICE gathering complete");

            };
        };

        pc.ontrack = (event) => {
            console.log("ontrack fired!", event.streams);

            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
                console.log("remote stream set");

            } else {
                console.log("ontrack fired!", event.streams);
            };
        };

        pc.onconnectionstatechange = () => {
            console.log("Connection state: ", pc.connectionState)

            if (pc.connectionState === "connected") {
                setCallState("connected");
            };

            if (pc.connectionState === "failed" ||
                pc.connectionState === "closed"
            ) {
                cleanup();
            }
        };

        pcRef.current = pc;
        return pc;
    }, [socket, cleanup]);


    const addLocalTracks = useCallback((pc: RTCPeerConnection, stream: MediaStream) => {
        console.log("addLocalTracks() triggered...");

        stream.getTracks().forEach(track => {
            pc.addTrack(track, stream);
        })
    }, []);


    const startCall = useCallback(async (targetUserId: string) => {

        console.log("startCall() triggered");

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

        console.log("acceptCall() triggered...");

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

            for (const candidate of pendingCandidatesRef.current) {
                try {
                    await pc.addIceCandidate(new RTCIceCandidate(candidate));
                    console.log("Added buffered candidate");
                } catch (err) {
                    console.error("Failed to add buffered candidate:", err);
                }
            }
            pendingCandidatesRef.current = [];

            const answer = await pc.createAnswer();

            await pc.setLocalDescription(answer);

            socket.emit("call_accepted", {
                targetUserId: incomingCall.callerId,
                answer,
            })

        } catch (err) {
            console.error("Failed to accept call: ", err);
            cleanup();
        };

    }, [socket, cleanup, createPeerConnection, addLocalTracks, getLocalStream, incomingCall]);


    const rejectCall = useCallback(() => {

        console.log("rejectCall() triggered");

        if (!socket || !incomingCall) return;

        socket.emit("call_rejected", {
            targetUserId: incomingCall.callerId
        });
        setIncomingCall(null);
        setCallState("idle");

    }, [socket, incomingCall]);


    const endCall = useCallback(() => {
        console.log("endCall() triggered");

        if (!socket || !activeCallUserId) return;

        socket.emit("call_ended", {
            targetUserId: activeCallUserId
        });

        cleanup();

    }, [socket, activeCallUserId, cleanup])


    const toggleMute = useCallback(() => {
        console.log("toggleMute() triggered...");

        if (!localStreamRef.current) return;
        localStreamRef.current.getAudioTracks().forEach(track => {
            track.enabled = !track.enabled;
        });

        setIsMuted(prev => !prev);

    }, []);


    const toggleCamera = useCallback(() => {
        console.log("toggleCamera() triggered...");

        if (!localStreamRef.current) return;
        localStreamRef.current.getVideoTracks().forEach(track => {
            track.enabled = !track.enabled;
        });

        setIsCameraOff(prev => !prev);

    }, []);



    // socket event listeners, add listeners again if socket changes. 

    useEffect(() => {

        if (!socket) return;

        socket.on("incoming_call", (data: IncomingCallData) => {
            setIncomingCall(data);
            setCallState("incoming");
        });

        socket.on("call_accepted", async ({ answer }: { answer: RTCSessionDescription }) => {
            if (!pcRef.current) return;
            await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer));

            for (const candidate of pendingCandidatesRef.current) {
                try {
                    await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                } catch (err) {
                    console.error("Failed to add buffered candidate:", err);
                }
            }
            pendingCandidatesRef.current = []
        });

        socket.on("call_rejected", () => {
            cleanup();
        });

        socket.on("call_ended", () => {
            cleanup();
        });

        socket.on("ice_candidate", async ({ candidate }) => {
            if (!pcRef.current) {
                pendingCandidatesRef.current.push(candidate);
                return;
            };
            try {
                pcRef.current.addIceCandidate(new RTCIceCandidate(candidate))
            } catch (err) {
                console.error("Failed to add ICE candidate: ", err);
            }
        });

        socket.on("call_failed", ({ reason }) => {
            console.error("Call failed: ", reason);
            cleanup();
        }
        );

        return () => {
            socket.off("incoming_call");
            socket.off("call_accepted");
            socket.off("call_rejected");
            socket.off("call_ended");
            socket.off("ice_candidate");
            socket.off("call_failed");
        }

    }, [socket, cleanup]);


    return {
        callState,
        incomingCall,
        isMuted,
        isCameraOff,
        localVideoRef,
        remoteVideoRef,
        startCall,
        acceptCall,
        rejectCall,
        endCall,
        toggleMute,
        toggleCamera,
    };

};


export default useWebRTC;