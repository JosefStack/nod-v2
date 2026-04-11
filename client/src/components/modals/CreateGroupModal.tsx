import { useChatStore } from "@/store/useChatStore";
import { Camera, Check, Search, X } from "lucide-react";
import { useRef, useState } from "react";
import { Skeleton } from "../ui/skeleton";

interface Props {
    onClose: () => void;
}

const CreateGroupModal = ({ onClose }: Props) => {

    const { searchUsers, searchResults, isSearching } = useChatStore();

    const [step, setStep] = useState<"details" | "members">("details")
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const [groupName, setGroupName] = useState("");
    const [groupDescription, setGroupDescription] = useState("");
    const [query, setQuery] = useState("")
    const [selected, setSelected] = useState<{ id: string, username: string }[]>([]);


    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const data = reader.result as string;
            setAvatarPreview(data);
        };
        reader.readAsDataURL(file);
    }

    const handleSearch = (query: string) => {
        setQuery(query);
        if (query.length > 2) searchUsers(query);
    }

    const toggleUser = (user: { id: string, username: string }) => {
        setSelected((prev) => (
            prev.some((u) => u.id === user.id) ? prev.filter((i) => i.id !== user.id) : [...prev, user]
        ))
    }

    return (
        <div>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                <div className="w-full max-w-md border border-gray-800 bg-[#121316] rounded-2xl overflow-hidden shadow-2xl">

                    {/* header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
                        <h3 className="text-white font-bold">
                            {step === "details" ? "Create Group" : "Add Members"}
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-800">
                            <X size={18} />
                        </button>
                    </div>

                    {/* step - details (name, avatar, desc) */}
                    {step === "details" ? (
                        <div className="px-5 py-5 space-y-4">
                            {/* avatar + name + description? */}
                            <div className="flex items-center gap-4">
                                <div
                                    onClick={() => avatarInputRef.current?.click()}
                                    className="w-16 h-16 rounded-full bg-[#24262a] flex items-center justify-center
                                            cursor-pointer hover:bg-[#2a2d31] transition-colors overflow-hidden shrink-0"
                                >
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="group" className="w-full h-full object-cover" />
                                    ) : (
                                        <Camera className="text-gray-400" size={20} />
                                    )}
                                </div>
                                <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />

                                <div className="flex-1 space-y-2">
                                    <input
                                        value={groupName}
                                        onChange={(e) => setGroupName(e.target.value)}
                                        placeholder="Group name *"
                                        className="w-full bg-[#0d0e11] rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600
                                        ouline-none focus:ring-1 focus:ring-violet-500/30"
                                    />
                                    <input
                                        value={groupDescription}
                                        onChange={(e) => setGroupDescription(e.target.value)}
                                        placeholder="Group description"
                                        className="w-full bg-[#0d0e11] rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600
                                        ouline-none focus:ring-1 focus:ring-violet-500/30"
                                    />
                                </div>
                            </div>

                            {/* cancel + next  */}
                            <div className="px-5 py-4 border-t border-gray-800 flex gap-3">
                                <button
                                    className="flex-1 py-3 rounded-xl bg-[#24262a] text-gray-400 font-bold hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={() => setStep("members")}
                                    disabled={!groupName.trim()}
                                    className="flex-1 py-3 rounded-xl bg-violet-500 text-white font-bold hover:bg-violet-600 
                                transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* step - members (add members) */}
                            <div className="px-5 py-3 border-b border-gray-800">
                                <div className="relative">
                                    <Search
                                        size={14}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                                    />
                                    <input
                                        autoFocus
                                        value={query}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        placeholder="Search people to add..."
                                        className="w-full pl-9 pr-4 py-2.5 bg-[#0d0e11] rounded-xl text-white text-sm
                                    placeholder:text-gray-600 outline-none focus:ring-1 focus:ring-violet-500/30"
                                    />
                                </div>
                                {selected.length > 0 && (
                                    <div className="space-y-1">
                                        <p className="text-xs text-violet-400 mt-2 px-1 ">
                                            {selected.length} member{selected.length > 1 ? "s" : ""} selected
                                        </p>
                                        <div className="flex flex-wrap gap-1">
                                            {selected.map(user => (
                                                <div
                                                    key={user.id}
                                                    onClick={() => toggleUser({ id: user.id, username: user.username })}
                                                    className="px-2 py-0.5 gap-2 text-xs rounded-md flex items-center justify-between text-gray-400 bg-[#24262a]"
                                                >
                                                    <p>{user.username}</p>
                                                    <div className="p-1 rounded-sm text-red-400 hover:bg-[#363636] hover:text-red-400 transition-colors">
                                                        <X size={10} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                            </div>

                            {/* search results .. */}
                            <div className="max-h-60 overflow-y-auto">
                                {isSearching ? (
                                    <div className="p-4 space-y-3">
                                        {Array.from({ length: 3 }).map((_, i) => (
                                            <div key={i} className="flex items-center gap-3 px-1">
                                                <Skeleton />
                                            </div>
                                        ))}
                                    </div>
                                ) : query.length < 2 ? (
                                    <div className="py-8 text-center text-gray-600 text-sm">
                                        Search for people to add
                                    </div>
                                ) : searchResults.length === 0 ? (
                                    <div className="py-8 text-center text-gray-600 text-sm">No users found</div>
                                ) : (
                                    searchResults.map((user) => (
                                        <button
                                            key={user.id}
                                            onClick={() => toggleUser({ id: user.id, username: user.username })}
                                            className="w-full flex items-center justify-between px-5 py-3 hover:bg-[#1e2023] transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-[#24262a] flex items-center justify-center 
                                                text-gray-400 font-bold text-sm overflow-hidden">
                                                    {user.avatar ?
                                                        <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" /> :
                                                        user.name?.[0]?.toUpperCase() || user.username[0].toUpperCase()
                                                    }
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-white text-sm font-medium">{user.name || user.username}</p>
                                                    <p className="text-gray-500 text-sm">@{user.username}</p>
                                                </div>
                                            </div>
                                            {/* toggle button */}
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                                                ${selected.some((u) => u.id === user.id) ? "bg-violet-500 border-violet-500" : "border-gray-600"}`}>
                                                {selected.some((u) => u.id === user.id) && <Check size={12} className="text-white" />}
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>

                            <div className="px-4 py-4 border-t border-gray-800 flex gap-3">
                                <button>
                                    ← Back
                                </button>
                            </div>
                        </>
                    )}


                </div>
            </div>
        </div>
    )
}

export default CreateGroupModal
