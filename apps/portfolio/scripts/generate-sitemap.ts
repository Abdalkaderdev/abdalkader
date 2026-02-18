import { projects } from '@/data/projectsData';
import fs from 'fs';
import path from 'path';

const BASE = 'https://abdalkader.dev';

export function generateSitemap(): string {
    const staticUrls = ['/', '/about', '/projects', '/contact']
        .map((u) => `<url><loc>${BASE}${u}</loc><priority>${u === '/' ? '1.0' : '0.8'}</priority></url>`) 
        .join('');

    const projectUrls = projects
        .map((p) => `<url><loc>${BASE}/projects/${p.slug}</loc><priority>0.7</priority></url>`) 
        .join('');

    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${staticUrls}${projectUrls}</urlset>`;
}

if (require.main === module) {
    const xml = generateSitemap();
    const out = path.join(process.cwd(), 'public', 'sitemap.xml');
    fs.writeFileSync(out, xml);
    // eslint-disable-next-line no-console
    console.log('Sitemap written to', out);
}

