/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://abdalkader.dev',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ['/api/*', '/components-demo'],
  additionalPaths: async (config) => {
    const result = [];
    
    // Add custom pages with specific priorities
    result.push({
      loc: '/about',
      changefreq: 'monthly',
      priority: 0.9,
    });
    
    result.push({
      loc: '/projects',
      changefreq: 'weekly',
      priority: 0.9,
    });
    
    result.push({
      loc: '/contact',
      changefreq: 'monthly',
      priority: 0.8,
    });
    
    return result;
  },
};

