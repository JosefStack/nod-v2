interface Chat {
    id: string;
    name: string;
    avatar: string | null;
    lastMessage: string;
    time: string;
    unread: number;
    online: boolean;
    type: "direct" | "group";
}

interface Props {
    chat: Chat;
    isSelected: boolean;
    onClick: () => void;
}

const ChatListItem = ({ chat, isSelected, onClick }: Props) => {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 transition-all text-left border-l-2 ${
                isSelected
                    ? "bg-[#121316] border-violet-500"
                    : "border-transparent hover:bg-[#121316]/50"
            }`}
        >
            {/* avatar */}
            <div className="relative flex-shrink-0">
                <div className="w-11 h-11 rounded-full bg-[#24262a] flex items-center justify-center text-gray-400 font-bold overflow-hidden">
                    {chat.avatar ? (
                        <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" />
                    ) : chat.type === "group" ? (
                        <span className="text-lg">👥</span>
                    ) : (
                        <span>{chat.name[0].toUpperCase()}</span>
                    )}
                </div>
                {chat.online && chat.type === "direct" && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0d0e11]" />
                )}
            </div>

            {/* info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                    <span className={`text-sm font-bold truncate ${isSelected ? "text-white" : "text-gray-200"}`}>
                        {chat.name}
                    </span>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{chat.time}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 truncate">{chat.lastMessage}</span>
                    {chat.unread > 0 && (
                        <span className="flex-shrink-0 ml-2 w-5 h-5 rounded-full bg-violet-500 text-white text-[10px] font-bold flex items-center justify-center">
                            {chat.unread}
                        </span>
                    )}
                </div>
            </div>
        </button>
    );
};

export default ChatListItem;