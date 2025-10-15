'use client';

import { ProfileColorType, UserApi } from "@/apis/user.api";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";


export default function ChatRegister() {
  const router = useRouter();

  const [nickName, setNickName] = useState("");
  const [selectedProfileColor, setSelectedProfileColor] = useState<ProfileColorType>();

  const { mutateAsync: patchUserProfileMutation } = useMutation({
    mutationFn: (payload: { profileColorType: ProfileColorType, nickName: string }) => UserApi.patchUserProfile(payload.profileColorType, payload.nickName),
    onSuccess: () => {
      toast.success("프로필 등록이 완료되었습니다.");
      router.back();
      // window.location.reload();
    },
  })

  const onClickRegister = () => {
    patchUserProfileMutation({ profileColorType: selectedProfileColor as ProfileColorType, nickName });
  }

  const convertProfileColorType = (profileColorType: ProfileColorType) => {
    switch (profileColorType) {
      case ProfileColorType.PURPLE:
        return "/icons/profile_dafault_purple.svg";
      case ProfileColorType.RED:
        return "/icons/profile_dafault_coral.svg";
      case ProfileColorType.GREEN:
        return "/icons/profile_dafault_mint.svg";
      case ProfileColorType.BLUE:
        return "/icons/profile_dafault_skyblue.svg";
      case ProfileColorType.YELLOW:
        return "/icons/profile_dafault_yellow.svg";
    }
  }


  useEffect(() => {
    const getRandomProfileColor = (): ProfileColorType => {
      const colors = Object.values(ProfileColorType);
      const randomIndex = Math.floor(Math.random() * colors.length);
      return colors[randomIndex];
    };

    const profileColor = getRandomProfileColor();
    setSelectedProfileColor(profileColor);
  }, []);

  return (
    <div className="flex flex-col justify-between h-screen">
      <div>
        <div className="p-[21px] px-[30px]">
          <h1 className="title4 font-bold text-font-point">프로필 등록</h1>
        </div>

        <div className="flex flex-col items-center justify-center mt-[140px] px-[80px] w-full ">
          <Image src={convertProfileColorType(selectedProfileColor as ProfileColorType)} alt="profile" className="w-[80px] h-[80px]" width={80} height={80} />
          <div className="w-full mt-[44px]">
            <div className="flex items-center justify-between relative">
              <input className="w-full bg-[#191A1B] rounded-[6px] px-[16px] py-[12px] text-font-point focus:outline-none body1 font-medium" value={nickName} onChange={(e) => setNickName(e.target.value)} />
              <Image src="/icons/remove.svg" alt="remove" className="w-[24px] h-[24px] absolute right-4 cursor-pointer" width={24} height={24} onClick={() => setNickName("")} />
            </div>
            <p className="body2 font-medium text-semantic-disabled1 mt-[10px]">닉네임은 최대 15자까지 입력이 가능해요</p>
          </div>
        </div>
      </div>

      <div className="px-[28px] py-[20px]">
        <button className="w-full bg-semantic-accent rounded-[4px] h-[48px] text-font-dark body1 font-medium" onClick={onClickRegister}>프로필 등록</button>
      </div>
    </div>
  )
}