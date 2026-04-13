import { useChatStore } from "@/store/useChatStore";
import type { Chat } from "@/types/chat";


const formatTime = (dateStr?: string | null) => {
    if (!dateStr) return " ";

    const date = new Date(dateStr);
    const now = new Date();

    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if ((diffDays) === 0) return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if ((diffDays) === 1) return "Yesterday";
    if ((diffDays) < 7) return date.toLocaleDateString([], { weekday: "short" });
    return date.toLocaleTimeString([], { month: "short", day: "numeric" });

}



interface Props {
    chat: Chat;
    onSelectChat: (chat: Chat) => void;
    isSelected: boolean;
}

const ChatListItem = ({ chat, onSelectChat, isSelected }: Props) => {
    const { onlineUsers } = useChatStore();
    const isOnline = chat.type === "direct" && !!chat.otherUserId && onlineUsers.includes(chat.otherUserId);

    return (
        <button
            onClick={() => onSelectChat(chat)}
            className={`
                w-full flex items-center gap-3 px-4 py-3 transition-all text-left border-l-2
                ${isSelected ?
                    "bg-[#121316] border-violet-500" :
                    "border-transparent hover:bg-[#121316]/60"
                }
            `}
        >

            {/* avatar */}
            <div className="relative shrink-0">
                <div className="w-11 h-11 rounded-full bg-[#24262a] flex items-center justify-center 
            text-gray-400 font-bold overflow-hidden text-sm">
                    {
                        chat.avatar ?
                            <img src={chat.avatar} alt={chat.name ? chat.name : chat.username as string} className="w-full h-full object-cover" /> :
                            chat.type === "group" ?
                                <span className="text-lg">👥</span> :
                                <span>{chat.name ? chat.name[0].toUpperCase() : "?"}</span>
                    }
                </div>
                {/* onlne/offline */}
                {chat.type === "direct" && 
                    <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#0d0e11]
                    ${isOnline ? "bg-green-500" : "bg-zinc-500"}`}
                    />
                }
            </div>

            {/* info */}
            <div className="flex-1 min-w-0">
                {/* top -> name and last received time */}
                <div className="flex items-center justify-between mb-0.5">
                    <span className={`text-sm font-bold truncate ${isSelected ? "text-white" : "text-gray-200"}`}>
                        {chat.name}
                    </span>
                    <span className="text-[11px] text-gray-500 shrink-0 ml-2">
                        {formatTime(chat.lastMessage?.createdAt)}
                    </span>
                </div>

                {/* bottom -> last message preview? and unread count? */}
                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 truncate">
                        {
                            chat.lastMessage?.sender && chat.type === "group" ?
                                `${chat.lastMessage.sender}: ${chat.lastMessage.preview || ""}` :
                                chat.lastMessage?.preview || "No messages yet"
                        }
                    </span>
                    {
                        chat.unreadCount > 0 && (
                            <span className="shrink-0 ml-2 min-w-5 h-5 px-1 rounded-full bg-violet-500
                            text-white text-[10px] font-bold flex items-center justify-center">
                                {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                            </span>
                        )
                    }
                </div>
            </div>

        </button>
    )
}

export default ChatListItem
