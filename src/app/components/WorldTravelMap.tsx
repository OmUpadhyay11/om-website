"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { geoDistance, geoGraticule10, geoOrthographic, geoPath } from "d3-geo";
import { feature, mesh } from "topojson-client";
import Image from "next/image";

type TravelLocation = {
  name: string;
  coordinates: [number, number]; // [longitude, latitude]
  description?: string;
  photos?: string[];
};

const MAP_WIDTH = 1000;
const MAP_HEIGHT = 620;
const MIN_SCALE = 0.85;
const MAX_SCALE = 7.5;
const INITIAL_ZOOM_SCALE = 1.25;
const BASE_GLOBE_SCALE = 230;
const INITIAL_ROTATION: [number, number] = [100, -28];
const AUTO_ROTATE_DEG_PER_SEC = 4.76;
const AUTO_ROTATE_MAX_ZOOM = MAP_WIDTH / (2 * BASE_GLOBE_SCALE);
const DRAG_ROTATE_SENSITIVITY = 0.28;
const INERTIA_DAMPING_PER_SEC = 3.1;
const MIN_INERTIA_SPEED = 10;
const PROJECTION_PRECISION = 1.15;
const ZOOM_INTERVAL_FACTOR = 1.35;
const LABELS_AND_SPIN_OFFSET_INTERVALS = 2;
const EARLIER_TRIGGER_FACTOR =
  Math.pow(ZOOM_INTERVAL_FACTOR, LABELS_AND_SPIN_OFFSET_INTERVALS);
const AUTO_ROTATE_STOP_ZOOM = Math.max(
  INITIAL_ZOOM_SCALE + 0.25,
  AUTO_ROTATE_MAX_ZOOM / EARLIER_TRIGGER_FACTOR,
);
const PIN_LABELS_SHOW_ZOOM = AUTO_ROTATE_STOP_ZOOM;
const COUNTRY_LABELS = [
  { name: "Canada", coordinates: [-106, 57] as [number, number] },
  { name: "USA", coordinates: [-97, 39] as [number, number] },
  { name: "Mexico", coordinates: [-102, 23] as [number, number] },
  { name: "Bahamas", coordinates: [-76.5, 24.5] as [number, number] },
  { name: "India", coordinates: [78, 22.5] as [number, number] },
  { name: "UAE", coordinates: [54.3, 24.2] as [number, number] },
];

// Editable list of locations you've been to.
const TRAVEL_LOCATIONS: TravelLocation[] = [
  {
    name: "Edmonton, Canada",
    coordinates: [-113.4938, 53.5461],
    description: "spawnpoint est. 2006",
  },
  {
    name: "Calgary, Canada",
    coordinates: [-114.0719, 51.0447],
    description: "i go here like 5x a year",
  },
  { name: "Vancouver, Canada", coordinates: [-123.1207, 49.2827] },
  { name: "Toronto, Canada", coordinates: [-79.3832, 43.6532] },
  { name: "Ottawa, Canada", coordinates: [-75.6972, 45.4215] },
  { name: "Montreal, Canada", coordinates: [-73.5673, 45.5017] },
  {
    name: "Waterloo, Canada",
    coordinates: [-80.5204, 43.4643],
    description: "engineering @ UW, 2024-2029",
  },
  { name: "Victoria, BC, Canada", coordinates: [-123.3656, 48.4284] },
  { name: "Regina, Canada", coordinates: [-104.6189, 50.4452] },
  {
    name: "Banff, Canada",
    coordinates: [-115.5708, 51.1784],
    photos: [
      "/banff_pics_website/IMG_6254.JPG",
      "/banff_pics_website/IMG_6269.JPG",
      "/banff_pics_website/IMG_6607.JPG",
      "/banff_pics_website/IMG_7408.JPG",
      "/banff_pics_website/IMG_7453.JPG",
      "/banff_pics_website/IMG_9442.HEIC",
      "/banff_pics_website/IMG_9446.HEIC",
      "/banff_pics_website/IMG_9464.HEIC",
    ],
  },
  {
    name: "Jasper, Canada",
    coordinates: [-118.0814, 52.8737],
    photos: [
      "/jasper_pics_website/IMG_6938.jpeg",
      "/jasper_pics_website/IMG_6945.jpeg",
      "/jasper_pics_website/IMG_6951.jpeg",
      "/jasper_pics_website/IMG_6956.jpeg",
      "/jasper_pics_website/IMG_6963.jpeg",
    ],
  },
  {
    name: "Hawaii, USA",
    coordinates: [-157.8583, 21.3069],
    photos: [
      "/gg_hawaii_pics/IMG_7434.jpeg",
      "/gg_hawaii_pics/IMG_7468.jpeg",
      "/gg_hawaii_pics/IMG_7528.jpeg",
      "/gg_hawaii_pics/IMG_7659.jpeg",
      "/gg_hawaii_pics/IMG_7736.jpeg",
      "/gg_hawaii_pics/IMG_7772.jpeg",
      "/gg_hawaii_pics/IMG_7800.jpeg",
      "/gg_hawaii_pics/IMG_7827.jpeg",
      "/gg_hawaii_pics/IMG_7853.jpeg",
      "/gg_hawaii_pics/IMG_7862.jpeg",
      "/gg_hawaii_pics/IMG_7898.jpeg",
      "/gg_hawaii_pics/IMG_7924.jpeg",
    ],
  },
  { name: "Dubai, UAE", coordinates: [55.2708, 25.2048] },
  { name: "Gujarat, India", coordinates: [72.5714, 23.0225] },
  {
    name: "Maharashtra, India",
    coordinates: [72.8777, 19.076],
    photos: [
      "/maharastra_pics_website/IMG_4010.jpeg",
      "/maharastra_pics_website/IMG_4018.jpeg",
      "/maharastra_pics_website/IMG_4029.jpeg",
      "/maharastra_pics_website/IMG_4081.jpeg",
      "/maharastra_pics_website/IMG_4137.jpeg",
      "/maharastra_pics_website/IMG_4153.jpeg",
    ],
  },
  {
    name: "Uttarakhand, India",
    coordinates: [79.0193, 30.0668],
    photos: [
      "/uttrakhand_pics_website/IMG_4248.jpeg",
      "/uttrakhand_pics_website/IMG_4255.jpeg",
      "/uttrakhand_pics_website/IMG_4300.jpeg",
      "/uttrakhand_pics_website/IMG_4348.jpeg",
      "/uttrakhand_pics_website/IMG_4353.jpeg",
      "/uttrakhand_pics_website/IMG_4379.jpeg",
      "/uttrakhand_pics_website/IMG_4413.jpeg",
      "/uttrakhand_pics_website/IMG_4419.jpeg",
      "/uttrakhand_pics_website/IMG_4453.jpeg",
      "/uttrakhand_pics_website/IMG_4470.jpeg",
      "/uttrakhand_pics_website/IMG_4502.jpeg",
      "/uttrakhand_pics_website/IMG_4554.jpeg",
      "/uttrakhand_pics_website/IMG_4573.jpeg",
      "/uttrakhand_pics_website/IMG_4584.jpeg",
      "/uttrakhand_pics_website/IMG_4620.jpeg",
      "/uttrakhand_pics_website/IMG_4634.jpeg",
      "/uttrakhand_pics_website/IMG_4659.jpeg",
      "/uttrakhand_pics_website/IMG_4669.jpeg",
    ],
  },
  {
    name: "Miami, USA",
    coordinates: [-80.1918, 25.7617],
    photos: [
      "/miami_pics_website/IMG_5883.jpeg",
      "/miami_pics_website/IMG_8465.jpeg",
      "/miami_pics_website/IMG_8575.jpeg",
      "/miami_pics_website/IMG_9078.jpeg",
      "/miami_pics_website/IMG_9092.jpeg",
      "/miami_pics_website/IMG_9096.jpeg",
      "/miami_pics_website/IMG_9104.jpeg",
    ],
  },
  {
    name: "The Bahamas",
    coordinates: [-77.3554, 25.0443],
    photos: [
      "/bahamas_pics_website/IMG_6176.jpeg",
      "/bahamas_pics_website/IMG_6326.jpeg",
      "/bahamas_pics_website/IMG_6344.jpeg",
      "/bahamas_pics_website/IMG_8643.jpeg",
      "/bahamas_pics_website/IMG_8658.jpeg",
      "/bahamas_pics_website/IMG_8800.jpeg",
      "/bahamas_pics_website/IMG_8810.jpeg",
      "/bahamas_pics_website/IMG_8820.jpg",
    ],
  },
  { name: "Cancun, Mexico", coordinates: [-86.8515, 21.1619] },
  { name: "Puerto Vallarta, Mexico", coordinates: [-105.2306, 20.6534] },
  { name: "Seattle, USA", coordinates: [-122.3321, 47.6062] },
  {
    name: "Yellowstone, USA",
    coordinates: [-110.5885, 44.4279],
    photos: [
      "/yellowstone_pics_website/IMG_6351.jpeg",
      "/yellowstone_pics_website/IMG_6377.jpeg",
      "/yellowstone_pics_website/IMG_6430.jpeg",
      "/yellowstone_pics_website/IMG_6479.jpeg",
      "/yellowstone_pics_website/IMG_6529.jpeg",
      "/yellowstone_pics_website/IMG_6547.jpeg",
      "/yellowstone_pics_website/IMG_6562.jpeg",
      "/yellowstone_pics_website/IMG_6604.jpeg",
      "/yellowstone_pics_website/IMG_6646.jpeg",
      "/yellowstone_pics_website/IMG_6671.jpeg",
      "/yellowstone_pics_website/IMG_6673.jpeg",
      "/yellowstone_pics_website/IMG_6684.jpeg",
      "/yellowstone_pics_website/IMG_6688.jpeg",
      "/yellowstone_pics_website/IMG_6710.jpeg",
      "/yellowstone_pics_website/IMG_6734.jpeg",
      "/yellowstone_pics_website/IMG_6750.jpeg",
      "/yellowstone_pics_website/IMG_6767.jpeg",
    ],
  },
  { name: "San Francisco, USA", coordinates: [-122.4194, 37.7749] },
  { name: "Los Angeles, USA", coordinates: [-118.2437, 34.0522] },
  { name: "Las Vegas, USA", coordinates: [-115.1398, 36.1699] },
];

export default function WorldTravelMap() {
  const [land, setLand] = useState<GeoJSON.Feature | null>(null);
  const [borders, setBorders] = useState<GeoJSON.MultiLineString | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<TravelLocation | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isFlinging, setIsFlinging] = useState(false);
  const [zoomScale, setZoomScale] = useState(INITIAL_ZOOM_SCALE);
  const [rotation, setRotation] = useState<[number, number]>(INITIAL_ROTATION);

  const selectedPhotoList = selectedLocation?.photos ?? [];
  const selectedPhotoIndex = selectedPhoto ? selectedPhotoList.indexOf(selectedPhoto) : -1;
  const hasPhotoGallery = selectedPhotoList.length > 0;

  function goToPreviousPhoto() {
    if (!selectedPhotoList.length || selectedPhotoIndex < 0) return;
    const prevIndex =
      (selectedPhotoIndex - 1 + selectedPhotoList.length) % selectedPhotoList.length;
    setSelectedPhoto(selectedPhotoList[prevIndex]);
  }

  function goToNextPhoto() {
    if (!selectedPhotoList.length || selectedPhotoIndex < 0) return;
    const nextIndex = (selectedPhotoIndex + 1) % selectedPhotoList.length;
    setSelectedPhoto(selectedPhotoList[nextIndex]);
  }

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const dragStateRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    startRotation: [number, number];
  } | null>(null);
  const movedDuringPointerRef = useRef(false);
  const rotationRef = useRef<[number, number]>(INITIAL_ROTATION);
  const velocityRef = useRef<{ lon: number; lat: number }>({ lon: 0, lat: 0 });
  const lastMoveRef = useRef<{ x: number; y: number; ts: number } | null>(null);
  const flingFrameRef = useRef<number | null>(null);
  const dragFrameRef = useRef<number | null>(null);
  const pendingRotationRef = useRef<[number, number] | null>(null);
  const autoRotateStateRef = useRef({
    isInView: false,
    isDragging: false,
    isFlinging: false,
    zoomScale: INITIAL_ZOOM_SCALE,
    hasOpenModal: false,
  });

  useEffect(() => {
    rotationRef.current = rotation;
  }, [rotation]);

  useEffect(() => {
    const el = mapContainerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsInView(entry?.isIntersecting ?? false);
      },
      { threshold: 0.12 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView || land) return;
    const controller = new AbortController();

    async function loadMap() {
      try {
        const res = await fetch(
          "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json",
          { signal: controller.signal },
        );
        const topo = await res.json();
        const landFeature = feature(topo, topo.objects.land) as GeoJSON.Feature;
        const bordersMesh = mesh(
          topo,
          topo.objects.countries,
          (a, b) => a !== b,
        ) as GeoJSON.MultiLineString;
        setLand(landFeature);
        setBorders(bordersMesh);
      } catch {
        // Ignore loading failures to keep the rest of the page interactive.
      }
    }

    loadMap();
    return () => controller.abort();
  }, [isInView, land]);

  function stopFling() {
    if (flingFrameRef.current !== null) {
      window.cancelAnimationFrame(flingFrameRef.current);
      flingFrameRef.current = null;
    }
    velocityRef.current = { lon: 0, lat: 0 };
    setIsFlinging(false);
  }

  useEffect(() => {
    return () => {
      if (dragFrameRef.current !== null) {
        window.cancelAnimationFrame(dragFrameRef.current);
      }
      if (flingFrameRef.current !== null) {
        window.cancelAnimationFrame(flingFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    autoRotateStateRef.current = {
      isInView,
      isDragging,
      isFlinging,
      zoomScale,
      hasOpenModal: !!selectedLocation || !!selectedPhoto,
    };
  }, [isInView, isDragging, isFlinging, zoomScale, selectedLocation, selectedPhoto]);

  useEffect(() => {
    let frameId = 0;
    let lastTs = 0;
    const targetFrameMs = 1000 / 30; // run idle spin at 30fps for lower CPU load

    const tick = (ts: number) => {
      const state = autoRotateStateRef.current;
      const shouldAutoRotate =
        state.isInView &&
        !state.isDragging &&
        !state.isFlinging &&
        state.zoomScale < AUTO_ROTATE_STOP_ZOOM &&
        !state.hasOpenModal;

      if (!shouldAutoRotate) {
        // Keep timestamp fresh so resuming auto-rotate doesn't jump.
        lastTs = ts;
        frameId = window.requestAnimationFrame(tick);
        return;
      }

      if (!lastTs) lastTs = ts;
      const elapsedMs = ts - lastTs;
      if (elapsedMs < targetFrameMs) {
        frameId = window.requestAnimationFrame(tick);
        return;
      }
      const deltaSec = elapsedMs / 1000;
      lastTs = ts;

      setRotation((prev) => [
        normalizeLongitude(prev[0] + AUTO_ROTATE_DEG_PER_SEC * deltaSec),
        prev[1],
      ]);

      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    if (!selectedLocation?.photos?.length) return;
    // Preload gallery images to reduce lag when opening thumbnails/fullscreen.
    selectedLocation.photos.forEach((src) => {
      const preloader = new window.Image();
      preloader.src = src;
    });
  }, [selectedLocation]);

  useEffect(() => {
    if (!selectedPhotoList.length || selectedPhotoIndex < 0) return;
    const nextIndex = (selectedPhotoIndex + 1) % selectedPhotoList.length;
    const prevIndex =
      (selectedPhotoIndex - 1 + selectedPhotoList.length) % selectedPhotoList.length;
    [selectedPhotoList[nextIndex], selectedPhotoList[prevIndex]].forEach((src) => {
      const preloader = new window.Image();
      preloader.src = src;
    });
  }, [selectedPhotoIndex, selectedPhotoList]);

  const projection = useMemo(
    () =>
      geoOrthographic()
        .translate([MAP_WIDTH / 2, MAP_HEIGHT / 2])
        .scale(BASE_GLOBE_SCALE * zoomScale)
        .rotate([rotation[0], rotation[1], 0])
        .clipAngle(90)
        .precision(PROJECTION_PRECISION),
    [rotation, zoomScale],
  );

  const path = useMemo(() => geoPath(projection), [projection]);
  const graticulePath = useMemo(() => path(geoGraticule10()) ?? "", [path]);
  const landPath = useMemo(() => (land ? path(land) ?? "" : ""), [land, path]);
  const bordersPath = useMemo(
    () => (borders ? path(borders) ?? "" : ""),
    [borders, path],
  );

  const projectedPins = useMemo(() => {
    const center: [number, number] = [-rotation[0], -rotation[1]];

    return TRAVEL_LOCATIONS.map((location) => ({
      location,
      point: projection(location.coordinates),
      isFrontFacing: geoDistance(location.coordinates, center) <= Math.PI / 2,
    })).filter(
      (
        item,
      ): item is {
        location: TravelLocation;
        point: [number, number];
        isFrontFacing: true;
      } => !!item.point && item.isFrontFacing,
    );
  }, [projection, rotation]);

  const projectedCountryLabels = useMemo(() => {
    const center: [number, number] = [-rotation[0], -rotation[1]];

    return COUNTRY_LABELS.map((label) => ({
      ...label,
      point: projection(label.coordinates),
      isFrontFacing: geoDistance(label.coordinates, center) <= Math.PI / 2,
    })).filter(
      (
        item,
      ): item is {
        name: string;
        coordinates: [number, number];
        point: [number, number];
        isFrontFacing: true;
      } => !!item.point && item.isFrontFacing,
    );
  }, [projection, rotation]);

  useEffect(() => {
    if (isInView) return;
    stopFling();
  }, [isInView]);

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const wheelHandler = (event: WheelEvent) => {
      const rect = svgEl.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      // Convert mouse position from rendered pixels to SVG viewBox coordinates.
      const x = ((event.clientX - rect.left) / rect.width) * MAP_WIDTH;
      const y = ((event.clientY - rect.top) / rect.height) * MAP_HEIGHT;
      const cx = MAP_WIDTH / 2;
      const cy = MAP_HEIGHT / 2;
      const globeRadius = BASE_GLOBE_SCALE * zoomScale;
      const isOnGlobe = (x - cx) * (x - cx) + (y - cy) * (y - cy) <= globeRadius * globeRadius;

      if (!isOnGlobe) return;

      event.preventDefault();
      event.stopPropagation();
      setZoomScale((prev) => {
        const next = prev * Math.exp(-event.deltaY * 0.0025);
        return Math.min(MAX_SCALE, Math.max(MIN_SCALE, next));
      });
    };

    svgEl.addEventListener("wheel", wheelHandler, { passive: false });
    return () => svgEl.removeEventListener("wheel", wheelHandler);
  }, [zoomScale]);

  function zoomBy(factor: number) {
    setZoomScale((prev) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev * factor)));
  }

  function zoomIn() {
    zoomBy(1.35);
  }

  function zoomOut() {
    zoomBy(0.84);
  }

  function resetView() {
    stopFling();
    setZoomScale(INITIAL_ZOOM_SCALE);
    setRotation(INITIAL_ROTATION);
  }

  function normalizeLongitude(value: number) {
    let normalized = value;
    while (normalized > 180) normalized -= 360;
    while (normalized < -180) normalized += 360;
    return normalized;
  }

  function startDrag(event: React.PointerEvent<SVGSVGElement>) {
    if (selectedLocation) return;
    stopFling();
    movedDuringPointerRef.current = false;
    lastMoveRef.current = {
      x: event.clientX,
      y: event.clientY,
      ts: performance.now(),
    };
    velocityRef.current = { lon: 0, lat: 0 };
    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startRotation: rotationRef.current,
    };
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function dragGlobe(event: React.PointerEvent<SVGSVGElement>) {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) return;

    const dx = event.clientX - dragState.startX;
    const dy = event.clientY - dragState.startY;
    if (Math.abs(dx) + Math.abs(dy) > 2) movedDuringPointerRef.current = true;
    const normalizedZoom = Math.max(zoomScale, 1);
    const effectiveSensitivity = Math.max(
      0.08,
      DRAG_ROTATE_SENSITIVITY / Math.pow(normalizedZoom, 0.72),
    );

    const move = lastMoveRef.current;
    const now = performance.now();
    if (move) {
      const dt = Math.max(1, now - move.ts);
      const vxPx = (event.clientX - move.x) / dt;
      const vyPx = (event.clientY - move.y) / dt;
      velocityRef.current = {
        lon: vxPx * 1000 * effectiveSensitivity,
        lat: -vyPx * 1000 * effectiveSensitivity,
      };
    }
    lastMoveRef.current = { x: event.clientX, y: event.clientY, ts: now };

    const nextLon = normalizeLongitude(
      dragState.startRotation[0] + dx * effectiveSensitivity,
    );
    const nextLat = Math.max(
      -85,
      Math.min(85, dragState.startRotation[1] - dy * effectiveSensitivity),
    );
    pendingRotationRef.current = [nextLon, nextLat];

    if (dragFrameRef.current === null) {
      dragFrameRef.current = window.requestAnimationFrame(() => {
        dragFrameRef.current = null;
        if (!pendingRotationRef.current) return;
        setRotation(pendingRotationRef.current);
      });
    }
  }

  function endDrag(event: React.PointerEvent<SVGSVGElement>) {
    if (dragStateRef.current?.pointerId !== event.pointerId) return;
    dragStateRef.current = null;
    lastMoveRef.current = null;
    pendingRotationRef.current = null;
    setIsDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const startVelocity = velocityRef.current;
    const speed = Math.hypot(startVelocity.lon, startVelocity.lat);
    if (speed < MIN_INERTIA_SPEED) {
      velocityRef.current = { lon: 0, lat: 0 };
      return;
    }

    setIsFlinging(true);
    let lastTs = 0;

    const tick = (ts: number) => {
      if (!lastTs) lastTs = ts;
      const deltaSec = (ts - lastTs) / 1000;
      lastTs = ts;

      const damping = Math.exp(-INERTIA_DAMPING_PER_SEC * deltaSec);
      const nextLonVel = velocityRef.current.lon * damping;
      const nextLatVel = velocityRef.current.lat * damping;
      velocityRef.current = { lon: nextLonVel, lat: nextLatVel };

      setRotation((prev) => [
        normalizeLongitude(prev[0] + nextLonVel * deltaSec),
        Math.max(-85, Math.min(85, prev[1] + nextLatVel * deltaSec)),
      ]);

      const nextSpeed = Math.hypot(nextLonVel, nextLatVel);
      if (nextSpeed < MIN_INERTIA_SPEED) {
        stopFling();
        return;
      }

      flingFrameRef.current = window.requestAnimationFrame(tick);
    };

    flingFrameRef.current = window.requestAnimationFrame(tick);
  }

  function selectLocation(location: TravelLocation) {
    setSelectedLocation(location);
  }

  return (
    <div className="mt-5">
      <div className="mb-3 text-center">
        <p className="text-lg font-semibold text-white md:text-xl">Global Gallery</p>
        <p className="mt-1 text-[13px] text-white/90 md:text-sm">
          <span className="relative -top-[2px] mr-1 inline-block leading-none text-[21px]">🗺️</span>
          Click on the pins to see Earth through my lens{" "}
          <span className="relative -top-[2px] inline-block leading-none text-[21px]">📷</span>
        </p>
      </div>

      <div ref={mapContainerRef} className="relative mt-2 overscroll-contain">
        <div className="absolute right-2 top-2 z-10 flex items-center gap-1.5">
          <button
            type="button"
            onClick={zoomOut}
            className="rounded-md border border-white/20 bg-zinc-900/80 px-2 py-1 text-sm text-white transition hover:border-cyan-200/60 hover:text-cyan-100"
            aria-label="Zoom out map"
          >
            -
          </button>
          <button
            type="button"
            onClick={zoomIn}
            className="rounded-md border border-white/20 bg-zinc-900/80 px-2 py-1 text-sm text-white transition hover:border-cyan-200/60 hover:text-cyan-100"
            aria-label="Zoom in map"
          >
            +
          </button>
          <button
            type="button"
            onClick={resetView}
            className="rounded-md border border-white/20 bg-zinc-900/80 px-2 py-1 text-[12px] text-white transition hover:border-cyan-200/60 hover:text-cyan-100"
            aria-label="Reset map view"
          >
            Reset
          </button>
        </div>

        {selectedLocation && (
          <div
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/45 p-4"
            onClick={() => {
              setSelectedPhoto(null);
              setSelectedLocation(null);
            }}
          >
            <div
              className={`rounded-xl border border-cyan-300/35 bg-zinc-900/95 p-4 shadow-[0_0_26px_rgba(34,211,238,0.18)] ${
                hasPhotoGallery ? "w-[75%] max-w-5xl" : "w-full max-w-md"
              }`}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="relative mb-3 flex items-center justify-center px-12 md:px-16">
                <p className="text-center text-base font-semibold text-white md:text-lg">
                  {selectedLocation.name}
                  {selectedLocation.name === "Hawaii, USA" ? (
                    <span className="text-[13px] font-medium text-white/85 md:text-[15px]">
                      {" "}
                      • Jan 2026
                    </span>
                  ) : selectedLocation.name === "Miami, USA" ? (
                    <span className="text-[13px] font-medium text-white/85 md:text-[15px]">
                      {" "}
                      • Mar 2026
                    </span>
                  ) : selectedLocation.name === "The Bahamas" ? (
                    <span className="text-[13px] font-medium text-white/85 md:text-[15px]">
                      {" "}
                      • Apr 2026
                    </span>
                  ) : selectedLocation.name === "Maharashtra, India" ? (
                    <span className="text-[13px] font-medium text-white/85 md:text-[15px]">
                      {" "}
                      • Jul 2024
                    </span>
                  ) : selectedLocation.name === "Uttarakhand, India" ? (
                    <span className="text-[13px] font-medium text-white/85 md:text-[15px]">
                      {" "}
                      • Aug 2024
                    </span>
                  ) : selectedLocation.name === "Yellowstone, USA" ? (
                    <span className="text-[13px] font-medium text-white/85 md:text-[15px]">
                      {" "}
                      • Jul 2025
                    </span>
                  ) : selectedLocation.name === "Cancun, Mexico" ? (
                    <span className="text-[13px] font-medium text-white/85 md:text-[15px]">
                      {" "}
                      • Dec 2023
                    </span>
                  ) : selectedLocation.name === "San Francisco, USA" ? (
                    <span className="text-[13px] font-medium text-white/85 md:text-[15px]">
                      {" "}
                      • Aug 2022
                    </span>
                  ) : selectedLocation.name === "Dubai, UAE" ? (
                    <span className="text-[13px] font-medium text-white/85 md:text-[15px]">
                      {" "}
                      • Dec 2019
                    </span>
                  ) : selectedLocation.name === "Los Angeles, USA" ? (
                    <span className="text-[13px] font-medium text-white/85 md:text-[15px]">
                      {" "}
                      • Jul 2019
                    </span>
                  ) : selectedLocation.name === "Las Vegas, USA" ? (
                    <span className="text-[13px] font-medium text-white/85 md:text-[15px]">
                      {" "}
                      • Dec 2018
                    </span>
                  ) : null}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPhoto(null);
                    setSelectedLocation(null);
                  }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 rounded-md border border-white/20 px-2 py-1 text-xs text-white/90 transition hover:border-cyan-200/60 hover:text-white"
                >
                  Close
                </button>
              </div>
              {selectedLocation.photos?.length ? (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {selectedLocation.photos.map((photoPath, index) => (
                    <button
                      key={photoPath}
                      type="button"
                      onClick={() => setSelectedPhoto(photoPath)}
                      className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-white/15 bg-zinc-800/70"
                      aria-label={`Open ${selectedLocation.name} photo ${index + 1}`}
                    >
                      <Image
                        src={photoPath}
                        alt={`${selectedLocation.name} photo ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        sizes="(min-width: 1024px) 16vw, (min-width: 768px) 22vw, 42vw"
                        quality={65}
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-center text-xs text-white/75 md:text-sm">
                  {selectedLocation.description ??
                    "Om didn't add anything here yet lol"}
                </p>
              )}
            </div>
          </div>
        )}
        {selectedPhoto && (
          <div
            className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <div
              className="relative w-[75%] max-w-5xl rounded-xl border border-white/20 bg-zinc-950/95 p-3"
              onClick={(event) => event.stopPropagation()}
            >
              {selectedPhotoList.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goToPreviousPhoto}
                    className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/25 bg-black/55 px-3 py-2 text-lg text-white transition hover:border-cyan-200/70 hover:text-cyan-100"
                    aria-label="View previous photo"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={goToNextPhoto}
                    className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/25 bg-black/55 px-3 py-2 text-lg text-white transition hover:border-cyan-200/70 hover:text-cyan-100"
                    aria-label="View next photo"
                  >
                    ›
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="absolute right-3 top-3 z-10 rounded-md border border-white/20 bg-zinc-900/80 px-2 py-1 text-xs text-white/90 transition hover:border-cyan-200/60 hover:text-white"
              >
                Close
              </button>
              <img
                src={selectedPhoto}
                alt="Selected travel photo"
                className="max-h-[85vh] w-full rounded-lg object-contain"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>
        )}

        <svg
          ref={svgRef}
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          className={`h-auto w-full touch-none select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
          onPointerDown={startDrag}
          onPointerMove={dragGlobe}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <defs>
            <radialGradient id="globeOcean" cx="35%" cy="28%" r="80%">
              <stop offset="0%" stopColor="#2b5b9c" />
              <stop offset="45%" stopColor="#16335f" />
              <stop offset="100%" stopColor="#0a1327" />
            </radialGradient>
            <filter id="globeShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow
                dx="0"
                dy="8"
                stdDeviation="9"
                floodColor="#030712"
                floodOpacity="0.6"
              />
            </filter>
            <filter id="pinGlow" x="-220%" y="-220%" width="440%" height="440%">
              <feDropShadow
                dx="0"
                dy="0.8"
                stdDeviation="1.1"
                floodColor="#ef4444"
                floodOpacity="0.42"
              />
            </filter>
          </defs>

          <g filter="url(#globeShadow)">
            <path
              d={path({ type: "Sphere" }) ?? ""}
              fill="url(#globeOcean)"
              stroke="#4a6598"
              strokeWidth={1.6}
            />
            <path d={graticulePath} fill="none" stroke="#6484bd" strokeOpacity={0.24} strokeWidth={0.55} />

            {landPath ? (
              <path
                d={landPath}
                fill="#1b2a46"
                stroke="#5f79ac"
                strokeWidth={0.52}
              />
            ) : null}
            {bordersPath ? (
              <path
                d={bordersPath}
                fill="none"
                stroke="#5f79ac"
                strokeOpacity={0.72}
                strokeWidth={0.36}
              />
            ) : null}

            {projectedCountryLabels.map((label) => (
              <text
                key={label.name}
                x={label.point[0]}
                y={label.point[1]}
                textAnchor="middle"
                className="pointer-events-none select-none"
                fill="rgba(220,238,255,0.9)"
                fontSize={Math.max(11, 12.5 / Math.sqrt(Math.max(zoomScale, 1)))}
                fontWeight={600}
                letterSpacing="0.02em"
                stroke="rgba(9,16,32,0.88)"
                strokeWidth={2.4}
                paintOrder="stroke"
              >
                {label.name}
              </text>
            ))}

            {projectedPins.map(({ location, point }) => {
              const isSelected = selectedLocation?.name === location.name;
              const normalizedZoom = Math.max(zoomScale, 1);
              const pinScale = Math.max(
                0.9,
                (isSelected ? 1.18 : 1.08) / Math.pow(normalizedZoom, 0.2),
              );
              const selectedRadius = Math.max(6, 10 / Math.sqrt(normalizedZoom));

              return (
                <g
                  key={location.name}
                  transform={`translate(${point[0]}, ${point[1]})`}
                  className="cursor-pointer"
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={() => selectLocation(location)}
                >
                  {/* Larger invisible hit target makes pins much easier to click. */}
                  <circle
                    r={16}
                    fill="transparent"
                    onPointerDown={(event) => event.stopPropagation()}
                  />
                  {isSelected && (
                    <>
                      <circle r={selectedRadius} fill="rgba(239,68,68,0.18)" />
                      <circle
                        r={selectedRadius + 2.4}
                        fill="none"
                        stroke="rgba(255,255,255,0.7)"
                        strokeWidth={0.9}
                      />
                    </>
                  )}
                  <g transform={`scale(${pinScale})`} filter="url(#pinGlow)">
                    <path
                      d="M0 -10 C5.2 -10 8.8 -6.4 8.8 -2 C8.8 2.4 5.4 6.1 0 13 C-5.4 6.1 -8.8 2.4 -8.8 -2 C-8.8 -6.4 -5.2 -10 0 -10 Z"
                      fill="#ff4d4f"
                      stroke="rgba(255,255,255,0.95)"
                      strokeWidth="1.1"
                    />
                    <circle cx="0" cy="-2.7" r="2.25" fill="rgba(255,255,255,0.96)" />
                  </g>
                </g>
              );
            })}

            {zoomScale >= PIN_LABELS_SHOW_ZOOM &&
              projectedPins.map(({ location, point }) => (
                <text
                  key={`${location.name}-label`}
                  x={point[0]}
                  y={point[1] + 18}
                  textAnchor="middle"
                  className="pointer-events-none select-none"
                  fill="rgba(255,255,255,0.9)"
                  fontSize={Math.max(9, 10 / Math.sqrt(Math.max(zoomScale, 1)))}
                  stroke="rgba(0,0,0,0.8)"
                  strokeWidth={2}
                  paintOrder="stroke"
                >
                  {location.name.split(",")[0]}
                </text>
              ))}
            <path
              d={path({ type: "Sphere" }) ?? ""}
              fill="none"
              stroke="rgba(103,193,255,0.24)"
              strokeWidth={7}
            />
          </g>
        </svg>
      </div>

    </div>
  );
}
