import { IconRobot } from '@tabler/icons-react';
import { FC } from 'react';

interface Props {}

export const ChatLoader: FC<Props> = () => {
  return (
    <div
      className={`group justify-center items-center flex flex-row md:px-4  my-8 rounded-xl  mx-5`}
      style={{ overflowWrap: 'anywhere' }}
    >
      <div className="min-w-[40px] text-right font-bold text-gray-600 sm:hidden">
        <img src="/kikulg2.ico" className="w-8 h-8" />
      </div>
      <div
        className={`relative w-full rounded-xl m-auto flex p-4 text-base md:max-w-2xl md:gap-6 md:py-6 text-gray-800 bg-white shadow`}
      >
        <span className="animate-pulse cursor-default mt-1">▍</span>
      </div>
    </div>
  );
};
