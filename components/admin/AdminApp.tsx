'use client';

import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

import { IntroEditor } from '@/components/admin/IntroEditor';
import { QuestionEditor } from '@/components/admin/QuestionEditor';
import { TipEditor } from '@/components/admin/TipEditor';
import { TypeEditor } from '@/components/admin/TypeEditor';
import { defaultCmsData, fetchCmsData, seedDefaultCmsData } from '@/lib/content';
import { createSupabaseBrowserClient } from '@/lib/supabase';
import { CmsData } from '@/lib/types';

const tabs = [
  { id: 'intro', label: '인트로/안내' },
  { id: 'questions', label: '질문지' },
  { id: 'types', label: '결과 유형' },
  { id: 'tips', label: '성장 가이드' },
] as const;

type AdminTab = (typeof tabs)[number]['id'];

export function AdminApp() {
  const [client] = useState(() => createSupabaseBrowserClient());
  const [session, setSession] = useState<Session | null>(null);
  const [cmsData, setCmsData] = useState<CmsData>(defaultCmsData);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState<AdminTab>('intro');
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [selectedTypeIndex, setSelectedTypeIndex] = useState(0);
  const [selectedTipIndex, setSelectedTipIndex] = useState(0);

  useEffect(() => {
    if (!client) return;

    client.auth.getSession().then(({ data }) => setSession(data.session ?? null));

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => subscription.unsubscribe();
  }, [client]);

  useEffect(() => {
    if (!client || !session) return;

    setIsLoading(true);
    fetchCmsData(client)
      .then((data) => setCmsData(data))
      .finally(() => setIsLoading(false));
  }, [client, session]);

  const saveCurrentTab = async () => {
    if (!client) return;

    setIsLoading(true);
    setStatusMessage('저장 중...');

    if (tab === 'intro') {
      await client.from('intro_content').upsert(cmsData.introRows, { onConflict: 'key' });
    }
    if (tab === 'questions') {
      await client.from('questions').upsert(cmsData.questions, { onConflict: 'sort_order' });
    }
    if (tab === 'types') {
      await client.from('result_types').upsert(cmsData.resultTypes, { onConflict: 'mbti_code' });
    }
    if (tab === 'tips') {
      await client.from('growth_tips').upsert(cmsData.growthTips, { onConflict: 'direction' });
    }

    setStatusMessage('저장 완료');
    setIsLoading(false);
  };

  const handleReset = async () => {
    if (!client) return;
    if (!window.confirm('모든 CMS 텍스트를 기본값으로 복원할까요?')) return;

    setIsLoading(true);
    setStatusMessage('기본값 복원 중...');
    await seedDefaultCmsData(client);
    const data = await fetchCmsData(client);
    setCmsData(data);
    setStatusMessage('기본값으로 복원했습니다.');
    setIsLoading(false);
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!client) return;

    setIsLoading(true);
    setStatusMessage('로그인 중...');
    const { error } = await client.auth.signInWithPassword({ email, password });
    setStatusMessage(error ? error.message : '로그인 완료');
    setIsLoading(false);
  };

  if (!client) {
    return (
      <main className="app-shell min-h-screen px-4 py-8">
        <div className="mx-auto flex max-w-[720px] items-center justify-center">
          <section className="card-surface w-full rounded-[32px] px-6 py-8 sm:px-8">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[var(--color-secondary)]">Admin Setup</p>
            <h1 className="mt-3 font-[var(--font-display)] text-4xl text-[var(--color-dark)]">Supabase 환경 변수가 필요합니다.</h1>
            <div className="mt-5 space-y-3 text-sm font-medium leading-7 text-slate-600">
              <p><code>NEXT_PUBLIC_SUPABASE_URL</code> 과 <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> 를 먼저 설정하세요.</p>
              <p>스키마는 <code>supabase/schema.sql</code> 에 넣어두었습니다.</p>
              <p>로그인 후 기본값 복원 버튼으로 앱 기본 콘텐츠를 바로 시드할 수 있습니다.</p>
            </div>
          </section>
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="app-shell min-h-screen px-4 py-8">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[520px] items-center justify-center">
          <section className="card-surface w-full rounded-[32px] px-6 py-8 sm:px-8">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[var(--color-secondary)]">Admin Login</p>
            <h1 className="mt-3 font-[var(--font-display)] text-4xl text-[var(--color-dark)]">추구미 여행 CMS</h1>
            <p className="mt-2 text-sm font-medium text-slate-600">Supabase Auth에 등록된 단일 관리자 계정으로 로그인하세요.</p>

            <form onSubmit={handleLogin} className="mt-6 grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm font-black text-slate-700">이메일</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-[18px] border border-[rgba(26,26,46,0.08)] bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[rgba(92,107,192,0.46)] focus:ring-4 focus:ring-[rgba(92,107,192,0.12)]"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-black text-slate-700">비밀번호</span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-[18px] border border-[rgba(26,26,46,0.08)] bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[rgba(92,107,192,0.46)] focus:ring-4 focus:ring-[rgba(92,107,192,0.12)]"
                />
              </label>
              <button
                type="submit"
                disabled={isLoading}
                className="primary-button mt-2 rounded-[20px] px-5 py-4 font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                로그인
              </button>
            </form>
            {statusMessage ? <p className="mt-4 text-sm font-semibold text-slate-500">{statusMessage}</p> : null}
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="app-shell min-h-screen px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-5">
        <section className="card-surface rounded-[32px] px-6 py-6 sm:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-[var(--color-secondary)]">Admin Dashboard</p>
              <h1 className="mt-2 font-[var(--font-display)] text-4xl text-[var(--color-dark)]">추구미 여행 MBTI CMS</h1>
              <p className="mt-2 text-sm font-medium text-slate-600">로그인 계정: {session.user.email}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                disabled={isLoading}
                onClick={saveCurrentTab}
                className="primary-button rounded-[18px] px-5 py-3 font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                현재 탭 저장
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={handleReset}
                className="rounded-[18px] border border-[rgba(255,112,67,0.18)] bg-[rgba(255,112,67,0.08)] px-5 py-3 font-extrabold text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                기본값 복원
              </button>
              <button
                type="button"
                onClick={() => client.auth.signOut()}
                className="rounded-[18px] border border-white/80 bg-white/80 px-5 py-3 font-extrabold text-slate-700"
              >
                로그아웃
              </button>
            </div>
          </div>
          {statusMessage ? <p className="mt-3 text-sm font-semibold text-slate-500">{statusMessage}</p> : null}
        </section>

        <section className="card-surface rounded-[32px] px-4 py-4 sm:px-5">
          <div className="flex flex-wrap gap-2">
            {tabs.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`rounded-full px-4 py-2 text-sm font-black transition ${
                  tab === item.id
                    ? 'bg-[var(--color-secondary)] text-white'
                    : 'bg-white/80 text-slate-500'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </section>

        <section className="card-surface rounded-[32px] px-4 py-4 sm:px-5 sm:py-5">
          {isLoading ? <p className="px-2 py-4 text-sm font-semibold text-slate-500">불러오는 중...</p> : null}
          {!isLoading && tab === 'intro' ? (
            <IntroEditor
              rows={cmsData.introRows}
              onChange={(index, value) => {
                setCmsData((prev) => {
                  const nextRows = prev.introRows.map((row, currentIndex) =>
                    currentIndex === index ? { ...row, value } : row,
                  );
                  return {
                    ...prev,
                    introRows: nextRows,
                    introContent: nextRows.reduce<CmsData['introContent']>((acc, row) => {
                      acc[row.key] = row.value;
                      return acc;
                    }, { ...prev.introContent }),
                  };
                });
              }}
            />
          ) : null}

          {!isLoading && tab === 'questions' ? (
            <QuestionEditor
              questions={cmsData.questions}
              selectedIndex={selectedQuestionIndex}
              onSelect={setSelectedQuestionIndex}
              onChange={(index, field, value) => {
                setCmsData((prev) => ({
                  ...prev,
                  questions: prev.questions.map((question, currentIndex) =>
                    currentIndex === index ? { ...question, [field]: value } : question,
                  ),
                }));
              }}
            />
          ) : null}

          {!isLoading && tab === 'types' ? (
            <TypeEditor
              types={cmsData.resultTypes}
              selectedIndex={selectedTypeIndex}
              onSelect={setSelectedTypeIndex}
              onChange={(index, field, value) => {
                setCmsData((prev) => ({
                  ...prev,
                  resultTypes: prev.resultTypes.map((resultType, currentIndex) =>
                    currentIndex === index ? { ...resultType, [field]: value } : resultType,
                  ),
                }));
              }}
            />
          ) : null}

          {!isLoading && tab === 'tips' ? (
            <TipEditor
              tips={cmsData.growthTips}
              selectedIndex={selectedTipIndex}
              onSelect={setSelectedTipIndex}
              onChange={(index, field, value) => {
                setCmsData((prev) => ({
                  ...prev,
                  growthTips: prev.growthTips.map((tip, currentIndex) =>
                    currentIndex === index ? { ...tip, [field]: value } : tip,
                  ),
                }));
              }}
            />
          ) : null}
        </section>
      </div>
    </main>
  );
}
