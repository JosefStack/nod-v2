import { useState, useRef } from "react";
import { Send, Plus, Smile, Image } from "lucide-react";

interface Props {
    onSend: (content: string, image?: string) => void;
}

const MessageInput = ({ onSend }: Props) => {
    const [message, setMessage] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSend = () => {
        if (!message.trim() && !imagePreview) return;
        onSend(message.trim(), imagePreview || undefined);
        setMessage("");
        setImagePreview(null);
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
        // auto-grow
        e.target.style.height = "auto";
        e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
    };

    return (
        <div className="px-4 lg:px-6 py-4 border-t border-gray-800/50 bg-[#0d0e11]">
            {/* image preview */}
            {imagePreview && (
                <div className="mb-3 relative inline-block">
                    <img src={imagePreview} alt="preview" className="h-20 rounded-xl object-cover" />
                    <button
                        onClick={() => setImagePreview(null)}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center"
                    >
                        ×
                    </button>
                </div>
            )}

            <div className="flex items-end gap-3">
                {/* plus button */}
                <button
                    onClick={() => fileRef.current?.click()}
                    className="flex-shrink-0 w-10 h-10 rounded-full bg-[#1e2023] flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#24262a] transition-all"
                >
                    <Plus size={18} />
                </button>
                <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                />

                {/* text input */}
                <div className="flex-1 flex items-end gap-2 bg-[#1e2023] rounded-2xl px-4 py-2.5">
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={handleTextareaInput}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        rows={1}
                        className="flex-1 bg-transparent text-white text-sm placeholder:text-gray-600 resize-none outline-none leading-relaxed max-h-[120px]"
                    />
                    <button className="flex-shrink-0 text-gray-500 hover:text-gray-300 transition-colors pb-0.5">
                        <Smile size={18} />
                    </button>
                    <button className="flex-shrink-0 text-gray-500 hover:text-gray-300 transition-colors pb-0.5">
                        <Image size={18} />
                    </button>
                </div>

                {/* send button */}
                <button
                    onClick={handleSend}
                    disabled={!message.trim() && !imagePreview}
                    className="flex-shrink-0 w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center text-white hover:bg-violet-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <Send size={16} />
                </button>
            </div>

            <p className="text-center text-[10px] text-gray-700 mt-2 hidden lg:block">
                SHIFT + ENTER FOR A NEW LINE
            </p>
        </div>
    );
};

export default MessageInput;