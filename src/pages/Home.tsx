import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="w-full min-h-screen">
      {/* 히어로 섹션 */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Flichat에 오신 것을<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                환영합니다!
              </span>
            </h1>
            <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed">
              최신 영화와 콘텐츠를 주제로 다양한 사람들과 실시간으로 소통하고 토론해보세요.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <button className="bg-white text-blue-600 font-semibold py-4 px-8 rounded-full hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg">
                채팅 시작하기
              </button>
              <Link 
                to="/qna" 
                className="bg-transparent border-2 border-white text-white font-semibold py-4 px-8 rounded-full hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                자주 묻는 질문
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 기능 소개 섹션 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Flichat의 주요 기능
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            영화와 콘텐츠를 사랑하는 사람들을 위한 특별한 채팅 플랫폼
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-white text-2xl">💬</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">실시간 채팅</h3>
            <p className="text-gray-600 leading-relaxed">빠르고 안전한 실시간 메시징으로 즉시 소통하세요</p>
          </div>
          
          <div className="group text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-white text-2xl">👥</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">그룹 토론</h3>
            <p className="text-gray-600 leading-relaxed">친구들과 함께 영화 감상을 공유하고 토론하세요</p>
          </div>
          
          <div className="group text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-white text-2xl">🔒</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">안전한 환경</h3>
            <p className="text-gray-600 leading-relaxed">필터링 시스템으로 쾌적하고 안전한 대화 환경을 제공합니다</p>
          </div>
        </div>
      </div>
    </div>
  );
}