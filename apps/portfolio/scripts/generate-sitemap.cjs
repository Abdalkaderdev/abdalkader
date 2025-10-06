const fs = require('fs');
const path = require('path');
function extractProjectSlugsFromTS(tsPath) {
    const content = fs.readFileSync(tsPath, 'utf8');
    const slugRegex = /slug:\s*"([^"]+)"/g;
    const slugs = [];
    let match;
    while ((match = slugRegex.exec(content)) !== null) {
        slugs.push(match[1]);
    }
    return slugs;
}

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://abdalkader.dev';

function generate() {
    const staticUrls = ['/', '/about', '/projects', '/contact']
        .map((u) => `<url><loc>${BASE}${u}</loc><priority>${u === '/' ? '1.0' : '0.8'}</priority></url>`) 
        .join('');

    const dataPath = path.join(process.cwd(), 'data', 'projectsData.ts');
    const slugs = extractProjectSlugsFromTS(dataPath);
    const projectUrls = slugs
        .map((slug) => `<url><loc>${BASE}/projects/${slug}</loc><priority>0.7</priority></url>`) 
        .join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${staticUrls}${projectUrls}</urlset>`;
    const out = path.join(process.cwd(), 'public', 'sitemap.xml');
    fs.writeFileSync(out, xml);
    // eslint-disable-next-line no-console
    console.log('Sitemap written to', out);
}

if (require.main === module) generate();

module.exports = { generate };

