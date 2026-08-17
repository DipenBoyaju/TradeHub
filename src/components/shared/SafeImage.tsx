"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

export const DEFAULT_PLACEHOLDER = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300' fill='%23f1f5f9'><rect width='100%' height='100%' /><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%2394a3b8'>No Image Available</text></svg>";

interface SafeImageProps extends Omit<ImageProps, "src"> {
  src?: string | null;
  fallbackSrc?: string;
}

export function SafeImage({ src, fallbackSrc = DEFAULT_PLACEHOLDER, alt, ...props }: SafeImageProps) {
  const initialSrc = src && src.trim() !== "" ? src : fallbackSrc;
  const [imgSrc, setImgSrc] = useState<string>(initialSrc);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt || "Service image"}
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
}