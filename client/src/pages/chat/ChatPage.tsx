import ChatWindow from "@/components/chat/ChatWindow";
import RoomWindow from "@/components/chat/RoomWindow";
import Sidebar from "@/components/chat/Sidebar";
// import { useAuthStore } from "@/store/useAuthStore"
import { useChatStore } from "@/store/useChatStore"
import type { Chat } from "@/types/chat";
import { useEffect, useState } from "react";


type Tab = "chats" | "rooms"

const ChatPage = () => {

    // const { user } = useAuthStore();
    const { fetchChats, setActiveChat, activeChat,  } = useChatStore();
    // const { message } = useChatStore();
    const [activeTab, setActiveTab] = useState<Tab>("chats");
    const [isMobileChatOpen, setIsMobileChatOpen] = useState<boolean>(false);

    useEffect(() => {
        fetchChats();
    }, []);

    const handleSelectChat = (chat: Chat) => {
        setActiveChat(chat);
        setIsMobileChatOpen(true);
    };

    const handleBack = () => {
        setActiveChat(null);
        setIsMobileChatOpen(false);
    }



    return (
        <div className="flex h-screen w-screen bg-[#0d0e11] overflow-hidden">

            {/* sidebar */}
            <div className={`
                ${isMobileChatOpen ? "hidden" : "flex"}
                flex-col
                lg:flex
                w-full lg:w-72 xl:w-80
                border-r border-gray-800/50
            `}>
                <Sidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    onSelectChat={handleSelectChat}
                />
            </div>

            {/* main */}
            <div className={`
                ${isMobileChatOpen ? "flex" : "hidden"}
                lg:flex
                flex-col flex-1 min-w-0
            `}>
                {activeTab === "chats" && activeChat ? (
                    <ChatWindow onBack={handleBack}/>
                ) : activeTab === "rooms" ? (
                    <RoomWindow />
                ) :
                    (
                        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
                            <div className="w-20 h-20 rounded-full bg-violet-500/10 flex items-center justify-center mb-4 text-4xl">
                                💬
                            </div>
                            <h3 className="text-white font-bold text-xl mb-2">Select a converstaion</h3>
                            <p className="text-gray-500 text-sm">Choose from your existing chats or start a new one</p>
                        </div>
                    )
                }
            </div>

        </div >
    )
}

export default ChatPage
