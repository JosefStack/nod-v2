import { World, type GlobeConfig, type Position } from "@/components/ui/globe";

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
  autoRotate: true,
  autoRotateSpeed: 0.5,
};

const colors = ["#06b6d4", "#3b82f6", "#6366f1"];
const r = () => colors[Math.floor(Math.random() * colors.length)];

const sampleArcs: Position[] = [
  { order: 1, startLat: -19.9, startLng: -43.9, endLat: -22.9, endLng: -43.2, arcAlt: 0.1, color: r() },
  { order: 1, startLat: 28.6, startLng: 77.2, endLat: 3.1, endLng: 101.7, arcAlt: 0.2, color: r() },
  { order: 1, startLat: -19.9, startLng: -43.9, endLat: -1.3, endLng: 36.9, arcAlt: 0.5, color: r() },
  { order: 2, startLat: 1.4, startLng: 103.8, endLat: 35.7, endLng: 139.7, arcAlt: 0.2, color: r() },
  { order: 2, startLat: 51.5, startLng: -0.1, endLat: 3.1, endLng: 101.7, arcAlt: 0.3, color: r() },
  { order: 2, startLat: -15.8, startLng: -47.9, endLat: 36.2, endLng: -115.1, arcAlt: 0.3, color: r() },
  { order: 3, startLat: -33.9, startLng: 151.2, endLat: 22.3, endLng: 114.2, arcAlt: 0.3, color: r() },
  { order: 3, startLat: 21.3, startLng: -157.9, endLat: 40.7, endLng: -74.0, arcAlt: 0.3, color: r() },
  { order: 3, startLat: -6.2, startLng: 106.8, endLat: 51.5, endLng: -0.1, arcAlt: 0.3, color: r() },
  { order: 4, startLat: 11.9, startLng: 8.6, endLat: -15.6, endLng: -56.1, arcAlt: 0.5, color: r() },
  { order: 4, startLat: -34.6, startLng: -58.4, endLat: 22.3, endLng: 114.2, arcAlt: 0.7, color: r() },
  { order: 4, startLat: 51.5, startLng: -0.1, endLat: 48.9, endLng: -2.4, arcAlt: 0.1, color: r() },
  { order: 5, startLat: 14.6, startLng: 121.0, endLat: 51.5, endLng: -0.1, arcAlt: 0.3, color: r() },
  { order: 5, startLat: 1.4, startLng: 103.8, endLat: -33.9, endLng: 151.2, arcAlt: 0.2, color: r() },
  { order: 5, startLat: 34.1, startLng: -118.2, endLat: 48.9, endLng: -2.4, arcAlt: 0.2, color: r() },
  { order: 6, startLat: -15.4, startLng: 28.3, endLat: 1.1, endLng: -63.3, arcAlt: 0.7, color: r() },
  { order: 6, startLat: 37.6, startLng: 126.9, endLat: 35.7, endLng: 139.7, arcAlt: 0.1, color: r() },
  { order: 7, startLat: 52.5, startLng: 13.4, endLat: 34.1, endLng: -118.2, arcAlt: 0.2, color: r() },
  { order: 8, startLat: 1.4, startLng: 103.8, endLat: 40.7, endLng: -74.0, arcAlt: 0.5, color: r() },
  { order: 9, startLat: 51.5, startLng: -0.1, endLat: 34.1, endLng: -118.2, arcAlt: 0.2, color: r() },
  { order: 10, startLat: -22.9, startLng: -43.2, endLat: 28.6, endLng: 77.2, arcAlt: 0.7, color: r() },
];

interface GlobePanelProps {
  heading: React.ReactNode;
  subtext: string;
}

export function GlobePanel({ heading, subtext }: GlobePanelProps) {
  return (
    <div className="relative hidden lg:flex flex-col w-[60%] bg-black overflow-hidden">
      <div className="absolute inset-0">
        <World data={sampleArcs} globeConfig={globeConfig} />
      </div>
      <div className="absolute bottom-10 left-10 right-10 z-10">
        <h1 className="text-5xl font-bold text-white leading-tight">{heading}</h1>
        <p className="mt-4 text-gray-300 text-lg max-w-lg">{subtext}</p>
      </div>
    </div>
  );
}
