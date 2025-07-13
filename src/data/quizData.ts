/**
 * 题目数据管理
 * 根据JSON配置文件生成的16道题目数据，支持单选题、多选题和简答题
 */
import { QuizCard } from '../atoms/quizAtoms';
import wzj from './assets/wzj.jpg'
import cy from './assets/cy.jpg'
import labubu2 from './assets/labubu-2.jpg'
import labubu5 from './assets/labubu5.jpg'
import jxl from './assets/jxl.jpg'
import Vanessa from './assets/Vanessa.jpg'
import zsn from './assets/zsn.jpg'
import labubu1 from './assets/labubu-1.jpg'
import zyl from './assets/zyl.jpg'
import MDYolanda from './assets/MD-Yolanda.jpg'
import pj from './assets/pj.jpg'
import lgp from './assets/lgp.jpg'
import labubu3 from './assets/labubu-3.jpg'
import lys from './assets/lys.jpg'
import glf from './assets/glf.jpg'
import zimomo from "./assets/zimomo.jpg"

export const createQuizData = (): QuizCard[] => {
  const questions = [
    {
      type: 'multiselect' as const,
      question: "交感神经过度激活的主要表现为",
      options: [
        "血压升高",
        "心率增快",
        "心肌耗氧量减少",
        "心绞痛发作"
      ],
      correctAnswer: [0, 1, 3], // 答案ABD
      points: 8,
      imageUrl: labubu1
    },
    {
      type: 'shortanswer' as const,
      question: "进入体内可定大量被______摄取。",
      points: 5,
      imageUrl: wzj,
    },
    {
      type: 'shortanswer' as const,
      question: "可使LDL-C降低50%以上的可定剂量是",
      points: 5,
      imageUrl: cy,
    },
    {
      type: 'shortanswer' as const,
      question: "可定®获批斑块适应症是基于哪个临床研究？",
      points: 8,
      imageUrl: labubu2,
    },
    {
      type: 'shortanswer' as const,
      question: "动脉粥样硬化主要是血液中___引起的？",
      points: 5,
      imageUrl: jxl,
    },
    {
      type: 'shortanswer' as const,
      question: "请简单介绍一下《名院社区》项目",
      points: 10,
      imageUrl: pj,
    },
    {
      type: 'shortanswer' as const,
      question: "胸痛中心第三版质控指标中新增出院带药管理指标，其中明确要求：所有ACS患者他汀药物使用率不得低于  %，双抗血小板治疗率不得低于   %；β受体阻滞剂(无禁忌症)的使用率不得低于   %",
      points: 10,
      imageUrl: zimomo,
    },
    {
      type: 'multiple' as const,
      question: "XZK 带量政策执行后，24粒和60粒考核价分别是？",
      options: [
        "21.51；56.89",
        "21.51；32.96",
        "13.19；32.96",
        "13.19；56.89"
      ],
      correctAnswer: 2, // 答案C
      points: 5,
      imageUrl: zsn,
    },
    {
      type: 'multiselect' as const,
      question: "原研倍他乐克缓释片和仿制品有哪些区别？",
      options: [
        "原研有独特的缓释微丸制剂技术",
        "通过一致性评级的仿制品在临床上完全等效",
        "仿制品与原研相比，心血管事件发生风险增加45%",
        "仿制品与原研相比，心动过缓不良反应报告率是原研的5倍"
      ],
      correctAnswer: [0, 2, 3], // 答案ACD
      points: 5,
      imageUrl: zyl,
    },
    {
      type: 'multiple' as const,
      question: "《2024中国NSTE-ACS指南》对ACS患者的常规抗血小板治疗P2Y12受体抑制剂方面是如何推荐的？",
      options: [
        "首选氯吡格雷联合阿司匹林进行抗血小板治疗",
        "氯吡格雷仅在替格瑞洛不可及、不耐受或有禁忌症时使用",
        "替格瑞洛负荷剂量800 mg，维持剂量150mg/d",
        "仅在选择保守治疗策略时，选择替格瑞洛"
      ],
      correctAnswer: 1, // 答案B
      points: 5,
      imageUrl: MDYolanda,
    },
    {
      type: 'shortanswer' as const,
      question: "心血管疾病患者（如高血压）一般心率快于___次/min时需要干预？",
      points: 5,
      imageUrl: Vanessa,
    },
    {
      type: 'multiple' as const,
      question: "国内外指南对CCS人群中使用β受体阻滞剂是如何推荐的？",
      options: [
        "低剂量使用β受体阻滞剂，以防止心动过缓",
        "使用其他抑制交感神经药物疗效不佳时，可联合使用β受体阻滞剂",
        "如无禁忌证，建议所有患者初始选择β受体阻滞剂，并逐步增加至维持剂量",
        "在心率得到有效控制后，可逐渐减量至最终停药"
      ],
      correctAnswer: 2, // 答案C
      points: 5,
      imageUrl: lgp,
    },
    {
      type: 'shortanswer' as const,
      question: "STELLAR研究是一项比较不同剂量的他汀治疗和安全性的研究结果显示，可定10mg降低LDL-C幅度为",
      points: 8,
      imageUrl: labubu3,
    },
    {
      type: 'multiple' as const,
      question: "以下关于血脂康调脂作用说法错误的是：",
      options: [
        "降低TC",
        "降低TG",
        "降低LDL-C",
        "降低HDL-C"
      ],
      correctAnswer: 3, // 答案D
      points: 5,
      imageUrl: lys,
    },
    {
      type: 'multiselect' as const,
      question: "β受体阻滞剂用于治疗心血管疾病（高血压、心绞痛等）的药理机制是什么？",
      options: [
        "抑制交感神经过度激活",
        "降低血脂",
        "减小心脏收缩力和心率，降低血压和心脏负荷",
        "快速高效可逆"
      ],
      correctAnswer: [0, 2], // 答案AC
      points: 5,
      imageUrl: glf
    },
    {
      type: 'shortanswer' as const,
      question: "可定三重机制稳定斑块，具体是哪三重机制？",
      points: 8,
      imageUrl: labubu5
    }
  ];

  return questions.map((q, index) => ({
    id: index + 1,
    imageUrl: q.imageUrl,
    question: q.question,
    type: q.type,
    options: q.options,
    correctAnswer: q.correctAnswer,
    points: q.points,
    isFlipped: false,
    isAnswered: false
  }));
};