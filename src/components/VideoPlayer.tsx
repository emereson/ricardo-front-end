import { useEffect, useRef, useMemo } from "react";
import Hls from "hls.js";

interface VideoPlayerProps {
  hlsUrl: string;
  ThumbnailUrl?: string; // <-- opcional
  autoPlay?: boolean;
  showControls?: boolean;
  mode?: "video" | "poster"; // "video" = reproduce, "poster" = solo muestra la imagen
}

export default function VideoPlayer({
  hlsUrl,
  ThumbnailUrl,
  autoPlay = true,
  showControls = true,
  mode = "video",
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // 🪄 Preprocesar thumbnail en baja calidad si viene de Bunny
  const optimizedThumbnail = useMemo(() => {
    if (!ThumbnailUrl) return undefined;
    try {
      const url = new URL(ThumbnailUrl);
      if (url.hostname.includes("b-cdn.net")) {
        // Bunny.net CDN → aplicamos parámetros de optimización
        url.searchParams.set("w", "320");
        url.searchParams.set("q", "40");
        return url.toString();
      }
      return ThumbnailUrl;
    } catch {
      return ThumbnailUrl;
    }
  }, [ThumbnailUrl]);

  useEffect(() => {
    if (!videoRef.current || !hlsUrl) return;
    const video = videoRef.current;

    // Si el modo es "poster", solo mostramos la miniatura (sin cargar video)
    if (mode === "poster") {
      video.src = "";
      return;
    }

    // Modo normal (video HLS)
    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });

      hls.loadSource(hlsUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (autoPlay) {
          video
            .play()
            .catch((error) => console.log("Auto-play prevented:", error));
        }
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) console.error("HLS Error:", data, event);
      });

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = hlsUrl;
      video.addEventListener("loadedmetadata", () => {
        if (autoPlay) {
          video
            .play()
            .catch((error) => console.log("Auto-play prevented:", error));
        }
      });
    }
  }, [hlsUrl, autoPlay, mode]);

  return (
    <video
      ref={videoRef}
      controls={mode === "video" ? showControls : false}
      className="w-full h-full object-contain rounded-2xl duration-300"
      playsInline
      preload="metadata"
      poster={optimizedThumbnail} // 👈 se usa la versión liviana
      muted={!showControls}
    />
  );
}
