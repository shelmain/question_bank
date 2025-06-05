"use client"
import React, {useEffect, useState} from 'react';
import { Tag } from 'antd';
import Link from "next/link";
import {fetchJudgeData, fetchMultipleData, fetchSingleData} from "@/utils/common";

interface QuestionItem {
  序号: string;
  题目板块: string;
  难度系数: string;
  题目内容: string;
  题目答案: string;
  选项: string[];
  题目解析: string;
  文件根据: string;
  yourAnswer?: string[];
  isCorrect?: boolean | null;
}

const QuestionListPage = (props:{params:Promise<{slug:string[]}>}) => {
  const [type,page=0] = React.use(props?.params)?.slug;
  const [data,setData] = useState<QuestionItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  // const [typeKeys,setTypeKeys] = useState([]);
  useEffect(() => {
    let typekeys =[]
    let historyAnswer = [];
    //
    if(page == "-1"){
      if(type === "multiple") {
        fetchMultipleData().then(res=>{
          setData(res || [])
          setLoaded(true)
        }).catch(()=>{
          setData([])
          setLoaded(true)
        });
      }else if(type === "single"){
        fetchSingleData().then(res=>{
          setData(res || [])
          setLoaded(true)
        }).catch(()=>{
          setData([])
          setLoaded(true)
        });
      }else{
        fetchJudgeData().then(res=>{
          setData(res || [])
          setLoaded(true)
        }).catch(()=>{
          setData([])
          setLoaded(true)
        });
      }

    }else{
      if(type === "multiple") {
        typekeys = ["yourMultipleAnswer", "multipleData", "multipleNumber"];
      }else if(type === "single"){
        typekeys = ["yourAnswer","singleData",'singleNumber'];
      }else{
        typekeys = ["yourJudgeAnswer","judgeData",'judgeNumber'];

      }
      historyAnswer = JSON.parse(localStorage.getItem(typekeys[0]+page) || "[]")
      console.log(historyAnswer)
      setData(historyAnswer);
      setLoaded(true)
    }
    // const orderNumber = localStorage.getItem("singleNumber") ? JSON.parse(localStorage.getItem("singleNumber") || ""):0;


  }, []);
  // const data: QuestionItem[] = JSON.parse(localStorage.getItem("singleData")|| '[]')

  const getBackgroundColor = (isCorrect: boolean | null) => {
    if (isCorrect === true) return 'bg-green-100 border-green-500';
    if (isCorrect === false) return 'bg-red-100 border-red-500';
    return 'bg-gray-100 border-gray-500';
  };
  if (!loaded) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl">加载题目中...</div>
        </div>
    );
  }
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-6 ">题目列表</h1>
      {
        !data.length ? <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl">暂无内容...</div>
        </div>:<div className="space-y-4 text-[#000]">
        {data.map((item:any) => (
          <Link href={`/${type === "multiple" ? 'multiple_choice' : "single_choice"}/${page}/${item.序号}/${type}`}
            key={item.序号}
            className={`p-4 rounded-lg border-l-4 flex flex-col text-block ${getBackgroundColor(item.isCorrect)}`}
          >
            <div className="flex text-block justify-between items-start mb-2">
              <div className="mb-2">
                <span className="font-bold text-block">{item.序号}.</span>
                <span className="font-medium text-block text-Text12">{item.题目内容}</span>
              </div>
              {/*<div className="flex space-x-2 text-block">*/}
              {/*  <Tag color="blue">{item.题目板块}</Tag>*/}
              {/*  <Tag color={item.难度系数 === '困难' ? 'red' : item.难度系数 === '中等' ? 'orange' : 'green'}>*/}
              {/*    {item.难度系数}*/}
              {/*  </Tag>*/}
              {/*</div>*/}
            </div>

            {
              page !='-1' && <div className="text-sm text-gray-500">
              你的答案: {Array.isArray(item.yourAnswer) ? item.yourAnswer.join(', '): item.yourAnswer || '未回答'}
            </div>
            }
          </Link>
        ))}
      </div>
      }
    </div>
  );
};

export default QuestionListPage;
