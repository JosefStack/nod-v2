import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import ChatList from "./ChatList";
import RoomsList from "./RoomsList";
import UserSearchModal from "../modals/UserSearchModal";
import CreateGroupModal from "../modals/CreateGroupModal";
import { Settings, HelpCircle, MessageSquarePlus, Users } from "lucide-react";

type Tab = "chats" | "rooms";

interface Props {
    activeTab: Tab;
    setActiveTab: (tab: Tab) => void;
    selectedChatId: string | null;
    onSelectChat: (id: string) => void;
}

const Sidebar = ({ activeTab, setActiveTab, selectedChatId, onSelectChat }: Props) => {
    const { user } = useAuthStore();
    const [showUserSearch, setShowUserSearch] = useState(false);
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [search, setSearch] = useState("");

    return (
        <div className="flex flex-col h-full bg-[#0d0e11]">

            {/* TOP — user info + tabs */}
            <div className="px-4 pt-5 pb-3 border-b border-gray-800/50">
                {/* user row */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-[#24262a] overflow-hidden">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-lg">
                                        {user?.username?.[0]?.toUpperCase() || "?"}
                                    </div>
                                )}
                            </div>
                            {/* online dot */}
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0d0e11]" />
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm leading-tight">{user?.username || "You"}</p>
                            <p className="text-green-500 text-xs">ONLINE</p>
                        </div>
                    </div>
                    {/* settings + help */}
                    <div className="flex items-center gap-1">
                        <button className="p-2 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-gray-800">
                            <Settings size={16} />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-gray-800">
                            <HelpCircle size={16} />
                        </button>
                    </div>
                </div>

                {/* tabs */}
                <div className="flex gap-1 bg-[#121316] rounded-xl p-1">
                    <button
                        onClick={() => setActiveTab("chats")}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                            activeTab === "chats"
                                ? "bg-[#24262a] text-white"
                                : "text-gray-500 hover:text-gray-300"
                        }`}
                    >
                        Chats
                    </button>
                    <button
                        onClick={() => setActiveTab("rooms")}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                            activeTab === "rooms"
                                ? "bg-[#24262a] text-white"
                                : "text-gray-500 hover:text-gray-300"
                        }`}
                    >
                        Rooms
                    </button>
                </div>
            </div>

            {/* SEARCH */}
            <div className="px-4 py-3">
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                        </svg>
                    </span>
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search conversations..."
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#121316] text-white text-sm placeholder:text-gray-600 border-none outline-none focus:ring-1 focus:ring-violet-500/30"
                    />
                </div>
            </div>

            {/* ACTION BUTTONS — only on chats tab */}
            {activeTab === "chats" && (
                <div className="px-4 pb-3 flex gap-2">
                    <button
                        onClick={() => setShowUserSearch(true)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#121316] text-gray-400 hover:text-white hover:bg-[#1e2023] transition-all text-sm font-medium"
                    >
                        <MessageSquarePlus size={15} />
                        <span>Add User</span>
                    </button>
                    <button
                        onClick={() => setShowCreateGroup(true)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#121316] text-gray-400 hover:text-white hover:bg-[#1e2023] transition-all text-sm font-medium"
                    >
                        <Users size={15} />
                        <span>New Group</span>
                    </button>
                </div>
            )}

            {/* LIST */}
            <div className="flex-1 overflow-y-auto">
                {activeTab === "chats" ? (
                    <ChatList
                        search={search}
                        selectedChatId={selectedChatId}
                        onSelectChat={onSelectChat}
                    />
                ) : (
                    <RoomsList />
                )}
            </div>

            {/* MODALS */}
            {showUserSearch && <UserSearchModal onClose={() => setShowUserSearch(false)} />}
            {showCreateGroup && <CreateGroupModal onClose={() => setShowCreateGroup(false)} />}
        </div>
    );
};

export default Sidebar;