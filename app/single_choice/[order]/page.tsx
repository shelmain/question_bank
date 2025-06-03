"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import Head from "next/head";
import QuestionCard from "../../components/QuestionCard";
import ProgressBar from "../../components/ProgressBar";

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

export default function Practice({ params }: { params: { order: string } }) {
  const { order } = params;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [orderNumber, setOrderNumber] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const orderNumber = localStorage.getItem("singleNumber")
        ? JSON.parse(localStorage.getItem("singleNumber") || "0")
        : 0;
    setOrderNumber(orderNumber);

    const currentIdx = localStorage.getItem("currentIndex" + orderNumber)
        ? JSON.parse(localStorage.getItem("currentIndex" + orderNumber) || "0")
        : 0;
    setCurrentIndex(currentIdx);

    const historyAnswer = JSON.parse(
        localStorage.getItem("yourAnswer" + orderNumber) || "[]"
    );
    const currentQuestion = questions.find(
        (q) => q.序号 === (currentIdx + 1).toString()
    );
    if (currentQuestion) {
      const answer = historyAnswer.find(
          (a: any) => a.序号 === currentQuestion.序号
      );
      if (answer) {
        setSelectedOption(answer.yourAnswer);
        setIsCorrect(answer.isCorrect);
        setShowExplanation(true);
      } else {
        setSelectedOption(null);
        setIsCorrect(null);
        setShowExplanation(false);
      }
    }
  }, [orderNumber, questions]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/asset/single_choice_data.xlsx");
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const formattedQuestions: any[] = jsonData.map((item: any) => {
          const options = [];
          for (let i = 5; i <= 8; i++) {
            const optionKey = `__EMPTY_${i}`;
            if (item[optionKey] && item[optionKey]) {
              options.push(item[optionKey]);
            }
          }

          return {
            序号: item["__EMPTY"]?.toString() || "",
            题目板块: item["__EMPTY_1"]?.toString() || "",
            难度系数: item["__EMPTY_2"]?.toString() || "",
            题目内容: item["__EMPTY_3"]?.toString() || "",
            题目答案: item["__EMPTY_4"]?.toString() || "",
            选项: options,
            题目解析: item["__EMPTY_13"]?.toString() || "",
            文件根据: item["__EMPTY_14"]?.toString() || "",
          };
        }).filter((q: any) => q !== null);

        setQuestions(formattedQuestions.slice(1, formattedQuestions.length) || []);
        setLoaded(true);
      } catch (error) {
        console.error("Error loading Excel file:", error);
      }
    };

    fetchData();
  }, []);

  const handleOptionSelect = (option: string) => {
    if (isCorrect !== null) return; // 已经回答过的不再处理

    setSelectedOption(option);
    const correct = option === questions[currentIndex].题目答案;
    setIsCorrect(correct);
    setShowExplanation(true);

    const historyAnswer = JSON.parse(
        localStorage.getItem("yourAnswer" + orderNumber) || "[]"
    );
    localStorage.setItem(
        "yourAnswer" + orderNumber,
        JSON.stringify([
          ...historyAnswer,
          { ...questions[currentIndex], yourAnswer: option, isCorrect: correct },
        ])
    );
    localStorage.setItem("currentIndex" + orderNumber, JSON.stringify(currentIndex));

    if (correct) {
      setScore((prev) => prev + 1);
      setTimeout(() => {
        setSelectedOption(null);
        setIsCorrect(null);
        setShowExplanation(false);

        if (currentIndex < questions.length - 1) {
          setCurrentIndex((prev: number) => prev + 1);
        } else {
          localStorage.setItem("singleNumber", JSON.stringify(orderNumber + 1));
          localStorage.setItem("currentIndex" + (orderNumber + 1), JSON.stringify(0));
          router.push(`/result/${score}/${questions.length}`);
        }
      }, 500);
    }
  };

  const handlePreviousQuestion = () => {
    setCurrentIndex((prev: number) => prev - 1);
  };

  const handleNextQuestion = () => {
    if (isCorrect === null) return;
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev: number) => prev + 1);
    } else {
      localStorage.setItem("singleNumber", JSON.stringify(orderNumber + 1));
      localStorage.setItem("currentIndex" + (orderNumber + 1), JSON.stringify(0));
      router.push(`/result/${score}/${questions.length}`);
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

            <div className="mt-6 flex justify-end fixed bottom-5 right-5 gap-4">
              {currentIndex > 0 && (
                  <button
                      onClick={handlePreviousQuestion}
                      className={`px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700`}
                  >
                    上一题
                  </button>
              )}
              <button
                  onClick={handleNextQuestion}
                  disabled={isCorrect === null}
                  className={`px-4 py-2 rounded-lg ${
                      isCorrect === null
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
              >
                {currentIndex < questions.length - 1 ? "下一题" : "查看结果"}
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}