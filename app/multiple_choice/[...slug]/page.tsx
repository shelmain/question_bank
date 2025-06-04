"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import Head from "next/head";
import ProgressBar from "../../components/ProgressBar";
import MultipleQuestionCard from "../../components/MultipleQuestionCard";
import {fetchMultipleData} from "@/utils/common";

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

export default function Practice(props:{params:Promise<{slug:string[]}>}) {
  const [page=0,index=0] = React.use(props?.params)?.slug;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [errorNumber, setError] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const currentQuestion = questions[currentIndex];
  const [orderNumber,setOrderNumber] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if(page != "-1"){
      setOrderNumber(+page);
      //  第几次历史记录
      if(index != "-1"){
        setCurrentIndex(+index-1);
        const historyAnswer = JSON.parse(localStorage.getItem("yourMultipleAnswer"+orderNumber) || "[]")?.find((i:any)=>i.序号 == index);
        console.log(historyAnswer)
        setIsCorrect(historyAnswer?.isCorrect);
        historyAnswer.yourAnswer && setSelectedOptions(historyAnswer.yourAnswer)
        if(historyAnswer.isCorrect !==null){
          setShowExplanation(true);
        }
        // handleOptionSelect(historyAnswer.yourAnswer)
      }
    }
    else{
      const orderNumber = JSON.parse(localStorage.getItem("multipleNumber") || "0");
      //  如果是列表模式过来
      if(index != "-1"){
        // 好像没用，不知道是不是要设置一下 localStorage
        setOrderNumber(orderNumber)
        setCurrentIndex(+index-1);
        const historyAnswer = JSON.parse(localStorage.getItem("yourMultipleAnswer"+orderNumber) || "[]")?.find((i:any)=>i.序号 == index);
        console.log("historyAnswer",orderNumber,historyAnswer)
        if(historyAnswer){
          setIsCorrect(historyAnswer?.isCorrect);
          historyAnswer?.yourAnswer && setSelectedOptions(historyAnswer?.yourAnswer)
          if(historyAnswer?.isCorrect !==null){
            setShowExplanation(true);
          }
        }
        // handleOptionSelect(historyAnswer.yourAnswer)
      }else{
        setCurrentIndex(JSON.parse(localStorage.getItem("currentMultipleIndex"+orderNumber) || "0"))
        setOrderNumber(+orderNumber||0)
        localStorage.setItem("currentMultipleIndex"+(+orderNumber+1), JSON.stringify(currentIndex));

        // 记录页面跳进来
        // setCurrentIndex(localStorage.getItem("currentMultipleIndex"+orderNumber)?JSON.parse(localStorage.getItem("currentMultipleIndex"+orderNumber) || ""):  0)
      }

    }


    setScore(localStorage.getItem("yourMultipleAnswer"+orderNumber)?JSON.parse(localStorage.getItem("yourMultipleAnswer"+orderNumber) || "[]").reduce((current:number,item:any)=>item.isCorrect+current,0):  0)
    setError(localStorage.getItem("yourMultipleAnswer"+orderNumber)?JSON.parse(localStorage.getItem("yourMultipleAnswer"+orderNumber) || "[]").reduce((current:number,item:any)=>item.isCorrect === false ? 1+current : current,0):  0)

    fetchMultipleData().then((res:any)=>{
      setQuestions(res)
      setLoaded(true)
    }).catch(()=>{
      setQuestions([])
      setLoaded(true)
    });
  }, []);

  const handleOptionSelect = (option: string) => {
    if (isCorrect !== null) return; // 如果已经提交答案，不允许再选择
    if (selectedOptions?.includes(option)) {
      setSelectedOptions(selectedOptions?.filter(o => o !== option));
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
    }else{
      setError(prevScore => prevScore + 1);
    }
    const historyAnswer = JSON.parse(localStorage.getItem("yourMultipleAnswer"+orderNumber) || "[]");
    localStorage.setItem("yourMultipleAnswer"+orderNumber, JSON.stringify([...historyAnswer,{...questions[currentIndex],yourAnswer:selectedOptions.sort(),isCorrect:correct}]));
    localStorage.setItem("currentMultipleIndex"+orderNumber, JSON.stringify(currentIndex));
    setIsCorrect(correct);
    setShowExplanation(true);
  };

  // 列表模式
  const toListPage = () => {
    router.replace(`/list/multiple/-1`)
  }
  // 练习记录
  const toHistory = ()=>{
    router.replace(`/orderList/multiple`)

  }
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
      router.replace(`/result/${score}/${questions.length}/${errorNumber}`)
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
          <div className="flex items-center justify-between gap-3 mb-5">
          <span onClick={toListPage}  className="text-blue-500 text-sm hover:bg-green-700 ">
            {/*<Button type="primary" size="large" className="bg-green-500 hover:bg-green-700 text-white">*/}
            列表模式
            {/*</Button>*/}
          </span>
            <span onClick={toHistory}  className="text-blue-500 text-sm hover:bg-green-700 ">
            {/*<Button type="primary" size="large" className="bg-green-500 hover:bg-green-700 text-white">*/}
              练习记录
              {/*</Button>*/}
          </span></div>
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
