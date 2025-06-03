"use client"
import { useRouter,useSearchParams} from 'next/navigation';
import Head from 'next/head';

export default function Result({params}:{params:any}) {
  const router = useRouter();
  const {slug:[score,total] } = params;

  const numericScore = typeof score === 'string' ? parseInt(score) : 0;
  const numericTotal = typeof total === 'string' ? parseInt(total) : 1;
  const percentage = Math.round((numericScore / numericTotal) * 100);

  // const restartPractice = () => {
  //   router.push('/practice');
  // };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <Head>
        <title>答题结果 - 招标代理培训题库</title>
      </Head>

      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">答题结果</h1>

        <div className="flex flex-col items-center mb-8">
          <div className="relative w-40 h-40 mb-4">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                className="text-gray-200"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
              />
              <circle
                className="text-blue-600"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
                strokeDasharray={`${percentage * 2.51} 251`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <span className="text-3xl font-bold">{percentage}%</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-lg mb-2">
              正确: <span className="font-bold text-green-600">{numericScore}</span> 题
            </p>
            <p className="text-lg">
              错误: <span className="font-bold text-red-600">{numericTotal - numericScore}</span> 题
            </p>
          </div>
        </div>

        {/*<div className="flex justify-center">*/}
        {/*  <button*/}
        {/*    onClick={restartPractice}*/}
        {/*    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"*/}
        {/*  >*/}
        {/*    重新练习*/}
        {/*  </button>*/}
        {/*</div>*/}
      </div>
    </div>
  );
}
