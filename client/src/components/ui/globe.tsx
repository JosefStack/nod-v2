import { useEffect, useRef } from "react";
import * as THREE from "three";

export type Position = {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
};

export type GlobeConfig = {
  pointSize?: number;
  globeColor?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  emissive?: string;
  emissiveIntensity?: number;
  shininess?: number;
  polygonColor?: string;
  ambientLight?: string;
  directionalLeftLight?: string;
  directionalTopLight?: string;
  pointLight?: string;
  arcTime?: number;
  arcLength?: number;
  rings?: number;
  maxRings?: number;
  initialPosition?: { lat: number; lng: number };
  autoRotate?: boolean;
  autoRotateSpeed?: number;
};

function latLngToVec3(lat: number, lng: number, r: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

function safeColor(hex: string): THREE.Color {
  try { return new THREE.Color(hex); }
  catch { return new THREE.Color("#ffffff"); }
}

function pointInRing(p: [number, number], ring: [number, number][]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1];
    const xj = ring[j][0], yj = ring[j][1];
    if (((yi > p[1]) !== (yj > p[1])) &&
        (p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }
  return inside;
}

export function World({ data, globeConfig }: { data: Position[]; globeConfig: GlobeConfig }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let isMounted = true;

    const {
      globeColor = "#062056",
      showAtmosphere = true,
      atmosphereColor = "#FFFFFF",
      atmosphereAltitude = 0.1,
      emissive = "#062056",
      emissiveIntensity = 0.1,
      shininess = 0.9,
      ambientLight = "#38bdf8",
      directionalLeftLight = "#ffffff",
      directionalTopLight = "#ffffff",
      pointLight = "#ffffff",
      autoRotate = true,
      autoRotateSpeed = 0.5,
      arcTime = 2000,
      arcLength = 0.9,
      maxRings = 3,
    } = globeConfig;

    const W = mount.clientWidth || 600;
    const H = mount.clientHeight || 600;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 1000);
    camera.position.set(0, 0, 320);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    scene.add(new THREE.AmbientLight(safeColor(ambientLight), 0.6));
    const dl1 = new THREE.DirectionalLight(safeColor(directionalLeftLight), 0.8);
    dl1.position.set(-400, 100, 400);
    scene.add(dl1);
    const dl2 = new THREE.DirectionalLight(safeColor(directionalTopLight), 0.8);
    dl2.position.set(-200, 500, 200);
    scene.add(dl2);
    const pl = new THREE.PointLight(safeColor(pointLight), 0.8);
    pl.position.set(-200, 500, 200);
    scene.add(pl);

    const R = 100;

    group.add(new THREE.Mesh(
      new THREE.SphereGeometry(R, 64, 64),
      new THREE.MeshPhongMaterial({
        color: safeColor(globeColor),
        emissive: safeColor(emissive),
        emissiveIntensity,
        shininess: shininess * 100,
      })
    ));

    if (showAtmosphere) {
      group.add(new THREE.Mesh(
        new THREE.SphereGeometry(R * (1 + atmosphereAltitude), 64, 64),
        new THREE.MeshPhongMaterial({
          color: safeColor(atmosphereColor),
          transparent: true,
          opacity: 0.12,
          side: THREE.BackSide,
        })
      ));
    }

    // Land dots: fetch TopoJSON, build polygon rings, sample a lat/lng grid with point-in-polygon
    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json")
      .then((r) => r.json())
      .then(({ objects, arcs: topoArcs, transform }: any) => {
        if (!isMounted) return;

        const scale: [number, number] = transform?.scale ?? [1, 1];
        const translate: [number, number] = transform?.translate ?? [0, 0];

        function decodeArc(arcIdx: number): [number, number][] {
          const raw: number[][] = arcIdx >= 0
            ? topoArcs[arcIdx]
            : [...topoArcs[~arcIdx]].reverse();
          let x = 0, y = 0;
          return raw.map(([dx, dy]) => {
            x += dx; y += dy;
            return [x * scale[0] + translate[0], y * scale[1] + translate[1]] as [number, number];
          });
        }

        type Poly = {
          exterior: [number, number][];
          holes: [number, number][][];
          bb: { minLng: number; maxLng: number; minLat: number; maxLat: number };
        };
        const polygons: Poly[] = [];

        const buildPolygon = (arcGroups: number[][]) => {
          if (!arcGroups.length) return;
          const exterior: [number, number][] = [];
          for (const idx of arcGroups[0]) exterior.push(...decodeArc(idx));

          const holes: [number, number][][] = [];
          for (let h = 1; h < arcGroups.length; h++) {
            const hole: [number, number][] = [];
            for (const idx of arcGroups[h]) hole.push(...decodeArc(idx));
            holes.push(hole);
          }

          let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity;
          for (const [lng, lat] of exterior) {
            if (lng < minLng) minLng = lng;
            if (lng > maxLng) maxLng = lng;
            if (lat < minLat) minLat = lat;
            if (lat > maxLat) maxLat = lat;
          }
          polygons.push({ exterior, holes, bb: { minLng, maxLng, minLat, maxLat } });
        };

        for (const geom of objects.countries.geometries) {
          if (geom.type === "Polygon") {
            buildPolygon(geom.arcs);
          } else if (geom.type === "MultiPolygon") {
            for (const polyArcs of geom.arcs) buildPolygon(polyArcs);
          }
        }

        // Sample every STEP degrees; reject quickly via bounding box, then full PIP
        const STEP = 2.5;
        const landPositions: number[] = [];

        for (let lat = -88; lat <= 88; lat += STEP) {
          for (let lng = -180; lng <= 180; lng += STEP) {
            const pt: [number, number] = [lng, lat];
            for (const poly of polygons) {
              if (lng < poly.bb.minLng || lng > poly.bb.maxLng ||
                  lat < poly.bb.minLat || lat > poly.bb.maxLat) continue;
              if (!pointInRing(pt, poly.exterior)) continue;
              let inHole = false;
              for (const hole of poly.holes) {
                if (pointInRing(pt, hole)) { inHole = true; break; }
              }
              if (!inHole) {
                const v = latLngToVec3(lat, lng, R + 0.5);
                landPositions.push(v.x, v.y, v.z);
                break;
              }
            }
          }
        }

        if (!isMounted) return;
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute(landPositions, 3));
        group.add(new THREE.Points(geo, new THREE.PointsMaterial({
          color: new THREE.Color("#a8d4f0"),
          size: 1.4,
          transparent: true,
          opacity: 0.6,
          sizeAttenuation: true,
        })));
      })
      .catch(() => {});

    // City discs at arc endpoints
    const discMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#06b6d4"),
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
    });
    data.forEach((arc) => {
      const pos = latLngToVec3(arc.endLat, arc.endLng, R + 1.5);
      const disc = new THREE.Mesh(new THREE.CircleGeometry(2.2, 16), discMat);
      disc.position.copy(pos);
      disc.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), pos.clone().normalize());
      group.add(disc);
    });

    // Animated arcs
    const ARC_SEGMENTS = 90;
    type ArcEntry = { line: THREE.Line; startMs: number; order: number };
    const arcEntries: ArcEntry[] = [];

    data.forEach((arc) => {
      const s = latLngToVec3(arc.startLat, arc.startLng, R);
      const e = latLngToVec3(arc.endLat, arc.endLng, R);
      const ctrl = s.clone().add(e).normalize().multiplyScalar(R + arc.arcAlt * R * 0.85);
      const pts = new THREE.QuadraticBezierCurve3(s, ctrl, e).getPoints(ARC_SEGMENTS);
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      geo.setDrawRange(0, 0);
      const line = new THREE.Line(
        geo,
        new THREE.LineBasicMaterial({ color: safeColor(arc.color), transparent: true, opacity: 0.88 })
      );
      group.add(line);
      arcEntries.push({ line, startMs: Date.now() + arc.order * 350, order: arc.order });
    });

    // Expanding rings at endpoints
    const ringPalette = ["#06b6d4", "#3b82f6", "#6366f1"];
    const RING_LIFE = 2500;
    const RING_MAX = 9;
    const ringCount = Math.min(maxRings * 4, data.length);

    const rings = data.slice(0, ringCount).map((arc, i) => {
      const pos = latLngToVec3(arc.endLat, arc.endLng, R + 0.4);
      const mesh = new THREE.Mesh(
        new THREE.RingGeometry(0.5, 1.1, 32),
        new THREE.MeshBasicMaterial({
          color: safeColor(ringPalette[i % ringPalette.length]),
          transparent: true,
          side: THREE.DoubleSide,
          depthWrite: false,
        })
      );
      mesh.position.copy(pos);
      mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), pos.clone().normalize());
      group.add(mesh);
      return { mesh, startMs: Date.now() + i * (RING_LIFE / (ringCount || 1)) };
    });

    let raf: number;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const now = Date.now();

      if (autoRotate) group.rotation.y += autoRotateSpeed * 0.002;

      for (const entry of arcEntries) {
        const elapsed = now - entry.startMs;
        if (elapsed <= 0) { entry.line.geometry.setDrawRange(0, 0); continue; }
        const t = elapsed / arcTime;
        if (t < 1) {
          entry.line.geometry.setDrawRange(0, Math.max(2, Math.floor(t * arcLength * ARC_SEGMENTS)));
        } else if (t < 2) {
          entry.line.geometry.setDrawRange(0, Math.floor(arcLength * ARC_SEGMENTS));
        } else {
          entry.startMs = now + entry.order * 350;
          entry.line.geometry.setDrawRange(0, 0);
        }
      }

      for (const r of rings) {
        const t = ((now - r.startMs) % RING_LIFE) / RING_LIFE;
        const s = t * RING_MAX;
        r.mesh.scale.set(s, s, 1);
        (r.mesh.material as THREE.MeshBasicMaterial).opacity = 0.85 * (1 - t);
      }

      renderer.render(scene, camera);
    };
    tick();

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      isMounted = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
}
