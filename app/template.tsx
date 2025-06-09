"use client"
import React,{useEffect, useState} from "react";
import Image from "next/image";
import qrcode from "@/public/asset/imgs/qrcode.jpg";
import {Button} from "antd";

export default function DashboardTemplate({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  const [token, setToken] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  // console.log('sldfkjslkdfjlk')
  useEffect(() => {
    // 检查是否有 token
    const storedToken = JSON.parse(localStorage.getItem("token"));
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
  if(token){
    return (
        <div> {/* 每次导航触发动画 */}
          {children}
        </div>
    )
  }

    return (
        <div style={{
          backgroundImage:`url(https://wx2.sinaimg.cn/mw690/005K3dRrly1hrc2hiygwtj31ko2t4kjm.jpg)`
        }} className="min-h-screen  bg-amber-50 flex items-center justify-center p-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden w-full max-w-md border border-amber-200">
            <div className="bg-amber-100 p-6 text-center">
              <h1 className="text-2xl font-bold text-amber-800">验证身份</h1>
            </div>
            <div className="p-6 relative">
              {/* 装饰性小气泡 */}
              <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-amber-200 opacity-30"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-amber-300 opacity-20"></div>

              <div className="text-center mb-6">
                <p className="text-amber-700 mb-4">请扫描二维码获取验证码</p>
                <div className="flex justify-center mb-6">
                  <div className="border-2 border-amber-200 rounded-lg p-2 bg-white/80">
                    <Image
                        src={qrcode}
                        alt="QR Code"
                        width={180}
                        height={180}
                        className="rounded"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <input
                      type="text"
                      value={inputValue}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition bg-white/80"
                      placeholder="请输入验证码"
                  />
                  {isValid === false && (
                      <p className="text-red-400 mt-2 text-sm">验证码无效，请重新输入</p>
                  )}
                </div>
                <Button
                    onClick={handleVerify}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-lg transition"
                    size="large"
                >
                  验证
                </Button>
              </div>
            </div>
          </div>
        </div>
    )
}
