/**
 * 单个卡片的状态管理逻辑
 * 处理卡片翻转、答题等交互状态
 */
import { useAtom } from 'jotai';
import { quizCardsAtom, progressAtom, activeCardAtom } from '../../atoms/quizAtoms';

export const useQuizCardState = () => {
  const [cards, setCards] = useAtom(quizCardsAtom);
  const [progress, setProgress] = useAtom(progressAtom);
  const [activeCard, setActiveCard] = useAtom(activeCardAtom);

  const openCard = (cardId: number) => {
    setActiveCard(cardId);
    // 调整为650毫秒后自动翻转到题目面，适中的响应速度
    setTimeout(() => {
      setCards(prev => prev.map(card => 
        card.id === cardId 
          ? { ...card, isFlipped: true }
          : card
      ));
    }, 650);
  };

  const closeCard = () => {
    setActiveCard(null);
    // 重置翻转状态
    setCards(prev => prev.map(card => ({ ...card, isFlipped: false })));
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

    // 答题完成后2秒关闭弹窗
    setTimeout(() => {
      closeCard();
    }, 2000);
  };

  return {
    cards,
    progress,
    activeCard,
    openCard,
    closeCard,
    answerQuestion
  };
};