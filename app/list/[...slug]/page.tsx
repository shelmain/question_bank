"use client"
import React, {useEffect, useState} from 'react';
import { Tag } from 'antd';

interface QuestionItem {
  序号: string;
  题目板块: string;
  难度系数: string;
  题目内容: string;
  题目答案: string;
  选项: string[];
  题目解析: string;
  文件根据: string;
  yourAnswer: string[];
  isCorrect: boolean | null;
}

const QuestionListPage = (props:{params:Promise<{slug:string[]}>}) => {
  const [type,page=0] = React.use(props?.params)?.slug;
  const [data,setData] = useState([]);
  // const [typeKeys,setTypeKeys] = useState([]);
  useEffect(() => {
    let typekeys =""
    if(type === "multiple"){
      typekeys = "yourMultipleAnswer"
    }else{
      typekeys = "yourAnswer"
    }
    // const orderNumber = localStorage.getItem("singleNumber") ? JSON.parse(localStorage.getItem("singleNumber") || ""):0;
    const historyAnswer = JSON.parse(localStorage.getItem(typekeys+page) || "[]");
    console.log(historyAnswer)
    setData(historyAnswer);

  }, []);
  // const data: QuestionItem[] = JSON.parse(localStorage.getItem("singleData")|| '[]')

  const getBackgroundColor = (isCorrect: boolean | null) => {
    if (isCorrect === true) return 'bg-green-100 border-green-500';
    if (isCorrect === false) return 'bg-red-100 border-red-500';
    return 'bg-gray-100 border-gray-500';
  };
  // if(data.length){
  //   return <div className="flex items-center">暂无内容。。。</div>
  // }
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-6 ">题目列表</h1>
      <div className="space-y-4 text-[#000]">
        {data.map((item:any) => (
          <div
            key={item.序号}
            className={`p-4 rounded-lg border-l-4 text-block ${getBackgroundColor(item.isCorrect)}`}
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

            <div className="text-sm text-gray-500">
              你的答案: {Array.isArray(item.yourAnswer) ? item.yourAnswer.join(', '): item.yourAnswer || '未回答'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionListPage;
