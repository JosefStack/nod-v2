import { useChatStore } from "@/store/useChatStore";
import { MessageSquare, Search, X } from "lucide-react"
import { useEffect, useState } from "react"


interface Props {
    onClose: () => void;
}

const UserSearchModal = ({ onClose }: Props) => {

    const { searchUsers, searchResults, isSearching, createDirectChat, } = useChatStore();

    const [query, setQuery] = useState("");


    useEffect(() => {
        const timer = setTimeout(() => {
            searchUsers(query)
        }, 500)

        return () => clearTimeout(timer)

    }, [query])




    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="w-full bg-[#121316] rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">


                {/* header */}
                <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
                    <h3 className="text-white font-bold">Find people</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-800"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* search input */}
                <div className="px-5 py-3 border-b border-gray-800 ">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by username or name..."
                            className="w-full text-white pl-9 pr-4 py-2.5 bg-[#0d0e11] rounded-xl outline-none text-sm
                            placeholder:text-gray-600 focus:ring-1 focus:ring-violet-500/30"
                        />
                    </div>
                </div>

                {/* search results */}
                <div className="max-h-72 overflow-y-auto">
                    {
                        isSearching ? (
                            <div className=""></div>
                        ) : query.length < 2 ? (
                            <div className="py-10 text-gray-600 text-sm text-center">
                                Enter at least 2 characters to search
                            </div>
                        ) : searchResults.length === 0 ? (
                            <div className="py-10 text-gray-600 text-sm text-center">
                                No users fround for "{query}"
                            </div>
                        ) : (
                            searchResults.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center justify-between px-5 py-3 hover:bg-[#1e2023] transition-colors"
                                >
                                    <div className="flex-1 not-visited:flex items-center gap-3 ">
                                        <div className="w-10 h-10 rounded-full bg-[#24262a] flex items-center justify-center text-gray-400 
                                                        font-bold text-sm overflow-hidden">
                                            {
                                                user.avatar
                                                    ? <img src={user.avatar}></img>
                                                    : user.name?.[0].toUpperCase() ||user.username?.[0].toUpperCase()
                                            }
                                        </div>

                                        <div>
                                            <p className="text-white text-sm font-bold ">{user.name || user.username}</p>
                                            <p className="text-gray-500 text-xs ">@{user.username}</p>
                                        </div>

                                        <button
                                            onClick={() => {return;}}
                                            className="p-2 ml-auto text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 rounded-xl transition-all disabled:opacity-50"
                                        >
                                            <MessageSquare size={16} />
                                        </button>

                                    </div>



                                </div>
                            ))
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default UserSearchModal
