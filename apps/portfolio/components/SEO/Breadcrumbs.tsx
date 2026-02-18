import Link from 'next/link';
import styles from './Breadcrumbs.module.scss';
import JsonLd from './JsonLd';
import { breadcrumbsJsonLd } from '@/utils/jsonld';
import { SITE_URL } from '@/utils/seo';

export interface BreadcrumbItem {
  label: string;
  href: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  // Prepare data for JSON-LD schema
  const schemaItems = items.map(item => ({
    name: item.label,
    item: item.href.startsWith('http') ? item.href : `${SITE_URL}${item.href}`
  }));

  return (
    <>
      <JsonLd data={breadcrumbsJsonLd(schemaItems)} />
      <nav
        aria-label="Breadcrumb"
        className={`${styles.breadcrumbs} ${className}`}
      >
        <ol className={styles.list} itemScope itemType="https://schema.org/BreadcrumbList">
          {items.map((item, index) => (
            <li
              key={item.href}
              className={styles.item}
              itemScope
              itemProp="itemListElement"
              itemType="https://schema.org/ListItem"
            >
              {item.current ? (
                <span
                  className={styles.current}
                  itemProp="name"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={styles.link}
                  itemProp="item"
                >
                  <span itemProp="name">{item.label}</span>
                </Link>
              )}
              <meta itemProp="position" content={String(index + 1)} />
              {index < items.length - 1 && (
                <span className={styles.separator} aria-hidden="true">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M6.22 4.22a.75.75 0 011.06 0l3.25 3.25a.75.75 0 010 1.06l-3.25 3.25a.75.75 0 01-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 010-1.06z" />
                  </svg>
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
