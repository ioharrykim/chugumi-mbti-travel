import type { MetadataRoute } from 'next';

import { DEFAULT_RESULT_TYPES } from '@/lib/constants';
import { getResultTypePath } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const now = new Date();

  const staticPaths = ['', '/type', '/about', '/privacy', '/terms', '/contact'];
  const typePaths = DEFAULT_RESULT_TYPES.map((type) => getResultTypePath(type.mbti_code));

  return [...staticPaths, ...typePaths].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: path === '' ? 'weekly' : path.startsWith('/type/') ? 'monthly' : 'monthly',
    priority: path === '' ? 1 : path === '/type' ? 0.9 : path.startsWith('/type/') ? 0.8 : 0.6,
  }));
}
