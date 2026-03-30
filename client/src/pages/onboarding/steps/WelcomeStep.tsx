const WelcomeStep = ({ onNext }: { onNext: () => void }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4">
                Welcome to <span className="text-violet-400">Nod</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-md mb-12">
                Before you continue, let's set up your profile so the community knows who you are.
            </p>
            <button
                onClick={onNext}
                className="px-12 py-4 rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 text-white font-bold text-lg shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 transition-all hover:scale-105"
            >
                Let's Go →
            </button>
        </div>
    );
};

export default WelcomeStep;