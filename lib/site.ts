import type { Route } from 'next';

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}

export function getResultTypePath(mbtiCode: string): Route {
  return `/type/${mbtiCode.toLowerCase()}` as Route;
}

export function getAbsoluteUrl(path: string) {
  return new URL(path, getSiteUrl()).toString();
}
