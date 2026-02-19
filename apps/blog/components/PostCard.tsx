import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import type { PostMeta } from '@/lib/posts';
import styles from './PostCard.module.scss';

interface PostCardProps {
  post: PostMeta;
  index?: number;
}

export default function PostCard({ post, index = 0 }: PostCardProps) {
  return (
    <motion.article
      className={styles.card}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <Link href={`/posts/${post.slug}`} className={styles.link}>
        <div className={styles.category}>{post.category}</div>

        <h2 className={styles.title}>{post.title}</h2>

        <p className={styles.description}>{post.description}</p>

        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <Calendar size={14} />
            {format(new Date(post.date), 'MMM d, yyyy')}
          </span>
          <span className={styles.metaItem}>
            <Clock size={14} />
            {post.readingTime}
          </span>
        </div>

        <div className={styles.tags}>
          {post.tags.slice(0, 3).map((tag) => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>

        <span className={styles.readMore}>
          Read more <ArrowRight size={16} />
        </span>
      </Link>
    </motion.article>
  );
}
