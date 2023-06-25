import { IconFolderPlus, IconMistOff, IconPlus } from '@tabler/icons-react';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import {
  CloseSidebarButton,
  OpenSidebarButton,
} from './components/OpenCloseButton';

import Search from '../Search';
import LanguageSwitch from '../Settings/LanguageSwitch';
import UserTagSidebar from '../User/UserTag';

interface Props<T> {
  isOpen: boolean;
  addItemButtonTitle: string;
  side: 'left' | 'right';
  items: T[];
  itemComponent: ReactNode;
  folderComponent: ReactNode;
  footerComponent?: ReactNode;
  searchTerm: string;
  handleSearchTerm: (searchTerm: string) => void;
  toggleOpen: () => void;
  handleCreateItem: () => void;
  handleCreateFolder: () => void;
  handleDrop: (e: any) => void;
}

const Sidebar = <T,>({
  isOpen,
  addItemButtonTitle,
  side,
  items,
  itemComponent,
  folderComponent,
  footerComponent,
  searchTerm,
  handleSearchTerm,
  toggleOpen,
  handleCreateItem,
  handleCreateFolder,
  handleDrop,
}: Props<T>) => {
  const { t } = useTranslation('promptbar');

  const allowDrop = (e: any) => {
    e.preventDefault();
  };

  const highlightDrop = (e: any) => {
    e.target.style.background = '#343541';
  };

  const removeHighlight = (e: any) => {
    e.target.style.background = 'none';
  };

  return isOpen ? (
    <div>
      <div
        className={`z-20 fixed top-0 pt-4 ${side}-0 
        flex h-full w-[260px] flex-none flex-col 
        space-y-2 bg-gradient-to-b from-[#2C75BA] to-[#22569F] 
        px-5 text-[12px] transition-all sm:relative sm:top-0`}
      >
        {side == 'left' && (
          <div className="border-b  border-white/20  pb-5">
            <LanguageSwitch />
            <UserTagSidebar />
          </div>
        )}

        <div className="flex items-center">
          <button
            className={`font-bold ${
              side == 'right'
                ? 'w-[168px] bg-white text-gray-800'
                : 'w-full bg-[#FF4500] text-white'
            } mb-0 text-sidebar flex  flex-shrink-0 cursor-pointer select-none items-center gap-1 rounded-xl  p-3  transition-colors duration-200`}
            onClick={() => {
              handleCreateItem();
              handleSearchTerm('');
            }}
          >
            <IconPlus size={16} />
            {addItemButtonTitle}
          </button>

          <button
            className={`${
              side == 'left' ? 'hidden' : ''
            } border bg-white w-auto ml-2 flex flex-shrink-0 cursor-pointer items-center gap-3 rounded-xl p-2 text-sm text-black transition-colors duration-200`}
            onClick={handleCreateFolder}
          >
            <IconFolderPlus size={25} />
          </button>
        </div>
        <Search
          placeholder={t('Search...') || ''}
          searchTerm={searchTerm}
          onSearch={handleSearchTerm}
        />

        <div className="flex-grow overflow-auto">
          {items?.length > 0 && (
            <div className="flex border-b border-white/20 pb-2">
              {folderComponent}
            </div>
          )}

          {items?.length > 0 ? (
            <div
              className="pt-2"
              onDrop={handleDrop}
              onDragOver={allowDrop}
              onDragEnter={highlightDrop}
              onDragLeave={removeHighlight}
            >
              {itemComponent}
            </div>
          ) : (
            <div className="mt-8 select-none text-center text-white opacity-50">
              <IconMistOff className="mx-auto mb-3" />
              <span className="text-[14px] leading-normal">
                {t('No data.')}
              </span>
            </div>
          )}
        </div>
        {footerComponent}
      </div>

      <CloseSidebarButton onClick={toggleOpen} side={side} />
    </div>
  ) : (
    <OpenSidebarButton onClick={toggleOpen} side={side} />
  );
};

export default Sidebar;
