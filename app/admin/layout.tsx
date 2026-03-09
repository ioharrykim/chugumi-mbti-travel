import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '추구미 여행 MBTI Admin',
  description: '추구미 여행 MBTI CMS 관리자 페이지',
};

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
