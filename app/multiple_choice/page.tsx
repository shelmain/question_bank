"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';
import Head from 'next/head';
import ProgressBar from '../components/ProgressBar';
import MultipleQuestionCard from "@/app/components/MultipleQuestionCard";

interface Question {
  序号: string;
  题目板块: string;
  难度系数: string;
  题目内容: string;
  题目答案: string[];
  选项: string[];
  题目解析: string;
  文件根据: string;
}

export default function Practice() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number >(localStorage.getItem("currentMultipleIndex")?JSON.parse(localStorage.getItem("currentMultipleIndex") || "") + 1:  0 );
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/asset/multiple_choice_data.xlsx');
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
          for (let i = 4; i <= 7; i++) {
            const optionKey = `__EMPTY_${i}`;
            if (item[optionKey] && item[optionKey]) {
              options.push(item[optionKey]);
            }
          }

          // 确保题目内容存在且不是空字符串
          const questionContent = item["__EMPTY_3"];
          if (!questionContent) return null;
          return {
            序号: item["招标代理从业人员培训题库"]?.toString() || '',
            题目板块: item["__EMPTY"]?.toString() || '',
            难度系数: item["__EMPTY_1"]?.toString() || '',
            题目内容: item["__EMPTY_2"]?.toString() || '',
            题目答案: item["__EMPTY_3"]?.toString().split('') || '',
            选项: options,
            题目解析: item["__EMPTY_12"]?.toString() || '',
            文件根据: item["__EMPTY_13"]?.toString() || ''
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
    if (selectedOptions?.includes(option)) {
      setSelectedOptions(selectedOptions.filter(o => o !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
    const historyAnswer = JSON.parse(localStorage.getItem("yourMultipleAnswer") || "[]");
    console.log(historyAnswer);
    localStorage.setItem("yourMultipleAnswer", JSON.stringify([...historyAnswer,{...questions[currentIndex],yourAnswer:option}]));
    localStorage.setItem("currentMultipleIndex", JSON.stringify(currentIndex));
  };

  const handleCheckAnswer = () => {
    setShowExplanation(true);
    const correctAnswers = questions[currentQuestionIndex].题目答案;
    const userAnswers = selectedOptions.sort();
    setIsCorrect(JSON.stringify(correctAnswers) === JSON.stringify(userAnswers));
  };



  const handleNextQuestion = () => {
    if (isCorrect === null) return;
    setSelectedOptions([]);
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

            <MultipleQuestionCard
                question={currentQuestion}
                selectedOptions={selectedOptions}
                isCorrect={isCorrect}
                showExplanation={showExplanation}
                onSelect={handleOptionSelect}
            />

            {
                !showExplanation && <div className="mt-4">
              <button
                  onClick={handleCheckAnswer}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                提交答案
              </button>
            </div>
            }
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
