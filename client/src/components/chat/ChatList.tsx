import ChatListItem from "./ChatListItem";
import ChatListSkeleton from "../skeletons/ChatListSkeletion";
import type { Chat } from "@/types/chat";
import { useChatStore } from "@/store/useChatStore";



interface Props {
    search: string;
    onSelectChat: (chat: Chat) => void;
}

const ChatList = ({ search, onSelectChat }: Props) => {
    const { chats, isLoadingChats, activeChat } = useChatStore();

    if (isLoadingChats) return <ChatListSkeleton />;

    const filtered = chats.filter((chat) => (
        (chat.name?.toLowerCase().includes(search.toLowerCase())) ||
        (chat.username?.toLowerCase().includes(search.toLowerCase()))
    ));

    if (filtered.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <p className="text-gray-600 text-sm">
                    {search ? "No conversations match your search" : "No conversations yet. Add someone to start chatting!"}
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col ">
            {
                filtered.map((chat) => (
                    <ChatListItem
                        key={chat.id}
                        chat={chat}
                        onSelectChat={onSelectChat}
                        isSelected={chat.id === activeChat?.id}

                    />
                ))
            }
        </div>
    )
}

export default ChatList;
