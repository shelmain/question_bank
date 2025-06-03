import Image from "next/image";
import { Button } from "antd";
import Link from "next/link";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-sky-500 to-emerald-500 text-white">
            {/* 顶部装饰 */}
            <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-sky-500 to-sky-700" />
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white opacity-10" />
            <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-white opacity-10" />

            {/* 主内容区 */}
            <div className="bg-opacity-80 bg-black p-8 rounded-lg shadow-lg max-w-md w-full">
                <h1 className="text-4xl font-bold text-center mb-6">招标代理从业人员培训题库</h1>
                <p className="text-lg text-center mb-8">
                    欢迎来到招标代理从业人员培训题库！这里提供了丰富的单选题和多选题，帮助你提升专业知识和技能。祝你学习愉快！
                </p>
                <div className="flex justify-center space-x-4">
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
                </div>
            </div>

            {/* 底部装饰 */}
            <div className="absolute bottom-0 right-0 w-full h-20 bg-gradient-to-l from-emerald-500 to-emerald-700" />
            <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-white opacity-10" />
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white opacity-10" />
        </div>
    );
}