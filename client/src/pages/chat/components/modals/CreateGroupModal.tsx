import { useState, useRef } from "react";
import { X, Camera, Check } from "lucide-react";

interface Props {
    onClose: () => void;
}

const mockUsers = [
    { id: "1", username: "sarah_design", name: "Sarah Design", avatar: null },
    { id: "2", username: "alex_dev", name: "Alex Dev", avatar: null },
    { id: "3", username: "luna_ray", name: "Luna Ray", avatar: null },
    { id: "4", username: "julian_vane", name: "Julian Vane", avatar: null },
];

const CreateGroupModal = ({ onClose }: Props) => {
    const [groupName, setGroupName] = useState("");
    const [selected, setSelected] = useState<string[]>([]);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const toggleUser = (id: string) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setAvatarPreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleCreate = () => {
        if (!groupName.trim() || selected.length === 0) return;
        // will wire up to API later
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="w-full max-w-md bg-[#121316] rounded-2xl border border-gray-800 overflow-hidden">
                {/* header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
                    <h3 className="text-white font-bold">Create Group</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <div className="px-5 py-4 space-y-5">
                    {/* group avatar + name */}
                    <div className="flex items-center gap-4">
                        <div className="relative flex-shrink-0">
                            <div
                                onClick={() => fileRef.current?.click()}
                                className="w-16 h-16 rounded-full bg-[#24262a] flex items-center justify-center text-gray-500 cursor-pointer hover:bg-[#2a2d31] transition-colors overflow-hidden"
                            >
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="group" className="w-full h-full object-cover" />
                                ) : (
                                    <Camera size={20} />
                                )}
                            </div>
                            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                        </div>
                        <input
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            placeholder="Group name..."
                            className="flex-1 bg-[#0d0e11] rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 outline-none focus:ring-1 focus:ring-violet-500/30"
                        />
                    </div>

                    {/* member selection */}
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-3">
                            Add Members ({selected.length} selected)
                        </p>
                        <div className="space-y-1 max-h-48 overflow-y-auto">
                            {mockUsers.map((user) => (
                                <button
                                    key={user.id}
                                    onClick={() => toggleUser(user.id)}
                                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#1e2023] transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-[#24262a] flex items-center justify-center text-gray-400 font-bold text-sm">
                                            {user.name[0]}
                                        </div>
                                        <div className="text-left">
                                            <p className="text-white text-sm font-medium">{user.name}</p>
                                            <p className="text-gray-500 text-xs">@{user.username}</p>
                                        </div>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                        selected.includes(user.id)
                                            ? "bg-violet-500 border-violet-500"
                                            : "border-gray-600"
                                    }`}>
                                        {selected.includes(user.id) && <Check size={10} className="text-white" />}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* footer */}
                <div className="px-5 py-4 border-t border-gray-800 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl bg-[#24262a] text-gray-400 font-bold hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreate}
                        disabled={!groupName.trim() || selected.length === 0}
                        className="flex-1 py-3 rounded-xl bg-violet-500 text-white font-bold hover:bg-violet-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Create Group
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateGroupModal;