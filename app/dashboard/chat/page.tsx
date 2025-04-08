//app/dashboard/chat/page.tsx

"use client";

import { useRouter } from "next/navigation";
import { ChatInput } from "./components/ChatInput";
import { useState, ChangeEvent } from "react";
import { ChatSidebar } from "./components/ChatSidebar";

export default function ChatPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, message: string) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const chatResponse = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: message.slice(0, 50) }),
      });
      
      if (!chatResponse.ok) throw new Error('Failed to create chat');
      
      const newChat = await chatResponse.json();
      router.push(`/dashboard/chat/${newChat.id}`);
    } catch (error) {
      console.error('Error creating chat:', error);
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    setInput(e.target.value);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <ChatSidebar />
      
      <main className="flex-1 flex flex-col">
        <div className="flex-1" />
        <ChatInput 
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          placeholder="Type a message to start a new chat..."
        />
      </main>
    </div>
  );
}