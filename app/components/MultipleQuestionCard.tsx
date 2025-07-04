import { useState } from 'react';

export interface Question {
    序号: string;
    题目板块: string;
    难度系数: string;
    题目内容: string;
    题目答案: string[];
    选项: string[];
    题目解析: string;
    文件根据: string;
}

interface QuestionCardProps {
    question: Question;
    selectedOptions: string[];
    isCorrect: boolean | null;
    onSelect: (option: string) => void;
    showExplanation: boolean;
}

export default function MultipleQuestionCard({ question, selectedOptions, isCorrect, onSelect, showExplanation }: QuestionCardProps) {
    const handleOptionSelect = (option: string) => {
        onSelect(option);
    };

    return (
        <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="md:text-l sm:text-[12px] font-semibold text-gray-800 mb-6">{question.题目内容}</h2>

            <div className="space-y-3 text-[#000]">
                {question.选项.map((option, index) => {
                    const optionLetter = String.fromCharCode(65 + index);
                    const isSelected = selectedOptions.includes(optionLetter);//当前是否被选中,isCorrect全部答案是否正确
                    let optionClass = "p-3 border rounded-lg cursor-pointer";
                    console.log(option, isSelected,isCorrect);
                    if (isCorrect !== null) {// 已经点击了提交
                        if (isSelected) {// 被选中
                            optionClass += question.题目答案.includes(optionLetter)? " bg-green-100 border-green-500": " bg-red-100 border-red-500";
                        } else if (question.题目答案.includes(optionLetter)) {
                            optionClass += " bg-red-100 border-red-500";
                        }
                    }
                    else if (isSelected) {
                        optionClass += " bg-orange-100 border-orange-500";
                    }
                    else {
                        optionClass += " hover:bg-blue-50 hover:text-blue";
                    }

                    return (
                        <div
                            key={index}
                            className={optionClass}
                            onClick={() => handleOptionSelect(optionLetter)}
                        >
                            <div className="flex items-center">
                                <span className="font-medium mr-3">{optionLetter}.</span>
                                <span>{option}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {isCorrect !== null && (
                <div className="mt-4 text-sm">
                    {isCorrect ? (
                        <span className="text-green-600">✓ 回答正确</span>
                    ) : (
                        <span className="text-red-600">✗ 回答错误，你的答案{selectedOptions.join(",")},正确答案是
                            <span className="text-green-600"> {question.题目答案.join(', ')}
                            </span></span>
                    )}
                </div>
            )}

            {showExplanation && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="font-bold text-gray-700 mb-2">解析：</h3>
                    <p className="text-gray-700">{question.题目解析}</p>
                    <p className="mt-2 text-sm text-gray-500">
                        依据：{question.文件根据}
                    </p>
                </div>
            )}
        </div>
    );
}