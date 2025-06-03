"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';
import Head from 'next/head';
import QuestionCard from '../components/QuestionCard';
import ProgressBar from '../components/ProgressBar';

interface Question {
  序号: string;
  题目板块: string;
  难度系数: string;
  题目内容: string;
  题目答案: string;
  选项: string[];
  题目解析: string;
  文件根据: string;
}

export default function Practice() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(localStorage.getItem("currentIndex")?JSON.parse(localStorage.getItem("currentIndex") || "") + 1:  0 );
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/asset/single_choice_data.xlsx');
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        console.log(jsonData)
        // 处理数据格式
        const formattedQuestions:any[] = jsonData.map((item: any) => {
          // 提取选项 - 从__EMPTY_5到__EMPTY_12对应A-H选项
          const options = [];
          for (let i = 5; i <= 8; i++) {
            const optionKey = `__EMPTY_${i}`;
            if (item[optionKey] && item[optionKey]) {
              options.push(item[optionKey]);
            }
          }

          // 确保题目内容存在且不是空字符串
          const questionContent = item["__EMPTY_3"];
          if (!questionContent) return null;
          return {
            序号: item["__EMPTY"]?.toString() || '',
            题目板块: item["__EMPTY_1"]?.toString() || '',
            难度系数: item["__EMPTY_2"]?.toString() || '',
            题目内容: item["__EMPTY_3"]?.toString() || '',
            题目答案: item["__EMPTY_4"]?.toString() || '',
            选项: options,
            题目解析: item["__EMPTY_13"]?.toString() || '',
            文件根据: item["__EMPTY_14"]?.toString() || ''
          };
        }).filter((q: any) => q !== null); // 过滤掉无效数据
        console.log(formattedQuestions)

        setQuestions(formattedQuestions.slice(1,formattedQuestions.length) || []);
        setLoaded(true);
      } catch (error) {
        console.error('Error loading Excel file:', error);
      }
    };

    fetchData();
  }, []);

  const handleOptionSelect = (option: string) => {
    //存答案
    const historyAnswer = JSON.parse(localStorage.getItem("yourAnswer") || "[]");
    console.log(historyAnswer);
    localStorage.setItem("yourAnswer", JSON.stringify([...historyAnswer,{...questions[currentIndex],yourAnswer:option}]));
    localStorage.setItem("currentIndex", JSON.stringify(currentIndex));
    if (isCorrect !== null) return; // 已经回答过的不再处理
    console.log(currentIndex);

    setSelectedOption(option);
    const correct = option === questions[currentIndex].题目答案;
    setIsCorrect(correct);
    setShowExplanation(true);
    console.log(correct)

    if (correct) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (isCorrect === null) return;

    setSelectedOption(null);
    setIsCorrect(null);
    setShowExplanation(false);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // 所有题目完成，跳转到结果页
      router.push(`/result?score=${score}&total=${questions.length}`,
      );
    }
  };

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">加载题目中...</div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">没有找到题目数据</div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Head>
        <title>刷题练习 - 招标代理培训题库</title>
      </Head>

      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <ProgressBar progress={progress} />

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-600">
              题目 {currentIndex + 1}/{questions.length}
            </span>
            <div className="flex space-x-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                {currentQuestion.题目板块}
              </span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                {currentQuestion.难度系数}
              </span>
            </div>
          </div>

          <QuestionCard
            question={currentQuestion}
            selectedOption={selectedOption}
            isCorrect={isCorrect}
            onSelect={handleOptionSelect}
          />

          {showExplanation && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-bold text-gray-700 mb-2">解析：</h3>
              <p className="text-gray-700">{currentQuestion.题目解析}</p>
              <p className="mt-2 text-sm text-gray-500">
                依据：{currentQuestion.文件根据}
              </p>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleNextQuestion}
              disabled={isCorrect === null}
              className={`px-4 py-2 rounded-lg fixed bottom-5 right-5 ${isCorrect === null
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            >
              {currentIndex < questions.length - 1 ? '下一题' : '查看结果'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
