import type { Metadata } from 'next';

import { StaticPageShell } from '@/components/ui/StaticPageShell';
import { getPublicContactEmail } from '@/lib/public-config';

export const metadata: Metadata = {
  title: '문의하기 | 추구미 여행 MBTI',
  description: '추구미 여행 MBTI 문의 페이지입니다.',
};

export default function ContactPage() {
  const contactEmail = getPublicContactEmail();

  return (
    <StaticPageShell
      kicker="운영 문의"
      title="문의하기"
      description="서비스 오류 제보, 문구 수정 요청, 제휴 및 운영 관련 문의를 받을 수 있는 페이지입니다. 배포 전에는 실제 운영용 이메일 주소를 반드시 연결해두는 편이 좋습니다."
    >
      <div className="space-y-6 text-[rgba(16,21,47,0.74)]">
        <section className="space-y-3">
          <h2 className="type-card-title text-[var(--color-ink)]">연락 방법</h2>
          <p className="type-body">
            이메일: {contactEmail}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="type-card-title text-[var(--color-ink)]">이런 문의를 받을 수 있습니다</h2>
          <ul className="type-body list-disc space-y-2 pl-5">
            <li>오탈자, 결과 문구, 문항 표현 수정 제안</li>
            <li>광고 노출, 제휴, 협업 문의</li>
            <li>개인정보 및 정책 관련 문의</li>
          </ul>
        </section>
      </div>
    </StaticPageShell>
  );
}
