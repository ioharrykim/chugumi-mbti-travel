const FALLBACK_CONTACT_EMAIL = 'contact@travelmbti.ourwed.in';

export function getPublicContactEmail() {
  return process.env.NEXT_PUBLIC_CONTACT_EMAIL || FALLBACK_CONTACT_EMAIL;
}

export function hasPublicContactEmail() {
  return Boolean(process.env.NEXT_PUBLIC_CONTACT_EMAIL);
}

export function getAdsensePublisherId() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || '';
  return client.startsWith('ca-pub-') ? client.replace('ca-pub-', 'pub-') : client.replace('ca-', '');
}
