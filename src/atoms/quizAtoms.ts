/**
 * 全局状态管理
 * 管理答题进度、卡片翻转状态等全局数据
 */
import { atom } from 'jotai';

export interface QuizCard {
  id: number;
  imageUrl: string;
  question: string;
  options: string[];
  correctAnswer: number;
  isFlipped: boolean;
  isAnswered: boolean;
  userAnswer?: number;
}

// 答题卡片数据
export const quizCardsAtom = atom<QuizCard[]>([]);

// 当前弹窗卡片ID
export const activeCardAtom = atom<number | null>(null);

// 当前答题进度
export const progressAtom = atom<{
  answered: number;
  total: number;
  score: number;
}>({
  answered: 0,
  total: 16,
  score: 0
});

// 游戏状态
export const gameStateAtom = atom<'playing' | 'completed'>('playing');