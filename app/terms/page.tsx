import type { Metadata } from 'next';

import { StaticPageShell } from '@/components/ui/StaticPageShell';

export const metadata: Metadata = {
  title: '이용약관 | 추구미 여행 MBTI',
  description: '추구미 여행 MBTI 이용약관입니다.',
};

export default function TermsPage() {
  return (
    <StaticPageShell
      kicker="Terms of Use"
      title="이용약관"
      description="본 약관은 추구미 여행 MBTI 서비스 이용 조건을 안내합니다. 실제 운영 버전에서는 사업자 정보, 연락처, 관할 등을 운영 형태에 맞게 최종 보완하는 것이 좋습니다."
    >
      <div className="space-y-6 text-[rgba(16,21,47,0.74)]">
        <section className="space-y-3">
          <h2 className="type-card-title text-[var(--color-ink)]">1. 서비스 성격</h2>
          <p className="type-body">
            본 서비스는 मनोरंजन 및 정보 제공 목적의 MBTI 기반 콘텐츠입니다. 의학적, 심리학적 진단이나 전문 상담을
            대체하지 않습니다.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="type-card-title text-[var(--color-ink)]">2. 이용자의 책임</h2>
          <p className="type-body">
            이용자는 서비스 내 문구, 이미지, 결과 화면을 법령과 공공질서에 반하지 않는 범위에서 이용해야 하며,
            자동화된 비정상 호출이나 서비스 방해 행위는 금지됩니다.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="type-card-title text-[var(--color-ink)]">3. 지식재산권</h2>
          <p className="type-body">
            서비스 내 테스트 문항, 결과 카피, 디자인 요소의 저작권은 운영자 또는 정당한 권리자에게 있습니다.
            사전 허가 없는 무단 복제, 재배포, 상업적 사용은 제한될 수 있습니다.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="type-card-title text-[var(--color-ink)]">4. 서비스 변경 및 중단</h2>
          <p className="type-body">
            운영자는 서비스 개선, 점검, 정책 변경에 따라 일부 기능이나 콘텐츠를 수정하거나 중단할 수 있습니다.
          </p>
        </section>
      </div>
    </StaticPageShell>
  );
}
