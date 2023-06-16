import {
  IconArrowsDiagonalMinimize2,
  IconLayoutBottombarExpand,
  IconLogout,
  IconMenu,
  IconPhoto,
  IconSettings,
} from '@tabler/icons-react';
import { IconAlignBoxLeftTop } from '@tabler/icons-react';
import { signIn, signOut, useSession } from 'next-auth/react';
import React, { useContext, useEffect, useState } from 'react';

import Image from 'next/image';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import { getSettings, saveSettings } from '@/utils/app/settings';

import { Settings } from '@/types/settings';

import HomeContext from '@/pages/api/home/home.context';

const UserTagSidebar = () => {
  const { data: session } = useSession();
  const [showInfo, setShowInfo] = useState(true);
  const {
    state: { isPaid, wordCount, imageCount },
    dispatch: homeDispatch,
  } = useContext(HomeContext);

  const settings: Settings = getSettings();
  const { state, dispatch } = useCreateReducer<Settings>({
    initialState: settings,
  });

  const handleShow = () => {
    setShowInfo(!showInfo);
    state.showInfo = !showInfo;
    saveSettings(state);
  };

  useEffect(() => {
    const settings = getSettings();
    setShowInfo(settings.showInfo);
  }, []);

  return (
    <>
      {session && session.user && (
        <>
          <button
            className="text-gray-700 bg-[#EBF2FC] absolute flex right-5 top-4  
            rounded-xl py-1 px-3 hover:shadow-lg items-center "
            onClick={handleShow}
          >
            {!showInfo ? (
              <Image
                className="rounded-full"
                src={session.user.image || '/images/userIcon.png'}
                height={30}
                width={30}
                alt=""
                unoptimized
              />
            ) : (
              <IconMenu height={30} width={30} />
            )}
          </button>

          {showInfo && (
            <div className="flex flex-col pt-5">
              <div className="flex justify-center gap-3 items-center">
                <button className="rounded-full hover:shadow-md p-3">
                  <IconSettings size={30} />
                </button>
                <img
                  className="rounded-full h-20 w-20 border p-1 border-white/20"
                  src={session.user.image || '/images/userIcon.png'}
                />
                <button
                  className="rounded-full hover:shadow-md p-3"
                  onClick={() => signOut()}
                >
                  <IconLogout size={30} />
                </button>
              </div>
              <span className="text-lg text-white text-center mt-5">
                {session?.user?.name}
              </span>
              <div className="flex flex-col mt-5 mb-2 border rounded-xl border-white/20 px-3 py-1">
                <div className="flex items-center gap-2">
                  <IconAlignBoxLeftTop />
                  <div className="flex w-full justify-between">
                    <span>Word limit:</span>
                    <span>{isPaid ? 'Unlimited' : wordCount + '/2000'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <IconPhoto />
                  <div className="flex w-full justify-between">
                    <span>Image limit:</span>
                    <span>{isPaid ? 'Unlimited' : imageCount + '/5'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default UserTagSidebar;
