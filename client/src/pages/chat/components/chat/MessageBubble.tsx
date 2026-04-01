interface Message {
    id: string;
    content: string | null;
    senderId: string;
    senderName: string;
    senderAvatar: string | null;
    time: string;
    image: string | null;
    dateLabel: string | null;
}

interface Props {
    message: Message;
}

const MessageBubble = ({ message }: Props) => {
    const isMe = message.senderId === "me";

    return (
        <div className="flex flex-col">
            {/* date separator */}
            {message.dateLabel && (
                <div className="flex items-center justify-center my-4">
                    <span className="text-xs text-gray-600 bg-[#121316] px-3 py-1 rounded-full tracking-widest uppercase">
                        {message.dateLabel}
                    </span>
                </div>
            )}

            <div className={`flex items-end gap-2 mb-1 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                {/* avatar — only for others */}
                {!isMe && (
                    <div className="w-8 h-8 rounded-full bg-[#24262a] flex items-center justify-center text-gray-400 text-xs font-bold flex-shrink-0 mb-1 overflow-hidden">
                        {message.senderAvatar ? (
                            <img src={message.senderAvatar} alt={message.senderName} className="w-full h-full object-cover" />
                        ) : (
                            message.senderName[0].toUpperCase()
                        )}
                    </div>
                )}

                <div className={`flex flex-col gap-1 max-w-[70%] ${isMe ? "items-end" : "items-start"}`}>
                    {/* sender name — only for others in groups */}
                    {!isMe && (
                        <span className="text-xs text-gray-500 px-1">{message.senderName}</span>
                    )}

                    {/* image */}
                    {message.image && (
                        <div className="rounded-2xl overflow-hidden max-w-xs">
                            <img
                                src={message.image}
                                alt="attachment"
                                className="w-full object-cover max-h-64"
                            />
                        </div>
                    )}

                    {/* text bubble */}
                    {message.content && (
                        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                            isMe
                                ? "bg-violet-500 text-white rounded-br-sm"
                                : "bg-[#1e2023] text-gray-100 rounded-bl-sm"
                        }`}>
                            {message.content}
                        </div>
                    )}

                    {/* time */}
                    <span className={`text-[10px] text-gray-600 px-1 ${isMe ? "text-right" : ""}`}>
                        {message.time}
                        {isMe && <span className="ml-1 text-violet-400">✓✓</span>}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;