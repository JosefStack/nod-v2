import { Camera, X } from "lucide-react";
import { useRef, useState } from "react"


interface Props {
    onClose: () => void;
}

const CreateGroupModal = ({ onClose }: Props) => {

    const [step, setStep] = useState<"details" | "members">("details")
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const [groupName, setGroupName] = useState("");
    const [groupDescription, setGroupDescription] = useState("");


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
                        // step - members (add members)
                        <div></div>
                    )}


                </div>
            </div>
        </div>
    )
}

export default CreateGroupModal
