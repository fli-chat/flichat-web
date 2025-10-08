import { useEffect } from "react";
import edit from "../assets/icons/edit.svg";

import purple from "../assets/icons/profile_dafault_purple.svg";
import red from "../assets/icons/profile_dafault_coral.svg";
import blue from "../assets/icons/profile_dafault_skyblue.svg";
import green from "../assets/icons/profile_dafault_mint.svg";
import yellow from "../assets/icons/profile_dafault_yellow.svg";

import { useSidebar } from "../store/useSidebar";
import { AnimatePresence, motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthApi } from "../apis/auth.api";
import { useNavigate } from "react-router-dom";
import { deleteCookie } from "../utils/cookie";
import useAuthStore, { AuthStatus } from "../store/useAuth";
import { ProfileColorType, UserApi } from "../apis/user.api";



export default function UserSidebar() {
  const queryClient = useQueryClient();

  const { isOpen, setIsOpen } = useSidebar();
  const { setAuthStatus } = useAuthStore();

  const navigate = useNavigate();

  const { data: userInfoData } = useQuery({
    queryKey: ['userInfo'],
    queryFn: () => UserApi.getUser(),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60,
    retry: false,
  });

  const { mutateAsync: logoutMutation } = useMutation({
    mutationFn: AuthApi.postLogout,
    onSuccess: () => {
      localStorage.removeItem('accessToken');
      deleteCookie('refreshToken', { path: '/' });
      setIsOpen(false);
      setAuthStatus(AuthStatus.unauthorized);
      queryClient.clear();

      navigate('/chat/login');
    },
  });

  const onClickLogout = () => {
    logoutMutation();
  }

  const convertProfileColorType = (profileColorType: ProfileColorType) => {
    switch (profileColorType) {
      case ProfileColorType.PURPLE:
        return purple;
      case ProfileColorType.RED:
        return red;
      case ProfileColorType.GREEN:
        return green;
      case ProfileColorType.BLUE:
        return blue;
      case ProfileColorType.YELLOW:
        return yellow;
    }
  }
  // ESC 키로 사이드바 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // 사이드바가 열릴 때 body 스크롤 방지
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, setIsOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'linear' }}
            role="dialog" aria-modal="true"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.04}
            onDragEnd={(_, info) => { if (info.offset.x > 80) setIsOpen(false); }}
            className={`absolute top-0 right-0 h-full w-[750px] bg-[#1A1A1A] z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
              }`}>
            {/* 헤더 */}
            <div className="flex justify-between items-center p-[20px]">
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-300 transition-colors duration-200"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button className="flex items-center gap-[8px] text-white bg-semantic-secondary rounded-[4px] px-[16px] py-[8px]">
                <img src={edit} alt="edit" />
                <span className="body1 font-medium">프로필 수정</span>
              </button>
            </div>

            {/* 사용자 프로필 */}
            <div className="flex flex-col items-center px-[20px] py-[32px]">
              {/* 프로필 이미지 */}
              <div className="mb-[20px]">
                <img src={convertProfileColorType(userInfoData?.data.profileColorType as ProfileColorType | ProfileColorType.PURPLE)} alt="profile" className="w-[77px] h-[77px]" />
              </div>

              {/* 사용자 이름 */}
              <h2 className="title4 font-bold text-font-primary">{userInfoData?.data.nickName}</h2>
            </div>

            {/* 구분선 */}
            <div className="mt-[70px] h-[1px] bg-semantic-secondary mx-[20px]"></div>

            {/* 알림 설정 */}
            <div className="px-[40px] mt-[24px]">
              <div className="flex justify-between items-center">
                <span className="text-white font-medium">주요 푸시알림</span>
                <button className="relative inline-flex h-[24px] w-[44px] items-center rounded-full bg-semantic-secondary transition-colors duration-200">
                  <span className="sr-only">알림 설정</span>
                  <span className="inline-block h-[20px] w-[20px] transform rounded-full bg-system-mint2 transition-transform duration-200 translate-x-[22px]"></span>
                </button>
              </div>
            </div>


            {/* 로그아웃 버튼 */}
            <div className="absolute bottom-4 left-0 right-0 p-[20px]">
              <button className=" text-white underline text-center py-[12px] hover:text-gray-300 transition-colors duration-200" onClick={onClickLogout} >
                로그아웃
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence >
  );
}
