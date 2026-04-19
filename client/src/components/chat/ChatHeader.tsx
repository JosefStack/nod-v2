import { useChatStore } from "@/store/useChatStore";
import { ArrowLeft, Info, Phone, Video } from "lucide-react";



interface Props {
  onBack: () => void;
  onCall: () => void;
}

const ChatHeader = ({ onBack, onCall }: Props) => {

  const { activeChat, onlineUsers } = useChatStore();
  if (!activeChat) return null;

  const isOnline = activeChat.type === "direct" && !!activeChat.otherUserId && onlineUsers.includes(activeChat.otherUserId);

  return (
    <div className="flex items-center justify-between px-4 lg:px-5 py-4 border-b border-gray-800/50 bg-[#0d0e11] shrink-0">
      <div className="flex items-center gap-3">
        {/* close chat button */}
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white  transition-all">
          <ArrowLeft size={21} />
        </button>

        {/* avatar */}
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-[#24262a] flex items-center justify-center text-gray-400 font-bold overflow-hidden text-sm">
            {activeChat.avatar
              ? <img src={activeChat.avatar} alt={activeChat.name} className="w-full h-full object-cover" />
              : activeChat.type === "group"
                ? <span>👥</span>
                : <span>{activeChat.name[0]?.toUpperCase()}</span>
            }
          </div>
        </div>

        {/* name */}
        <div>
          <p className="font-bold text-white text-xs leading-tight">
            {activeChat.name ? activeChat.name : "?"}
          </p>
          {activeChat.type === "direct" &&
            <p className="font-bold text-gray-500 text-xs leading-tight">
              @{activeChat.username ? activeChat.username : "?"}
            </p>
          }
        </div>

        {/* online/offline */}
        {activeChat.type === "direct" &&
          <span className={`text-xs ${isOnline ? "text-green-500" : "text-red-500"}`}>
            {isOnline ? "online" : "offline"}
          </span>
        }
      </div>

      {/* actions -> call, video call, info */}

      <div className="flex items-center gap-1">
        {/* <button className="p-2.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all">
          <Phone size={17} />
        </button> */}
        <button
          onClick={onCall}
          className="p-2.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all">
          <Video size={17} />
        </button>

        <button className="p-2.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all">
          <Info size={17} />
        </button>
      </div>
    </div >


  )
}

export default ChatHeader;