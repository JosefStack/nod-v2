import { useEffect, useRef } from "react";
import { useChatStore } from "@/store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import MessagesSkeleton from "./MessageSkeleton";
import type useWebRTC from "@/hooks/useWebRTC";

interface Props {
    onBack: () => void;
    webRTC: ReturnType<typeof useWebRTC>;
}

const shouldShowDateLabel = (messages: any[], idx: number) => {
    if (idx === 0) return true;
    const curr = new Date(messages[idx].createdAt).toDateString();
    const prev = new Date(messages[idx - 1].createdAt).toDateString();
    return curr !== prev;
};

const ChatWindow = ({ onBack, webRTC }: Props) => {
    const { messages, isLoadingMessages, activeChat } = useChatStore();
    const bottomRef = useRef<HTMLDivElement>(null);


    const handleCall = () => {
        if (!activeChat?.otherUserId) return;
        webRTC.startCall(activeChat.otherUserId);
    }


    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="flex flex-col h-full">
            <ChatHeader onBack={onBack} onCall={handleCall} />

            {/* MESSAGES AREA */}
            <div className="flex-1 overflow-y-auto px-4 lg:px-5 py-2">
                {isLoadingMessages ? (
                    <MessagesSkeleton />
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="text-5xl mb-4">👋</div>
                        <p className="text-gray-500 text-sm">No messages yet. Say hello!</p>
                    </div>
                ) : (
                    messages.map((msg, idx) => (
                        <MessageBubble
                            key={msg.id}
                            message={msg}
                            showDateLabel={shouldShowDateLabel(messages, idx)}
                        />
                    ))
                )}
                <div ref={bottomRef} />
            </div>

            <MessageInput />
        </div>
    );
};

export default ChatWindow;