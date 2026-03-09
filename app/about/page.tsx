import type { Metadata } from 'next';

import { StaticPageShell } from '@/components/ui/StaticPageShell';

export const metadata: Metadata = {
  title: '서비스 소개 | 추구미 여행 MBTI',
  description: '추구미 여행 MBTI 테스트 서비스 소개 페이지입니다.',
};

export default function AboutPage() {
  return (
    <StaticPageShell
      kicker="About Service"
      title="추구미 여행 MBTI 소개"
      description="이 서비스는 이미 알고 있는 실제 MBTI와, 여행에서 되고 싶은 이상적인 캐릭터를 비교해보는 테스트입니다. 단순 성격 진단보다 여행 상황 속 선택을 통해 나의 취향과 지향점을 가볍고 재미있게 해석하는 데 초점을 둡니다."
    >
      <div className="space-y-6 text-[rgba(16,21,47,0.74)]">
        <section className="space-y-3">
          <h2 className="type-card-title text-[var(--color-ink)]">서비스가 보는 포인트</h2>
          <ul className="type-body list-disc space-y-2 pl-5">
            <li>실제 MBTI와 이상적인 여행 MBTI의 차이</li>
            <li>여행 맥락에서 드러나는 선택 패턴과 추구하는 분위기</li>
            <li>바뀐 축을 기준으로 한 현실적인 성장 가이드</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="type-card-title text-[var(--color-ink)]">결과 해석 방식</h2>
          <p className="type-body">
            각 축마다 3개의 문항이 배치되어 있으며, 축별 다수 선택으로 추구미 MBTI를 계산합니다. 이 결과는
            전문 심리검사나 의료·진단 목적이 아니라, 여행 상황 속 취향과 이상적 자아를 재미있게 해석하기 위한
            콘텐츠입니다.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="type-card-title text-[var(--color-ink)]">운영 원칙</h2>
          <p className="type-body">
            테스트 문항과 결과 카피는 서비스 운영자가 직접 관리하며, 서비스 품질 개선을 위해 화면 구성과 문구는
            변경될 수 있습니다. 광고 도입 전에는 광고 없는 버전으로 운영할 수 있으며, 광고가 도입되는 경우 관련
            정보는 개인정보처리방침에 함께 반영됩니다.
          </p>
        </section>
      </div>
    </StaticPageShell>
  );
}
