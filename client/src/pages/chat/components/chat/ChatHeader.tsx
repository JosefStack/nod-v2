import { Phone, Video, Info, ArrowLeft } from "lucide-react";
import { mockChats } from "../../../../lib/mockData";

interface Props {
    chatId: string;
    onBack: () => void;
}

const ChatHeader = ({ chatId, onBack }: Props) => {
    const chat = mockChats.find((c) => c.id === chatId);
    if (!chat) return null;

    return (
        <div className="flex items-center justify-between px-4 lg:px-6 py-4 border-b border-gray-800/50 bg-[#0d0e11]">
            <div className="flex items-center gap-3">
                {/* back button — mobile only */}
                <button
                    onClick={onBack}
                    className="lg:hidden p-1.5 text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>

                {/* avatar */}
                <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-[#24262a] flex items-center justify-center text-gray-400 font-bold overflow-hidden">
                        {chat.avatar ? (
                            <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" />
                        ) : (
                            <span>{chat.name[0].toUpperCase()}</span>
                        )}
                    </div>
                    {chat.online && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#0d0e11]" />
                    )}
                </div>

                {/* name + status */}
                <div>
                    <p className="text-white font-bold text-sm leading-tight">{chat.name}</p>
                    <p className="text-xs text-green-500">
                        {chat.online ? "Online" : "Offline"}
                    </p>
                </div>
            </div>

            {/* actions */}
            <div className="flex items-center gap-1">
                <button className="p-2.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all">
                    <Phone size={18} />
                </button>
                <button className="p-2.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all">
                    <Video size={18} />
                </button>
                <button className="p-2.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all">
                    <Info size={18} />
                </button>
            </div>
        </div>
    );
};

export default ChatHeader;