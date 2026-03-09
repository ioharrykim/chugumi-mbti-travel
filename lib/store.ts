import { create } from 'zustand';

import { ScreenStep } from '@/lib/types';

interface ChugumiState {
  step: ScreenStep;
  actualMbti: string;
  answers: Record<number, string>;
  currentQuestionIndex: number;
  setStep: (step: ScreenStep) => void;
  setActualMbti: (mbti: string) => void;
  answerQuestion: (questionIndex: number, value: string) => void;
  setCurrentQuestionIndex: (index: number) => void;
  reset: () => void;
}

const initialState = {
  step: 'intro' as ScreenStep,
  actualMbti: '',
  answers: {},
  currentQuestionIndex: 0,
};

export const useChugumiStore = create<ChugumiState>((set) => ({
  ...initialState,
  setStep: (step) => set({ step }),
  setActualMbti: (actualMbti) => set({ actualMbti }),
  answerQuestion: (questionIndex, value) =>
    set((state) => ({
      answers: {
        ...state.answers,
        [questionIndex]: value,
      },
    })),
  setCurrentQuestionIndex: (currentQuestionIndex) => set({ currentQuestionIndex }),
  reset: () => set(initialState),
}));
