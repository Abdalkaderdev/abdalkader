import React, { useState } from 'react';
import { Share2, Twitter, Linkedin, Facebook, Link2, Check } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import styles from './ShareButtons.module.scss';

interface ShareButtonsProps {
  projectTitle: string;
  projectSlug: string;
  projectDescription?: string;
}

export function ShareButtons({ projectTitle, projectSlug, projectDescription }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/projects/${projectSlug}`
    : `https://abdalkader.dev/projects/${projectSlug}`;
  const shareText = projectDescription 
    ? `${projectTitle} - ${projectDescription.substring(0, 100)}...`
    : projectTitle;

  const handleShare = (platform: string, url: string) => {
    trackEvent({
      name: 'project_share',
      properties: {
        platform,
        project_slug: projectSlug,
        project_title: projectTitle,
      },
    });

    switch (platform) {
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`,
          '_blank',
          'width=550,height=420'
        );
        break;
      case 'linkedin':
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          '_blank',
          'width=550,height=420'
        );
        break;
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          '_blank',
          'width=550,height=420'
        );
        break;
      default:
        break;
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      trackEvent({
        name: 'project_share',
        properties: {
          platform: 'copy_link',
          project_slug: projectSlug,
        },
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <div className={styles.shareButtons}>
      <div className={styles.shareLabel}>
        <Share2 className={styles.shareIcon} />
        <span>Share Project</span>
      </div>
      <div className={styles.shareGrid}>
        <button
          onClick={() => handleShare('twitter', shareUrl)}
          className={styles.shareButton}
          aria-label="Share on Twitter"
        >
          <Twitter className={styles.buttonIcon} />
          <span>Twitter</span>
        </button>
        <button
          onClick={() => handleShare('linkedin', shareUrl)}
          className={styles.shareButton}
          aria-label="Share on LinkedIn"
        >
          <Linkedin className={styles.buttonIcon} />
          <span>LinkedIn</span>
        </button>
        <button
          onClick={() => handleShare('facebook', shareUrl)}
          className={styles.shareButton}
          aria-label="Share on Facebook"
        >
          <Facebook className={styles.buttonIcon} />
          <span>Facebook</span>
        </button>
        <button
          onClick={handleCopyLink}
          className={`${styles.shareButton} ${copied ? styles.copied : ''}`}
          aria-label="Copy link"
        >
          {copied ? (
            <>
              <Check className={styles.buttonIcon} />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Link2 className={styles.buttonIcon} />
              <span>Copy Link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

