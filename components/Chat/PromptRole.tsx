import { Option as Coption, Select as Cselect } from '@material-tailwind/react';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Prompt } from '@/types/prompt';

import fetchGoogleSheetData from '@/pages/api/fetchGoogleSheetData';
import HomeContext from '@/pages/api/home/home.context';

export const PromptRole = () => {
  const { t } = useTranslation('chat');
  const [selectedRole, setSelectedRole] = useState<any>('Virtual Assistant');
  const [options, setOptions] = useState<Prompt[]>([]);
  const {
    state: { selectedConversation, messageIsStreaming, prompts, roleList },

    dispatch: homeDispatch,
  } = useContext(HomeContext);

  function renderOptionsByType() {
    return options.map((item) => (
      <Coption
        key={item.id}
        className="bg-white text-black/50"
        value={item.name}
      >
        {item.name}
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
    });
  }, []);

  return (
    <div className="stretch flex items-center mt-8 justify-center ">
      <span className="mr-4 text-xl font-bold">Let Kiku work for you as a</span>
      <div className="relative flex flex-col w-40 z-50">
        {options.length > 0 ? (
          <Cselect
            className="text-sm border-none outline-none text-white bg-[#FF4500] "
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
