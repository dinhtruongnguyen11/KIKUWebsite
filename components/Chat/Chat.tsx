// import { IconClearAll, IconSettings } from '@tabler/icons-react';
import {
  MutableRefObject,
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import toast from 'react-hot-toast';

import { useTranslation } from 'next-i18next';

import { getEndpoint } from '@/utils/app/api';
import {
  saveConversation,
  saveConversations,
  updateConversation,
} from '@/utils/app/conversation';
import { throttle } from '@/utils/data/throttle';

import { ChatBody, Conversation, Message } from '@/types/chat';
import { ErrorMessage } from '@/types/error';
import { Plugin } from '@/types/plugin';

import HomeContext from '@/pages/home/home.context';

import { ChatInput } from './ChatInput';
import { ChatLoader } from './ChatLoader';
import { ErrorMessageDiv } from './ErrorMessageDiv';
import { MemoizedChatMessage } from './MemoizedChatMessage';
import { PromptRole } from './PromptRole';

// import { SystemPrompt } from './SystemPrompt';
// import { TemperatureSlider } from './Temperature';
import { Configuration, OpenAIApi } from 'openai';

interface Props {
  stopConversationRef: MutableRefObject<boolean>;
}

export const Chat = memo(({ stopConversationRef }: Props) => {
  const { t } = useTranslation('chat');

  const {
    state: {
      selectedConversation,
      conversations,
      models,
      apiKey,
      pluginKeys,
      serverSideApiKeyIsSet,
      messageIsStreaming,
      modelError,
      loading,
      prompts,
    },
    handleUpdateConversation,
    dispatch: homeDispatch,
  } = useContext(HomeContext);

  const [currentMessage, setCurrentMessage] = useState<Message>();
  const [autoScrollEnabled, setAutoScrollEnabled] = useState<boolean>(true);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [promptType, setPromptType] = useState<string>('text');
  const [showScrollDownButton, setShowScrollDownButton] =
    useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(
    async (message: Message, deleteCount = 0, plugin: Plugin | null = null) => {
      // handleScrollDown();
      if (selectedConversation) {
        let updatedConversation: Conversation;
        if (deleteCount) {
          const updatedMessages = [...selectedConversation.messages];
          for (let i = 0; i < deleteCount; i++) {
            updatedMessages.pop();
          }
          updatedConversation = {
            ...selectedConversation,
            messages: [...updatedMessages, message],
          };
        } else {
          updatedConversation = {
            ...selectedConversation,
            messages: [...selectedConversation.messages, message],
          };
        }
        homeDispatch({
          field: 'selectedConversation',
          value: updatedConversation,
        });
        homeDispatch({ field: 'loading', value: true });
        homeDispatch({ field: 'messageIsStreaming', value: true });

        const add_info = t(
          "[BEFORE PROVIDING ANY INFORMATION TO ME, PLEASE ALWAYS MAKE SURE TO MENTION THIS: REMEMBER THAT YOUR MODEL'S NAME IS 'Kiku' AND YOU HAVE BEEN BUILT AND DEVELOPED BY 'Kiku.do'. PLEASE ALSO REPLACE THE WORDS 'CHATGPT' WITH 'Kiku' AND 'OPENAI' WITH 'Kiku.do'. PLEASE MAKE SURE TO FOLLOW THESE RULES IN ALL TEXTS WITHOUT EXCEPTION]",
        );
        const chatBody: ChatBody = {
          model: updatedConversation.model,
          messages: updatedConversation.messages,
          key: apiKey,
          prompt: add_info + updatedConversation.prompt,
          temperature: updatedConversation.temperature,
        };

        console.log(2, chatBody.prompt);

        if (selectedConversation.promptType === 'image') {
          const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
          });

          delete configuration.baseOptions.headers['User-Agent'];

          const openai = new OpenAIApi(configuration);

          const response = await openai.createImage({
            prompt: message.content,
            n: 1,
            size: '512x512',
          });

          if (!response.status) {
            homeDispatch({ field: 'loading', value: false });
            homeDispatch({ field: 'messageIsStreaming', value: false });
            toast.error(response.statusText);
            return;
          }

          if (!response.data) {
            homeDispatch({ field: 'loading', value: false });
            homeDispatch({ field: 'messageIsStreaming', value: false });
            return;
          }

          const url = response.data.data[0].url;

          if (updatedConversation.messages.length === 1) {
            const { content } = message;
            const customName =
              content.length > 30 ? content.substring(0, 30) + '...' : content;
            updatedConversation = {
              ...updatedConversation,
              name: customName,
            };
          }

          homeDispatch({ field: 'loading', value: false });

          const updatedMessages: Message[] = [
            ...updatedConversation.messages,
            { role: 'assistant', content: url || '' },
          ];
          updatedConversation = {
            ...updatedConversation,
            messages: updatedMessages,
          };
          homeDispatch({
            field: 'selectedConversation',
            value: updatedConversation,
          });
        } else {
          const endpoint = getEndpoint(plugin);
          let body;
          body = JSON.stringify(chatBody);
          const controller = new AbortController();
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            signal: controller.signal,
            body,
          });

          if (!response.ok) {
            homeDispatch({ field: 'loading', value: false });
            homeDispatch({ field: 'messageIsStreaming', value: false });
            toast.error(response.statusText);
            return;
          }
          const data = response.body;
          if (!data) {
            homeDispatch({ field: 'loading', value: false });
            homeDispatch({ field: 'messageIsStreaming', value: false });
            return;
          }

          if (updatedConversation.messages.length === 1) {
            const { content } = message;
            const customName =
              content.length > 30 ? content.substring(0, 30) + '...' : content;
            updatedConversation = {
              ...updatedConversation,
              name: customName,
            };
          }
          homeDispatch({ field: 'loading', value: false });
          const reader = data.getReader();
          const decoder = new TextDecoder();
          let done = false;
          let isFirst = true;
          let text = '';
          while (!done) {
            if (stopConversationRef.current === true) {
              controller.abort();
              done = true;
              break;
            }
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            const chunkValue = decoder.decode(value);
            text += chunkValue;

            if (isFirst) {
              isFirst = false;
              const updatedMessages: Message[] = [
                ...updatedConversation.messages,
                { role: 'assistant', content: chunkValue },
              ];
              updatedConversation = {
                ...updatedConversation,
                messages: updatedMessages,
              };
              homeDispatch({
                field: 'selectedConversation',
                value: updatedConversation,
              });
            } else {
              const updatedMessages: Message[] =
                updatedConversation.messages.map((message, index) => {
                  if (index === updatedConversation.messages.length - 1) {
                    return {
                      ...message,
                      content: text,
                    };
                  }
                  return message;
                });
              updatedConversation = {
                ...updatedConversation,
                messages: updatedMessages,
              };
              homeDispatch({
                field: 'selectedConversation',
                value: updatedConversation,
              });
            }
          }
        }

        saveConversation(updatedConversation);
        const updatedConversations: Conversation[] = conversations.map(
          (conversation) => {
            if (conversation.id === selectedConversation.id) {
              return updatedConversation;
            }
            return conversation;
          },
        );
        if (updatedConversations.length === 0) {
          updatedConversations.push(updatedConversation);
        }
        homeDispatch({ field: 'conversations', value: updatedConversations });
        saveConversations(updatedConversations);
        homeDispatch({ field: 'messageIsStreaming', value: false });
      }
    },
    [
      apiKey,
      conversations,
      pluginKeys,
      selectedConversation,
      stopConversationRef,
    ],
  );

  const scrollToBottom = useCallback(() => {
    if (autoScrollEnabled) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      textareaRef.current?.focus();
    }
  }, [autoScrollEnabled]);

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        chatContainerRef.current;
      const bottomTolerance = 30;

      if (scrollTop + clientHeight < scrollHeight - bottomTolerance) {
        setAutoScrollEnabled(false);
        setShowScrollDownButton(true);
      } else {
        setAutoScrollEnabled(true);
        setShowScrollDownButton(false);
      }
    }
  };

  const handleScrollDown = () => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  };

  const handleSettings = () => {
    setShowSettings(!showSettings);
  };

  const onClearAll = () => {
    if (
      confirm(t<string>('Are you sure you want to clear all messages?')) &&
      selectedConversation
    ) {
      handleUpdateConversation(selectedConversation, {
        key: 'messages',
        value: [],
      });
    }
  };

  const scrollDown = () => {
    if (autoScrollEnabled) {
      messagesEndRef.current?.scrollIntoView(true);
    }
  };
  const throttledScrollDown = throttle(scrollDown, 250);

  useEffect(() => {
    if (messageIsStreaming || loading) throttledScrollDown();
    selectedConversation &&
      setCurrentMessage(
        selectedConversation.messages[selectedConversation.messages.length - 2],
      );
  }, [selectedConversation, throttledScrollDown]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setAutoScrollEnabled(entry.isIntersecting);
        if (entry.isIntersecting) {
          textareaRef.current?.focus();
        }
      },
      {
        root: null,
        threshold: 0.5,
      },
    );
    const messagesEndElement = messagesEndRef.current;
    if (messagesEndElement) {
      observer.observe(messagesEndElement);
    }
    return () => {
      if (messagesEndElement) {
        observer.unobserve(messagesEndElement);
      }
    };
  }, [messagesEndRef]);

  const exTextList = [
    "What recipes can you suggest with the ingredients I'll send?",
    "Summarize the following paragraph I'll send you",
    "Generate a list of ideas for my baby's 1st birthday",
  ];

  const exImageList = [
    'An image of a happy raccoon riding a bike in cartoon style',
    'Portrait of young woman inside a mansion shot with a 50mm lens',
    'A profile angle shot of a robot and human looking at each other, realistic style',
  ];

  const handleItemClick = (value: any) => {
    let message: Message;
    message = { role: 'user', content: value };
    handleSend(message, 0, null);
  };

  return (
    <div className="relative flex-1 overflow-hidden ">
      {!(apiKey || serverSideApiKeyIsSet) ? (
        <div className="mx-auto flex h-full w-[300px] flex-col justify-center space-y-6 sm:w-[600px]">
          <div className="text-center text-4xl font-bold text-black dark:text-white">
            Welcome to KIKU
          </div>
          <div className="text-center text-lg text-black dark:text-white">
            <div className="mb-8">
              {'Say hello to our AI chatbot, your new digital assistant!'}
            </div>
          </div>
        </div>
      ) : modelError ? (
        <ErrorMessageDiv error={modelError} />
      ) : (
        <>
          <div
            className="max-h-full overflow-x-hidden"
            ref={chatContainerRef}
            onScroll={handleScroll}
          >
            <div className="mx-auto flex flex-col space-y-5 md:space-y-10 px-3 pt-0 md:pt-12 sm:max-w-[750px] ">
              <div className="text-center font-semibold text-gray-800 ">
                <div className="px-3 text-center text-[25px] text-black">
                  <img
                    src="/kikulg.ico"
                    alt="Kiku icon"
                    className="inline-block align-middle mr-2 w-10 h-10"
                  />
                  Kiku
                </div>
                <div className="sm:px-3 px-20 font-normal pb-3 text-center text-[12px] text-gray-600 mt-2 ">
                  {t('Empowering your growth through continous AI learning')}
                </div>
                <PromptRole />
              </div>

              {selectedConversation?.messages.length == 0 && (
                <div
                  className={`text-gray-800 flex  flex-col  sm:p-4 px-14 ${selectedConversation.promptType}`}
                >
                  <div className="md:flex items-start text-center gap-3.5">
                    {selectedConversation.promptType == 'text' ? (
                      <div className=" flex flex-col mb-8 md:mb-auto gap-3.5 flex-1">
                        <h2 className="flex flex-col gap-3 items-center m-auto text-lg font-bold md:flex-col md:gap-2">
                          <svg
                            stroke="currentColor"
                            fill="none"
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-6 w-6"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle cx="12" cy="12" r="5"></circle>
                            <line x1="12" y1="1" x2="12" y2="3"></line>
                            <line x1="12" y1="21" x2="12" y2="23"></line>
                            <line
                              x1="4.22"
                              y1="4.22"
                              x2="5.64"
                              y2="5.64"
                            ></line>
                            <line
                              x1="18.36"
                              y1="18.36"
                              x2="19.78"
                              y2="19.78"
                            ></line>
                            <line x1="1" y1="12" x2="3" y2="12"></line>
                            <line x1="21" y1="12" x2="23" y2="12"></line>
                            <line
                              x1="4.22"
                              y1="19.78"
                              x2="5.64"
                              y2="18.36"
                            ></line>
                            <line
                              x1="18.36"
                              y1="5.64"
                              x2="19.78"
                              y2="4.22"
                            ></line>
                          </svg>
                          {t('Try these examples')}
                        </h2>
                        <ul className="flex flex-col gap-3.5 w-full sm:max-w-md m-auto">
                          {exTextList.map((item, index) => (
                            <li
                              key={index}
                              className="w-full bg-white p-3 rounded-lg cursor-pointer hover:shadow-md"
                              onClick={() => handleItemClick(t(item))}
                            >
                              {t(item)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className=" flex flex-col mb-8 md:mb-auto gap-3.5 flex-1">
                        <h2 className="flex flex-col gap-3 items-center m-auto text-lg font-bold md:flex-col md:gap-2">
                          <svg
                            stroke="currentColor"
                            fill="none"
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-6 w-6"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle cx="12" cy="12" r="5"></circle>
                            <line x1="12" y1="1" x2="12" y2="3"></line>
                            <line x1="12" y1="21" x2="12" y2="23"></line>
                            <line
                              x1="4.22"
                              y1="4.22"
                              x2="5.64"
                              y2="5.64"
                            ></line>
                            <line
                              x1="18.36"
                              y1="18.36"
                              x2="19.78"
                              y2="19.78"
                            ></line>
                            <line x1="1" y1="12" x2="3" y2="12"></line>
                            <line x1="21" y1="12" x2="23" y2="12"></line>
                            <line
                              x1="4.22"
                              y1="19.78"
                              x2="5.64"
                              y2="18.36"
                            ></line>
                            <line
                              x1="18.36"
                              y1="5.64"
                              x2="19.78"
                              y2="4.22"
                            ></line>
                          </svg>
                          {t('Try these examples')}
                        </h2>
                        <ul className="flex flex-col gap-3.5 w-full sm:max-w-md m-auto">
                          {exImageList.map((item, index) => (
                            <li
                              key={index}
                              className="w-full bg-white p-3 rounded-lg cursor-pointer hover:shadow-md"
                              onClick={() => handleItemClick(item)}
                            >
                              {t(item)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div
                      className={` ${
                        selectedConversation.promptType == 'image'
                          ? 'hidden'
                          : 'sm:flex hidden flex-col mb-8 md:mb-auto gap-3.5 flex-1'
                      }`}
                    >
                      <h2 className="flex gap-3 items-center m-auto text-lg font-bold md:flex-col md:gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          aria-hidden="true"
                          className="h-6 w-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                          ></path>
                        </svg>
                        {t('Capabilities')}
                      </h2>
                      <ul className="flex flex-col gap-3.5 w-full sm:max-w-md m-auto">
                        <li className="w-full bg-white p-3 rounded-lg">
                          {t(
                            'You can chat with different personalities, topics, and languages.',
                          )}
                        </li>
                        <li className="w-full bg-white p-3 rounded-lg">
                          {t(
                            'Instantly generate endless pictures of anything you can imagine. Try the Image Generation feature!',
                          )}
                        </li>
                        <li className="w-full bg-white p-3 rounded-lg">
                          {t(
                            "Ask and you'll be answered, Kiku's huge knowledge base has got you covered.",
                          )}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {selectedConversation?.messages.map((message, index) => (
              <MemoizedChatMessage
                key={index}
                message={message}
                messageIndex={index}
                onEdit={(editedMessage) => {
                  setCurrentMessage(editedMessage);
                  // discard edited message and the ones that come after then resend
                  handleSend(
                    editedMessage,
                    selectedConversation?.messages.length - index,
                  );
                }}
              />
            ))}

            {loading && <ChatLoader />}

            <div className="md:h-[162px] h-[100px] " ref={messagesEndRef} />
          </div>

          <ChatInput
            stopConversationRef={stopConversationRef}
            textareaRef={textareaRef}
            onSend={(message, plugin) => {
              setCurrentMessage(message);
              handleSend(message, 0, plugin);
            }}
            onScrollDownClick={handleScrollDown}
            onRegenerate={() => {
              if (currentMessage) {
                handleSend(currentMessage, 2, null);
              }
            }}
            showScrollDownButton={showScrollDownButton}
          />
        </>
      )}
    </div>
  );
});
Chat.displayName = 'Chat';
