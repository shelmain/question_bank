"use client"
import React, {useEffect, useState} from "react";
import Link from "next/link";
import Image from "next/image";
import qrcode from "@/public/asset/imgs/qrcode.jpg";
import {Button} from "antd";

export default function AuthPage() {
    const [token, setToken] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState<string>("");
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const storedToken = localStorage.getItem("printToken");
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        if (isValid === false) setIsValid(null); // 清除错误状态当用户重新输入时
    };

    const handleVerify = () => {
        setIsLoading(true);
        import("../../public/asset/printToken.json").then((tokens) => {
            if (tokens.default.includes(inputValue)) {
                localStorage.setItem("printToken", "true");
                setToken(inputValue);
                setIsValid(true);
            } else {
                setIsValid(false);
            }
            setIsLoading(false);
        });
    };

    if (token) {
        return (
            <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center p-6">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden w-full max-w-md border border-amber-200 p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-amber-800 mb-2">打印功能</h1>
                        <p className="text-amber-600">请选择要打印的题目类型</p>
                    </div>

                    <div className="flex flex-col space-y-4 gap-1">
                        <Link href={'/print/multiple'}>
                            <Button
                                block
                                size="large"
                                className="h-12 bg-amber-100 hover:bg-amber-200 border-amber-200 text-amber-800 hover:text-amber-900 transition-all"
                            >
                                多选题打印
                            </Button>
                        </Link>
                        <Link href={'/print/single'}>
                            <Button
                                block
                                size="large"
                                className="h-12 bg-amber-100 hover:bg-amber-200 border-amber-200 text-amber-800 hover:text-amber-900 transition-all"
                            >
                                单选题打印
                            </Button>
                        </Link>
                        <Link href={'/print/judge'}>
                            <Button
                                block
                                size="large"
                                className="h-12 bg-amber-100 hover:bg-amber-200 border-amber-200 text-amber-800 hover:text-amber-900 transition-all"
                            >
                                判断题打印
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div style={{
            backgroundImage: `url(https://wx2.sinaimg.cn/mw690/005K3dRrly1hrc2hiygwtj31ko2t4kjm.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }} className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden w-full max-w-md border border-amber-200 transition-all hover:shadow-xl">
                <div className="bg-gradient-to-r from-amber-100 to-amber-50 p-6 text-center relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-amber-200 opacity-20"></div>
                    <div className="absolute -bottom-5 -left-5 w-20 h-20 rounded-full bg-amber-300 opacity-15"></div>
                    <h1 className="text-2xl font-bold text-amber-800 relative z-10">验证身份</h1>
                    <p className="text-amber-600 mt-1 relative z-10">打印功能</p>
                </div>

                <div className="p-6 relative">
                    {/* 装饰元素 */}
                    <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-amber-100 opacity-10 -mt-8 -mr-8"></div>
                    <div className="absolute bottom-0 left-0 w-12 h-12 rounded-full bg-amber-200 opacity-10 -mb-6 -ml-6"></div>

                    <div className="text-center">
                        <p className="text-amber-700 mb-4">请扫描二维码获取验证码</p>

                        <div className="flex justify-center mb-6">
                            <div className="border-2 border-amber-200 rounded-lg p-2 bg-white/80 hover:border-amber-300 transition-all">
                                <Image
                                    src={qrcode}
                                    alt="QR Code"
                                    width={180}
                                    height={180}
                                    className="rounded hover:scale-105 transition-transform"
                                    priority
                                />
                            </div>
                        </div>

                        <div className="mb-4 relative">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 border ${isValid === false ? 'border-red-300' : 'border-amber-300'} rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition bg-white/80 shadow-sm`}
                                placeholder="请输入验证码"
                            />
                            {isValid === false && (
                                <p className="text-red-400 mt-2 text-sm animate-fade-in">验证码无效，请重新输入</p>
                            )}
                        </div>

                        <Button
                            onClick={handleVerify}
                            loading={isLoading}
                            className={`w-full ${isLoading ? 'bg-amber-500' : 'bg-amber-600 hover:bg-amber-700'} text-white py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg`}
                            size="large"
                        >
                            {isLoading ? '验证中...' : '验证'}
                        </Button>
                    </div>
                </div>

                <div className="bg-amber-50/50 p-4 text-center border-t border-amber-100">
                    <p className="text-xs text-amber-500">仅限授权用户使用打印功能</p>
                </div>
            </div>
        </div>
    );
}