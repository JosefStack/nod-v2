import { useState } from "react";
import Sidebar from "./components/sidebar/Sidebar";
import ChatWindow from "./components/chat/ChatWindow";
import RoomsPage from "./components/rooms/RoomsPage";

type Tab = "chats" | "rooms";

const ChatPage = () => {
    const [activeTab, setActiveTab] = useState<Tab>("chats");
    const [selectedChatId, setSelectedChatId] = useState<string | null>("1");
    const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

    const handleSelectChat = (id: string) => {
        setSelectedChatId(id);
        setIsMobileChatOpen(true);
    };

    const handleBack = () => {
        setIsMobileChatOpen(false);
    };

    return (
        <div className="flex h-screen w-screen bg-[#0d0e11] overflow-hidden">

            {/* SIDEBAR — always visible on desktop, hidden on mobile when chat is open */}
            <div className={`
                ${isMobileChatOpen ? "hidden" : "flex"} 
                lg:flex
                w-full lg:w-72 xl:w-80
                flex-shrink-0
                flex-col
                border-r border-gray-800/50
            `}>
                <Sidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    selectedChatId={selectedChatId}
                    onSelectChat={handleSelectChat}
                />
            </div>

            {/* MAIN AREA */}
            <div className={`
                ${!isMobileChatOpen ? "hidden" : "flex"}
                lg:flex
                flex-1
                flex-col
                min-w-0
            `}>
                {activeTab === "chats" && selectedChatId ? (
                    <ChatWindow
                        chatId={selectedChatId}
                        onBack={handleBack}
                    />
                ) : activeTab === "rooms" ? (
                    <RoomsPage />
                ) : (
                    // empty state on desktop when no chat selected
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 rounded-full bg-violet-500/10 flex items-center justify-center mb-4 text-4xl">
                            💬
                        </div>
                        <h3 className="text-white font-bold text-xl mb-2">Select a conversation</h3>
                        <p className="text-gray-500 text-sm">Choose from your existing chats or start a new one</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;