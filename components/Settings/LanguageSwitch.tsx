import {
  Card,
  List,
  ListItem,
  ListItemPrefix,
  Radio,
  Typography,
} from '@material-tailwind/react';
import { FC, useContext, useEffect, useReducer, useRef, useState } from 'react';

import { useTranslation } from 'next-i18next';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import { getSettings, saveSettings } from '@/utils/app/settings';

import { Settings } from '@/types/settings';

import HomeContext from '@/pages/api/home/home.context';

export default function LanguageSwitch() {
  const { t, i18n } = useTranslation('settings');
  const [selectedOption, setSelectedOption] = useState('es');
  const {
    state: { showChatbar, showPromptbar },
    dispatch: homeDispatch,
  } = useContext(HomeContext);

  const settings: Settings = getSettings();
  const { state, dispatch } = useCreateReducer<Settings>({
    initialState: settings,
  });

  const handleOptionChange = (event: any) => {
    setSelectedOption(event.target.value);
    state.language = event.target.value;
    homeDispatch({
      field: 'language',
      value: event.target.value,
    });
    saveSettings(state);
    i18n.changeLanguage(event.target.value);
  };

  useEffect(() => {
    setSelectedOption(state.language);
    // console.log(state.language);
  });

  return (
    <div
      className={`${
        showChatbar ? '' : 'lg:block hidden'
      } absolute flex top-4 left-5 lg:left-[91vw]  z-40`}
    >
      <Card className="w-full max-w-[24rem]">
        <List className="flex-row">
          <ListItem className="p-0">
            <label
              htmlFor="horizontal-list-vue"
              className="px-2 py-0.5 flex items-center w-full cursor-pointer"
            >
              <ListItemPrefix className="hidden">
                <Radio
                  name="horizontal-list"
                  id="horizontal-list-vue"
                  ripple={false}
                  className="hover:before:opacity-0 "
                  containerProps={{
                    className: 'p-0',
                  }}
                  value="es"
                  checked={selectedOption === 'es'}
                  onChange={handleOptionChange}
                />
              </ListItemPrefix>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg"
                alt="Flag of Spain"
                className="w-10  h-6"
              />
            </label>
          </ListItem>
          <ListItem className="p-0">
            <label
              htmlFor="horizontal-list-react"
              className="px-2 flex items-center w-full cursor-pointer"
            >
              <ListItemPrefix className="hidden">
                <Radio
                  name="horizontal-list"
                  id="horizontal-list-react"
                  ripple={false}
                  className="hover:before:opacity-0 "
                  containerProps={{
                    className: 'p-0',
                  }}
                  value="en"
                  checked={selectedOption === 'en'}
                  onChange={handleOptionChange}
                />
              </ListItemPrefix>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg"
                alt="Flag of United Kingdom"
                className="w-10 h-6"
              />
            </label>
          </ListItem>
        </List>
      </Card>
    </div>
  );
}
