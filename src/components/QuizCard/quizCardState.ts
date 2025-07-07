/**
 * 单个卡片的状态管理逻辑
 * 处理卡片翻转、答题等交互状态，支持单选题、多选题和简答题
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

  const answerQuestion = (cardId: number, answer: number | number[] | boolean) => {
    setCards(prev => prev.map(card => {
      if (card.id === cardId && !card.isAnswered) {
        let isCorrect = false;
        
        if (card.type === 'multiple') {
          // 单选题：对比预设答案
          isCorrect = answer === card.correctAnswer;
        } else if (card.type === 'multiselect') {
          // 多选题：对比数组答案
          const userAnswers = answer as number[];
          const correctAnswers = card.correctAnswer as number[];
          isCorrect = Array.isArray(userAnswers) && Array.isArray(correctAnswers) &&
                     userAnswers.length === correctAnswers.length && 
                     userAnswers.every(ans => correctAnswers.includes(ans));
        } else {
          // 简答题：主持人的判断就是最终结果
          isCorrect = answer === true;
        }
        
        // 更新进度 - 使用题目的分值
        setProgress(currentProgress => ({
          ...currentProgress,
          answered: currentProgress.answered + 1,
          score: isCorrect ? currentProgress.score + card.points : currentProgress.score
        }));

        return {
          ...card,
          isAnswered: true,
          userAnswer: answer
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