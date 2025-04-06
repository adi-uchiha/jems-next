//app/dashboard/chat/[chatId]/page.tsx

'use client';

import { useChat } from "ai/react";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { ChatSidebar } from "../components/ChatSidebar";
import { ChatInput } from "../components/ChatInput";
import { ChatMessage } from "../components/ChatMessage";

export default function ChatPage() {
  const params = useParams();
  const chatId = params?.chatId as string;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: `/api/chats/${chatId}/messages`,
    initialMessages: [],
    id: chatId,
  });

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <ChatSidebar />
      
      <main className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <ChatInput 
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
}