import { useChatStore } from "@/store/useChatStore";
import { Plus, Send, X } from "lucide-react";
import { useRef, useState } from "react"
import { toast } from "sonner";


const MessageInput = () => {

    const { activeChat, sendMessage, isSendingMessage } = useChatStore();
    const [message, setMessage] = useState("");
    const [attachments, setAttachments] = useState<{ data: string; type: string; filename: string; size: number; preview: string }[]>([])
    const fileRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);


    const handleSend = async () => {
        if (!activeChat) return;
        if (!message.trim() && attachments.length === 0) return;

        try {
            await sendMessage({
                chatId: activeChat.id,
                chatType: activeChat.type,
                content: message.trim(),
                attachments: attachments.map(({ data, type, filename, size }) => ({ data, type, filename, size }))
            })
            setMessage("");
            setAttachments([]);
            if (textareaRef.current) textareaRef.current.style.height = "auto"
        } catch (err: any) {
            toast.error("Failed to send message");
        }
    }

    const handleMessageInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
        e.target.style.height = "auto";
        e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
    }

    const handleEnterKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (attachments.length + files.length > 5) {
            toast.error("Maximum 5 attachments per message");
            return;
        }

        files.forEach((file) => {
            const type = file.type.startsWith("image/") ? "image" :
                file.type.startsWith("video/") ? "video" :
                    "raw";

            const reader = new FileReader();
            reader.onloadend = () => {
                const data = reader.result as string; {/* base64 string */ }

                setAttachments((prev) => (
                    [
                        ...prev,
                        {
                            data,
                            type,
                            filename: file.name,
                            size: file.size,
                            preview: type === "image" ? data : ""
                        }
                    ]
                ))
            }
            reader.readAsDataURL(file);
        })
    }

    const removeAttachment = (i: number) => {
        setAttachments((prev) => prev.filter((_, index) => index !== i));
    }

    return (
        <div className="px-4 lg:px-5 py-4 border-t border-gray-800/50 bg-[#0d0e11] shrink-0">
            {/* attachments if any */}
            {
                attachments.length > 0 && (
                    <div className="flex gap-2 mb-3 flex-wrap">
                        {
                            attachments.map((attachment, index) => (
                                <div key={index} className="relative">
                                    {attachment.type === "image" ? (
                                        <img
                                            src={attachment.preview}
                                            alt="preview"
                                            className="h-16 w-16 rounded-xl object-cover"
                                        />
                                    ) : attachment.type === "video" ? (
                                        <div className="h-16 w-16 rounded-xl bg-gray-800 flex items-center justify-center text-2xl">
                                            🎬
                                        </div>
                                    ) : (
                                        <div className="h-16 w-16 rounded-xl bg-gray-800 flex flex-col items-center justify-center text-center px-1">
                                            <span className="text-xl">📄</span>
                                            <span className="text-[8px] text-gray-400 truncate w-full text-center">{attachment.filename}</span>
                                        </div>
                                    )
                                    }

                                    <button
                                        onClick={() => removeAttachment(index)}
                                        className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-red-500 rounded-full flex items-center justify-center text-white">
                                        <X size={10} />
                                    </button>
                                </div>
                            ))
                        }
                    </div>
                )
            }

            {/* input  */}
            <div className="flex items-end gap-3">
                {/* attachment button */}
                <button
                    onClick={() => { fileRef.current?.click() }}
                    className="shrink-0 w-10 h-10 rounded-full bg-[#1e203] flex items-center justify-center
                            text-gray-400 hover:text-white hover:bg-[#24262a] transition-all"
                >
                    <Plus size={18} />
                </button>
                <input
                    ref={fileRef}
                    type="file"
                    multiple
                    accept="image/*, video/* .pdf, .doc, .docx, .txt, .zip"
                    className="hidden"
                    onChange={handleFileChange}
                />

                {/* message input  */}
                <div className="flex-1 flex items-center justify-center gap-2 bg-[#1e2023] rounded-2xl px-4 py-1">
                    {/* or textarea */}
                    <textarea
                        ref={textareaRef}
                        placeholder={`Message ${activeChat?.name}`}
                        value={message}
                        onChange={handleMessageInput}
                        onKeyDown={handleEnterKey}
                        className="flex-1 bg-transparent text-white text-sm placeholder:text-gray-600 
                        outline-none max-h-30 resize-y leading-none py-2"
                    ></textarea>

                </div>

                {/* send button */}
                <button
                    onClick={handleSend}
                    disabled={(!message.trim() && attachments.length === 0) || isSendingMessage}
                    className="flex shrink-0 w-10 h-10 rounded-full bg-violet-500 items-center justify-center
                    text-white hover:bg-violet-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <Send size={15} />
                </button>
            </div>

        </div>
    )
}

export default MessageInput
