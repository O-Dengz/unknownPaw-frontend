// src/pages/Faq.tsx

import { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

const faqData: FaqItem[] = [
  {
    question: "Q. 회원가입은 어떻게 하나요?",
    answer: "A. 메인 페이지 우측 상단의 회원가입 버튼을 클릭하여 절차에 따라 가입하실 수 있습니다.",
  },
  {
    question: "Q. 회원탈퇴는 어떻게 하나요?",
    answer: "A. 마이페이지의 회원탈퇴 메뉴를 통해 탈퇴하실 수 있습니다.",
  },
  {
    question: "Q. 게시글은 하루에 몇 개까지 작성할 수 있나요?",
    answer: "A. 하루에 최대 5개까지 작성 가능합니다.",
  },
  {
    question: "Q. 채팅은 어떻게 하나요?",
    answer: "A. 게시글 상세 페이지에서 '채팅하기' 버튼을 눌러 대화를 시작할 수 있습니다.",
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">자주 묻는 질문</h1>
      <div className="space-y-4">
        {faqData.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-xl overflow-hidden shadow-sm"
          >
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 transition-all font-medium"
            >
              {faq.question}
            </button>
            {openIndex === index && (
              <div className="px-4 py-3 bg-white border-t border-gray-200 text-gray-700">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;
