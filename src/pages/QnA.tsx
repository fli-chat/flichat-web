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
    question: "이 앱은 어떤 기능을 제공하나요?",
    answer: "이 앱은 최근 인기 있는 영화나 콘텐츠를 주제로, 사용자들이 자유롭게 의견을 나눌 수 있는 오픈채팅 플랫폼입니다. 실시간 채팅을 통해 다양한 사람들과 영화 감상을 공유하고 토론할 수 있어요.",
    category: "기능",
    isOpen: false,
  },
  {
    id: 2,
    question: "욕설이나 불쾌한 메시지를 보는 경우 어떻게 하나요?",
    answer: "앱에는 욕설 및 부적절한 표현을 자동 감지해 가려주는 필터링 기능이 적용되어 있어, 쾌적한 대화 환경을 유지할 수 있습니다. 또한, 불쾌감을 주는 사용자는 차단하거나 신고할 수 있으며, 신고된 사용자는 운영팀의 검토를 거쳐 경고, 이용 제한, 영구 제재 등의 조치를 받을 수 있습니다.",
    category: "안전",
    isOpen: false,
  },
  {
    id: 3,
    question: "계정을 탈퇴하려면 어떻게 하나요?",
    answer: "설정 > 내 계정 > 계정 탈퇴 메뉴를 통해 언제든지 탈퇴하실 수 있습니다. 탈퇴 시, 사용자의 모든 정보는 관련 법령에 따라 안전하게 처리됩니다.",
    category: "계정",
    isOpen: false,
  },
  {
    id: 4,
    question: "고객 지원은 어디에서 받을 수 있나요?",
    answer: "앱 사용 중 문제가 발생하거나 문의사항이 있으실 경우, teamtuesa@gmail.com 으로 문의해 주세요. 운영팀이 최대한 빠르게 응답 드릴 수 있도록 노력하겠습니다.",
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
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
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
    <div className="w-full min-h-screen">
      {/* 헤더 섹션 */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            자주 묻는 질문
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Flichat 사용 중 궁금한 점들을 확인해보세요.
          </p>
        </div>
      </div>

      {/* 컨텐츠 섹션 */}
      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* 검색 */}
        <div className="mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="질문을 검색해보세요..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 pl-14 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-lg"
            />
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* 질문 목록 */}
        <div className="space-y-6">
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-300 text-8xl mb-6">🔍</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-3">검색 결과가 없습니다</h3>
              <p className="text-gray-500 text-lg">다른 키워드로 검색해보세요.</p>
            </div>
          ) : (
            filteredQuestions.map((question) => (
              <div
                key={question.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <button
                  onClick={() => toggleQuestion(question.id)}
                  className="w-full px-8 py-6 text-left focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700">
                          {question.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 leading-relaxed">
                        {question.question}
                      </h3>
                    </div>
                    <div className="ml-6 flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center transition-all duration-300 ${question.isOpen ? 'bg-blue-100 rotate-180' : 'hover:bg-gray-200'}`}>
                        <svg
                          className="h-5 w-5 text-gray-600 transition-transform duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </button>

                {question.isOpen && (
                  <div className="px-8 pb-6">
                    <div className="border-t border-gray-100 pt-6">
                      <p className="text-gray-700 leading-relaxed text-lg">
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
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 mb-2">더 도움이 필요하신가요?</h3>
              <p className="text-gray-600 mb-4">
                위의 질문들로 해결되지 않는 문제가 있으시다면 언제든지 고객센터로 문의해주세요.
              </p>
              <div className="flex space-x-4">
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
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
