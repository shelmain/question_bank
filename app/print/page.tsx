"use client"
import React, {useEffect, useState} from "react";
import Link from "next/link";
import Image from "next/image";
import qrcode from "@/public/asset/imgs/qrcode.jpg";
import {Button} from "antd";

export default function (){
    const [token, setToken] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState<string>("");
    const [isValid, setIsValid] = useState<boolean | null>(null);

    useEffect(() => {
        // 检查是否有 token
        const storedToken = localStorage.getItem("printToken");
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleVerify = () => {
        // 从 JSON 文件中加载有效的 token 列表
        import("../../public/asset/printToken.json").then((tokens) => {
            if (tokens.default.includes(inputValue)) {
                localStorage.setItem("printToken", "true");
                setToken(inputValue);
                setIsValid(true);
            } else {
                setIsValid(false);
            }
        });
    };
    if (token) {
        return (<div>
            <Link href={'/print/multiple'}><Button>多选题打印</Button></Link>
            <Link href={'/print/multiple'}><Button>单选题打印</Button></Link>
            <Link href={'/print/judge'}><Button>判断题打印</Button></Link>
        </div>)
    }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-sky-500 to-emerald-500 text-white">
            <div className="bg-opacity-80 bg-[#ffffff00] p-8 rounded-lg max-w-md w-full">
                <h1 className="text-4xl font-bold text-center mb-6">验证身份</h1>
                <p className="text-lg text-center mb-8">
                    请扫描二维码添加好友付款后可获得验证码。
                </p>
                <div className="flex justify-center mb-8">
                    <Image src={qrcode} alt="QR Code" width={200} height={200} />
                </div>
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                    placeholder="请输入验证码"
                />
                <Button
                    onClick={handleVerify}
                    className="bg-blue-500 hover:bg-blue-700 text-white w-full"
                >
                    验证
                </Button>
                {isValid === false && (
                    <p className="text-red-500 mt-2">验证码无效，请重新输入。</p>
                )}
            </div>
        </div>
    );
}