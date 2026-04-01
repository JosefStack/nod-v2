import { mockRooms } from "../../../../lib/mockData";

const RoomsList = () => {
    return (
        <div className="flex flex-col px-4 py-2">
            <p className="text-xs text-gray-600 uppercase tracking-widest font-bold mb-3 px-1">
                Your Rooms
            </p>
            {mockRooms.map((room) => (
                <button
                    key={room.id}
                    className="flex items-center gap-3 px-2 py-3 rounded-xl hover:bg-[#121316] transition-colors text-left"
                >
                    <div className="w-10 h-10 rounded-xl bg-[#24262a] flex items-center justify-center text-lg flex-shrink-0">
                        🏠
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-bold truncate">{room.name}</p>
                        <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            <p className="text-gray-500 text-xs">{room.online} online</p>
                        </div>
                    </div>
                </button>
            ))}
        </div>
    );
};

export default RoomsList;