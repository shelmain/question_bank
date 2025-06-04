"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "antd";
import qrcode from '../public/asset/imgs/qrcode.jpg'

export default function Home() {
        return
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-sky-500 to-emerald-500 text-white">
                <div className="bg-opacity-80  p-8 rounded-lg shadow-lg max-w-md w-full">
                    <h1 className="text-4xl font-bold text-center mb-6">招标代理从业人员培训题库</h1>
                    <p className="text-lg text-center mb-8">
                        欢迎来到招标代理从业人员培训题库！这里提供了丰富的单选题和多选题，帮助你提升专业知识和技能。祝你学习愉快！
                    </p>
                    <div className="flex justify-center space-x-4 gap-2 flex-row flex-wrap">
                        <Link href="/single_choice/-1/-1" passHref>
                            <Button type="primary" size="large" className="bg-blue-500 hover:bg-blue-700 text-white">
                                单选题
                            </Button>
                        </Link>
                        <Link href="/multiple_choice/-1/-1" passHref>
                            <Button type="primary" size="large" className="bg-green-500 hover:bg-green-700 text-white">
                                多选题
                            </Button>
                        </Link>
                        {/*<Link href="/orderList/multiple" passHref>*/}
                        {/*    <Button type="primary" size="large" className="bg-green-500 hover:bg-green-700 text-white">*/}
                        {/*        多选题刷题记录*/}
                        {/*    </Button>*/}
                        {/*</Link>*/}

                    </div>
                </div>
            </div>




}
