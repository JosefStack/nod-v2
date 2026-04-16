import useWebRTC from "@/hooks/useWebRTC";
import { Phone, PhoneOff } from "lucide-react";

interface Props {
    webRTC: ReturnType<typeof useWebRTC>;
}

const IncomingCall = ({ webRTC }: Props) => {
    const { incomingCall, acceptCall, rejectCall, callState } = webRTC;

    if (callState !== "incoming" || !incomingCall) return null;

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.7)" }}>
            <div className="bg-[#121316] rounded-2xl p-8 flex flex-col items-center gap-6 border border-gray-800 w-80">

                {/* caller avatar */}
                <div className="w-20 h-20 rounded-full bg-[#24262a] overflow-hidden flex items-center justify-center text-3xl font-bold text-white">
                    {incomingCall.callerAvatar
                        ? <img src={incomingCall.callerAvatar} className="w-full h-full object-cover" />
                        : incomingCall.callerName?.[0]?.toUpperCase()
                    }
                </div>

                <div className="text-center">
                    <p className="text-white font-bold text-lg">{incomingCall.callerName}</p>
                    <p className="text-gray-400 text-sm">Incoming video call...</p>
                </div>

                <div className="flex gap-6">
                    <button
                        onClick={rejectCall}
                        className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition-all"
                    >
                        <PhoneOff size={22} />
                    </button>
                    <button
                        onClick={acceptCall}
                        className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center text-white transition-all"
                    >
                        <Phone size={22} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IncomingCall;