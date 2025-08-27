const fs = require('fs');
const path = require('path');
// Resolve TS module transpiled by Next at runtime via require; fallback to .js if available
let projects;
try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    ({ projects } = require('../data/projectsData'));
} catch (e) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    ({ projects } = require(path.join(process.cwd(), '.next', 'server', 'app', 'data', 'projectsData.js')));
}

const BASE = 'https://abdalkader-alhamoud.vercel.app';

function generate() {
    const staticUrls = ['/', '/about', '/projects', '/contact']
        .map((u) => `<url><loc>${BASE}${u}</loc><priority>${u === '/' ? '1.0' : '0.8'}</priority></url>`) 
        .join('');

    const projectUrls = projects
        .map((p) => `<url><loc>${BASE}/projects/${p.slug}</loc><priority>0.7</priority></url>`) 
        .join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${staticUrls}${projectUrls}</urlset>`;
    const out = path.join(process.cwd(), 'public', 'sitemap.xml');
    fs.writeFileSync(out, xml);
    // eslint-disable-next-line no-console
    console.log('Sitemap written to', out);
}

if (require.main === module) generate();

module.exports = { generate };

