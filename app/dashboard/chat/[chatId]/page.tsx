//app/dashboard/chat/[chatId]/page.tsx

'use client';

import { useChat } from "ai/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { ChatSidebar } from "../components/ChatSidebar";
import { ChatInput } from "../components/ChatInput";
import { ChatMessage } from "../components/ChatMessage";

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const chatId = params?.chatId as string;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Verify chat exists
  useEffect(() => {
    const validateChat = async () => {
      try {
        const response = await fetch(`/api/chats/${chatId}`);
        if (!response.ok) {
          router.push('/dashboard/chat');
        }
      } catch (error) {
        console.error('Error validating chat:', error);
        router.push('/dashboard/chat');
      }
    };

    if (chatId) validateChat();
  }, [chatId]);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: `/api/chats/${chatId}/messages`,
    initialMessages: [],
    id: chatId,
    body: {
      chatId
    },
    onError: (error) => {
      console.error('Chat error:', error);
      if (error.message.includes('Unauthorized')) {
        router.push('/login');
      }
    }
  });

  // Load initial messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await fetch(`/api/chats/${chatId}/messages`);
        if (response.ok) {
          const initialMessages = await response.json();
          // Set initial messages if needed
        }
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    };

    if (chatId) loadMessages();
  }, [chatId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <ChatSidebar />
      
      <main className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
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