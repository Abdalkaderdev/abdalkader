const fs = require('fs');
const path = require('path');

// Blog configuration
const BLOG_URL = 'https://blog.abdalkader.dev';
const POSTS_DIR = path.join(__dirname, '../source/_posts');
const OUTPUT_DIR = path.join(__dirname, '../public');

// Generate sitemap.xml
function generateSitemap() {
  const posts = fs.readdirSync(POSTS_DIR)
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const content = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
      const title = content.match(/title:\s*(.+)/)?.[1] || file.replace('.md', '');
      const date = content.match(/date:\s*(.+)/)?.[1] || new Date().toISOString();
      const slug = file.replace('.md', '').toLowerCase().replace(/\s+/g, '-');
      
      return {
        title,
        date,
        slug,
        url: `${BLOG_URL}/${slug}/`
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Static pages
  const staticPages = [
    { url: `${BLOG_URL}/`, priority: '1.0', changefreq: 'weekly' },
    { url: `${BLOG_URL}/about/`, priority: '0.8', changefreq: 'monthly' },
    { url: `${BLOG_URL}/blog/`, priority: '0.9', changefreq: 'weekly' },
    { url: `${BLOG_URL}/projects/`, priority: '0.8', changefreq: 'monthly' },
    { url: `${BLOG_URL}/resources/`, priority: '0.7', changefreq: 'monthly' },
    { url: `${BLOG_URL}/tutorials/`, priority: '0.8', changefreq: 'weekly' },
    { url: `${BLOG_URL}/case-studies/`, priority: '0.8', changefreq: 'monthly' }
  ];

  // Generate XML
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Add static pages
  staticPages.forEach(page => {
    sitemap += `
  <url>
    <loc>${page.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  });

  // Add blog posts
  posts.forEach(post => {
    sitemap += `
  <url>
    <loc>${post.url}</loc>
    <lastmod>${new Date(post.date).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  sitemap += `
</urlset>`;

  // Write sitemap
  fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap.xml'), sitemap);
  console.log('✅ Blog sitemap.xml generated successfully');
}

// Generate robots.txt
function generateRobots() {
  const robots = `User-agent: *
Allow: /

Sitemap: ${BLOG_URL}/sitemap.xml`;

  fs.writeFileSync(path.join(OUTPUT_DIR, 'robots.txt'), robots);
  console.log('✅ Blog robots.txt generated successfully');
}

// Run generators
generateSitemap();
generateRobots();