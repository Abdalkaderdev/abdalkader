import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getAllPosts, getAllCategories, type PostMeta } from '@/lib/posts';
import styles from '@/styles/Categories.module.scss';

interface CategoriesProps {
  categories: {
    name: string;
    count: number;
  }[];
}

export default function Categories({ categories }: CategoriesProps) {
  return (
    <>
      <Head>
        <title>Categories | Abdalkader's Blog</title>
        <meta name="description" content="Browse blog posts by category" />
      </Head>

      <main className={styles.main}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className={styles.title}>Categories</h1>
          <p className={styles.description}>Browse posts by topic</p>

          <div className={styles.grid}>
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <motion.div
                  key={category.name}
                  className={styles.card}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <h2>{category.name}</h2>
                  <p>{category.count} {category.count === 1 ? 'post' : 'posts'}</p>
                </motion.div>
              ))
            ) : (
              <div className={styles.empty}>
                <p>Categories will appear here once posts are published.</p>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps<CategoriesProps> = async () => {
  const posts = getAllPosts();
  const categoryNames = getAllCategories();

  const categories = categoryNames.map((name) => ({
    name,
    count: posts.filter((post) => post.category === name).length,
  }));

  return {
    props: {
      categories,
    },
  };
};
