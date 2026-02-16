'use client';

import { useState } from 'react';
import emailjs from '@emailjs/browser';

interface Question {
  id: number;
  question: string;
  answer: string;
  category: string;
  isOpen: boolean;
}

const sampleQuestions: Question[] = [
  {
    id: 1,
    question: "피로몽(Piromong)은 어떤 서비스인가요?",
    answer:
      "피로몽은 매일 4단계 피로도 체크를 통해 오늘의 컨디션을 분석하고, 결과 해석과 실천 가이드를 제공하는 서비스입니다.",
    category: "기능",
    isOpen: false,
  },
  {
    id: 2,
    question: "로그인 없이도 이용할 수 있나요?",
    answer:
      "아니요. 피로몽은 소셜 로그인 후 이용할 수 있으며, 첫 로그인 시 닉네임 설정을 완료하면 서비스를 사용할 수 있습니다.",
    category: "이용",
    isOpen: false,
  },
  {
    id: 3,
    question: "어떤 로그인 방식을 지원하나요?",
    answer:
      "카카오, 구글, 애플 로그인(iOS)을 지원합니다.",
    category: "계정",
    isOpen: false,
  },
  {
    id: 4,
    question: "피로도 결과에서는 무엇을 확인할 수 있나요?",
    answer:
      "오늘의 컨디션 요약, 신체/인지/정서/수면·회복 상태, 그리고 즉시 실천할 수 있는 행동 가이드를 확인할 수 있습니다.",
    category: "기능",
    isOpen: false,
  },
  {
    id: 5,
    question: "계정을 탈퇴하려면 어떻게 하나요?",
    answer:
      "앱에서 설정 > 탈퇴하기 경로로 요청할 수 있습니다. 처리 기간은 접수 후 최대 30일이며, 자세한 내용은 계정 및 데이터 삭제 안내에서 확인할 수 있습니다.",
    category: "계정",
    isOpen: false,
  },
  {
    id: 6,
    question: "고객 지원은 어디에서 받을 수 있나요?",
    answer:
      "설정의 의견 보내기 또는 문의 폼을 통해 문의할 수 있습니다.",
    category: "지원",
    isOpen: false,
  },
];

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function QnA() {
  const [questions, setQuestions] = useState<Question[]>(sampleQuestions);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleQuestion = (id: number) => {
    setQuestions(questions.map(q =>
      q.id === id ? { ...q, isOpen: !q.isOpen } : q
    ));
  };

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
      console.log(serviceId, templateId, publicKey);
      if (!serviceId || !templateId || !publicKey) {
        throw new Error('EmailJS 설정이 완료되지 않았습니다.');
      }

      emailjs.init(publicKey);

      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_email: 'teamtuesa@gmail.com'
      };

      // 이메일 발송
      await emailjs.send(serviceId, templateId, templateParams);

      // 폼 초기화
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });

      setIsModalOpen(false);

      // 성공 메시지
      alert('문의가 성공적으로 전송되었습니다. 빠른 시일 내에 답변드리겠습니다.');

    } catch (error) {
      console.error('이메일 발송 중 오류:', error);
      alert('이메일 발송 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="w-full p-6 py-10 sm:p-6">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">자주 묻는 질문</h1>
        <p className="text-gray-600">피로몽(Piromong) 사용 중 궁금한 점들을 확인해보세요.</p>
      </div>

      {/* 검색 */}
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="질문을 검색해보세요..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* 질문 목록 */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
            <p className="text-gray-500">다른 키워드로 검색해보세요.</p>
          </div>
        ) : (
          filteredQuestions.map((question) => (
            <div
              key={question.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => toggleQuestion(question.id)}
                className="w-full px-4 sm:px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {question.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {question.question}
                    </h3>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <svg
                      className={`h-5 w-5 text-gray-400 transition-transform ${question.isOpen ? 'rotate-180' : ''
                        }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </button>

              {question.isOpen && (
                <div className="px-4 sm:px-6 pb-4">
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-gray-700 leading-relaxed">
                      {question.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* 추가 도움말 */}
      <div className="mt-12 bg-blue-50 rounded-lg p-4 sm:p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-2">더 도움이 필요하신가요?</h3>
            <p className="text-gray-600 mb-4">
              위의 질문들로 해결되지 않는 문제가 있으시다면 언제든지 고객센터로 문의해주세요.
            </p>
            <div className="flex space-x-4 justify-center">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                고객센터 문의
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 문의 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">고객센터 문의</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    이름 *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="이름을 입력해주세요"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    이메일 *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="이메일을 입력해주세요"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    제목 *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="문의 제목을 입력해주세요"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    문의내용 *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="문의 내용을 자세히 입력해주세요"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? '발송 중...' : '문의하기'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
