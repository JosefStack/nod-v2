import useWebRTC from "@/hooks/useWebRTC"
import { useChatStore } from "@/store/useChatStore"
import { Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react"
import { useEffect, useRef } from "react"




interface Props {
    webRTC: ReturnType<typeof useWebRTC>
}

const CallWindow = ({ webRTC }: Props) => {

    const {
        callState,
        endCall,
        isMuted,
        isCameraOff,
        toggleMute,
        toggleCamera,
        localStream,
        remoteStream,
    } = webRTC

    const { activeChat } = useChatStore();

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    useEffect(() => {
        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    if (callState === "idle" || callState === "incoming") return null;

    return (
        <div className="fixed inset-0 z-40 bg-[#0d0e11] flex flex-col">

            <div className="flex-1 min-h-0 relative">

                <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                />
                


                {callState === "calling" && (
                    <div className="absolute z-50 inset-0 flex flex-col items-center justify-center bg-[#0d0e11]">
                        <div className="w-24 h-24 rounded-full bg-[#24262a] flex items-center justify-center text-4xl font-bold text-white 
                    overflow-hidden mb-4 ">
                            {activeChat?.avatar
                                ? <img src={activeChat.avatar} alt={activeChat.name} className="w-full h-full object-cover" />
                                : activeChat?.name?.[0].toUpperCase()
                            }
                        </div>
                        <p className="text-white font-bold text-xl">{activeChat?.name}</p>
                        <p className="text-gray-400 text-sm mt-2 animate-pulse">Calling...</p>
                    </div>
                )}

                <div className="absolute bottom-4 w-32 h-44  right-4 rounded-2xl overflow-hidden border-2 border-gray-700">
                    <video
                        ref={localVideoRef}
                        autoPlay
                        className="w-full h-full object-cover"
                        playsInline
                        muted
                    />
                </div>
            </div>

            {/* controls */}
            <div className="flex shrink-0 items-center justify-center gap-6 py-6 bg-[#121316]">
                <button
                    onClick={toggleMute}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all
                    ${isMuted
                            ? "bg-red-500 text-white"
                            : "bg-[#24262a] text-gray-300 hover:bg-[#2a2d31]"
                        }`}
                >
                    {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
                </button>

                <button
                    onClick={endCall}
                    className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition-all"
                >
                    <PhoneOff size={24} />
                </button>

                <button
                    onClick={toggleCamera}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all
                    ${isCameraOff
                            ? "bg-red-500 text-white"
                            : "bg-[#24262a] text-gray-300 hover:bg-[#2a2d31]"
                        }`}
                >
                    {isCameraOff ? <VideoOff size={18} /> : <Video size={18} />}
                </button>
            </div>
        </div>
    )
}

export default CallWindow
