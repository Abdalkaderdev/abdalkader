/** @type {import('next-sitemap').IConfig} */

// Project data for sitemap generation (synced with data/projectsData.ts)
// These slugs and images are used to generate proper sitemap entries with image support
const projectSitemapData = [
  { slug: 'soapbox-super-app', img: '/images/dribble1.webp', title: 'SoapBox Super App' },
  { slug: 'discipleone-platform', img: '/images/dribble2.webp', title: 'DiscipleOne Platform' },
  { slug: 'via-discipleship-app', img: '/images/dribble3.webp', title: 'VIA Discipleship App' },
  { slug: 'parsalink-ai-crm', img: '/images/dribble4.webp', title: 'ParsaLink AI CRM' },
  { slug: 'quantum-animation-system', img: '/images/dribble5.webp', title: 'Quantum Animation System' },
  { slug: 'apple-tv-clone', img: '/images/apple.webp', title: 'Apple TV Clone' },
  { slug: 'virtualview', img: '/images/virtual.webp', title: 'VirtualView' },
  { slug: 'jegr-jalal-company', img: '/images/jegr.webp', title: 'Jegr Jalal Company' },
  { slug: 'doner-qr-menu-magic', img: '/images/doner.webp', title: 'Doner QR Menu Magic' },
  { slug: 'headquarter-iraq-real-estate', img: '/images/head.webp', title: 'Headquarter Iraq Real Estate' },
  { slug: 'innovations-architecture-department', img: '/images/head-quarter-international.webp', title: 'Innovations Architecture Department' },
  { slug: 'hamilton-iraq-real-estate', img: '/images/hamilton.webp', title: 'Hamilton Iraq Real Estate' },
];

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://abdalkader.dev';

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ['/api/*', '/components-demo'],

  // Generate index sitemap for better organization
  generateIndexSitemap: true,

  // Additional paths with proper priorities for static pages
  additionalPaths: async (config) => [
    { loc: '/', changefreq: 'weekly', priority: 1.0, lastmod: new Date().toISOString() },
    { loc: '/about', changefreq: 'monthly', priority: 0.9, lastmod: new Date().toISOString() },
    { loc: '/projects', changefreq: 'weekly', priority: 0.9, lastmod: new Date().toISOString() },
    { loc: '/contact', changefreq: 'monthly', priority: 0.8, lastmod: new Date().toISOString() },
    // Dynamically add all project pages with image sitemap support
    ...projectSitemapData.map((project) => ({
      loc: `/projects/${project.slug}`,
      changefreq: 'monthly',
      priority: 0.7,
      lastmod: new Date().toISOString(),
      // Image sitemap support for better SEO
      images: [
        {
          loc: `${siteUrl}${project.img}`,
          title: project.title,
        },
      ],
    })),
  ],

  // Transform function to customize each URL
  transform: async (config, path) => {
    // Custom priority for project pages
    if (path.startsWith('/projects/')) {
      // Find the project to include image data
      const slug = path.replace('/projects/', '');
      const project = projectSitemapData.find((p) => p.slug === slug);

      return {
        loc: path,
        changefreq: 'monthly',
        priority: 0.7,
        lastmod: new Date().toISOString(),
        // Include image in sitemap for project pages
        images: project ? [
          {
            loc: `${config.siteUrl}${project.img}`,
            title: project.title,
          },
        ] : [],
      };
    }

    // Default transform for other pages
    return {
      loc: path,
      changefreq: 'weekly',
      priority: 0.5,
      lastmod: new Date().toISOString(),
    };
  },

  // Robots.txt configuration with enhanced policies
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/*', '/components-demo'],
      },
    ],
    additionalSitemaps: [
      `${siteUrl}/sitemap.xml`,
    ],
  },
};

