/**
 * 单个卡片的状态管理逻辑
 * 处理卡片翻转、答题等交互状态
 */
import { useAtom } from 'jotai';
import { quizCardsAtom, progressAtom } from '../../atoms/quizAtoms';

export const useQuizCardState = () => {
  const [cards, setCards] = useAtom(quizCardsAtom);
  const [progress, setProgress] = useAtom(progressAtom);

  const flipCard = (cardId: number) => {
    setCards(prev => prev.map(card => 
      card.id === cardId 
        ? { ...card, isFlipped: !card.isFlipped }
        : card
    ));
  };

  const answerQuestion = (cardId: number, answerIndex: number) => {
    setCards(prev => prev.map(card => {
      if (card.id === cardId && !card.isAnswered) {
        const isCorrect = answerIndex === card.correctAnswer;
        
        // 更新进度
        setProgress(currentProgress => ({
          ...currentProgress,
          answered: currentProgress.answered + 1,
          score: isCorrect ? currentProgress.score + 1 : currentProgress.score
        }));

        return {
          ...card,
          isAnswered: true,
          userAnswer: answerIndex
        };
      }
      return card;
    }));
  };

  return {
    cards,
    progress,
    flipCard,
    answerQuestion
  };
};
