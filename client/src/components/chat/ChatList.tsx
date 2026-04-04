import ChatListItem from "./ChatListItem";
import ChatListSkeleton from "../skeletons/ChatListSkeletion";
import type { Chat } from "@/types/chat";



interface Props {
    search: string;
    onSelectChat: (chat: Chat) => void;
}

const ChatList = ({ search, onSelectChat }: Props) => {
    return (
        <div className="">
                
        </div>
    )
}

export default ChatList;
