import Camera from 'lucide-react/dist/esm/icons/camera.js';
import { getVideoEmbedUrl, isDirectVideoUrl, normalizeMediaUrl } from '../lib/media';
import { PixelFrame } from './PixelFrame';

type HostCameraPanelProps = {
  cameraUrl: string;
};

const renderHostMedia = (value: string) => {
  const mediaUrl = normalizeMediaUrl(value);
  if (!mediaUrl) return null;

  const embedUrl = getVideoEmbedUrl(mediaUrl);
  if (embedUrl) {
    return (
      <iframe
        className="h-full w-full border-0"
        src={embedUrl}
        title="Host camera"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (isDirectVideoUrl(mediaUrl)) {
    return <video className="h-full w-full object-cover" src={mediaUrl} muted loop playsInline autoPlay controls />;
  }

  return <img className="h-full w-full object-cover" src={mediaUrl} alt="" referrerPolicy="no-referrer" />;
};

export const HostCameraPanel = ({ cameraUrl }: HostCameraPanelProps) => (
  <aside className="flex min-h-0 flex-col gap-3">
    <PixelFrame className="min-h-[352px]">
      <div className="flex h-full flex-col p-2">
        <div className="relative min-h-[224px] overflow-hidden bg-gradient-to-br from-zinc-950 to-blood-950/70">
          {cameraUrl ? (
            renderHostMedia(cameraUrl)
          ) : (
            <div className="flex h-full min-h-[224px] items-center justify-center">
              <Camera className="h-14 w-14 text-blood-400 drop-shadow-[0_0_10px_rgba(255,23,23,.8)]" />
            </div>
          )}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-blood-500/25 to-transparent" />
        </div>
        <div className="mt-2 border-t border-blood-800/60 pt-2 text-center">
          <div className="truncate text-[10px] font-black uppercase tracking-[0.16em] text-white">Prowadzacy</div>
          <div className="mt-1 truncate text-[9px] uppercase tracking-[0.14em] text-red-200/60">kamera</div>
        </div>
      </div>
    </PixelFrame>
  </aside>
);
