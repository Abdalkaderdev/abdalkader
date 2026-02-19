import { GetStaticProps } from 'next';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { getAllPosts, type PostMeta } from '@/lib/posts';
import PostCard from '@/components/PostCard';
import styles from '@/styles/Home.module.scss';

interface HomeProps {
  posts: PostMeta[];
}

export default function Home({ posts }: HomeProps) {
  return (
    <>
      <Head>
        <title>Abdalkader's Blog | AI, Web Development & Tech Insights</title>
      </Head>

      <main className={styles.main}>
        {/* Hero Section */}
        <motion.section
          className={styles.hero}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className={styles.heroTitle}>
            Thoughts on <span>AI</span>, <span>Code</span> & <span>Building</span>
          </h1>
          <p className={styles.heroDescription}>
            I write about AI engineering, web development, building SaaS products,
            and lessons learned along the way.
          </p>
        </motion.section>

        {/* Posts Grid */}
        <section className={styles.posts}>
          {posts.length > 0 ? (
            <div className={styles.grid}>
              {posts.map((post, index) => (
                <PostCard key={post.slug} post={post} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              className={styles.emptyState}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h2>Coming Soon</h2>
              <p>
                I'm working on some exciting content. Check back soon for articles
                about AI engineering, web development, and more.
              </p>
              <div className={styles.topics}>
                <span>AI/ML</span>
                <span>React</span>
                <span>Node.js</span>
                <span>SaaS</span>
                <span>TypeScript</span>
              </div>
            </motion.div>
          )}
        </section>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const posts = getAllPosts();

  return {
    props: {
      posts,
    },
  };
};
