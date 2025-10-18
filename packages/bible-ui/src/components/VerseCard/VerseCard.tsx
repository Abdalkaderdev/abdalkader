import React from 'react';
import { clsx } from 'clsx';
import { Bookmark, Share2, Copy } from 'lucide-react';
import './VerseCard.css';

export interface Verse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  version?: string;
}

export interface VerseCardProps {
  verse: Verse;
  onBookmark?: (verse: Verse) => void;
  onShare?: (verse: Verse) => void;
  onCopy?: (verse: Verse) => void;
  isBookmarked?: boolean;
  className?: string;
}

export const VerseCard: React.FC<VerseCardProps> = ({
  verse,
  onBookmark,
  onShare,
  onCopy,
  isBookmarked = false,
  className
}) => {
  const handleBookmark = () => {
    onBookmark?.(verse);
  };

  const handleShare = () => {
    onShare?.(verse);
  };

  const handleCopy = () => {
    onCopy?.(verse);
  };

  return (
    <div className={clsx('verse-card', className)}>
      <div className="verse-card__header">
        <div className="verse-card__reference">
          {verse.book} {verse.chapter}:{verse.verse}
          {verse.version && <span className="verse-card__version"> ({verse.version})</span>}
        </div>
        <div className="verse-card__actions">
          <button
            onClick={handleBookmark}
            className={clsx('verse-card__action', { 'verse-card__action--active': isBookmarked })}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            <Bookmark size={16} />
          </button>
          <button
            onClick={handleCopy}
            className="verse-card__action"
            aria-label="Copy verse"
          >
            <Copy size={16} />
          </button>
          <button
            onClick={handleShare}
            className="verse-card__action"
            aria-label="Share verse"
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>
      <div className="verse-card__content">
        <p className="verse-card__text">{verse.text}</p>
      </div>
    </div>
  );
};
