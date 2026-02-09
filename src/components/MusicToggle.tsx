"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const YOUTUBE_VIDEO_ID = "QqR5Pd6KIxM";

declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function MusicToggle() {
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const playerRef = useRef<YT.Player | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const initPlayer = useCallback(() => {
    if (playerRef.current || !containerRef.current) return;
    playerRef.current = new window.YT.Player("yt-music-player", {
      videoId: YOUTUBE_VIDEO_ID,
      playerVars: {
        autoplay: 0,
        loop: 1,
        playlist: YOUTUBE_VIDEO_ID,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
      },
      events: {
        onReady: () => setReady(true),
        onStateChange: (e: YT.OnStateChangeEvent) => {
          setPlaying(e.data === YT.PlayerState.PLAYING);
        },
      },
    });
  }, []);

  useEffect(() => {
    if (window.YT && window.YT.Player) {
      initPlayer();
      return;
    }
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      initPlayer();
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(script);
  }, [initPlayer]);

  const toggle = () => {
    const p = playerRef.current;
    if (!p) return;
    if (playing) {
      p.pauseVideo();
    } else {
      p.playVideo();
    }
  };

  return (
    <>
      {/* Hidden YouTube player */}
      <div className="hidden">
        <div ref={containerRef}>
          <div id="yt-music-player" />
        </div>
      </div>

      {/* Toggle button — fixed top-right */}
      <button
        onClick={toggle}
        disabled={!ready}
        aria-label={playing ? "Pause music" : "Play music"}
        className="fixed top-4 right-4 z-40 w-10 h-10 rounded-full bg-surface-light/80 backdrop-blur-sm border border-surface-light flex items-center justify-center transition-all hover:bg-surface disabled:opacity-30"
      >
        <svg className={`w-5 h-5 text-accent transition-opacity ${playing ? "opacity-100" : "opacity-50"}`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
        </svg>
        {playing && (
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
        )}
      </button>
    </>
  );
}
