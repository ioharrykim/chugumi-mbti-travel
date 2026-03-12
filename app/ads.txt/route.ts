import { getAdsensePublisherId } from '@/lib/public-config';

export async function GET() {
  const publisherId = getAdsensePublisherId();
  const body = publisherId
    ? `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`
    : '# AdSense publisher ID will be added after account approval.\n';

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
