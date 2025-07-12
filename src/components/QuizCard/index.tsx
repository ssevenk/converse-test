/**
 * 单个答题卡片组件
 * 实现卡片的翻转动画、图片显示、题目展示和答题交互
 * 支持单选题、多选题和简答题三种题型，增加30秒倒计时功能
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, X, Check, Clock } from 'lucide-react';
import { QuizCard } from '../../atoms/quizAtoms';

interface QuizCardProps {
  card: QuizCard;
  isActive: boolean;
  onOpen: (cardId: number) => void;
  onClose: () => void;
  onAnswer: (cardId: number, answer: number | number[] | boolean) => void;
}

const QuizCardComponent: React.FC<QuizCardProps> = ({ 
  card, 
  isActive, 
  onOpen, 
  onClose, 
  onAnswer 
}) => {
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [countdown, setCountdown] = useState<number>(30);
  const [isCountdownActive, setIsCountdownActive] = useState<boolean>(false);

  const handleCardClick = () => {
    if (!card.isAnswered && !isActive) {
      onOpen(card.id);
    }
  };

  const handleMultipleChoiceClick = (answerIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCountdownActive(false); // 停止倒计时
    onAnswer(card.id, answerIndex);
  };

  const handleTrueFalseClick = (answer: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCountdownActive(false); // 停止倒计时
    onAnswer(card.id, answer);
  };

  const handleMultiSelectClick = (optionIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (card.isAnswered) return;

    setSelectedOptions(prev => {
      if (prev.includes(optionIndex)) {
        return prev.filter(index => index !== optionIndex);
      } else {
        return [...prev, optionIndex];
      }
    });
  };

  const handleMultiSelectSubmit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedOptions.length > 0) {
      setIsCountdownActive(false); // 停止倒计时
      onAnswer(card.id, selectedOptions);
    }
  };

  const handleStartCountdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCountdownActive(true);
    setCountdown(30);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 倒计时逻辑
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isCountdownActive && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (isCountdownActive && countdown === 0) {
      // 倒计时结束，自动提交错误答案
      setIsCountdownActive(false);
      if (card.type === 'multiple') {
        // 单选题提交一个错误答案（选择不是正确答案的选项）
        const wrongAnswer = card.correctAnswer === 0 ? 1 : 0;
        onAnswer(card.id, wrongAnswer);
      } else if (card.type === 'multiselect') {
        // 多选题提交空数组（错误答案）
        onAnswer(card.id, []);
      } else {
        // 简答题提交false（错误答案）
        onAnswer(card.id, false);
      }
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isCountdownActive, countdown, card, onAnswer]);

  // 重置状态当卡片关闭时
  useEffect(() => {
    if (!isActive) {
      setSelectedOptions([]);
      setCountdown(30);
      setIsCountdownActive(false);
    }
  }, [isActive]);

  const renderAnswerButtons = () => {
    if (card.type === 'multiple') {
      // 单选题
      return (
        <div className="flex-1 flex flex-col gap-4">
          {card.options?.map((option, index) => {
            let buttonClass = "w-full text-left text-base p-4 rounded-lg transition-all transform hover:scale-105 ";
            
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
                onClick={(e) => handleMultipleChoiceClick(index, e)}
                disabled={card.isAnswered}
                whileHover={{ scale: card.isAnswered ? 1 : 1.02 }}
                whileTap={{ scale: card.isAnswered ? 1 : 0.98 }}
              >
                {String.fromCharCode(65 + index)}. {option}
              </motion.button>
            );
          })}
        </div>
      );
    } else if (card.type === 'multiselect') {
      // 多选题
      return (
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex-1 flex flex-col gap-3">
            {card.options?.map((option, index) => {
              const isSelected = selectedOptions.includes(index);
              const isCorrect = Array.isArray(card.correctAnswer) && card.correctAnswer.includes(index);
              const isUserSelected = Array.isArray(card.userAnswer) && card.userAnswer.includes(index);
              
              let buttonClass = "w-full text-left text-base p-4 rounded-lg transition-all transform hover:scale-105 flex items-center gap-4 ";
              let checkboxClass = "w-5 h-5 rounded border-2 transition-all flex items-center justify-center ";
              
              if (card.isAnswered) {
                if (isCorrect) {
                  buttonClass += "bg-green-500 text-white shadow-lg border-2 border-green-300";
                  checkboxClass += "bg-green-600 border-green-600";
                } else if (isUserSelected && !isCorrect) {
                  buttonClass += "bg-red-500 text-white shadow-lg border-2 border-red-300";
                  checkboxClass += "bg-red-600 border-red-600";
                } else {
                  buttonClass += "bg-white bg-opacity-50 text-gray-700";
                  checkboxClass += "bg-gray-300 border-gray-400";
                }
              } else {
                if (isSelected) {
                  buttonClass += "bg-blue-500 text-white shadow-lg hover:bg-blue-600";
                  checkboxClass += "bg-blue-500 border-blue-500";
                } else {
                  buttonClass += "bg-white bg-opacity-90 text-gray-800 hover:bg-opacity-100 shadow-lg hover:shadow-xl";
                  checkboxClass += "bg-white border-gray-400";
                }
              }

              const showCheckmark = (!card.isAnswered && isSelected) || (card.isAnswered && (isCorrect || isUserSelected));

              return (
                <motion.button
                  key={index}
                  className={buttonClass}
                  onClick={(e) => handleMultiSelectClick(index, e)}
                  disabled={card.isAnswered}
                  whileHover={{ scale: card.isAnswered ? 1 : 1.02 }}
                  whileTap={{ scale: card.isAnswered ? 1 : 0.98 }}
                >
                  <div className={checkboxClass}>
                    {showCheckmark && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <span>{String.fromCharCode(65 + index)}. {option}</span>
                </motion.button>
              );
            })}
          </div>
          
          {!card.isAnswered && (
            <motion.button
              className={`w-full py-4 rounded-lg font-bold text-xl transition-all transform ${
                selectedOptions.length > 0
                  ? 'bg-purple-500 text-white hover:bg-purple-600 shadow-lg hover:shadow-xl hover:scale-105'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
              onClick={handleMultiSelectSubmit}
              disabled={selectedOptions.length === 0}
              whileHover={{ scale: selectedOptions.length > 0 ? 1.02 : 1 }}
              whileTap={{ scale: selectedOptions.length > 0 ? 0.98 : 1 }}
            >
              提交答案 ({selectedOptions.length}项)
            </motion.button>
          )}
        </div>
      );
    } else {
      // 简答题 - 主持人操作
      return (
        <div className="flex-1 flex flex-col justify-end">
          <div className="flex gap-6 justify-center">
            <motion.button
              className={`px-10 py-5 rounded-xl font-bold text-xl transition-all transform ${
                card.isAnswered
                  ? card.userAnswer === true
                    ? 'bg-green-500 text-white shadow-lg border-2 border-green-300'
                    : 'bg-white bg-opacity-50 text-gray-700'
                  : 'bg-green-500 text-white hover:bg-green-600 shadow-lg hover:shadow-xl hover:scale-105'
              }`}
              onClick={(e) => handleTrueFalseClick(true, e)}
              disabled={card.isAnswered}
              whileHover={{ scale: card.isAnswered ? 1 : 1.05 }}
              whileTap={{ scale: card.isAnswered ? 1 : 0.95 }}
            >
              <div className="flex items-center gap-3">
                <Check className="w-7 h-7" />
                <span>正确</span>
              </div>
            </motion.button>

            <motion.button
              className={`px-10 py-5 rounded-xl font-bold text-xl transition-all transform ${
                card.isAnswered
                  ? card.userAnswer === false
                    ? 'bg-red-500 text-white shadow-lg border-2 border-red-300'
                    : 'bg-white bg-opacity-50 text-gray-700'
                  : 'bg-red-500 text-white hover:bg-red-600 shadow-lg hover:shadow-xl hover:scale-105'
              }`}
              onClick={(e) => handleTrueFalseClick(false, e)}
              disabled={card.isAnswered}
              whileHover={{ scale: card.isAnswered ? 1 : 1.05 }}
              whileTap={{ scale: card.isAnswered ? 1 : 0.95 }}
            >
              <div className="flex items-center gap-3">
                <X className="w-7 h-7" />
                <span>错误</span>
              </div>
            </motion.button>
          </div>
        </div>
      );
    }
  };

  // 判断答案是否正确
  const isCorrectAnswer = () => {
    if (card.type === 'multiple') {
      return card.userAnswer === card.correctAnswer;
    } else if (card.type === 'multiselect') {
      const userAnswers = card.userAnswer as number[];
      const correctAnswers = card.correctAnswer as number[];
      return Array.isArray(userAnswers) && Array.isArray(correctAnswers) &&
             userAnswers.length === correctAnswers.length && 
             userAnswers.every(ans => correctAnswers.includes(ans));
    } else {
      return card.userAnswer === true;
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
          {/* <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            {!card.isAnswered && (
              <span className="text-white text-lg font-bold bg-black bg-opacity-50 px-3 py-1 rounded-lg">
                点击答题
              </span>
            )}
          </div> */}
          {card.isAnswered && (
            <div className="absolute top-2 right-2">
              {isCorrectAnswer() ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <XCircle className="w-6 h-6 text-red-500" />
              )}
            </div>
          )}
          {/* 题型标识 */}
          <div className="absolute top-2 left-2">
            <span className={`px-2 py-1 rounded text-xs font-bold text-white ${
              card.type === 'multiple' 
                ? 'bg-blue-500 bg-opacity-80' 
                : card.type === 'multiselect'
                ? 'bg-purple-500 bg-opacity-80'
                : 'bg-orange-500 bg-opacity-80'
            }`}>
              {card.type === 'multiple' ? '单选' : card.type === 'multiselect' ? '多选' : '简答'}
            </span>
          </div>
          {/* 分值标识 */}
          <div className="absolute bottom-2 right-2">
            <span className="bg-yellow-500 bg-opacity-90 text-white px-2 py-1 rounded-full text-xs font-bold">
              {card.points}分
            </span>
          </div>
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
              className="relative w-[500px] h-[600px]"
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
                  className="absolute inset-0 w-full h-full rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-purple-500 to-pink-500 p-8"
                  style={{ 
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  <div className="h-full flex flex-col">
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-4 py-2 rounded-full text-base font-bold text-white ${
                          card.type === 'multiple' 
                            ? 'bg-blue-500 bg-opacity-80' 
                            : card.type === 'multiselect'
                            ? 'bg-purple-600 bg-opacity-80'
                            : 'bg-orange-600 bg-opacity-80'
                        }`}>
                          {card.type === 'multiple' ? '单选题' : card.type === 'multiselect' ? '多选题' : '简答题'}
                        </span>
                        <span className="bg-yellow-500 bg-opacity-90 text-white px-4 py-2 rounded-full text-base font-bold">
                          {card.points}分
                        </span>
                      </div>
                      <h3 className="text-white text-xl font-bold leading-relaxed">
                        {card.question}
                      </h3>
                    </div>

                    {/* 倒计时按钮和显示 */}
                    {card.isFlipped && !card.isAnswered && (
                      <div className="mb-4">
                        {!isCountdownActive ? (
                          <motion.button
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                            onClick={handleStartCountdown}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Clock className="w-5 h-5" />
                            开始30秒倒计时
                          </motion.button>
                        ) : (
                          <motion.div 
                            className="w-full bg-red-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2"
                            animate={{ 
                              scale: countdown <= 5 ? [1, 1.05, 1] : 1,
                              backgroundColor: countdown <= 10 ? ['#ef4444', '#dc2626', '#ef4444'] : '#ef4444'
                            }}
                            transition={{ 
                              duration: countdown <= 5 ? 0.5 : 1,
                              repeat: countdown <= 5 ? Infinity : 0
                            }}
                          >
                            <Clock className="w-5 h-5" />
                            倒计时：{countdown}秒
                          </motion.div>
                        )}
                      </div>
                    )}
                    
                    {renderAnswerButtons()}

                    {card.isAnswered && (
                      <motion.div 
                        className="mt-6 text-center relative"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        {/* 答对时的庆祝粒子效果 */}
                        {isCorrectAnswer() && (
                          <div className="absolute inset-0 pointer-events-none">
                            {/* 金色粒子爆炸 */}
                            {[...Array(20)].map((_, i) => (
                              <motion.div
                                key={`particle-${i}`}
                                className="absolute w-3 h-3 rounded-full"
                                style={{
                                  background: `linear-gradient(45deg, ${
                                    ['#fbbf24', '#f59e0b', '#22c55e', '#10b981', '#3b82f6'][i % 5]
                                  }, #ffffff)`
                                }}
                                initial={{
                                  x: "50%",
                                  y: "50%",
                                  scale: 0,
                                  opacity: 0
                                }}
                                animate={{
                                  x: `${50 + (Math.random() - 0.5) * 300}%`,
                                  y: `${50 + (Math.random() - 0.5) * 300}%`,
                                  scale: [0, 1.5, 0],
                                  opacity: [0, 1, 0],
                                  rotate: [0, 360, 720]
                                }}
                                transition={{
                                  duration: 2,
                                  delay: Math.random() * 0.5,
                                  ease: "easeOut"
                                }}
                              />
                            ))}
                            
                            {/* 星星闪烁效果 */}
                            {[...Array(8)].map((_, i) => (
                              <motion.div
                                key={`star-${i}`}
                                className="absolute text-yellow-300"
                                style={{
                                  fontSize: '24px',
                                  left: `${20 + i * 10}%`,
                                  top: `${30 + (i % 2) * 40}%`
                                }}
                                initial={{ scale: 0, opacity: 0, rotate: -180 }}
                                animate={{ 
                                  scale: [0, 1.5, 1, 1.2, 1],
                                  opacity: [0, 1, 1, 1, 0],
                                  rotate: [0, 180, 360]
                                }}
                                transition={{
                                  duration: 1.5,
                                  delay: 0.3 + i * 0.1,
                                  ease: "easeOut"
                                }}
                              >
                                ✨
                              </motion.div>
                            ))}
                            
                            {/* 圆环扩散效果 */}
                            {[...Array(3)].map((_, i) => (
                              <motion.div
                                key={`ring-${i}`}
                                className="absolute rounded-full border-4 border-green-400"
                                style={{
                                  left: '50%',
                                  top: '50%',
                                  transform: 'translate(-50%, -50%)'
                                }}
                                initial={{
                                  width: 0,
                                  height: 0,
                                  opacity: 0.8
                                }}
                                animate={{
                                  width: [0, 200, 300],
                                  height: [0, 200, 300],
                                  opacity: [0.8, 0.4, 0]
                                }}
                                transition={{
                                  duration: 1.5,
                                  delay: i * 0.2,
                                  ease: "easeOut"
                                }}
                              />
                            ))}
                          </div>
                        )}

                        {!isCorrectAnswer() && (
                          <div className="absolute inset-0 pointer-events-none">
                            {/* 红色警告波纹 */}
                            {[...Array(3)].map((_, i) => (
                              <motion.div
                                key={`warning-ring-${i}`}
                                className="absolute rounded-full border-4 border-red-500"
                                style={{
                                  left: '50%',
                                  top: '50%',
                                  transform: 'translate(-50%, -50%)'
                                }}
                                initial={{
                                  width: 50,
                                  height: 50,
                                  opacity: 0.8
                                }}
                                animate={{
                                  width: [50, 150, 200],
                                  height: [50, 150, 200],
                                  opacity: [0.8, 0.3, 0]
                                }}
                                transition={{
                                  duration: 1,
                                  delay: i * 0.15,
                                  ease: "easeOut"
                                }}
                              />
                            ))}
                            
                            {/* 错误符号飞散 */}
                            {[...Array(6)].map((_, i) => (
                              <motion.div
                                key={`error-symbol-${i}`}
                                className="absolute text-red-400 text-2xl font-bold"
                                style={{
                                  left: '50%',
                                  top: '50%'
                                }}
                                initial={{
                                  x: 0,
                                  y: 0,
                                  scale: 0,
                                  opacity: 0
                                }}
                                animate={{
                                  x: (Math.random() - 0.5) * 200,
                                  y: (Math.random() - 0.5) * 200,
                                  scale: [0, 1.2, 0],
                                  opacity: [0, 1, 0],
                                  rotate: [0, 360]
                                }}
                                transition={{
                                  duration: 1.2,
                                  delay: i * 0.1,
                                  ease: "easeOut"
                                }}
                              >
                                ❌
                              </motion.div>
                            ))}
                          </div>
                        )}

                        <motion.div 
                          className="flex items-center justify-center gap-3 text-white relative z-10"
                          animate={isCorrectAnswer() ? {
                            scale: [1, 1.2, 1.1, 1.2, 1],
                            y: [0, -10, 0, -5, 0]
                          } : {
                            x: [-10, 10, -8, 8, -5, 5, 0],
                            rotate: [-2, 2, -1, 1, 0]
                          }}
                          transition={{ 
                            duration: isCorrectAnswer() ? 2 : 1,
                            repeat: isCorrectAnswer() ? 1 : 0
                          }}
                        >
                          {isCorrectAnswer() ? (
                            <>
                              <motion.div
                                className="relative"
                                animate={{
                                  rotate: [0, 360],
                                  scale: [1, 1.5, 1.3, 1.5, 1.2]
                                }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                              >
                                {/* 成功图标光环 */}
                                <motion.div
                                  className="absolute inset-0 rounded-full"
                                  style={{
                                    background: 'radial-gradient(circle, rgba(34, 197, 94, 0.6) 0%, transparent 70%)',
                                    filter: 'blur(8px)'
                                  }}
                                  animate={{
                                    scale: [1, 2, 1],
                                    opacity: [0.6, 1, 0.6]
                                  }}
                                  transition={{
                                    duration: 1.5,
                                    repeat: 2,
                                    ease: "easeInOut"
                                  }}
                                />
                                <CheckCircle className="w-7 h-7 text-green-300 relative z-10" />
                              </motion.div>
                              
                              <motion.span 
                                className="font-bold text-lg relative"
                                animate={{
                                  color: [
                                    "#ffffff", 
                                    "#22c55e", 
                                    "#fbbf24", 
                                    "#3b82f6", 
                                    "#ffffff"
                                  ],
                                  textShadow: [
                                    "0 0 0px rgba(255,255,255,0)",
                                    "0 0 10px rgba(34,197,94,0.8)",
                                    "0 0 15px rgba(251,191,36,0.8)",
                                    "0 0 10px rgba(59,130,246,0.8)",
                                    "0 0 0px rgba(255,255,255,0)"
                                  ]
                                }}
                                transition={{ duration: 2, repeat: 1 }}
                              >
                                {card.type === 'shortanswer' ? '主持人判定正确！' : '回答正确！'}
                                获得 {card.points} 分
                                
                                {/* 分数增加动画 */}
                                <motion.span
                                  className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-yellow-400 font-bold text-xl"
                                  initial={{ opacity: 0, y: 0, scale: 0.5 }}
                                  animate={{ 
                                    opacity: [0, 1, 1, 0], 
                                    y: [0, -20, -30, -40],
                                    scale: [0.5, 1.2, 1.5, 1]
                                  }}
                                  transition={{ duration: 2, delay: 0.5 }}
                                >
                                  +{card.points}
                                </motion.span>
                              </motion.span>
                            </>
                          ) : (
                            <>
                              <motion.div
                                className="relative"
                                animate={{
                                  rotate: [-15, 15, -10, 10, -5, 5, 0],
                                  scale: [1, 1.3, 1.1, 1.3, 1]
                                }}
                                transition={{ duration: 1.2, ease: "easeOut" }}
                              >
                                {/* 错误图标脉冲 */}
                                <motion.div
                                  className="absolute inset-0 rounded-full"
                                  style={{
                                    background: 'radial-gradient(circle, rgba(239, 68, 68, 0.6) 0%, transparent 70%)',
                                    filter: 'blur(8px)'
                                  }}
                                  animate={{
                                    scale: [1, 1.8, 1],
                                    opacity: [0.6, 1, 0.6]
                                  }}
                                  transition={{
                                    duration: 0.8,
                                    repeat: 3,
                                    ease: "easeInOut"
                                  }}
                                />
                                <XCircle className="w-7 h-7 text-red-300 relative z-10" />
                              </motion.div>
                              
                              <motion.span 
                                className="font-bold text-lg"
                                animate={{
                                  color: ["#ffffff", "#ef4444", "#dc2626", "#ffffff"],
                                  textShadow: [
                                    "0 0 0px rgba(255,255,255,0)",
                                    "0 0 10px rgba(239,68,68,0.8)",
                                    "0 0 15px rgba(220,38,38,0.8)",
                                    "0 0 0px rgba(255,255,255,0)"
                                  ]
                                }}
                                transition={{ duration: 1.5, repeat: 1 }}
                              >
                                {card.type === 'shortanswer' ? '主持人判定错误' : '回答错误'}
                              </motion.span>
                            </>
                          )}
                        </motion.div>
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