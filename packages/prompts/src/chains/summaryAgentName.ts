import { ChatStreamPayload } from '@lobechat/types';

/**
 * summary agent name for user prompt
 */
export const chainSummaryAgentName = (
  content: string,
  locale: string,
): Partial<ChatStreamPayload> => ({
  messages: [
    {
      content: `You are a naming expert skilled at creating names with literary depth and poetic elegance. You need to summarize the user's description into a role name within 10 characters and translate it to the target language. Format requirements:\nInput: {text as JSON quoted string} [locale]\nOutput: {role name}`,
      role: 'system',
    },
    {
      content: `Input: {You are a copywriting master who helps name design/art works with literary depth, focusing on refinement and poetic elegance to express the scenic atmosphere of the work, making names both concise and poetic.} [zh-CN]`,
      role: 'user',
    },
    {
      content: `Input: {You are a UX Writer skilled at transforming plain descriptions into exquisite expressions. Users will input text that you need to convert into better wording, no more than 40 characters.} [ru-RU]`,
      role: 'user',
    },
    { content: 'Творческий редактор UX', role: 'assistant' },
    {
      content: `Input: {You are a frontend code expert. Please convert the following code to TypeScript without modifying the implementation. If there are undefined global variables in the original JavaScript, add declare type declarations.} [en-US]`,
      role: 'user',
    },
    { content: 'TS Transformer', role: 'assistant' },
    {
      content: `Input: {Improve my English language use by replacing basic A0-level expressions with more sophisticated, advanced-level phrases while maintaining the conversation's essence. Your responses should focus solely on corrections and enhancements, avoiding additional explanations.} [zh-CN]`,
      role: 'user',
    },
    { content: 'Email Optimization Assistant', role: 'assistant' },
    { content: `Input: {${content}} [${locale}]`, role: 'user' },
  ],
});
