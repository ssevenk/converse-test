/**
 * 单个答题卡片组件
 * 实现卡片的翻转动画、图片显示、题目展示和答题交互
 */
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import { QuizCard } from '../../atoms/quizAtoms';

interface QuizCardProps {
  card: QuizCard;
  onFlip: (cardId: number) => void;
  onAnswer: (cardId: number, answerIndex: number) => void;
}

const QuizCardComponent: React.FC<QuizCardProps> = ({ card, onFlip, onAnswer }) => {
  const handleCardClick = () => {
    if (!card.isAnswered) {
      onFlip(card.id);
    }
  };

  const handleAnswerClick = (answerIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onAnswer(card.id, answerIndex);
  };

  return (
    <div 
      className="relative w-full h-48 cursor-pointer"
      style={{ perspective: '1000px' }}
      onClick={handleCardClick}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: card.isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* 正面 - 图片 */}
        <div 
          className="absolute inset-0 w-full h-full rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-blue-400 to-purple-500"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)'
          }}
        >
          <img 
            src={card.imageUrl} 
            alt={`卡片 ${card.id}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            <span className="text-white text-lg font-bold bg-black bg-opacity-50 px-3 py-1 rounded-lg">
              点击翻转
            </span>
          </div>
          {card.isAnswered && (
            <div className="absolute top-2 right-2">
              {card.userAnswer === card.correctAnswer ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <XCircle className="w-6 h-6 text-red-500" />
              )}
            </div>
          )}
        </div>

        {/* 反面 - 题目 */}
        <div 
          className="absolute inset-0 w-full h-full rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-purple-500 to-pink-500 p-4"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="h-full flex flex-col">
            <h3 className="text-white text-sm font-bold mb-3 leading-tight">
              {card.question}
            </h3>
            
            <div className="flex-1 flex flex-col gap-2">
              {card.options.map((option, index) => {
                let buttonClass = "w-full text-left text-xs p-2 rounded-lg transition-all transform hover:scale-105 ";
                
                if (card.isAnswered) {
                  if (index === card.correctAnswer) {
                    buttonClass += "bg-green-500 text-white shadow-lg";
                  } else if (index === card.userAnswer && index !== card.correctAnswer) {
                    buttonClass += "bg-red-500 text-white shadow-lg";
                  } else {
                    buttonClass += "bg-white bg-opacity-50 text-gray-700";
                  }
                } else {
                  buttonClass += "bg-white bg-opacity-80 text-gray-800 hover:bg-opacity-100 shadow-md";
                }

                return (
                  <button
                    key={index}
                    className={buttonClass}
                    onClick={(e) => handleAnswerClick(index, e)}
                    disabled={card.isAnswered}
                  >
                    {String.fromCharCode(65 + index)}. {option}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default QuizCardComponent;