'use client';
import dynamic from "next/dynamic";

const ShipmentMap = dynamic(() => import("./ShipmentMap"), { ssr: false });

export default function ShipmentMapWrapper(props: any) {
  return <ShipmentMap {...props} />;
}
