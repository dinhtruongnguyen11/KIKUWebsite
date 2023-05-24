import { FC } from 'react';

interface Props {
  text: string;
  icon: JSX.Element;
  onClick: () => void;
}

export const SidebarButton: FC<Props> = ({ text, icon, onClick }) => {
  return (
    <button
      className="flex w-full  cursor-pointer select-none items-center gap-3 rounded-md py-2 px-3 text-[13px] leading-3 text-white transition-colors duration-200 hover:bg-gray-500/10"
      onClick={onClick}
    >
      <div>{icon}</div>
      <span className="text-left overflow-hidden whitespace-nowrap text-overflow-ellipsis">
        {text}
      </span>
    </button>
  );
};
