"use client"
import {useEffect,useState} from "react";

export default async function WrongQuestion({params}:{params: Promise<{ order: string }>}){
    const { pageType } = await params;
    const [keys,setKeys] = useState<string[]>([]);
    const [questions, setQuestions] = useState<any[]>([]);
    useEffect(() => {
        if(pageType==="multiple"){
            setKeys(["multipleNumber","currentMultipleIndex","yourMultipleAnswer"])
        }else{
            setKeys(["singleNumber","currentIndex","yourAnswer"])
        }
    }, [pageType]);
    useEffect(() => {
    //     获取练习次数
        const orderNumber = localStorage.getItem(keys[0]) ? JSON.parse(localStorage.getItem("singleNumber") || ""):0;
        for (let i = 0;i<orderNumber;i++){
            const  item = JSON.parse(localStorage.getItem(keys[2]+orderNumber) || "[]")
            setQuestions(prev=>[...prev,item])
        }
    }, [keys]);
    return <div>432</div>
}