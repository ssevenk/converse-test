/**
 * 单个答题卡片组件
 * 实现卡片的翻转动画、图片显示、题目展示和答题交互
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, X } from 'lucide-react';
import { QuizCard } from '../../atoms/quizAtoms';

interface QuizCardProps {
  card: QuizCard;
  isActive: boolean;
  onOpen: (cardId: number) => void;
  onClose: () => void;
  onAnswer: (cardId: number, answerIndex: number) => void;
}

const QuizCardComponent: React.FC<QuizCardProps> = ({ 
  card, 
  isActive, 
  onOpen, 
  onClose, 
  onAnswer 
}) => {
  const handleCardClick = () => {
    if (!card.isAnswered && !isActive) {
      onOpen(card.id);
    }
  };

  const handleAnswerClick = (answerIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onAnswer(card.id, answerIndex);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {/* 网格中的卡片 */}
      <motion.div 
        className="relative w-full h-48 cursor-pointer"
        whileHover={{ scale: card.isAnswered ? 1 : 1.05 }}
        whileTap={{ scale: card.isAnswered ? 1 : 0.95 }}
        onClick={handleCardClick}
        animate={{ opacity: isActive ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative w-full h-full rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-blue-400 to-purple-500">
          <img 
            src={card.imageUrl} 
            alt={`卡片 ${card.id}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            {!card.isAnswered && (
              <span className="text-white text-lg font-bold bg-black bg-opacity-50 px-3 py-1 rounded-lg">
                点击答题
              </span>
            )}
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
      </motion.div>

      {/* 弹窗模式 */}
      <AnimatePresence>
        {isActive && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
          >
            {/* 关闭按钮 */}
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
              onClick={onClose}
            >
              <X className="w-8 h-8" />
            </button>

            {/* 弹窗卡片 */}
            <motion.div 
              className="relative w-96 h-96"
              style={{ perspective: '1000px' }}
              initial={{ scale: 0.5, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 100 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <motion.div
                className="relative w-full h-full"
                style={{ transformStyle: 'preserve-3d' }}
                animate={{ rotateY: card.isFlipped ? 180 : 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {/* 正面 - 图片 */}
                <div 
                  className="absolute inset-0 w-full h-full rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-400 to-purple-500"
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
                  <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                </div>

                {/* 反面 - 题目 */}
                <div 
                  className="absolute inset-0 w-full h-full rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-purple-500 to-pink-500 p-6"
                  style={{ 
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  <div className="h-full flex flex-col">
                    <h3 className="text-white text-lg font-bold mb-6 leading-tight">
                      {card.question}
                    </h3>
                    
                    <div className="flex-1 flex flex-col gap-3">
                      {card.options.map((option, index) => {
                        let buttonClass = "w-full text-left text-sm p-3 rounded-lg transition-all transform hover:scale-105 ";
                        
                        if (card.isAnswered) {
                          if (index === card.correctAnswer) {
                            buttonClass += "bg-green-500 text-white shadow-lg border-2 border-green-300";
                          } else if (index === card.userAnswer && index !== card.correctAnswer) {
                            buttonClass += "bg-red-500 text-white shadow-lg border-2 border-red-300";
                          } else {
                            buttonClass += "bg-white bg-opacity-50 text-gray-700";
                          }
                        } else {
                          buttonClass += "bg-white bg-opacity-90 text-gray-800 hover:bg-opacity-100 shadow-lg hover:shadow-xl";
                        }

                        return (
                          <motion.button
                            key={index}
                            className={buttonClass}
                            onClick={(e) => handleAnswerClick(index, e)}
                            disabled={card.isAnswered}
                            whileHover={{ scale: card.isAnswered ? 1 : 1.02 }}
                            whileTap={{ scale: card.isAnswered ? 1 : 0.98 }}
                          >
                            {String.fromCharCode(65 + index)}. {option}
                          </motion.button>
                        );
                      })}
                    </div>

                    {card.isAnswered && (
                      <motion.div 
                        className="mt-4 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <div className="flex items-center justify-center gap-2 text-white">
                          {card.userAnswer === card.correctAnswer ? (
                            <>
                              <CheckCircle className="w-6 h-6 text-green-300" />
                              <span className="font-bold">回答正确！</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-6 h-6 text-red-300" />
                              <span className="font-bold">回答错误</span>
                            </>
                          )}
                        </div>
                        <p className="text-white text-sm mt-2 opacity-80">
                          将在2秒后自动关闭
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default QuizCardComponent;