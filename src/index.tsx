/**
 * 主答题界面组件
 * 负责整体布局、进度显示和答题网格的渲染
 */
import React, { useEffect } from 'react';
import { useAtom } from 'jotai';
import { Trophy, Target, CheckCircle } from 'lucide-react';
import { quizCardsAtom, progressAtom, gameStateAtom } from './atoms/quizAtoms';
import { createQuizData } from './data/quizData';
import { useQuizCardState } from './components/QuizCard/quizCardState';
import QuizCardComponent from './components/QuizCard';

const QuizGame: React.FC = () => {
  const [gameState, setGameState] = useAtom(gameStateAtom);
  const [cards, setCards] = useAtom(quizCardsAtom);
  const [progress, setProgress] = useAtom(progressAtom);
  const { activeCard, openCard, closeCard, answerQuestion } = useQuizCardState();

  // 初始化题目数据
  useEffect(() => {
    const quizData = createQuizData();
    setCards(quizData);
    // 计算总的可能得分
    const maxScore = quizData.reduce((sum, card) => sum + card.points, 0);
    setProgress(prev => ({ ...prev, maxScore }));
  }, [setCards, setProgress]);

  // 检查游戏完成状态
  useEffect(() => {
    if (progress.answered === progress.total) {
      setGameState('completed');
    }
  }, [progress.answered, progress.total, setGameState]);

  const resetGame = () => {
    const quizData = createQuizData();
    setCards(quizData);
    const maxScore = quizData.reduce((sum, card) => sum + card.points, 0);
    setProgress({ answered: 0, total: 16, score: 0, maxScore });
    setGameState('playing');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-[800px] mx-auto">
        {/* 标题和进度 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Target className="w-8 h-8" />
            我带BOSS冲冲冲
          </h1>
          
          <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl p-4 max-w-md mx-auto">
            <div className="flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>已答题: {progress.answered}/{progress.total}</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                <span>得分: {progress.score}/{progress.maxScore}</span>
              </div>
            </div>
            
            <div className="mt-3 bg-white bg-opacity-30 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(progress.answered / progress.total) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* 答题网格 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {cards.map((card) => (
            <QuizCardComponent
              key={card.id}
              card={card}
              isActive={activeCard === card.id}
              onOpen={openCard}
              onClose={closeCard}
              onAnswer={answerQuestion}
            />
          ))}
        </div>

        {/* 完成状态 */}
        {gameState === 'completed' && (
          <div className="text-center">
            <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl p-8 max-w-md mx-auto">
              <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">挑战完成！</h2>
              <p className="text-white text-lg mb-4">
                最终得分: {progress.score}/{progress.maxScore}
              </p>
              <p className="text-white mb-6">
                正确率: {((progress.score / progress.maxScore) * 100).toFixed(1)}%
              </p>
              <button
                onClick={resetGame}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full font-bold transform hover:scale-105 transition-all shadow-lg"
              >
                重新挑战
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizGame;