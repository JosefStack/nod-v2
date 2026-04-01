import { useState } from "react";
import { mockRooms } from "../../../../lib/mockData";
import PublicRoomCard from "./PublicRoomCard";
import JoinPrivateRoom from "./JoinPrivateRoom";

const REGIONS = ["Random", "North America", "Europe", "Asia", "Africa"];

const RoomsPage = () => {
    const [activeRegion, setActiveRegion] = useState("Random");

    const filtered = activeRegion === "Random"
        ? mockRooms
        : mockRooms.filter((r) => r.region === activeRegion);

    return (
        <div className="flex flex-col h-full overflow-y-auto">
            {/* header */}
            <div className="px-4 lg:px-6 pt-5 pb-4 border-b border-gray-800/50">
                <h2 className="text-white font-bold text-lg mb-4">Explore Rooms</h2>

                {/* region pills */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {REGIONS.map((region) => (
                        <button
                            key={region}
                            onClick={() => setActiveRegion(region)}
                            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                activeRegion === region
                                    ? "bg-violet-500 text-white"
                                    : "bg-[#121316] text-gray-400 hover:text-white"
                            }`}
                        >
                            {region}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 px-4 lg:px-6 py-4 space-y-6">
                {/* public rooms */}
                <div>
                    <h3 className="text-white font-bold mb-3">Public Rooms</h3>
                    <div className="space-y-2">
                        {filtered.length === 0 ? (
                            <p className="text-gray-600 text-sm py-4">No rooms in this region</p>
                        ) : (
                            filtered.map((room) => (
                                <PublicRoomCard key={room.id} room={room} />
                            ))
                        )}
                    </div>
                </div>

                {/* join private room */}
                <JoinPrivateRoom />
            </div>
        </div>
    );
};

export default RoomsPage;