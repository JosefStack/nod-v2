import { Skeleton } from "@/components/ui/skeleton";

const MessagesSkeleton = () => {
    return (
        <div className="flex flex-col gap-4 px-4 py-6">
            {/* others message */}
            <div className="flex items-end gap-2">
                <Skeleton className="w-8 h-8 rounded-full bg-gray-800 flex-shrink-0" />
                <div className="space-y-1">
                    <Skeleton className="h-10 w-52 rounded-2xl rounded-bl-sm bg-gray-800" />
                    <Skeleton className="h-3 w-16 bg-gray-800/60" />
                </div>
            </div>

            {/* my message */}
            <div className="flex items-end gap-2 flex-row-reverse">
                <div className="space-y-1 items-end flex flex-col">
                    <Skeleton className="h-10 w-64 rounded-2xl rounded-br-sm bg-gray-800" />
                    <Skeleton className="h-3 w-16 bg-gray-800/60" />
                </div>
            </div>

            {/* others message */}
            <div className="flex items-end gap-2">
                <Skeleton className="w-8 h-8 rounded-full bg-gray-800 flex-shrink-0" />
                <div className="space-y-1">
                    <Skeleton className="h-16 w-44 rounded-2xl rounded-bl-sm bg-gray-800" />
                    <Skeleton className="h-3 w-16 bg-gray-800/60" />
                </div>
            </div>

            {/* my message */}
            <div className="flex items-end gap-2 flex-row-reverse">
                <div className="space-y-1 items-end flex flex-col">
                    <Skeleton className="h-10 w-48 rounded-2xl rounded-br-sm bg-gray-800" />
                    <Skeleton className="h-3 w-16 bg-gray-800/60" />
                </div>
            </div>
        </div>
    );
};

export default MessagesSkeleton;