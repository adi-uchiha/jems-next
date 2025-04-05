"use client";

import { Message, useChat } from "ai/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
// ...existing imports...

export default function ChatInterface() {
  const params = useParams();
  const chatId = params?.chatId as string;
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);
  
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: `/api/chat/${chatId}`,
    initialMessages,
  });

  // Fetch chat history on mount
  useEffect(() => {
    async function fetchChatHistory() {
      try {
        const response = await fetch(`/api/chat/${chatId}/messages`);
        if (!response.ok) throw new Error('Failed to fetch messages');
        const data = await response.json();
        setInitialMessages(data);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    }
    
    if (chatId) {
      fetchChatHistory();
    }
  }, [chatId]);

  // ...rest of the component remains the same...
}