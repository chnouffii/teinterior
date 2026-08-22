import { Star } from 'lucide-react';

export default function StarRating({ rating = 5, size = 'h-3.5 w-3.5' }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Note de ${rating} sur 5`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`${size} ${index < rating ? 'fill-accent text-accent' : 'text-ink-600'}`}
          strokeWidth={1.5}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
