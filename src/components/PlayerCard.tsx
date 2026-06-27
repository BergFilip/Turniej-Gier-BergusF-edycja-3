import Camera from 'lucide-react/dist/esm/icons/camera.js';
import { getVideoEmbedUrl, isDirectVideoUrl, isLikelyVideoUrl, normalizeMediaUrl } from '../lib/media';
import type { Player } from '../store/gameStore';
import { PixelFrame } from './PixelFrame';

type PlayerCardProps = {
  player: Player;
};

const renderCameraMedia = (url: string) => {
  const mediaUrl = normalizeMediaUrl(url);
  if (!mediaUrl) return null;

  const embedUrl = getVideoEmbedUrl(mediaUrl);
  if (embedUrl) {
    return (
      <iframe
        className="h-full w-full border-0"
        src={embedUrl}
        title="Player camera"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (isDirectVideoUrl(mediaUrl)) {
    return <video className="h-full w-full object-cover" src={mediaUrl} muted loop playsInline autoPlay controls />;
  }

  return (
    <img
      src={mediaUrl}
      alt=""
      referrerPolicy="no-referrer"
      className={`h-full w-full object-cover grayscale-[20%] saturate-125 ${isLikelyVideoUrl(mediaUrl) ? 'hidden' : ''}`}
    />
  );
};

export const PlayerCard = ({ player }: PlayerCardProps) => (
  <PixelFrame className="h-full min-h-[154px]">
    <div className="flex h-full flex-col p-2">
      <div className="relative min-h-[92px] flex-1 overflow-hidden bg-gradient-to-br from-zinc-950 to-blood-950/70">
        {player.avatar ? (
          renderCameraMedia(player.avatar)
        ) : (
          <div className="flex h-full min-h-[92px] items-center justify-center">
            <Camera className="h-9 w-9 text-blood-400 drop-shadow-[0_0_10px_rgba(255,23,23,.8)]" />
          </div>
        )}
        <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-blood-500/20 to-transparent" />
      </div>
      <div className="mt-2 border-t border-blood-800/60 pt-2 text-center">
        <div className="truncate text-[10px] font-black uppercase tracking-[0.16em] text-white">{player.name}</div>
        <div className="mt-1 truncate text-[9px] uppercase tracking-[0.14em] text-red-200/60">{player.label}</div>
      </div>
    </div>
  </PixelFrame>
);
