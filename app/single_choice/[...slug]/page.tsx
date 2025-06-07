"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';
import Head from 'next/head';
import QuestionCard from '../../components/QuestionCard';
import ProgressBar from '../../components/ProgressBar';
import {fetchSingleData} from "@/utils/common";
import {Button} from "antd";
import Link from "next/link";

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

export default function Practice(props:{params:Promise<{slug:string[]}>}) {
  const [page=0,index=0] = React.use(props?.params)?.slug;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [errorNumber, setError] = useState(0);
  const [score, setScore] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [orderNumber,setOrderNumber] = useState(0);
  const router = useRouter();

  useEffect(() => {
    getHistoryData(currentIndex);
  }, [currentIndex]);
  useEffect(() => {
    if(page != "-1"){
      // 第几次历史记录
      setOrderNumber(+page);

      if(index != "-1"){
        console.log("序号",index);
        setCurrentIndex(+index-1);
        const historyAnswer = JSON.parse(localStorage.getItem("yourAnswer"+orderNumber) || "[]")?.find((i:any)=>i.序号 == index);
        console.log("historyAnswer",historyAnswer?.isCorrect,historyAnswer)
        setIsCorrect(historyAnswer?.isCorrect);
        setSelectedOption(historyAnswer?.yourAnswer || [])
        if(historyAnswer?.isCorrect !== null){
          console.log(historyAnswer?.isCorrect, typeof historyAnswer.isCorrect,"sldjflks");
          setShowExplanation(true);
        }
        // handleOptionSelect(historyAnswer.yourAnswer)
      //   暂时没有这个可能会是这样
      }else{
        // setCurrentIndex(localStorage.getItem("currentIndex"+orderNumber)?JSON.parse(localStorage.getItem("currentIndex"+orderNumber) || ""):  0)
      }
    }else{
      const orderNumber = JSON.parse(localStorage.getItem("singleNumber") || "0");
      setCurrentIndex(JSON.parse(localStorage.getItem("currentIndex"+orderNumber) || "0"))
      setOrderNumber(+orderNumber||0)
      // 列表模式过来的,不用设置数据源
      if(index != "-1"){
        setCurrentIndex(+index-1);
        setOrderNumber(orderNumber +1)
      }else{
        localStorage.setItem("currentIndex"+(+orderNumber+1), JSON.stringify(currentIndex));

      }
    }

    // 所有对的数量
    setScore(localStorage.getItem("yourAnswer"+orderNumber)?JSON.parse(localStorage.getItem("yourAnswer"+orderNumber) || "[]").reduce((current:number,item:any)=>item.isCorrect+current,0):  0)
    setError(localStorage.getItem("yourMultipleAnswer"+orderNumber)?JSON.parse(localStorage.getItem("yourMultipleAnswer"+orderNumber) || "[]").reduce((current:number,item:any)=>item.isCorrect === false ? 1+current : current,0):  0)
    fetchSingleData().then((res:any)=>{
        setQuestions(res)
        setLoaded(true)
      }).catch(()=>{
        setQuestions([])
        setLoaded(true)
      });

  }, []);

  const handleOptionSelect = (option: string) => {

    if (isCorrect !== null) return; // 已经回答过的不再处理

    setSelectedOption(option);
    const correct = questions[currentIndex].题目答案?.includes(option);
    // console.log('当前item：',correct,"回答：",option,"正确答案：",questions[currentIndex].题目答案,"currentIndex",currentIndex )
    setIsCorrect(correct);
    console.log("handleOptionSelect",correct);
    setShowExplanation(true);
//存答案
    const historyAnswer = JSON.parse(localStorage.getItem("yourAnswer"+orderNumber) || "[]");
    console.log("存答案",currentIndex);
    localStorage.setItem("yourAnswer"+orderNumber, JSON.stringify([...historyAnswer,{...questions[currentIndex],yourAnswer:option,isCorrect:correct}]));
    localStorage.setItem("currentIndex"+orderNumber, JSON.stringify(currentIndex));
    if (correct) {
      setScore(prev => prev + 1);
      setTimeout(() => {
        setSelectedOption(null);
        setIsCorrect(null);
        console.log("setTimeout",null);
        setShowExplanation(false);

        if (currentIndex < questions.length - 1) {
          setCurrentIndex((prev:number) => prev + 1);
        } else {
          //记录练习了几次
          localStorage.setItem("singleNumber", JSON.stringify(orderNumber+1) );
          // 下一次重制为零
          localStorage.setItem("currentIndex"+(orderNumber+1), JSON.stringify(0));
          // 所有题目完成，跳转到结果页
          router.push(`/result/${score}/${questions.length}`,
          );
        }
      },500)

    } else{
      setError(prevScore => prevScore + 1);
    }
  };
  // 列表模式
  const toListPage = () => {
    router.replace(`/list/single/-1`)
  }
  // 练习记录
  const toHistory = ()=>{
    router.replace(`/orderList/single`)

  }
  // 上一页
  const handlePreviousQuestion = ()=>{
    // getHistoryData(currentIndex -1)
    setCurrentIndex((prev:number) => prev - 1);

  }
  // 获取之前做题的数据
  const getHistoryData = (targetIndex:number)=>{
    if(questions.length < 1 ) return;
    console.log("<UNK>",targetIndex,currentIndex,questions);
    const index = questions[targetIndex].序号;
    const allData = JSON.parse(localStorage.getItem("yourAnswer"+orderNumber) || "[]");
    console.log("index",allData)
    const item = allData?.find((i:any)=>i.序号 === index);
    if(item){
      setSelectedOption(item.yourAnswer);
      setIsCorrect(item.isCorrect);
      console.log("isCorrect",item.isCorrect);
      setShowExplanation(item.isCorrect !== null);
      return;
    }
    setSelectedOption(null);
    setIsCorrect(null);
    console.log("答案正确时",null);
    setShowExplanation(false);

  }
  // 下一页
  const handleNextQuestion = () => {
    if (isCorrect === null) return;
    if (currentIndex < questions.length - 1) {
      // getHistoryData(currentIndex+1);
      setCurrentIndex((prev:number) => prev + 1);
    } else {
     //记录练习了几次
      localStorage.setItem("singleNumber", JSON.stringify(orderNumber+1) );
      console.log(orderNumber,"currentIndex"+(orderNumber+1));
      // 下一次重制为零
      localStorage.setItem("currentIndex"+(orderNumber+1), JSON.stringify(0));
      // 所有题目完成，跳转到结果页
      router.replace(`/result/${score}/${questions.length}/${errorNumber}`,
      );
    }  };

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

  console.log("isCorrect",isCorrect);
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
            {currentIndex > 0 && <button
                onClick={handlePreviousQuestion}
                // disabled={isCorrect === null}
                className={`px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700`}
            >
              上一题
            </button>}
            <button
              onClick={handleNextQuestion}
              disabled={isCorrect === null}
              className={`px-4 py-2 rounded-lg  ${isCorrect === null
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
