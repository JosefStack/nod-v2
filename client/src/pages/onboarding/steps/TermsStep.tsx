import { useState } from "react";

const TermsStep = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
    const [accepted, setAccepted] = useState(false);

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-10">
                <h2 className="text-4xl font-extrabold text-white mb-2">
                    Terms & <span className="text-violet-400">Conditions</span>
                </h2>
                <p className="text-gray-400">Please read and accept before continuing.</p>
            </div>

            <div className="bg-[#121316] rounded-2xl p-6 h-64 overflow-y-auto mb-8 text-gray-400 text-sm leading-relaxed space-y-4 border border-gray-800">
                <p className="font-bold text-white">1. Acceptance of Terms</p>
                <p>By accessing Neon Nocturne, you agree to be bound by these terms and conditions.</p>
                <p className="font-bold text-white">2. User Conduct</p>
                <p>You agree not to use the platform for any unlawful purposes or to transmit any harmful, offensive, or disruptive content.</p>
                <p className="font-bold text-white">3. Privacy</p>
                <p>We respect your privacy. Your data is encrypted and never sold to third parties.</p>
                <p className="font-bold text-white">4. Content Ownership</p>
                <p>You retain ownership of content you post. By posting, you grant us a license to display it within the platform.</p>
                <p className="font-bold text-white">5. Termination</p>
                <p>We reserve the right to terminate accounts that violate these terms.</p>
                <p className="font-bold text-white">6. Changes</p>
                <p>We may update these terms at any time. Continued use of the platform constitutes acceptance.</p>
            </div>

            <label className="flex items-center gap-3 cursor-pointer mb-10">
                <input
                    type="checkbox"
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                    className="w-5 h-5 rounded accent-violet-500"
                />
                <span className="text-gray-400 text-sm">
                    I have read and agree to the{" "}
                    <span className="text-violet-400">Terms & Conditions</span>
                </span>
            </label>

            <div className="flex items-center justify-between">
                <button onClick={onBack} className="text-gray-500 font-bold hover:text-white transition-colors">
                    Back
                </button>
                <button
                    onClick={onNext}
                    disabled={!accepted}
                    className="px-10 py-4 rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 text-white font-bold shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    Accept & Continue →
                </button>
            </div>
        </div>
    );
};

export default TermsStep;