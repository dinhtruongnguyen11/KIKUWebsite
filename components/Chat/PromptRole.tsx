import { Option as Coption, Select as Cselect } from '@material-tailwind/react';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Prompt } from '@/types/prompt';

import fetchGoogleSheetData from '@/pages/api/fetchGoogleSheetData';
import HomeContext from '@/pages/api/home/home.context';

export const PromptRole = () => {
  const { t } = useTranslation('chat');
  const [selectedRole, setSelectedRole] = useState<any>('');
  const [options, setOptions] = useState<Prompt[]>([]);
  const {
    state: { selectedConversation, language, showChatbar, showPromptbar },

    dispatch: homeDispatch,
  } = useContext(HomeContext);

  function renderOptionsByType() {
    return options
      .filter((item) => item.status === 'A')
      .map((item) => (
        <Coption
          key={item.id}
          className="bg-white text-black/50"
          value={item.content}
        >
          {language === 'en' ? item.name : item.name_es}
        </Coption>
      ));
  }

  function handleSelectRoleChange(value: any) {
    if (selectedConversation) selectedConversation.prompt = value;
    setSelectedRole(value);
  }

  useEffect(() => {
    fetchGoogleSheetData().then((data) => {
      setOptions(data);

      const tmp = data.filter((item: Prompt) => item.status === 'A');
      if (tmp.length > 0) {
        setSelectedRole(tmp[0].content);
        if (selectedConversation) selectedConversation.prompt = tmp[0].content;
      }
    });
  }, []);

  return (
    <div className="stretch flex flex-col sm:flex-row items-center mt-4 justify-center">
      <span
        className={`sm:mr-4 sm:text-xl  font-bold ${
          language === 'en' ? 'text-2xl' : 'text-lg'
        }`}
      >
        {t('Let Kiku work for you as a')}
      </span>
      <div
        className={`${
          showChatbar || showPromptbar ? 'z-0 sm:z-20' : 'z-20'
        } relative w-72 mt-4 sm:mt-0 `}
      >
        {options.length > 0 && selectedRole ? (
          <Cselect
            className="text-base -mt-1 h-12 sm:h-10 sm:-mt-0 border-none outline-none text-white bg-[#FF4500]"
            value={selectedRole}
            onChange={handleSelectRoleChange}
            lockScroll={true}
          >
            {renderOptionsByType()}
          </Cselect>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};
