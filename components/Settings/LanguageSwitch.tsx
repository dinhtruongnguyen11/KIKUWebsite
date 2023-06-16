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
  },[]);

  return (
    <div>
      <Card className="w-24 ">
        <List className="flex-row  py-2 px-1.5">
          <ListItem className="p-0">
            <label
              htmlFor="horizontal-list-vue"
              className="flex items-center w-full cursor-pointer mx-1"
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
                className="w-8  h-5"
              />
            </label>
          </ListItem>
          <ListItem className="p-0">
            <label
              htmlFor="horizontal-list-react"
              className="flex items-center w-full cursor-pointer  mx-1"
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
                className="w-8 h-5"
              />
            </label>
          </ListItem>
        </List>
      </Card>
    </div>
  );
}
