import { useEffect, useRef } from "react";

const SVG_NS = "http://www.w3.org/2000/svg";

const config = {
  particleCount: 24,
  trailSpan: 0.18,
  durationMs: 8000,
  pulseDurationMs: 5600,
  strokeWidth: 3.9,
  heartWaveB: 3.2,
  heartWaveRoot: 3.3,
  heartWaveAmp: 0.9,
  heartWaveScaleX: 14,
  heartWaveScaleY: 14,
};

function getDetailScale(time: number) {
  const pulseProgress = (time % config.pulseDurationMs) / config.pulseDurationMs;
  return 0.52 + ((Math.sin(pulseProgress * Math.PI * 2 + 0.55) + 1) / 2) * 0.48;
}

function point(progress: number, detailScale: number) {
  const xLimit = Math.sqrt(config.heartWaveRoot);
  const x = -xLimit + progress * xLimit * 2;
  const safeRoot = Math.max(0, config.heartWaveRoot - x * x);
  const wave = config.heartWaveAmp * Math.sqrt(safeRoot) * Math.sin(config.heartWaveB * Math.PI * x);
  const y = Math.pow(Math.abs(x), 2 / 3) + wave;
  const scaleY = config.heartWaveScaleY + detailScale * 1.5;
  return { x: 50 + x * config.heartWaveScaleX, y: 18 + (1.75 - y) * scaleY };
}

function buildPath(detailScale: number, steps = 480) {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const p = point(i / steps, detailScale);
    return `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
  }).join(" ");
}

export function HeartWave() {
  const groupRef = useRef<SVGGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const particlesRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const group = groupRef.current;
    const path = pathRef.current;
    const particlesGroup = particlesRef.current;
    if (!group || !path || !particlesGroup) return;

    path.setAttribute("stroke-width", String(config.strokeWidth));

    const particles = Array.from({ length: config.particleCount }, () => {
      const circle = document.createElementNS(SVG_NS, "circle");
      circle.setAttribute("fill", "currentColor");
      particlesGroup.appendChild(circle);
      return circle;
    });

    const startedAt = performance.now();
    let rafId: number;

    function render(now: number) {
      const time = now - startedAt;
      const progress = (time % config.durationMs) / config.durationMs;
      const detailScale = getDetailScale(time);

      path!.setAttribute("d", buildPath(detailScale));

      particles.forEach((node, index) => {
        const tailOffset = index / (config.particleCount - 1);
        const p = point(((progress - tailOffset * config.trailSpan) % 1 + 1) % 1, detailScale);
        const fade = Math.pow(1 - tailOffset, 0.56);
        node.setAttribute("cx", p.x.toFixed(2));
        node.setAttribute("cy", p.y.toFixed(2));
        node.setAttribute("r", (0.9 + fade * 2.7).toFixed(2));
        node.setAttribute("opacity", (0.04 + fade * 0.96).toFixed(3));
      });

      rafId = requestAnimationFrame(render);
    }

    rafId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(rafId);
      while (particlesGroup.firstChild) particlesGroup.removeChild(particlesGroup.firstChild);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505]">
      <div style={{ width: "min(72vmin, 420px)", aspectRatio: "1" }} className="flex items-center justify-center">
        <svg viewBox="0 0 100 100" fill="none" aria-hidden="true" style={{ width: "100%", height: "100%", overflow: "visible", color: "#f5f5f5" }}>
          <g ref={groupRef}>
            <path ref={pathRef} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" opacity="0.1" />
            <g ref={particlesRef} />
          </g>
        </svg>
      </div>
    </div>
  );
}
