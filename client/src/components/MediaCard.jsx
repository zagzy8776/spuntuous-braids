import { isVideoUrl } from '../lib/api.js';

export default function MediaCard({ item, className = '', onClick }) {
  const video = isVideoUrl(item?.imageUrl);
  const title = item?.title || 'Sumptuous Braids';

  return (
    <button type="button" onClick={onClick} className={`group overflow-hidden rounded-2xl bg-white text-left shadow-sm ring-1 ring-amber-900/10 ${className}`}>
      <div className="aspect-[3/4] overflow-hidden bg-stone-100">
        {video ? (
          <video
            src={item.imageUrl}
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            controls={false}
          />
        ) : (
          <img src={item.imageUrl} alt={title} className="h-full w-full object-cover" loading="lazy" />
        )}
      </div>
      {(item.title || item.caption) && (
        <div className="p-3">
          {item.title && <p className="line-clamp-1 font-display text-sm font-semibold">{item.title}</p>}
          {item.caption && <p className="mt-1 line-clamp-2 text-xs text-stone-500">{item.caption}</p>}
        </div>
      )}
    </button>
  );
}
