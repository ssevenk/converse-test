/**
 * 题目数据管理
 * 包含16道题目和对应的图片数据
 */
import { QuizCard } from '../atoms/quizAtoms';

export const createQuizData = (): QuizCard[] => {
  const questions = [
    {
      question: "哪个星球是太阳系中最大的？",
      options: ["火星", "木星", "土星", "天王星"],
      correctAnswer: 1
    },
    {
      question: "世界上最高的山峰是？",
      options: ["珠穆朗玛峰", "乞力马扎罗山", "阿尔卑斯山", "安第斯山"],
      correctAnswer: 0
    },
    {
      question: "中国的首都是？",
      options: ["上海", "广州", "北京", "深圳"],
      correctAnswer: 2
    },
    {
      question: "一年有多少个月？",
      options: ["10个", "11个", "12个", "13个"],
      correctAnswer: 2
    },
    {
      question: "海洋中最大的动物是？",
      options: ["鲨鱼", "蓝鲸", "章鱼", "海豚"],
      correctAnswer: 1
    },
    {
      question: "彩虹有几种颜色？",
      options: ["5种", "6种", "7种", "8种"],
      correctAnswer: 2
    },
    {
      question: "地球绕太阳转一圈需要多长时间？",
      options: ["一个月", "半年", "一年", "两年"],
      correctAnswer: 2
    },
    {
      question: "人体最大的器官是？",
      options: ["心脏", "肝脏", "皮肤", "肺"],
      correctAnswer: 2
    },
    {
      question: "水的沸点是多少摄氏度？",
      options: ["90°C", "95°C", "100°C", "105°C"],
      correctAnswer: 2
    },
    {
      question: "一周有几天？",
      options: ["5天", "6天", "7天", "8天"],
      correctAnswer: 2
    },
    {
      question: "中国有多少个省份？",
      options: ["22个", "23个", "24个", "25个"],
      correctAnswer: 1
    },
    {
      question: "光速是多少？",
      options: ["30万公里/秒", "20万公里/秒", "40万公里/秒", "50万公里/秒"],
      correctAnswer: 0
    },
    {
      question: "世界上最大的洋是？",
      options: ["大西洋", "印度洋", "太平洋", "北冰洋"],
      correctAnswer: 2
    },
    {
      question: "人体有多少块骨头？",
      options: ["206块", "196块", "216块", "186块"],
      correctAnswer: 0
    },
    {
      question: "金字塔位于哪个国家？",
      options: ["希腊", "埃及", "意大利", "土耳其"],
      correctAnswer: 1
    },
    {
      question: "世界上最小的国家是？",
      options: ["摩纳哥", "梵蒂冈", "列支敦士登", "圣马力诺"],
      correctAnswer: 1
    }
  ];

  return questions.map((q, index) => ({
    id: index + 1,
    imageUrl: `https://picsum.photos/400/300?random=${index + 1}`,
    question: q.question,
    options: q.options,
    correctAnswer: q.correctAnswer,
    isFlipped: false,
    isAnswered: false
  }));
};
