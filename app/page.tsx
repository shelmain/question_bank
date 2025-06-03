"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "antd";
import qrcode from '../public/asset/imgs/qrcode.jpg'

export default function Home() {
    const [token, setToken] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState<string>("");
    const [isValid, setIsValid] = useState<boolean | null>(null);

    useEffect(() => {
        // 检查是否有 token
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleVerify = () => {
        // 从 JSON 文件中加载有效的 token 列表
        import("../public/asset/tokens.json").then((tokens) => {
            if (tokens.default.includes(inputValue)) {
                localStorage.setItem("token", "true");
                setToken(inputValue);
                setIsValid(true);
            } else {
                setIsValid(false);
            }
        });
    };

    if (token) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-sky-500 to-emerald-500 text-white">
                <div className="bg-opacity-80  p-8 rounded-lg shadow-lg max-w-md w-full">
                    <h1 className="text-4xl font-bold text-center mb-6">招标代理从业人员培训题库</h1>
                    <p className="text-lg text-center mb-8">
                        欢迎来到招标代理从业人员培训题库！这里提供了丰富的单选题和多选题，帮助你提升专业知识和技能。祝你学习愉快！
                    </p>
                    <div className="flex justify-center space-x-4 gap-2 flex-row flex-wrap">
                        <Link href="/single_choice" passHref>
                            <Button type="primary" size="large" className="bg-blue-500 hover:bg-blue-700 text-white">
                                单选题
                            </Button>
                        </Link>
                        <Link href="/multiple_choice" passHref>
                            <Button type="primary" size="large" className="bg-green-500 hover:bg-green-700 text-white">
                                多选题
                            </Button>
                        </Link>
                        <Link href="/orderList/multiple" passHref>
                            <Button type="primary" size="large" className="bg-green-500 hover:bg-green-700 text-white">
                                多选题刷题记录
                            </Button>
                        </Link>
                        <Link href="/orderList/single" passHref>
                            <Button type="primary" size="large" className="bg-green-500 hover:bg-green-700 text-white">
                                单选题刷题记录
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
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
