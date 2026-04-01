import { useRef, useEffect, useState } from "react";
import { mockMessages } from "../../../../lib/mockData";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

interface Props {
    chatId: string;
    onBack: () => void;
}

const ChatWindow = ({ chatId, onBack }: Props) => {
    const [messages, setMessages] = useState(mockMessages);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = (content: string, image?: string) => {
        const newMessage = {
            id: Date.now().toString(),
            content: content || null,
            senderId: "me",
            senderName: "You",
            senderAvatar: null,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            image: image || null,
            dateLabel: null,
        };
        setMessages((prev) => [...prev, newMessage]);
    };

    return (
        <div className="flex flex-col h-full">
            <ChatHeader chatId={chatId} onBack={onBack} />

            {/* messages */}
            <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-4 space-y-1">
                {messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} />
                ))}
                <div ref={bottomRef} />
            </div>

            <MessageInput onSend={handleSend} />
        </div>
    );
};

export default ChatWindow;