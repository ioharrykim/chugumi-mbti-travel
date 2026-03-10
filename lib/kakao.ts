import { getResultTypePath } from '@/lib/site';
import { ResultType } from '@/lib/types';

const kakaoJavascriptKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;

interface KakaoLinkTarget {
  mobileWebUrl: string;
  webUrl: string;
}

interface KakaoSharePayload {
  objectType: 'feed';
  content: {
    title: string;
    description: string;
    imageUrl: string;
    link: KakaoLinkTarget;
  };
  buttons: Array<{
    title: string;
    link: KakaoLinkTarget;
  }>;
}

interface KakaoSdk {
  isInitialized(): boolean;
  init(appKey: string): void;
  Share: {
    sendDefault(payload: KakaoSharePayload): void;
  };
}

declare global {
  interface Window {
    Kakao?: KakaoSdk;
  }
}

export function isKakaoShareEnabled() {
  return Boolean(kakaoJavascriptKey);
}

function getKakaoSdk() {
  if (typeof window === 'undefined') return null;
  if (!kakaoJavascriptKey) return null;
  return window.Kakao ?? null;
}

function getAbsoluteCurrentUrl(path: string) {
  return new URL(path, window.location.origin).toString();
}

export function shareResultToKakao({
  actualMbti,
  chugumiMbti,
  resultType,
}: {
  actualMbti: string;
  chugumiMbti: string;
  resultType: ResultType;
}) {
  const sdk = getKakaoSdk();

  if (!sdk || !kakaoJavascriptKey) {
    return false;
  }

  if (!sdk.isInitialized()) {
    sdk.init(kakaoJavascriptKey);
  }

  const resultPath = getResultTypePath(chugumiMbti);
  const resultUrl = getAbsoluteCurrentUrl(resultPath);
  const homeUrl = getAbsoluteCurrentUrl('/');
  const imageUrl = getAbsoluteCurrentUrl(`/api/og?actual=${actualMbti}&chugumi=${chugumiMbti}`);
  const description = `실제 ${actualMbti} → 추구미 ${chugumiMbti} · ${resultType.sub}`;

  sdk.Share.sendDefault({
    objectType: 'feed',
    content: {
      title: `${chugumiMbti} ${resultType.title}`,
      description,
      imageUrl,
      link: {
        mobileWebUrl: resultUrl,
        webUrl: resultUrl,
      },
    },
    buttons: [
      {
        title: '결과 보러가기',
        link: {
          mobileWebUrl: resultUrl,
          webUrl: resultUrl,
        },
      },
      {
        title: '테스트 하러 가기',
        link: {
          mobileWebUrl: homeUrl,
          webUrl: homeUrl,
        },
      },
    ],
  });

  return true;
}
