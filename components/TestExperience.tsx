'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { BootScreen } from '@/components/screens/BootScreen';
import { ScreenShell } from '@/components/ui/ScreenShell';
import { IntroScreen } from '@/components/screens/IntroScreen';
import { MbtiInputScreen } from '@/components/screens/MbtiInputScreen';
import { QuestionScreen } from '@/components/screens/QuestionScreen';
import { ResultScreen } from '@/components/screens/ResultScreen';
import { calculateChugumiMbti } from '@/lib/calculate';
import { defaultCmsData, fetchCmsData, parseCmsBoolean } from '@/lib/content';
import { createSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase';
import { Answer, CmsData } from '@/lib/types';
import { useChugumiStore } from '@/lib/store';

export function TestExperience({ initialCmsData = null }: { initialCmsData?: CmsData | null }) {
  const [cmsData, setCmsData] = useState<CmsData | null>(initialCmsData);
  const [isCmsReady, setIsCmsReady] = useState(Boolean(initialCmsData) || !isSupabaseConfigured());
  const logKeyRef = useRef<string | null>(null);
  const {
    step,
    actualMbti,
    answers,
    currentQuestionIndex,
    setStep,
    setActualMbti,
    answerQuestion,
    setCurrentQuestionIndex,
    reset,
  } = useChugumiStore();

  useEffect(() => {
    const client = createSupabaseBrowserClient();

    if (!client) {
      if (!initialCmsData) {
        setCmsData(defaultCmsData);
      }
      setIsCmsReady(true);
      return;
    }

    let cancelled = false;

    fetchCmsData(client)
      .then((data) => {
        if (cancelled) return;
        setCmsData(data);
        setIsCmsReady(true);
      })
      .catch(() => {
        if (cancelled) return;
        setCmsData((prev) => prev ?? defaultCmsData);
        setIsCmsReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [initialCmsData]);

  const resolvedCmsData = cmsData ?? defaultCmsData;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step, currentQuestionIndex]);

  const answerEntries = useMemo<Answer[]>(() => {
    return resolvedCmsData.questions
      .map((question, index) => {
        const value = answers[index];
        return value ? { axis: question.axis, value: value as Answer['value'] } : null;
      })
      .filter((entry): entry is Answer => Boolean(entry));
  }, [answers, resolvedCmsData.questions]);

  const chugumiMbti = useMemo(() => {
    if (answerEntries.length !== resolvedCmsData.questions.length) return '';
    return calculateChugumiMbti(answerEntries);
  }, [answerEntries, resolvedCmsData.questions.length]);

  const currentQuestion = resolvedCmsData.questions[currentQuestionIndex];
  const currentSelectedValue = answers[currentQuestionIndex];
  const resultType =
    resolvedCmsData.resultTypes.find((item) => item.mbti_code === chugumiMbti) ?? resolvedCmsData.resultTypes[0];
  const adsEnabled = parseCmsBoolean(resolvedCmsData.introContent.adsEnabled, false);

  useEffect(() => {
    if (step !== 'result' || !actualMbti || !chugumiMbti) return;

    const uniqueKey = `${actualMbti}:${chugumiMbti}`;
    if (logKeyRef.current === uniqueKey) return;

    const client = createSupabaseBrowserClient();
    logKeyRef.current = uniqueKey;

    if (!client) return;

    void (async () => {
      try {
        await client.from('test_logs').insert({ actual_mbti: actualMbti, chugumi_mbti: chugumiMbti });
      } catch {
        // Logging failures should not block the result screen.
      }
    })();
  }, [actualMbti, chugumiMbti, step]);

  const handleAnswer = (value: string) => {
    answerQuestion(currentQuestionIndex, value);

    if (currentQuestionIndex < resolvedCmsData.questions.length - 1) {
      window.setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 180);
    }
  };

  const handleNext = () => {
    if (!currentSelectedValue) return;

    if (currentQuestionIndex === resolvedCmsData.questions.length - 1) {
      if (Object.keys(answers).length === resolvedCmsData.questions.length) {
        setStep('result');
      }
      return;
    }

    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handlePrev = () => {
    if (currentQuestionIndex === 0) return;
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  return (
    <ScreenShell
      onHome={() => {
        logKeyRef.current = null;
        reset();
      }}
    >
      {!isCmsReady ? <BootScreen /> : null}

      {isCmsReady && step === 'intro' ? (
        <IntroScreen content={resolvedCmsData.introContent} onStart={() => setStep('passport')} />
      ) : null}

      {isCmsReady && step === 'passport' ? (
        <MbtiInputScreen
          content={resolvedCmsData.introContent}
          initialValue={actualMbti}
          onBack={() => setStep('intro')}
          onSubmit={(mbti) => {
            setActualMbti(mbti);
            setCurrentQuestionIndex(0);
            setStep('questions');
          }}
        />
      ) : null}

      {isCmsReady && step === 'questions' && currentQuestion ? (
        <QuestionScreen
          content={resolvedCmsData.introContent}
          question={currentQuestion}
          currentIndex={currentQuestionIndex}
          total={resolvedCmsData.questions.length}
          answeredCount={Object.keys(answers).length}
          selectedValue={currentSelectedValue}
          onAnswer={handleAnswer}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      ) : null}

      {isCmsReady && step === 'result' && resultType ? (
        <ResultScreen
          actualMbti={actualMbti}
          chugumiMbti={chugumiMbti}
          resultType={resultType}
          growthTips={resolvedCmsData.growthTips}
          adsEnabled={adsEnabled}
          onRetry={() => {
            logKeyRef.current = null;
            reset();
          }}
        />
      ) : null}
    </ScreenShell>
  );
}
