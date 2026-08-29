"use client";

import { useEffect, useRef } from "react";

type Props = {
  stream: MediaStream | null;
  muted?: boolean;
  mirrored?: boolean;
  className?: string;
  label: string;
};

export function StreamVideo({ stream, muted = false, mirrored = false, className = "", label }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => { if (ref.current) ref.current.srcObject = stream; }, [stream]);
  return <video ref={ref} autoPlay muted={muted} playsInline aria-label={label} className={`${mirrored ? "-scale-x-100" : ""} ${className}`} />;
}
