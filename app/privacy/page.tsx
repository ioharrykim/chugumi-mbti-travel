import type { Metadata } from 'next';

import { StaticPageShell } from '@/components/ui/StaticPageShell';

export const metadata: Metadata = {
  title: '개인정보처리방침 | 추구미 여행 MBTI',
  description: '추구미 여행 MBTI 개인정보처리방침입니다.',
};

const lastUpdated = '2026년 3월 9일';

export default function PrivacyPage() {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || '배포 전 문의 이메일 설정 필요';

  return (
    <StaticPageShell
      kicker="Privacy Policy"
      title="개인정보처리방침"
      description={`최종 업데이트: ${lastUpdated}. 본 방침은 추구미 여행 MBTI 서비스에서 어떤 정보를 수집하고, 어떻게 사용하는지 안내합니다. 실제 운영 전에는 도메인, 문의 이메일, 광고/분석 도구 사용 여부에 맞춰 최종 검토가 필요합니다.`}
    >
      <div className="space-y-6 text-[rgba(16,21,47,0.74)]">
        <section className="space-y-3">
          <h2 className="type-card-title text-[var(--color-ink)]">1. 수집하는 정보</h2>
          <p className="type-body">
            서비스는 테스트 이용 과정에서 사용자가 입력한 실제 MBTI, 계산된 추구미 MBTI, 테스트 완료 시각 같은
            최소한의 데이터만 수집할 수 있습니다. 이름, 전화번호, 주민등록번호 같은 민감한 개인정보는 기본적으로
            수집하지 않습니다.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="type-card-title text-[var(--color-ink)]">2. 정보 이용 목적</h2>
          <ul className="type-body list-disc space-y-2 pl-5">
            <li>테스트 결과 제공 및 화면 기능 유지</li>
            <li>유형 분포와 이용 현황 확인을 통한 서비스 개선</li>
            <li>부정 이용 방지 및 오류 분석</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="type-card-title text-[var(--color-ink)]">3. 쿠키, 분석 도구, 광고</h2>
          <p className="type-body">
            서비스는 운영 과정에서 쿠키 또는 유사 기술을 사용할 수 있습니다. 향후 Google AdSense 또는 방문 분석
            도구가 적용되는 경우, 광고 개인화 여부와 쿠키 사용 방식은 본 페이지에서 별도로 고지합니다. 광고가
            비활성화된 버전에서는 AdSense 스크립트와 광고 구좌를 표시하지 않습니다.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="type-card-title text-[var(--color-ink)]">4. 보관 및 파기</h2>
          <p className="type-body">
            서비스 운영에 꼭 필요한 기간 동안만 데이터를 보관하며, 보관 목적이 끝난 데이터는 지체 없이 삭제하거나
            식별 불가능한 형태로 처리합니다.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="type-card-title text-[var(--color-ink)]">5. 이용자 문의</h2>
          <p className="type-body">
            개인정보 관련 문의는 아래 연락처로 접수할 수 있습니다.<br />문의 이메일: {contactEmail}
          </p>
        </section>
      </div>
    </StaticPageShell>
  );
}
