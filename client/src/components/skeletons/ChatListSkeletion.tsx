import { Skeleton } from "@/components/ui/skeleton";

const ChatListSkeleton = () => {
    return (
        <div className="flex flex-col gap-1 px-2 py-2">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-3">
                    <Skeleton className="w-11 h-11 rounded-full shrink-0 bg-gray-800" />
                    <div className="flex-1 space-y-2">
                        <div className="flex justify-between">
                            <Skeleton className="h-3.5 w-28 bg-gray-800" />
                            <Skeleton className="h-3 w-8 bg-gray-800" />
                        </div>
                        <Skeleton className="h-3 w-44 bg-gray-800" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ChatListSkeleton;