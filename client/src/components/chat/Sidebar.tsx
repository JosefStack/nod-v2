import { useAuthStore } from "@/store/useAuthStore";
import type { Chat } from "@/types/chat";
import { LogOut, MessageSquarePlus, Settings, Users } from "lucide-react";
import { useState } from "react";

// for in development features
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import ChatList from "./ChatList";
import UserSearchModal from "../modals/UserSearchModal";
import CreateGroupModal from "../modals/CreateGroupModal";
import { div } from "three/src/nodes/math/OperatorNode.js";


type Tab = "rooms" | "chats";
interface Props {
    activeTab: Tab;
    setActiveTab: (tab: Tab) => void;
    onSelectChat: (chat: Chat) => void;
}

const Sidebar = ({ activeTab, setActiveTab, onSelectChat }: Props) => {

    const { user, logout } = useAuthStore();
    // const [showUserSearch, setShowUserSearch] = useState<boolean>(false);
    // const [showCreateGroup, setShowCreateGroup] = useState<boolean>(false);
    const [search, setSearch] = useState("")
    const [showUserSearch, setShowUserSearch] = useState(false);
    const [showCreateGroup, setShowCreateGroup] = useState(false);

    if (activeTab === "rooms") return (
        <div className="flex items-center justify-center">
            coming soon
        </div>
    )

    return (
        <div className="flex flex-col h-full bg-[#0d0e11]">

            {showUserSearch &&
                <UserSearchModal
                    onSelectChat={onSelectChat}
                    onClose={() => setShowUserSearch(false)}
                />
            }

            {showCreateGroup &&
                <CreateGroupModal
                    onSelectChat={onSelectChat}
                    onClose={() => setShowCreateGroup(false)}
                />
            }




            {/* user header */}
            <div className="px-4 pt-5 pb-3 border-b border-gray-800/50">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-[#24262a] overflow-hidden flex items-center justify-center text-gray-400 font-bold">
                                {user?.avatar
                                    ? <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                                    : user?.name?.[0]?.toUpperCase() || "?"
                                }
                            </div>
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0d0e11]" />
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm">{user?.name || "You"}</p>
                            <p className="text-gray-400 text-xs">@{user?.username}</p>
                        </div>
                    </div>
                    {/* settings and help -- to be implemented -- hover-card for showing {in development} progress*/}
                    <div className="flex gap-1">
                        <HoverCard>
                            <HoverCardTrigger>
                                <button className="p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                                    <Settings size={15} />
                                </button>
                            </HoverCardTrigger>
                            <HoverCardContent side={"bottom"} className="w-40 h-10 flex items-center justify-center bg-[#272727] text-white">In development!</HoverCardContent>
                        </HoverCard>


                        <button
                            onClick={logout}
                            className="p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                            <LogOut size={15} />
                        </button>

                    </div>
                </div>
            </div>


            {/* tab switch */}
            <div className="flex gap-1 bg-[#121316] rounded-xl p-1">
                {
                    (["chats", "rooms"] as Tab[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => { setActiveTab(tab) }}
                            className={`
                                flex-1 py-2 rounded-lg text-sm font-bold capitalize transition-all 
                                ${activeTab === tab
                                    ? "bg-[#24262a] text-white"
                                    : "text-gray-500 hover:text-gray-300"
                                }
                        `}
                        >
                            {tab}
                        </button>
                    ))
                }
            </div>


            {/* search */}
            <div className="px-4 py-3">
                <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                    </svg>
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search conversation..."
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#121316] text-white text-sm placeholder:text-gray-600 outline-none focus:ring-1 focus:ring-violet-500/30"

                    />

                </div>
            </div>

            {/* action buttons -> add user ... create group */}
            {activeTab === "chats" && (
                <div className="px-4 pb-3 flex gap-2">
                    <button
                        onClick={() => setShowUserSearch(true)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#121316]
                                text-gray-400 hover:bg-[#1e2023] transition-all text-sm font-medium"
                    >
                        <MessageSquarePlus size={15} />
                        <span>Add user</span>
                    </button>
                    <button
                        onClick={() => setShowCreateGroup(true)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#121316]
                                text-gray-400 hover:bg-[#1e2023] transition-all text-sm font-medium"
                    >
                        <Users size={15} />
                        <span>New group</span>
                    </button>
                </div>
            )}


            {/* chats list */}
            <div className="flex-1 overflow-y-auto">
                <ChatList search={search} onSelectChat={onSelectChat} />
            </div>

        </div>

    )
}

export default Sidebar;