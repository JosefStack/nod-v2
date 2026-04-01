import { mockChats } from "../../../../lib/mockData";
import ChatListItem from "./ChatListItem";

interface Props {
    search: string;
    selectedChatId: string | null;
    onSelectChat: (id: string) => void;
}

const ChatList = ({ search, selectedChatId, onSelectChat }: Props) => {
    const filtered = mockChats.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex flex-col">
            {filtered.length === 0 ? (
                <div className="text-center py-12 text-gray-600 text-sm">
                    No conversations found
                </div>
            ) : (
                filtered.map((chat) => (
                    <ChatListItem
                        key={chat.id}
                        chat={chat}
                        isSelected={selectedChatId === chat.id}
                        onClick={() => onSelectChat(chat.id)}
                    />
                ))
            )}
        </div>
    );
};

export default ChatList;