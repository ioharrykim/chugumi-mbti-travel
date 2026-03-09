import { TestExperience } from '@/components/TestExperience';
import { fetchCmsData } from '@/lib/content';
import { createSupabaseServerClient } from '@/lib/supabase';

export default async function HomePage() {
  const supabase = createSupabaseServerClient();
  let initialCmsData = null;

  if (supabase) {
    try {
      initialCmsData = await fetchCmsData(supabase);
    } catch {
      initialCmsData = null;
    }
  }

  return <TestExperience initialCmsData={initialCmsData} />;
}
