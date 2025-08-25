import dynamic from "next/dynamic";

const MapContainerNoSSR = dynamic(() => import("./MapContainerComponent"), { ssr: false });

export default function ShipmentMapInner({ center = [51.505, -0.09], zoom = 13 }) {
  return <MapContainerNoSSR center={center} zoom={zoom} />;
}
