import { motion } from "motion/react";
import { World } from "@/components/ui/globe";
import type { GlobeConfig, Position } from "@/components/ui/globe";

const globeConfig: GlobeConfig = {
  pointSize: 4,
  globeColor: "#062056",
  showAtmosphere: true,
  atmosphereColor: "#FFFFFF",
  atmosphereAltitude: 0.1,
  emissive: "#062056",
  emissiveIntensity: 0.1,
  shininess: 0.9,
  polygonColor: "rgba(255,255,255,0.7)",
  ambientLight: "#38bdf8",
  directionalLeftLight: "#ffffff",
  directionalTopLight: "#ffffff",
  pointLight: "#ffffff",
  arcTime: 1000,
  arcLength: 0.9,
  rings: 1,
  maxRings: 3,
  initialPosition: { lat: 22.3193, lng: 114.1694 },
  autoRotate: true,
  autoRotateSpeed: 0.5,
};

const colors = ["#06b6d4", "#3b82f6", "#6366f1"];
const c = (i: number) => colors[i % colors.length];

const arcs: Position[] = [
  // — Americas internal —
  { order: 1,  startLat: 40.7128,   startLng: -74.006,    endLat: 34.0522,   endLng: -118.2437, arcAlt: 0.2, color: c(0) },
  { order: 1,  startLat: 51.5072,   startLng: -0.1276,    endLat: 40.7128,   endLng: -74.006,   arcAlt: 0.3, color: c(1) },
  { order: 2,  startLat: -22.9068,  startLng: -43.1729,   endLat: -34.6037,  endLng: -58.3816,  arcAlt: 0.1, color: c(2) },
  { order: 2,  startLat: 19.4326,   startLng: -99.1332,   endLat: 40.7128,   endLng: -74.006,   arcAlt: 0.2, color: c(0) },
  { order: 3,  startLat: 49.2827,   startLng: -123.1207,  endLat: 34.0522,   endLng: -118.2437, arcAlt: 0.1, color: c(1) },
  { order: 3,  startLat: 4.7109,    startLng: -74.0721,   endLat: -22.9068,  endLng: -43.1729,  arcAlt: 0.2, color: c(2) },
  { order: 4,  startLat: -33.4489,  startLng: -70.6693,   endLat: -22.9068,  endLng: -43.1729,  arcAlt: 0.15,color: c(0) },
  { order: 4,  startLat: 25.7617,   startLng: -80.1918,   endLat: 19.4326,   endLng: -99.1332,  arcAlt: 0.1, color: c(1) },

  // — Trans-Atlantic —
  { order: 5,  startLat: 40.7128,   startLng: -74.006,    endLat: 51.5072,   endLng: -0.1276,   arcAlt: 0.4, color: c(2) },
  { order: 5,  startLat: 34.0522,   startLng: -118.2437,  endLat: 48.8566,   endLng: 2.3522,    arcAlt: 0.5, color: c(0) },
  { order: 6,  startLat: -22.9068,  startLng: -43.1729,   endLat: 48.8566,   endLng: 2.3522,    arcAlt: 0.5, color: c(1) },
  { order: 6,  startLat: 40.7128,   startLng: -74.006,    endLat: 52.52,     endLng: 13.405,    arcAlt: 0.4, color: c(2) },
  { order: 7,  startLat: 43.6532,   startLng: -79.3832,   endLat: 53.3498,   endLng: -6.2603,   arcAlt: 0.3, color: c(0) },
  { order: 7,  startLat: -34.6037,  startLng: -58.3816,   endLat: 40.4168,   endLng: -3.7038,   arcAlt: 0.5, color: c(1) },

  // — Europe internal —
  { order: 8,  startLat: 51.5072,   startLng: -0.1276,    endLat: 48.8566,   endLng: 2.3522,    arcAlt: 0.1, color: c(2) },
  { order: 8,  startLat: 52.52,     startLng: 13.405,     endLat: 41.9028,   endLng: 12.4964,   arcAlt: 0.1, color: c(0) },
  { order: 9,  startLat: 48.8566,   startLng: 2.3522,     endLat: 40.4168,   endLng: -3.7038,   arcAlt: 0.1, color: c(1) },
  { order: 9,  startLat: 59.3293,   startLng: 18.0686,    endLat: 52.52,     endLng: 13.405,    arcAlt: 0.1, color: c(2) },
  { order: 10, startLat: 48.1351,   startLng: 11.582,     endLat: 47.3769,   endLng: 8.5417,    arcAlt: 0.05,color: c(0) },
  { order: 10, startLat: 41.9028,   startLng: 12.4964,    endLat: 37.9838,   endLng: 23.7275,   arcAlt: 0.1, color: c(1) },

  // — Europe ↔ Middle East / Africa —
  { order: 11, startLat: 51.5072,   startLng: -0.1276,    endLat: 25.2048,   endLng: 55.2708,   arcAlt: 0.4, color: c(2) },
  { order: 11, startLat: 48.8566,   startLng: 2.3522,     endLat: 30.0444,   endLng: 31.2357,   arcAlt: 0.35,color: c(0) },
  { order: 12, startLat: 52.52,     startLng: 13.405,     endLat: -33.9249,  endLng: 18.4241,   arcAlt: 0.5, color: c(1) },
  { order: 12, startLat: 40.4168,   startLng: -3.7038,    endLat: -8.8368,   endLng: 13.2343,   arcAlt: 0.4, color: c(2) },

  // — Africa internal —
  { order: 13, startLat: 30.0444,   startLng: 31.2357,    endLat: -1.2921,   endLng: 36.8219,   arcAlt: 0.3, color: c(0) },
  { order: 13, startLat: -33.9249,  startLng: 18.4241,    endLat: -1.2921,   endLng: 36.8219,   arcAlt: 0.3, color: c(1) },
  { order: 14, startLat: 6.5244,    startLng: 3.3792,     endLat: 30.0444,   endLng: 31.2357,   arcAlt: 0.25,color: c(2) },
  { order: 14, startLat: -15.4167,  startLng: 28.2833,    endLat: -33.9249,  endLng: 18.4241,   arcAlt: 0.2, color: c(0) },
  { order: 15, startLat: 5.5600,    startLng: -0.2057,    endLat: 6.5244,    endLng: 3.3792,    arcAlt: 0.05,color: c(1) },
  { order: 15, startLat: -4.3217,   startLng: 15.3222,    endLat: -15.4167,  endLng: 28.2833,   arcAlt: 0.15,color: c(2) },

  // — Trans-Pacific —
  { order: 16, startLat: 34.0522,   startLng: -118.2437,  endLat: 35.6762,   endLng: 139.6503,  arcAlt: 0.5, color: c(0) },
  { order: 16, startLat: 37.7749,   startLng: -122.4194,  endLat: 22.3193,   endLng: 114.1694,  arcAlt: 0.5, color: c(1) },
  { order: 17, startLat: 40.7128,   startLng: -74.006,    endLat: 1.3521,    endLng: 103.8198,  arcAlt: 0.6, color: c(2) },
  { order: 17, startLat: 21.3069,   startLng: -157.8583,  endLat: 35.6762,   endLng: 139.6503,  arcAlt: 0.3, color: c(0) },

  // — Asia internal —
  { order: 18, startLat: 35.6762,   startLng: 139.6503,   endLat: 37.5665,   endLng: 126.978,   arcAlt: 0.1, color: c(1) },
  { order: 18, startLat: 22.3193,   startLng: 114.1694,   endLat: 1.3521,    endLng: 103.8198,  arcAlt: 0.1, color: c(2) },
  { order: 19, startLat: 28.6139,   startLng: 77.209,     endLat: 22.3193,   endLng: 114.1694,  arcAlt: 0.2, color: c(0) },
  { order: 19, startLat: 1.3521,    startLng: 103.8198,   endLat: 13.7563,   endLng: 100.5018,  arcAlt: 0.1, color: c(1) },
  { order: 20, startLat: 55.7558,   startLng: 37.6173,    endLat: 39.9042,   endLng: 116.4074,  arcAlt: 0.3, color: c(2) },
  { order: 20, startLat: 39.9042,   startLng: 116.4074,   endLat: 35.6762,   endLng: 139.6503,  arcAlt: 0.15,color: c(0) },
  { order: 21, startLat: 28.6139,   startLng: 77.209,     endLat: 6.9271,    endLng: 79.8612,   arcAlt: 0.1, color: c(1) },
  { order: 21, startLat: 25.2048,   startLng: 55.2708,    endLat: 28.6139,   endLng: 77.209,    arcAlt: 0.15,color: c(2) },
  { order: 22, startLat: 31.2304,   startLng: 121.4737,   endLat: 22.3193,   endLng: 114.1694,  arcAlt: 0.1, color: c(0) },
  { order: 22, startLat: 3.1390,    startLng: 101.6869,   endLat: 1.3521,    endLng: 103.8198,  arcAlt: 0.05,color: c(1) },

  // — Europe ↔ Asia —
  { order: 23, startLat: 51.5072,   startLng: -0.1276,    endLat: 55.7558,   endLng: 37.6173,   arcAlt: 0.3, color: c(2) },
  { order: 23, startLat: 48.8566,   startLng: 2.3522,     endLat: 28.6139,   endLng: 77.209,    arcAlt: 0.4, color: c(0) },
  { order: 24, startLat: 52.52,     startLng: 13.405,     endLat: 39.9042,   endLng: 116.4074,  arcAlt: 0.4, color: c(1) },
  { order: 24, startLat: 41.9028,   startLng: 12.4964,    endLat: 25.2048,   endLng: 55.2708,   arcAlt: 0.3, color: c(2) },

  // — Oceania —
  { order: 25, startLat: -33.8688,  startLng: 151.2093,   endLat: -36.8485,  endLng: 174.7633,  arcAlt: 0.1, color: c(0) },
  { order: 25, startLat: -33.8688,  startLng: 151.2093,   endLat: 1.3521,    endLng: 103.8198,  arcAlt: 0.3, color: c(1) },
  { order: 26, startLat: -33.8688,  startLng: 151.2093,   endLat: 35.6762,   endLng: 139.6503,  arcAlt: 0.3, color: c(2) },
  { order: 26, startLat: -37.8136,  startLng: 144.9631,   endLat: -33.8688,  endLng: 151.2093,  arcAlt: 0.05,color: c(0) },

  // — Middle East hub —
  { order: 27, startLat: 25.2048,   startLng: 55.2708,    endLat: 1.3521,    endLng: 103.8198,  arcAlt: 0.3, color: c(1) },
  { order: 27, startLat: 25.2048,   startLng: 55.2708,    endLat: -33.8688,  endLng: 151.2093,  arcAlt: 0.5, color: c(2) },
  { order: 28, startLat: 24.6877,   startLng: 46.7219,    endLat: 30.0444,   endLng: 31.2357,   arcAlt: 0.1, color: c(0) },
  { order: 28, startLat: 41.0082,   startLng: 28.9784,    endLat: 25.2048,   endLng: 55.2708,   arcAlt: 0.2, color: c(1) },
];

export default function GlobeDemo() {
  return (
    <div className="flex items-center justify-center py-20 h-screen dark:bg-black bg-white relative w-full">
      <div className="max-w-7xl mx-auto w-full relative overflow-hidden h-full md:h-[40rem] px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-center text-xl md:text-4xl font-bold text-black dark:text-white">
            Connected worldwide
          </h2>
          <p className="text-center text-base md:text-lg font-normal text-neutral-700 dark:text-neutral-200 max-w-md mt-2 mx-auto">
            Real-time connections across the globe.
          </p>
        </motion.div>
        <div className="absolute w-full bottom-0 inset-x-0 h-40 bg-gradient-to-b pointer-events-none select-none from-transparent dark:to-black to-white z-40" />
        <div className="absolute w-full -bottom-20 h-72 md:h-full z-10">
          <World data={arcs} globeConfig={globeConfig} />
        </div>
      </div>
    </div>
  );
}
