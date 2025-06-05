"use client"
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Button, Spin, message, Checkbox, Space } from 'antd'
import { PrinterOutlined, SettingOutlined } from '@ant-design/icons'
import { fetchSingleData, fetchMultipleData, fetchJudgeData } from '@/utils/common'
import Link from "next/link";
import Image from "next/image";
import qrcode from "@/public/asset/imgs/qrcode.jpg";

type QuestionType = 'single' | 'multiple' | 'judge'

interface Question {
  序号: string
  题目板块: string
  难度系数: string
  题目内容: string
  题目答案: string | string[]
  选项: string[]
  题目解析: string
  文件根据: string
}

const QuestionListPage = (props:{params:Promise<{type:string}>}) => {
  const router = useRouter()
  const type = React.use(props?.params)?.type;
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [showAnswers, setShowAnswers] = useState(false)
  const [showExplanations, setShowExplanations] = useState(false)
  const [showPrintSettings, setShowPrintSettings] = useState(false)


  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true)
        let data: Question[] = []
        let titleText = ''

        switch (type) {
          case 'single':
            data = await fetchSingleData() as Question[]
            titleText = '单选题库'
            break
          case 'multiple':
            data = await fetchMultipleData() as Question[]
            titleText = '多选题库'
            break
          case 'judge':
            data = await fetchJudgeData() as Question[]
            titleText = '判断题库'
            break
          default:
            router.push('/404')
            return
        }

        setQuestions(data)
        setTitle(titleText)
      } catch (error) {
        message.error('加载题库失败')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    if (type) {
      loadQuestions()
    }
  }, [type, router])

  const handlePrint = () => {
    window.print()
  }

  const togglePrintSettings = () => {
    setShowPrintSettings(!showPrintSettings)
  }

  if (loading) {
    return (
        <div className="flex justify-center items-center h-screen">
          <Spin size="large" />
        </div>
    )
  }



  return (
      <div className="p-4 print:p-0">
        <div className="flex justify-between items-center mb-6 print:hidden">
          <h1 className="text-2xl font-bold">{title}</h1>
          <Space>
            <Button
                type="default"
                icon={<SettingOutlined />}
                onClick={togglePrintSettings}
            >
              打印设置
            </Button>
            <Button
                type="primary"
                icon={<PrinterOutlined />}
                onClick={handlePrint}
            >
              打印
            </Button>
          </Space>
        </div>

        {/* 打印设置面板 */}
        {showPrintSettings && (
            <div className="bg-gray-100 p-4 mb-6 rounded print:hidden">
              <h3 className="font-semibold mb-3">打印选项</h3>
              <Space direction="vertical">
                <Checkbox
                    checked={showAnswers}
                    onChange={(e) => setShowAnswers(e.target.checked)}
                >
                  显示答案
                </Checkbox>
                <Checkbox
                    checked={showExplanations}
                    onChange={(e) => setShowExplanations(e.target.checked)}
                >
                  显示解析
                </Checkbox>
              </Space>
            </div>
        )}

        <div className="bg-white p-8 print:p-0">
          {/* 试卷标题 - 打印时显示 */}
          <div className="hidden print:block text-center mb-8">
            <h1 className="text-3xl font-bold">{title}</h1>
            <div className="text-right mt-4 text-sm">
              姓名：________________ 得分：________________
            </div>
          </div>

          <div className="space-y-8">
            {questions.map((q, index) => {
              console.log(q,showAnswers )
              return (
                <div key={index} className="mb-2 break-inside-avoid">
                  <div className="flex ">
                    <span className="font-bold mr-2">{index + 1}.</span>
                    <div>
                      <p className="font-medium">{q.题目内容}</p>
                      <div className="mt-2 ml-4 space-y-2 flex gap-4  flex-row flex-wrap">
                        {q.选项.map((opt, i) => {
                          console.log(opt,q.题目答案,showAnswers && (Array.isArray(q.题目答案) ? q.题目答案.includes(opt) : q.题目答案 == opt))
                          return (
                            <div key={i} className="flex items-start text-left">
                              <span className="mr-2">{String.fromCharCode(65 + i)}.</span>
                              <span className={(showAnswers && (Array.isArray(q.题目答案) ? q.题目答案.includes(String.fromCharCode(65 + i)) : q.题目答案 == String.fromCharCode(65 + i))) ?'font-bold font-black text-blue-500':""}>{opt}</span>
                            </div>
                        )})}
                      </div>
                    </div>
                  </div>

                  {/* 答案和解析 - 根据设置显示 */}
                  {(showAnswers || showExplanations) && (
                      <div className={`mt-2 text-sm ${showAnswers ? 'font-semibold' : ''}`}>
                        {/*{showAnswers && (*/}
                        {/*    <p className="text-gray-800">*/}
                        {/*      答案：{Array.isArray(q.题目答案) ? q.题目答案.join('、') : q.题目答案}*/}
                        {/*    </p>*/}
                        {/*)}*/}
                        {showExplanations && q.题目解析 && (
                            <p className="mt-1 text-gray-600">解析：{q.题目解析}</p>
                        )}
                        {showExplanations && q.文件根据 && (
                            <p className="mt-1 text-gray-600">依据：{q.文件根据}</p>
                        )}
                      </div>
                  )}
                </div>
            )})}
          </div>
        </div>

        {/* 打印样式 */}
        <style jsx global>{`
        @media print {
          body {
            background: white;
            font-size: 12pt;
          }
          .no-print {
            display: none;
          }
          .page-break {
            page-break-after: always;
          }
          .break-inside-avoid {
            break-inside: avoid;
          }
          .question-container {
            margin-bottom: 16pt;
          }
        }
      `}</style>
      </div>
  )


}

export default QuestionListPage