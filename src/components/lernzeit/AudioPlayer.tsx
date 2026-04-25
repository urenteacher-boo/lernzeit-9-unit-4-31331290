import { useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

export interface AudioTrack {
  label: string;
  src: string;
}

interface AudioPlayerProps {
  tracks: AudioTrack[];
}

export const AudioPlayer = ({ tracks }: AudioPlayerProps) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggle = (idx: number) => {
    const track = tracks[idx];
    if (!track) return;

    if (activeIdx === idx && audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setActiveIdx(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(track.src);
    audioRef.current = audio;
    audio.onended = () => setActiveIdx(null);
    audio.play().catch(() => setActiveIdx(null));
    setActiveIdx(idx);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {tracks.map((t, i) => {
        const isPlaying = activeIdx === i;
        return (
          <button
            key={`${t.label}-${i}`}
            onClick={() => toggle(i)}
            className="inline-flex items-center gap-2 rounded-full bg-cream border border-terracotta/30 px-4 py-2 text-sm font-sans text-terracotta hover:bg-terracotta hover:text-cream transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
};
