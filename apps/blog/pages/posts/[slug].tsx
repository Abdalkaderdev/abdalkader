import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { Calendar, Clock, ArrowLeft, User } from 'lucide-react';
import { format } from 'date-fns';
import { getAllPosts, getPostBySlug, type Post } from '@/lib/posts';
import styles from '@/styles/Post.module.scss';

interface PostPageProps {
  post: Omit<Post, 'content'>;
  mdxSource: MDXRemoteSerializeResult;
}

export default function PostPage({ post, mdxSource }: PostPageProps) {
  return (
    <>
      <Head>
        <title>{post.title} | Abdalkader's Blog</title>
        <meta name="description" content={post.description} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.date} />
        <meta property="article:author" content={post.author} />
      </Head>

      <main className={styles.main}>
        <motion.article
          className={styles.article}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Back Link */}
          <Link href="/" className={styles.backLink}>
            <ArrowLeft size={18} />
            Back to all posts
          </Link>

          {/* Header */}
          <header className={styles.header}>
            <div className={styles.category}>{post.category}</div>
            <h1 className={styles.title}>{post.title}</h1>
            <p className={styles.description}>{post.description}</p>

            <div className={styles.meta}>
              <span className={styles.metaItem}>
                <User size={16} />
                {post.author}
              </span>
              <span className={styles.metaItem}>
                <Calendar size={16} />
                {format(new Date(post.date), 'MMMM d, yyyy')}
              </span>
              <span className={styles.metaItem}>
                <Clock size={16} />
                {post.readingTime}
              </span>
            </div>

            <div className={styles.tags}>
              {post.tags.map((tag) => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
          </header>

          {/* Content */}
          <div className="prose">
            <MDXRemote {...mdxSource} />
          </div>

          {/* Footer */}
          <footer className={styles.footer}>
            <div className={styles.authorCard}>
              <div className={styles.authorAvatar}>AA</div>
              <div className={styles.authorInfo}>
                <h3>Abdalkader Alhamoud</h3>
                <p>Full Stack AI Engineer building web apps and SaaS platforms.</p>
              </div>
            </div>
          </footer>
        </motion.article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getAllPosts();
  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PostPageProps> = async ({ params }) => {
  const slug = params?.slug as string;
  const post = getPostBySlug(slug);

  if (!post) {
    return { notFound: true };
  }

  const mdxSource = await serialize(post.content);

  return {
    props: {
      post: {
        slug: post.slug,
        title: post.title,
        description: post.description,
        date: post.date,
        author: post.author,
        category: post.category,
        tags: post.tags,
        coverImage: post.coverImage,
        readingTime: post.readingTime,
      },
      mdxSource,
    },
  };
};
