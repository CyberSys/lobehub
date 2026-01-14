import { ChatStreamPayload } from '@lobechat/types';

export const chainSummaryDescription = (
  content: string,
  locale: string,
): Partial<ChatStreamPayload> => ({
  messages: [
    {
      content: `You are an assistant skilled at summarizing abilities. You need to summarize the user's input into a role skill description, no more than 20 characters. The content should ensure clarity, logical coherence, and effectively convey the role's skills and experience, and translate to the target language: ${locale}. Format requirements:\nInput: {text as JSON quoted string} [locale]\nOutput: {description}`,
      role: 'system',
    },
    {
      content: `Input: {You are a copywriting master who helps name design/art works with literary depth, focusing on refinement and poetic elegance to express the scenic atmosphere of the work, making names both concise and poetic.} [zh-CN]`,
      role: 'user',
    },
    { content: 'Skilled at naming creative art works', role: 'assistant' },
    {
      content: `Input: {You are a business plan writing expert who can provide comprehensive plans including creative names, short slogans, target user personas, user pain points, main value propositions, sales/marketing channels, revenue streams, cost structure, etc.} [en-US]`,
      role: 'user',
    },
    { content: 'Good at business plan writing and consulting', role: 'assistant' },
    {
      content: `Input: {You are a frontend expert. Please convert the code below to TS without modifying the implementation. If there are global variables not defined in the original JS, you need to add type declarations using declare.} [zh-CN]`,
      role: 'user',
    },
    { content: 'Skilled at TS conversion and adding type declarations', role: 'assistant' },
    {
      content: `Input: {
You write API user documentation for developers. You need to provide documentation content that is easy to use and read from the user's perspective.\n\nA standard API documentation example is as follows:\n\n\`\`\`markdown
---
title: useWatchPluginMessage
description: Listen and receive plugin messages from LobeChat
nav: API
---\n\n\`useWatchPluginMessage\` is a React Hook encapsulated in the Chat Plugin SDK for listening to plugin messages from LobeChat.
} [ru-RU]`,
      role: 'user',
    },
    {
      content:
        'Специализируется на создании хорошо структурированной и профессиональной документации README для GitHub с точными техническими терминами',
      role: 'assistant',
    },
    {
      content: `Input: {You are a business plan writing expert who can provide comprehensive plans including creative names, short slogans, target user personas, user pain points, main value propositions, sales/marketing channels, revenue streams, cost structure, etc.} [zh-CN]`,
      role: 'user',
    },
    { content: 'Skilled at business plan writing and consulting', role: 'assistant' },
    { content: `Input: {${content}} [${locale}]`, role: 'user' },
  ],
  temperature: 0,
});
