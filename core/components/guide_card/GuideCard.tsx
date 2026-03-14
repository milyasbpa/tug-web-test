'use client';

import { Play } from 'lucide-react';
import * as React from 'react';

import { LogoIcon } from '@/core/icons/Logo.icon';
import { cn } from '@/core/lib/utils';

// ── GuideCard ─────────────────────────────────────────────────────────────────

export interface GuideCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Small category label shown top-left e.g. "Guides" */
  category?: string;
  /** Smaller line above the thumbnail e.g. "How to Create" */
  title?: string;
  /** Bold description below the thumbnail e.g. "Your First Photoshoot" */
  description: string;
  /** Thumbnail image URL */
  thumbnailSrc?: string;
  /** Alt text for thumbnail */
  thumbnailAlt?: string;
  /** Video URL — when provided, clicking play will play the video inline */
  videoSrc?: string;
  /** Called when the play button is clicked (fires regardless of videoSrc) */
  onPlay?: () => void;
}

export function GuideCard({
  category = 'Guides',
  title,
  description,
  thumbnailSrc,
  thumbnailAlt = '',
  videoSrc,
  onPlay,
  className,
  ...props
}: GuideCardProps) {
  const [playing, setPlaying] = React.useState(false);

  function handlePlay() {
    if (videoSrc) setPlaying(true);
    onPlay?.();
  }

  const showVideo = playing && videoSrc;
  const showThumbnail = !showVideo && thumbnailSrc;
  const canPlay = Boolean(videoSrc || onPlay);

  return (
    <div
      data-slot="guide-card"
      className={cn('bg-background-secondary flex flex-col gap-1 rounded-2xl p-4', className)}
      {...props}
    >
      {/* Category badge */}
      <div className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
        <LogoIcon size={16} color="#0D9488" />
        <span className="text-text-primary text-xs leading-[1.4] font-medium">—</span>
        <span className="text-text-primary text-xs leading-[1.4] font-medium">{category}</span>
      </div>

      {/* Title */}
      {title && (
        <p className="text-text-primary text-center text-lg leading-[1.6] font-medium">{title}</p>
      )}

      {/* Media area */}
      <div className="bg-muted relative mx-auto aspect-video w-full max-w-[224px] overflow-hidden rounded-xl">
        {showVideo ? (
          // ── Inline video player ────────────────────────────────────────────
          <video src={videoSrc} autoPlay controls className="size-full object-cover" />
        ) : showThumbnail ? (
          // ── Thumbnail image ────────────────────────────────────────────────
          <img src={thumbnailSrc} alt={thumbnailAlt} className="size-full object-cover" />
        ) : (
          // ── Fallback placeholder ───────────────────────────────────────────
          <div className="bg-muted-foreground/10 size-full" />
        )}

        {/* Play button overlay — hidden once video is playing */}
        {!showVideo && (
          <button
            type="button"
            onClick={handlePlay}
            aria-label="Play video"
            className={cn(
              'absolute inset-0 flex items-center justify-center',
              'transition-opacity duration-200',
              canPlay ? 'cursor-pointer' : 'pointer-events-none',
            )}
          >
            <div className="flex size-6 items-center justify-center rounded-full bg-[#303030]/50 shadow-md backdrop-blur-sm transition-transform duration-150 hover:scale-105 active:scale-95">
              <Play className="size-4 fill-white text-white" />
            </div>
          </button>
        )}
      </div>

      {/* Description */}
      <p className="text-text-primary text-center text-lg leading-[1.6] font-medium">
        {description}
      </p>
    </div>
  );
}
