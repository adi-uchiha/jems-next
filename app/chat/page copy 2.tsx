// components/chat-interface.tsx
'use client';

import { useChat, type Message } from '@ai-sdk/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useRef } from 'react';

// Parse raw streaming text from parts or content
function parseRawText(rawText: string): string {
  const lines = rawText.split('\n');
  let textContent = '';

  for (const line of lines) {
    if (line.startsWith('0:"')) {
      // Extract text between 0:" and closing quote, handling escapes
      const text = line.slice(3).replace(/\\n/g, '\n').replace(/\\"/g, '"');
      textContent += text.endsWith('"') ? text.slice(0, -1) : text;
    }
  }

  return textContent.trim();
}

// Render message parts or fallback to parsed content
function renderMessageParts(message: Message): JSX.Element {
  console.log('Rendering message:', message); // For debugging

  // Check if parts exist and are populated
  if (message.parts && message.parts.length > 0) {
    return (
      <>
        {message.parts.map((part, index) => {
          switch (part.type) {
            case 'text':
              // Parse the raw text within the part
              const cleanText = parseRawText(part.text);
              return <span key={index} className="whitespace-pre-wrap">{cleanText}</span>;
            case 'reasoning':
              return (
                <div key={index} className="mt-1 italic opacity-80">
                  <span>{part.reasoning}</span>
                  {part.details.map((detail, i) => (
                    <span key={i} className="block text-xs">
                      {detail.type === 'text' ? detail.text : '[Redacted]'}
                    </span>
                  ))}
                </div>
              );
            case 'tool-invocation':
              const { toolInvocation } = part;
              return (
                <pre key={index} className="text-xs mt-1 bg-gray-800 text-white p-2 rounded">
                  {toolInvocation.state === 'result'
                    ? JSON.stringify(toolInvocation.result, null, 2)
                    : JSON.stringify(
                        { toolName: toolInvocation.toolName, args: toolInvocation.args },
                        null,
                        2
                      )}
                </pre>
              );
            case 'source':
              return <span key={index} className="block text-xs mt-1">[Source: {part.source.type}]</span>;
            case 'file':
              return <span key={index} className="block text-xs mt-1">[File: {part.mimeType}]</span>;
            default:
              return null;
          }
        })}
      </>
    );
  }

  // Fallback: Parse raw content if parts are unavailable
  const cleanContent = parseRawText(message.content);
  return <span className="whitespace-pre-wrap">{cleanContent}</span>;
}

export default function ChatInterface() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    streamProtocol: 'text', // Matches your API setup
  });

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="flex flex-col h-[500px] w-full max-w-2xl mx-auto border rounded-lg">
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
            >
              <span
                className={`inline-block p-2 rounded-lg ${
                  message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                }`}
              >
                {renderMessageParts(message)}
              </span>
            </div>
          ))}
        </ScrollArea>
        <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </form>
      </div>
    </main>
  );
}