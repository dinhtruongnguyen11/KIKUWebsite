import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import {
  IconArrowDown,
  IconBolt,
  IconBrandGoogle,
  IconHighlight,
  IconLoader2,
  IconMicrophone,
  IconPhotoEdit,
  IconPlayerRecord,
  IconPlayerStop,
  IconRepeat,
  IconSend,
} from '@tabler/icons-react';
import {
  KeyboardEvent,
  MutableRefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useTranslation } from 'next-i18next';

import { Conversation, Message } from '@/types/chat';
import { Plugin } from '@/types/plugin';
import { Prompt } from '@/types/prompt';

import HomeContext from '@/pages/home/home.context';

import { PromptList } from './PromptList';
import { VariableModal } from './VariableModal';

interface Props {
  onSend: (message: Message, plugin: Plugin | null) => void;
  onRegenerate: () => void;
  onScrollDownClick: () => void;
  stopConversationRef: MutableRefObject<boolean>;
  textareaRef: MutableRefObject<HTMLTextAreaElement | null>;
  showScrollDownButton: boolean;
}

export const ChatInput = ({
  onSend,
  onRegenerate,
  onScrollDownClick,
  stopConversationRef,
  textareaRef,
  showScrollDownButton,
}: Props) => {
  const { t } = useTranslation('chat');

  const {
    state: { selectedConversation, messageIsStreaming, prompts, roleList },

    dispatch: homeDispatch,
  } = useContext(HomeContext);

  const [content, setContent] = useState<string>();
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [showPromptList, setShowPromptList] = useState(false);
  const [activePromptIndex, setActivePromptIndex] = useState(0);
  const [promptInputValue, setPromptInputValue] = useState('');
  const [variables, setVariables] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [plugin, setPlugin] = useState<Plugin | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const promptListRef = useRef<HTMLUListElement | null>(null);

  const filteredPrompts = prompts.filter((prompt) =>
    prompt.name.toLowerCase().includes(promptInputValue.toLowerCase()),
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const maxLength = selectedConversation?.model.maxLength;

    if (maxLength && value.length > maxLength) {
      alert(
        t(
          `Message limit is {{maxLength}} characters. You have entered {{valueLength}} characters.`,
          { maxLength, valueLength: value.length },
        ),
      );
      return;
    }

    setContent(value);
    updatePromptListVisibility(value);
  };

  const handleSend = () => {
    if (messageIsStreaming) {
      return;
    }

    if (!content) {
      alert(t('Please enter a message'));
      return;
    }

    onSend({ role: 'user', content }, plugin);
    setContent('');
    setPlugin(null);

    if (window.innerWidth < 640 && textareaRef && textareaRef.current) {
      textareaRef.current.blur();
    }
  };

  const handleRecord = () => {
    setIsRecording(true);
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onresult = (event: any) => {
      const data = event.results[0][0].transcript;
      const msg: Message = { role: 'user', content: data };
      onSend({ role: 'user', content: data }, plugin);
      setIsRecording(false);
    };
    recognition.start();
  };

  const handleStopConversation = () => {
    stopConversationRef.current = true;
    setTimeout(() => {
      stopConversationRef.current = false;
    }, 1000);
  };

  const isMobile = () => {
    const userAgent =
      typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
    const mobileRegex =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
    return mobileRegex.test(userAgent);
  };

  const handleInitModal = () => {
    const selectedPrompt = filteredPrompts[activePromptIndex];
    if (selectedPrompt) {
      setContent((prevContent) => {
        const newContent = prevContent?.replace(
          /\/\w*$/,
          selectedPrompt.content,
        );
        return newContent;
      });
      handlePromptSelect(selectedPrompt);
    }
    setShowPromptList(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (showPromptList) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActivePromptIndex((prevIndex) =>
          prevIndex < prompts.length - 1 ? prevIndex + 1 : prevIndex,
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActivePromptIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : prevIndex,
        );
      } else if (e.key === 'Tab') {
        e.preventDefault();
        setActivePromptIndex((prevIndex) =>
          prevIndex < prompts.length - 1 ? prevIndex + 1 : 0,
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleInitModal();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setShowPromptList(false);
      } else {
        setActivePromptIndex(0);
      }
    } else if (e.key === 'Enter' && !isTyping && !isMobile() && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else if (e.key === '/' && e.metaKey) {
      e.preventDefault();
      // setShowPluginSelect(!showPluginSelect);
    }
  };

  const parseVariables = (content: string) => {
    const regex = /{{(.*?)}}/g;
    const foundVariables = [];
    let match;

    while ((match = regex.exec(content)) !== null) {
      foundVariables.push(match[1]);
    }

    return foundVariables;
  };

  const updatePromptListVisibility = useCallback((text: string) => {
    const match = text.match(/\/\w*$/);

    if (match) {
      setShowPromptList(true);
      setPromptInputValue(match[0].slice(1));
    } else {
      setShowPromptList(false);
      setPromptInputValue('');
    }
  }, []);

  const handlePromptSelect = (prompt: Prompt) => {
    const parsedVariables = parseVariables(prompt.content);
    setVariables(parsedVariables);

    if (parsedVariables.length > 0) {
      setIsModalVisible(true);
    } else {
      setContent((prevContent) => {
        const updatedContent = prevContent?.replace(/\/\w*$/, prompt.content);
        return updatedContent;
      });
      updatePromptListVisibility(prompt.content);
    }
  };

  const handleSubmit = (updatedVariables: string[]) => {
    const newContent = content?.replace(/{{(.*?)}}/g, (match, variable) => {
      const index = variables.indexOf(variable);
      return updatedVariables[index];
    });

    setContent(newContent);

    if (textareaRef && textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  useEffect(() => {
    if (promptListRef.current) {
      promptListRef.current.scrollTop = activePromptIndex * 30;
    }
  }, [activePromptIndex]);

  useEffect(() => {
    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      textareaRef.current.style.height = `${textareaRef.current?.scrollHeight}px`;
      textareaRef.current.style.overflow = `${
        textareaRef?.current?.scrollHeight > 400 ? 'auto' : 'hidden'
      }`;
    }
  }, [content]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        promptListRef.current &&
        !promptListRef.current.contains(e.target as Node)
      )
        setShowPromptList(false);
    };

    window.addEventListener('click', handleOutsideClick);

    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const [selectedOption, setSelectedOption] = useState('text');

  const handleOptionChange = (event: any) => {
    setSelectedOption(event.target.value);

    if (selectedConversation) {
      let updatedConversation: Conversation;
      updatedConversation = {
        ...selectedConversation,
      };
      updatedConversation.promptType = event.target.value;
      homeDispatch({
        field: 'selectedConversation',
        value: updatedConversation,
      });
    }
  };

  useEffect(() => {
    selectedConversation && setSelectedOption(selectedConversation.promptType);
  }, []);

  return (
    <div className="absolute bottom-0 left-0 w-full border-transparent   pt-6 dark:border-white/20 md:pt-2 pb-2 sm:pb-0 bg-[#EBF2FC]">
      <div className="stretch mx-2 mt-4 flex flex-row last:mb-2 md:mx-4 md:mt-[52px] md:last:mb-6 lg:mx-auto lg:max-w-3xl justify-center">
        {messageIsStreaming && (
          <button
            className="absolute top-0 left-0 right-0 mx-auto mb-3 hidden sm:flex w-fit items-center gap-3 rounded-lg  bg-white py-2 px-4 text-gray-800 hover:opacity-50  md:mb-0 md:mt-2"
            onClick={handleStopConversation}
          >
            <IconPlayerStop size={16} /> {t('Stop Generating')}
          </button>
        )}

        {!messageIsStreaming &&
          selectedConversation &&
          selectedConversation.messages.length > 0 && (
            <button
              className="absolute hidden sm:flex top-0 left-0 right-0 mx-auto mb-3 w-fit items-center gap-3  bg-white py-2 px-4 text-gray-800 hover:opacity-50 rounded-lg md:mb-0 md:mt-2"
              onClick={onRegenerate}
            >
              <IconRepeat size={16} /> {t('Regenerate response')}
            </button>
          )}

        <div className="relative flex ">
          <button
            className=" text-gray-900  opacity-60  hover:text-neutral-900 "
            onClick={handleRecord}
          >
            {isRecording ? (
              <IconPlayerRecord size={30} />
            ) : (
              <IconMicrophone size={30} />
            )}
          </button>
        </div>

        <div className="relative mx-2 flex w-[70vw]  flex-col rounded-xl border border-black/10 bg-white shadow-[0_0_10px_rgba(0,0,0,0.10)]  text-gray-800">
          <div className="absolute flex -top-9">
            <div>
              <input
                type="radio"
                id="hosting-small"
                name="hosting"
                value="text"
                className="hidden peer"
                checked={selectedOption === 'text'}
                onChange={handleOptionChange}
              />
              <label
                htmlFor="hosting-small"
                className="inline-flex items-center justify-between pl-2.5 min-w-20 cursor-pointer text-[#888888]  peer-checked:text-[#424242] peer-checked:border-2 peer-checked:border-black/10 peer-checked:rounded-lg"
              >
                <IconHighlight size={30} />
                <div className="w-full ml-1">{t('Text')}</div>
              </label>
            </div>
            <div>
              <input
                type="radio"
                id="hosting-big"
                name="hosting-big"
                value="image"
                className="hidden peer"
                checked={selectedOption === 'image'}
                onChange={handleOptionChange}
              />
              <label
                htmlFor="hosting-big"
                className=" inline-flex items-center justify-between px-2 min-w-20   cursor-pointer text-[#888888] peer-checked:text-[#424242] peer-checked:border-2 peer-checked:border-black/10 peer-checked:rounded-lg"
              >
                <IconPhotoEdit size={30} />
                <div className="w-full ml-1">{t('Image')}</div>
              </label>
            </div>
          </div>

          <textarea
            ref={textareaRef}
            className="focus:outline-none m-0 w-full resize-none border-0 bg-transparent p-0 py-2 pr-8 pl-5 text-black dark:bg-transparent  md:py-3 md:pl-5"
            style={{
              resize: 'none',
              bottom: `${textareaRef?.current?.scrollHeight}px`,
              maxHeight: '400px',
              overflow: `${
                textareaRef.current && textareaRef.current.scrollHeight > 400
                  ? 'auto'
                  : 'hidden'
              }`,
            }}
            placeholder={t('Ask what you want') || ''}
            value={content}
            rows={1}
            onCompositionStart={() => setIsTyping(true)}
            onCompositionEnd={() => setIsTyping(false)}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />

          {showPromptList && filteredPrompts.length > 0 && (
            <div className="absolute bottom-12 w-full">
              <PromptList
                activePromptIndex={activePromptIndex}
                prompts={filteredPrompts}
                onSelect={handleInitModal}
                onMouseOver={setActivePromptIndex}
                promptListRef={promptListRef}
              />
            </div>
          )}

          {isModalVisible && (
            <VariableModal
              prompt={filteredPrompts[activePromptIndex]}
              variables={variables}
              onSubmit={handleSubmit}
              onClose={() => setIsModalVisible(false)}
            />
          )}
        </div>

        <div className="relative flex  items-center ">
          <button
            className={` p-2.5 h-11 w-11 text-white  hover:bg-neutral-200 hover:text-neutral-900  rounded-full ${
              messageIsStreaming ? 'bg-gray-500' : 'bg-[#FF4500]'
            }`}
            onClick={handleSend}
          >
            <PaperAirplaneIcon className="pb-2 pr-1 h-8 w-8 text-white" />
          </button>
        </div>
      </div>

      <div className="px-3 pt-2 pb-3 text-center text-[12px] text-black/50  md:px-4 md:pt-3 md:pb-6 hidden sm:block">
        {t(
          'KIKU is a cutting-edge chatbot that leverages the most powerful chat models to ceate engaging and realistic conversations.',
        )}
      </div>
    </div>
  );
};
