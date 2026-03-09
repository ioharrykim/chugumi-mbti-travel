import { cache } from 'react';

import { defaultCmsData, fetchCmsData } from '@/lib/content';
import { createSupabaseServerClient } from '@/lib/supabase';

export const getServerCmsData = cache(async () => {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return defaultCmsData;
  }

  try {
    return await fetchCmsData(supabase);
  } catch {
    return defaultCmsData;
  }
});
