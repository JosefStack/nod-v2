import { useState } from "react";
import { Lock } from "lucide-react";

const JoinPrivateRoom = () => {
    const [roomId, setRoomId] = useState("");
    const [password, setPassword] = useState("");

    const handleJoin = () => {
        if (!roomId.trim()) return;
        // will wire up to API later
        console.log("Joining private room:", roomId, password);
    };

    return (
        <div className="bg-[#121316] rounded-2xl p-5 border border-gray-800">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-white font-bold">Join Private Room</h3>
                    <p className="text-gray-500 text-xs mt-1">Enter credentials to access restricted vaults.</p>
                </div>
                <Lock size={20} className="text-gray-600 flex-shrink-0 mt-0.5" />
            </div>

            <div className="space-y-3">
                <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5 block">
                        Room ID
                    </label>
                    <input
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        placeholder="e.g. #NOD-4421"
                        className="w-full px-4 py-3 bg-[#0d0e11] rounded-xl text-white text-sm placeholder:text-gray-700 outline-none focus:ring-1 focus:ring-violet-500/30"
                    />
                </div>
                <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5 block">
                        Password
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 bg-[#0d0e11] rounded-xl text-white text-sm placeholder:text-gray-700 outline-none focus:ring-1 focus:ring-violet-500/30"
                    />
                </div>

                <button
                    onClick={handleJoin}
                    disabled={!roomId.trim()}
                    className="w-full py-3.5 rounded-xl bg-violet-500 text-white font-bold text-sm hover:bg-violet-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <Lock size={14} />
                    Join Securely
                </button>
            </div>
        </div>
    );
};

export default JoinPrivateRoom;