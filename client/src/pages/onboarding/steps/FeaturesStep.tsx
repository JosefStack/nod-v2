const FEATURES = [
    { icon: "💬", title: "Real-time Messaging", desc: "Instant messages with zero lag across all your devices." },
    { icon: "👥", title: "Group Chats & Rooms", desc: "Create communities, rooms and channels for any topic." },
    { icon: "🔒", title: "End-to-End Privacy", desc: "Your conversations are encrypted and always private." },
    { icon: "🎨", title: "Rich Media Sharing", desc: "Share images, files and links seamlessly in any chat." },
];

const FeaturesStep = ({
    onComplete,
    onBack,
    isSubmitting,
}: {
    onComplete: () => void;
    onBack: () => void;
    isSubmitting: boolean;
}) => {
    return (
        <div>
            <div className="mb-10 text-center">
                <h2 className="text-4xl font-extrabold text-white mb-2">
                    Everything you <span className="text-violet-400">need</span>
                </h2>
                <p className="text-gray-400 text-lg">Here's what's waiting for you inside.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {FEATURES.map((f) => (
                    <div
                        key={f.title}
                        className="p-6 rounded-2xl bg-[#121316] border border-gray-800 hover:border-violet-500/30 transition-colors"
                    >
                        <div className="text-3xl mb-4">{f.icon}</div>
                        <h3 className="text-white font-bold mb-2">{f.title}</h3>
                        <p className="text-gray-500 text-sm">{f.desc}</p>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between">
                <button onClick={onBack} className="text-gray-500 font-bold hover:text-white transition-colors">
                    Back
                </button>
                <button
                    onClick={onComplete}
                    disabled={isSubmitting}
                    className="px-12 py-4 rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 text-white font-bold text-lg shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 transition-all disabled:opacity-40"
                >
                    {isSubmitting ? "Setting up..." : "Enter the Nocturne →"}
                </button>
            </div>
        </div>
    );
};

export default FeaturesStep;