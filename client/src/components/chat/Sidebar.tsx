import { useAuthStore } from "@/store/useAuthStore";
import type { Chat } from "@/types/chat";
import { HelpCircle, Settings } from "lucide-react";
import { useState } from "react";

// for in development features
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"


type Tab = "rooms" | "chats";
interface Props {
    activeTab: Tab;
    setActiveTab: (tab: Tab) => void;
    onSelectChat: (chat: Chat) => void;
}

const Sidebar = ({ activeTab, setActiveTab, onSelectChat }: Props) => {

    const { user } = useAuthStore();
    const [showUserSearch, setShowUserSearch] = useState<boolean>(false);
    const [showCreateGroup, setShowCreateGroup] = useState<boolean>(false);

    return (
        <div className="flex flex-col h-full bg-[#0d0e11]">

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
                    {/* settings and help -- to be implemented */}
                    <div className="flex gap-1">
                        <HoverCard>
                            <HoverCardTrigger><button className="p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                                <Settings size={15} />
                            </button></HoverCardTrigger>
                            <HoverCardContent>In development</HoverCardContent>
                        </HoverCard>

                        <button className="p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                            <HelpCircle size={15} />
                        </button>
                    </div>
                </div>
            </div>


            {/* tab switch */}

            {/* search */}

            {/* action button -> add user ... create group */}

            {/* chats list */}

        </div>

    )
}

export default Sidebar
