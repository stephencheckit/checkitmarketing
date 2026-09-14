'use client';

import { useEffect, useRef, useState } from 'react';

interface HeroVideoProps {
  /** Path to the compressed background video (in /public) */
  src: string;
  /** Poster image shown instantly while (or instead of) the video loads */
  poster: string;
}

/**
 * Performance-conscious hero background video.
 *
 * - The poster image renders immediately as a plain background, so the hero
 *   never appears blank or half-loaded.
 * - The video element is only mounted on desktop-sized viewports and when the
 *   user hasn't requested reduced motion — phones just keep the still image.
 * - The video fades in only once the browser reports it can play through,
 *   so there's no visible stall or pixelated first frame.
 */
export default function HeroVideo({ src, poster }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isDesktop && !prefersReducedMotion) {
      setShouldLoadVideo(true);
    }
  }, []);

  useEffect(() => {
    if (!shouldLoadVideo || !videoRef.current) return;
    // Autoplay can be blocked; if play() rejects we silently keep the poster.
    videoRef.current.play().catch(() => {});
  }, [shouldLoadVideo]);

  return (
    <>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url("${poster}")` }}
      />
      {shouldLoadVideo && (
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            videoReady ? 'opacity-100' : 'opacity-0'
          }`}
          src={src}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          onCanPlayThrough={() => setVideoReady(true)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
