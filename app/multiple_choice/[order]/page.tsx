"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import Head from "next/head";
import ProgressBar from "../../components/ProgressBar";
import MultipleQuestionCard from "../../components/MultipleQuestionCard";
import Link from "next/link";
import {Button} from "antd";

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

export default  function Practice({params}:{params:{ order: string }}) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const currentQuestion = questions[currentIndex];
  const [orderNumber,setOrderNumber] = useState(0);
  const router = useRouter();
  const {order } =  params;

  useEffect(() => {
    if(order == "-1"){
      const orderNumber = localStorage.getItem("multipleNumber") ? JSON.parse(localStorage.getItem("multipleNumber") || ""):0;
      setOrderNumber(orderNumber||0)
    }else{
      setOrderNumber(+order)
    }
    setCurrentIndex(localStorage.getItem("currentMultipleIndex"+orderNumber)?JSON.parse(localStorage.getItem("currentMultipleIndex"+orderNumber) || ""):  0)
    setScore(localStorage.getItem("yourMultipleAnswer"+orderNumber)?JSON.parse(localStorage.getItem("yourMultipleAnswer"+orderNumber) || "[]").reduce((current:number,item:any)=>item.isCorrect+current,0):  0)
    const fetchData = async () => {
      try {
        const response = await fetch('/asset/multiple_choice_data.xlsx');
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const formattedQuestions = jsonData.map((item: any) => {
          const options = [];
          for (let i = 4; i <= 7; i++) {
            const optionKey = `__EMPTY_${i}`;
            if (item[optionKey]) {
              options.push(item[optionKey]);
            }
          }

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
        }).filter((q: any) => q !== null);

        setQuestions(formattedQuestions.slice(2, formattedQuestions.length));
        setLoaded(true);
      } catch (error) {
        console.error('Error loading Excel file:', error);
      }
    };

    fetchData();
  }, []);

  const handleOptionSelect = (option: string) => {
    if (isCorrect !== null) return; // 如果已经提交答案，不允许再选择
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter(o => o !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const handleCheckAnswer = () => {
   const correctAnswers = currentQuestion.题目答案;
    const userAnswers = selectedOptions.sort();
    const correct = JSON.stringify(correctAnswers) === JSON.stringify(userAnswers);
    if(correct){
      setScore(prevScore => prevScore + 1);
    }
    const historyAnswer = JSON.parse(localStorage.getItem("yourMultipleAnswer"+orderNumber) || "[]");
    localStorage.setItem("yourMultipleAnswer"+orderNumber, JSON.stringify([...historyAnswer,{...questions[currentIndex],yourAnswer:selectedOptions.sort(),isCorrect:correct}]));
    localStorage.setItem("currentMultipleIndex"+orderNumber, JSON.stringify(currentIndex));
    setIsCorrect(correct);
    setShowExplanation(true);
  };
// 上一页
  const handlePreviousQuestion = ()=>{
    getHistoryData(currentIndex -1)
    setCurrentIndex((prev:number) => prev - 1);

  }
  // 获取之前做题的数据
  const getHistoryData = (targetIndex:number)=>{
    const index = questions[targetIndex].序号;
    console.log("index",index)
    const allData = JSON.parse(localStorage.getItem("yourMultipleAnswer"+orderNumber) || "[]");
    const item = allData?.find((i:any)=>i.序号 === index);
    if(item){
      setSelectedOptions(item.yourAnswer);
      setIsCorrect(item.isCorrect);
      setShowExplanation(item.isCorrect !== null);
      return;
    }
    setSelectedOptions([]);
    setIsCorrect(null);
    setShowExplanation(false);

  }
  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      getHistoryData(currentIndex+1);
      setCurrentIndex(currentIndex + 1);
    } else {
      localStorage.setItem("multipleNumber", JSON.stringify(orderNumber+1) );
      // 下一次重制为零
      localStorage.setItem("currentMultipleIndex"+(orderNumber+1), JSON.stringify(0));
      router.push(`/result/${score}/${questions.length}`)
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
            <Link className=" flex justify-end items-content gap-2 text-blue-500 text-[14px] mb-3
            " href="/wrong_question/multiple" passHref>
              <Button type="primary" size="small" className="bg-blue-500 font-bold hover:bg-blue-700 text-white">
                历史练习记录
              </Button></Link>
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
                onSelect={handleOptionSelect}
                showExplanation={showExplanation}
            />


            <div className="mt-6 flex justify-end fixed bottom-5 right-5 gap-4">
              {currentIndex > 0 && <div className="mt-4"><button
                  onClick={handlePreviousQuestion}
                  // disabled={isCorrect === null}
                  className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
              >
                上一题
              </button>
              </div>
              }
              {!showExplanation && (
                  <div className="mt-4">
                    <button
                        onClick={handleCheckAnswer}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      提交答案
                    </button>
                  </div>
              )}
              <div className="mt-4">
              <button
                  onClick={handleNextQuestion}
                  disabled={isCorrect === null}
                  className={` font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isCorrect === null
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                {currentIndex < questions.length - 1 ? '下一题' : '查看结果'}
              </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}