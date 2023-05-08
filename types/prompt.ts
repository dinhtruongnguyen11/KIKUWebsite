import { OpenAIModel } from './openai';

export interface Prompt {
  id: string;
  name: string;
  name_es: string;
  description: string;
  content: string;
  model: OpenAIModel;
  folderId: string | null;
  type: string | '';
  status: string | 'I';
}
