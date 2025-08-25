"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export type ShipmentPoint = {
  shipmentId: string;
  status?: string;
  city?: string;
  country?: string;
  lat: number;
  lng: number;
};

// Fix default icon paths for Next.js bundling
const fixLeafletIcons = () => {
  if (typeof window !== "undefined") {
    const L = require("leaflet");
    // Use default icon paths that work with Next.js
    L.Icon.Default.mergeOptions({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
    });
  }
};

// Separate component for FitBounds
function FitBounds({ points, focused }: { points: ShipmentPoint[]; focused?: ShipmentPoint | null }) {
  const mapRef = useRef<any>(null);
  
  useEffect(() => {
    if (!mapRef.current) return;
    
    const map = mapRef.current;
    
    if (focused) {
      map.setView([focused.lat, focused.lng], Math.max(map.getZoom(), 6), { animate: true });
      return;
    }
    if (points.length === 0) return;
    
    const L = require("leaflet");
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng] as [number, number]));
    map.fitBounds(bounds.pad(0.2));
  }, [points, focused]);

  return (
    <div ref={mapRef} style={{ display: 'none' }} />
  );
}

// Memoized map component to prevent re-renders
const MemoizedMapContainer = React.memo(({ center, zoom, children }: any) => (
  <MapContainer 
    center={center} 
    zoom={zoom} 
    style={{ height: "100%", width: "100%" }} 
    scrollWheelZoom
  >
    {children}
  </MapContainer>
));

MemoizedMapContainer.displayName = 'MemoizedMapContainer';

export default function ShipmentMap({
  shipments,
  focusedId,
  className,
  height = 360,
  route,
}: {
  shipments: any[];
  focusedId?: string | null;
  className?: string;
  height?: number;
  route?: { origin?: string; dest?: string };
}) {
  const [isClient, setIsClient] = useState(false);
  const [mapKey] = useState(() => `map-${Math.random()}`); // Stable key for this component instance

  // Ensure component only renders on client side
  useEffect(() => {
    setIsClient(true);
    fixLeafletIcons();
  }, []);

  const points: ShipmentPoint[] = useMemo(() => {
    return (shipments || [])
      .map((s) => {
        const coords = s?.currentLocation?.coordinates;
        if (!coords || typeof coords.lat !== "number" || typeof coords.lng !== "number") return null;
        return {
          shipmentId: s.shipmentId,
          status: s.status,
          city: s?.currentLocation?.city,
          country: s?.currentLocation?.country,
          lat: coords.lat,
          lng: coords.lng,
        } as ShipmentPoint;
      })
      .filter(Boolean) as ShipmentPoint[];
  }, [shipments]);

  const focused = useMemo(() => points.find((p) => p.shipmentId === focusedId) || null, [points, focusedId]);

  const defaultCenter: [number, number] = useMemo(() => {
    return points.length > 0 ? [points[0].lat, points[0].lng] : [51.5074, -0.1278];
  }, [points]);

  const [routePoints, setRoutePoints] = useState<Array<[number, number]>>([]);
  
  useEffect(() => {
    let cancelled = false;
    async function loadRoute() {
      if (!route?.origin || !route?.dest) { setRoutePoints([]); return }
      try {
        const q = new URLSearchParams({ origin: route.origin, dest: route.dest, profile: 'driving-car' }).toString()
        const res = await fetch(`/api/geo/route?${q}`)
        if (!res.ok) throw new Error('route failed')
        const data = await res.json()
        if (!cancelled) setRoutePoints((data.points || []).map((p: any) => [p.lat, p.lng]))
      } catch {
        if (!cancelled) setRoutePoints([])
      }
    }
    loadRoute()
    return () => { cancelled = true }
  }, [route?.origin, route?.dest])

  // Don't render map on server side
  if (!isClient) {
    return (
      <div className={className} style={{ height }}>
        <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500">
          Loading map...
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={{ height }}>
      {/* TEMPORARILY DISABLED MAP TO TEST ERRORS */}
      <div className="flex items-center justify-center h-full bg-blue-100 text-blue-800 border-2 border-blue-300 rounded-lg">
        <div className="text-center">
          <div className="text-lg font-bold">🗺️ Map Temporarily Disabled</div>
          <div className="text-sm">Testing if map errors stop</div>
        </div>
      </div>
      
      {/* ORIGINAL MAP CODE COMMENTED OUT
      <MemoizedMapContainer center={defaultCenter} zoom={5}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds points={points} focused={focused} />
        {points.map((p) => (
          <Marker key={p.shipmentId} position={[p.lat, p.lng]}>
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">{p.shipmentId}</div>
                <div className="text-muted-foreground">{p.status}</div>
                <div>
                  {p.city}{p.city ? ", " : ""}{p.country}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        {routePoints.length > 1 ? (
          <Polyline positions={routePoints} pathOptions={{ color: '#2563eb', weight: 4, opacity: 0.8 }} />
        ) : null}
      </MemoizedMapContainer>
      */}
    </div>
  );
}

