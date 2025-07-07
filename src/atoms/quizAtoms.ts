/**
 * 全局状态管理
 * 管理答题进度、卡片翻转状态等全局数据
 */
import { atom } from 'jotai';

export interface QuizCard {
  id: number;
  imageUrl: string;
  question: string;
  type: 'multiple' | 'multiselect' | 'shortanswer'; // 新增多选题类型
  options?: string[]; // 选择题和多选题的选项
  correctAnswer?: number | number[]; // 单选题用number，多选题用number[]
  points: number; // 每道题的分值
  isFlipped: boolean;
  isAnswered: boolean;
  userAnswer?: number | number[] | boolean; // 单选题用number，多选题用number[]，简答题用boolean
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
  maxScore: number; // 总的可能得分
}>({
  answered: 0,
  total: 16,
  score: 0,
  maxScore: 0
});

// 游戏状态
export const gameStateAtom = atom<'playing' | 'completed'>('playing');