"use client";
import Link from "next/link";
import { Button } from "antd";

export default function Home() {
        return (
            <div  style={{
                backgroundImage:`url(https://wx2.sinaimg.cn/mw690/005K3dRrly1hrc2hiygwtj31ko2t4kjm.jpg)`
            }} className="min-h-screen bg-amber-50 bg-no-repeat bg-center">
                {/* 气泡背景装饰 */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-amber-100 opacity-20 blur-xl animate-float"></div>
                    <div className="absolute top-1/3 right-20 w-32 h-32 rounded-full bg-amber-200 opacity-15 blur-xl animate-float-delay"></div>
                    <div className="absolute bottom-20 left-1/4 w-24 h-24 rounded-full bg-amber-300 opacity-10 blur-xl animate-float"></div>
                </div>

                <div className="container mx-auto px-4 py-12 relative z-10">
                    <header className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-amber-800 mb-4">招标代理从业人员培训题库</h1>
                        <p className="text-lg text-amber-700 max-w-2xl mx-auto">
                            专业题库助力职业成长
                        </p>
                    </header>

                    {/* 第一行 - 两个方块 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* 方块1 - 竹节纹理 */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm overflow-hidden border border-amber-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                            <div className="h-48 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJiYW1ib28iIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTIwIDBMMjAgNDBNMCAyMEw0MCAyMCIgc3Ryb2tlPSIjZmJhYzgyIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYmFtYm9vKSIgb3BhY2l0eT0iMC4xIi8+PC9zdmc+')]">
                                <div className="h-full flex items-center justify-center p-6 backdrop-blur-[1px]">
                                    <div className="text-center">
                                        <h2 className="text-xl font-semibold text-amber-800 mb-2">单选题练习</h2>
                                        <p className="text-amber-700 mb-4">基础题型巩固知识</p>
                                        <Link href="/single_choice/-1/-1/single" passHref>
                                            <Button type="primary" className="bg-amber-600 hover:bg-amber-700 border-amber-600 transition-colors">
                                                开始练习
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 方块2 - 水波纹纹理 */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm overflow-hidden border border-amber-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                            <div className="h-48 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJ3YXZlIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0wIDIwIHEyMCAtMTAgNDAgMCB0NDAgMCB0NDAgMCB0NDAgMCB0NDAgMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmJhYzgyIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjd2F2ZSkiIG9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')]">
                                <div className="h-full flex items-center justify-center p-6">
                                    <div className="text-center">
                                        <h2 className="text-xl font-semibold text-amber-800 mb-2">判断题练习</h2>
                                        <p className="text-amber-700 mb-4">检验判断能力</p>
                                        <Link href="/single_choice/-1/-1/judge" passHref>
                                            <Button type="primary" className="bg-amber-600 hover:bg-amber-700 border-amber-600 transition-colors">
                                                开始练习
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 第二行 - 长方形块 */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm overflow-hidden border border-amber-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1 mb-8">
                        <div className="md:flex">
                            {/* 左侧 - 竹叶纹理 */}
                            <div className="w-full bg-center bg-contain h-50 "
                                 style={{
                                     backgroundImage: `url('https://wx2.sinaimg.cn/mw690/007lc0bkgy1hvys8gz6ihj30u01syqc1.jpg')`
                                 }}
                                    />
                            <svg className="w-16 h-16   text-amber-400 opacity-30 absolute top-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M12 2L3 12L12 22L21 12L12 2Z" strokeWidth="1"/>
                            </svg>
                            <svg className="w-16 h-16 left-20 text-amber-400 opacity-30 absolute top-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M12 2L3 12L12 22L21 12L12 2Z" strokeWidth="1"/>
                            </svg>
                            <svg className="w-16 h-16 left-40 text-amber-400 opacity-30 absolute top-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M12 2L3 12L12 22L21 12L12 2Z" strokeWidth="1"/>
                            </svg>
                            <svg className="w-16 h-16 left-60 text-amber-400 opacity-30 absolute top-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M12 2L3 12L12 22L21 12L12 2Z" strokeWidth="1"/>
                            </svg>
                            {/* 右侧内容 */}
                            <div className="p-6 md:w-2/3">
                                <h2 className="text-xl font-semibold text-amber-800 mb-2">多选题练习</h2>
                                <p className="text-amber-700 mb-4">综合能力提升训练</p>
                                <div className="flex space-x-4">
                                    <Link href="/multiple_choice/-1/-1" passHref>
                                        <Button type="primary" className="bg-amber-600 hover:bg-amber-700 border-amber-600 transition-colors">
                                            开始练习
                                        </Button>
                                    </Link>
                                    {/*<Button className="border-amber-600 text-amber-600 hover:bg-amber-50 transition-colors">*/}
                                    {/*    查看说明*/}
                                    {/*</Button>*/}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );

}
