interface Room {
    id: string;
    name: string;
    avatar: string | null;
    online: number;
    capacity: number;
    region: string;
}

interface Props {
    room: Room;
}

const PublicRoomCard = ({ room }: Props) => {
    return (
        <div className="flex items-center gap-4 p-4 bg-[#121316] rounded-2xl hover:bg-[#1e2023] transition-colors">
            {/* icon */}
            <div className="w-12 h-12 rounded-xl bg-[#24262a] flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
                {room.avatar ? (
                    <img src={room.avatar} alt={room.name} className="w-full h-full object-cover" />
                ) : (
                    "🏠"
                )}
            </div>

            {/* info */}
            <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm">{room.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <p className="text-gray-500 text-xs">{room.online}/{room.capacity} online</p>
                </div>
            </div>

            {/* join button */}
            <button className="flex-shrink-0 px-5 py-2 rounded-xl bg-violet-500 text-white text-sm font-bold hover:bg-violet-600 transition-colors">
                Join
            </button>
        </div>
    );
};

export default PublicRoomCard;