import useWebRTC from "@/hooks/useWebRTC";
import { PhoneOff, Mic, MicOff, Video, VideoOff } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";

interface Props {
    webRTC: ReturnType<typeof useWebRTC>;
}

const CallWindow = ({ webRTC }: Props) => {
    const {
        callState,
        localVideoRef,
        remoteVideoRef,
        isMuted,
        isCameraOff,
        toggleMute,
        toggleCamera,
        endCall,
    } = webRTC;

    const { activeChat } = useChatStore();

    if (callState === "idle" || callState === "incoming") return null;

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 40 }} className="bg-[#0d0e11] flex flex-col">

            {/* remote video — fills screen */}
            <div className="flex-1 relative">
                <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                />

                {/* waiting for answer */}
                {callState === "calling" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0d0e11]">
                        <div className="w-24 h-24 rounded-full bg-[#24262a] flex items-center justify-center text-4xl font-bold text-white overflow-hidden mb-4">
                            {activeChat?.avatar
                                ? <img src={activeChat.avatar} className="w-full h-full object-cover" />
                                : activeChat?.name?.[0]?.toUpperCase()
                            }
                        </div>
                        <p className="text-white font-bold text-xl">{activeChat?.name}</p>
                        <p className="text-gray-400 text-sm mt-2 animate-pulse">Calling...</p>
                    </div>
                )}

                {/* your face — picture in picture */}
                <div className="absolute bottom-4 right-4 w-32 h-44 rounded-2xl overflow-hidden border-2 border-gray-700 shadow-2xl">
                    <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover mirror"
                    />
                </div>
            </div>

            {/* controls */}
            <div className="flex items-center justify-center gap-6 py-6 bg-[#121316]">
                <button
                    onClick={toggleMute}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all
                        ${isMuted ? "bg-red-500 text-white" : "bg-[#24262a] text-gray-300 hover:bg-[#2a2d31]"}`}
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
                        ${isCameraOff ? "bg-red-500 text-white" : "bg-[#24262a] text-gray-300 hover:bg-[#2a2d31]"}`}
                >
                    {isCameraOff ? <VideoOff size={18} /> : <Video size={18} />}
                </button>
            </div>
        </div>
    );
};

export default CallWindow;