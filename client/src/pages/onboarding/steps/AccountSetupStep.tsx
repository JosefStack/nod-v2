import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface FormData {
    username: string;
    fullName: string;
    bio: string;
    avatar: string;
    avatarPreview: string;
}

interface Props {
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    onNext: () => void;
    onBack: () => void;
}

const AccountSetupStep = ({ formData, setFormData, onNext, onBack }: Props) => {
    const fileRef = useRef<HTMLInputElement>(null);
    const [errors, setErrors] = useState({ username: "", fullName: "" });

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const previewURL = URL.createObjectURL(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData((prev) => ({
                ...prev,
                avatar: reader.result as string,
                avatarPreview: previewURL,
            }));
        }


    };

    const validate = () => {
        const newErrors = { username: "", fullName: "" };
        let valid = true;

        if (!formData.username) {
            newErrors.username = "Username is required";
            valid = false;
        } else if (formData.username.length < 3) {
            newErrors.username = "Username must be at least 3 characters";
            valid = false;
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
            newErrors.username = "Only letters, numbers and underscores";
            valid = false;
        }

        if (!formData.fullName) {
            newErrors.fullName = "Full name is required";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleNext = () => {
        if (validate()) onNext();
    };

    return (
        <div>
            <div className="mb-10">
                <h2 className="text-4xl font-extrabold text-white mb-2">
                    Create your <span className="text-violet-400">Identity</span>
                </h2>
                <p className="text-gray-400 text-lg">
                    This is how the community will see you.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* avatar */}
                <div className="lg:col-span-4 flex flex-col items-center">
                    <div className="relative group">
                        <div className="w-40 h-40 rounded-full bg-[#24262a] overflow-hidden ring-4 ring-[#121316]">
                            {formData.avatarPreview ? (
                                <img
                                    src={formData.avatarPreview}
                                    alt="avatar"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-600 text-5xl">
                                    👤
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => fileRef.current?.click()}
                            className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"
                        >
                            ✏️
                        </button>
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarChange}
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-4">PNG, JPG up to 10MB</p>
                </div>

                {/* fields */}
                <div className="lg:col-span-8 space-y-6">
                    {/* username + name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
                                Username
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-400 font-bold">@</span>
                                <Input
                                    value={formData.username}
                                    onChange={(e) => setFormData((p) => ({ ...p, username: e.target.value }))}
                                    placeholder="username"
                                    className={`pl-9 bg-[#0d0e11] border-none text-white placeholder:text-gray-700 rounded-xl py-6 focus-visible:ring-violet-500/20 ${errors.username ? "ring-2 ring-red-500" : ""}`}
                                />
                            </div>
                            {errors.username && <p className="text-red-500 text-xs">{errors.username}</p>}
                        </div>


                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
                                Full Name
                            </label>
                            <div className="relative">
                                <Input
                                    value={formData.fullName}
                                    onChange={(e) => setFormData((p) => ({ ...p, fullName: e.target.value }))}
                                    placeholder="Alex Sterling"
                                    className={`bg-[#0d0e11] border-none text-white placeholder:text-gray-700 rounded-xl py-6 focus-visible:ring-violet-500/20 ${errors.fullName ? "ring-2 ring-red-500" : ""}`}
                                />
                            </div>
                            {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName}</p>}
                        </div>
                    </div>

                    {/* bio */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
                            Short Bio
                        </label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => setFormData((p) => ({ ...p, bio: e.target.value.slice(0, 160) }))}
                            placeholder="Tell us a little about your journey..."
                            rows={4}
                            className="w-full px-4 py-4 rounded-xl bg-[#0d0e11] border-none text-white placeholder:text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                        />
                        <div className="flex justify-between text-[10px] text-gray-600">
                            <span>Recommended: 160 characters</span>
                            <span>{formData.bio.length}/160</span>
                        </div>
                    </div>

                    {/* actions */}
                    <div className="pt-4 flex items-center justify-between">
                        <button onClick={onBack} className="text-gray-500 font-bold hover:text-white transition-colors">
                            Back
                        </button>
                        <button
                            onClick={handleNext}
                            className="px-10 py-4 rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 text-white font-bold shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 transition-all"
                        >
                            Continue →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountSetupStep;