import { useState } from "react";
import { Search, X, MessageSquare } from "lucide-react";

interface Props {
    onClose: () => void;
}

// mock search results
const mockUsers = [
    { id: "1", username: "sarah_design", name: "Sarah Design", avatar: null, online: true },
    { id: "2", username: "alex_dev", name: "Alex Dev", avatar: null, online: false },
    { id: "3", username: "luna_ray", name: "Luna Ray", avatar: null, online: true },
];

const UserSearchModal = ({ onClose }: Props) => {
    const [query, setQuery] = useState("");

    const filtered = mockUsers.filter(
        (u) =>
            u.username.toLowerCase().includes(query.toLowerCase()) ||
            u.name.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="w-full max-w-md bg-[#121316] rounded-2xl border border-gray-800 overflow-hidden">
                {/* header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
                    <h3 className="text-white font-bold">Find People</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* search */}
                <div className="px-5 py-3 border-b border-gray-800">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            autoFocus
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by username or name..."
                            className="w-full pl-9 pr-4 py-2.5 bg-[#0d0e11] rounded-xl text-white text-sm placeholder:text-gray-600 outline-none focus:ring-1 focus:ring-violet-500/30"
                        />
                    </div>
                </div>

                {/* results */}
                <div className="max-h-72 overflow-y-auto">
                    {query === "" ? (
                        <div className="py-8 text-center text-gray-600 text-sm">
                            Search for someone to message
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="py-8 text-center text-gray-600 text-sm">
                            No users found
                        </div>
                    ) : (
                        filtered.map((user) => (
                            <div
                                key={user.id}
                                className="flex items-center justify-between px-5 py-3 hover:bg-[#1e2023] transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-[#24262a] flex items-center justify-center text-gray-400 font-bold">
                                            {user.name[0].toUpperCase()}
                                        </div>
                                        {user.online && (
                                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#121316]" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-white text-sm font-bold">{user.name}</p>
                                        <p className="text-gray-500 text-xs">@{user.username}</p>
                                    </div>
                                </div>
                                <button className="p-2 text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 rounded-xl transition-all">
                                    <MessageSquare size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserSearchModal;