import {
  IconArrowBarLeft,
  IconArrowBarRight,
  IconMessage,
  IconMessages,
  IconStarFilled,
} from '@tabler/icons-react';
import { useContext } from 'react';

import HomeContext from '@/pages/api/home/home.context';

interface Props {
  onClick: any;
  side: 'left' | 'right';
}

export const CloseSidebarButton = ({ onClick, side }: Props) => {
  return (
    <>
      <button
        className={`fixed bg-[#2AAAE3] p-2 top-[80px] ${
          side === 'right'
            ? 'right-[260px] rounded-l-lg'
            : 'left-[260px] rounded-r-lg'
        } z-50  text-white  `}
        onClick={onClick}
      >
        {side === 'right' ? <IconStarFilled /> : <IconMessages />}
      </button>
      <div
        onClick={onClick}
        className="absolute top-0 left-0 z-10 h-full w-full bg-black opacity-70 sm:hidden"
      ></div>
    </>
  );
};

export const OpenSidebarButton = ({ onClick, side }: Props) => {
  const {
    state: { showChatbar, showPromptbar },
  } = useContext(HomeContext);
  return (
    <button
      className={`fixed bg-[#2AAAE3] p-2  top-[80px]  ${
        side === 'right'
          ? 'right-0 rounded-l-xl lg:hidden border-l'
          : 'left-0 rounded-r-xl border-r'
      } z-20 text-white  ${showChatbar || showPromptbar ? 'hidden' : ''}`}
      onClick={onClick}
    >
      {side === 'right' ? <IconStarFilled /> : <IconMessages />}
    </button>
  );
};
