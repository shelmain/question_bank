"use client"
import React, {useEffect, useState} from 'react';
import { Tag } from 'antd';
import Link from "next/link";


const QuestionListPage= (props:{params:Promise<{type:string}>}) => {
  const type = React.use(props?.params)?.type;
  const [title, setTitle] = React.useState<string>("单选题列表");
  const [data,setData] = useState(0);
  // const [typeKeys,setTypeKeys] = useState([]);
  useEffect(() => {
    let typekeys =""
    if(type === "multiple"){
      typekeys = "multipleNumber"
    }else{
      typekeys = "singleNumber"
    }
    // const orderNumber = localStorage.getItem("singleNumber") ? JSON.parse(localStorage.getItem("singleNumber") || ""):0;
    const historyAnswer = JSON.parse(localStorage.getItem(typekeys) || "0");
    setData(historyAnswer);

  }, []);
  // const data: QuestionItem[] = JSON.parse(localStorage.getItem("singleData")|| '[]')


  // console.log("data",data,[...Array(data).keys()])

  return (
    <div className="container mx-auto p-4 ">
      <h1 className="text-xl font-bold mb-6 ">刷题记录</h1>
      <div className="space-y-4 ">
        {[...Array(data+1).keys()].map((item) => (
          <Link href={`/list/${type}/${item}`}
            key={item}
            className={`p-4 rounded-lg border-1 border bg-blue-100 block text-block border-blue-500`}
          >
            <div className="flex text-block justify-between items-start mb-2">
              <div className="mb-2">
                <span className="font-bold text-block">{item+1}.</span>
                <span className="font-medium text-block text-Text12">第{item+1}次刷题记录</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuestionListPage;
