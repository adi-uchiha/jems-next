// app/dashboard/chat/[chatId]/page.tsx

'use client';

import { useChat, Message } from "ai/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";
import { ChatInput } from "../components/ChatInput";
import { ChatMessage } from "../components/ChatMessage";

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const chatId = params?.chatId as string;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [lastMessageId, setLastMessageId] = useState<string | null>(null);
  const [hasLoadedInitialMessages, setHasLoadedInitialMessages] = useState(false);
  const hasAutoStarted = useRef(false);

  const shouldAutoStart = searchParams.get('autostart') === 'true';

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
    isLoading, // isLoading from useChat hook
    error,
    setMessages,
    reload // <-- Import the reload function
  } = useChat({
    api: `/api/chats/${chatId}/messages`, // API endpoint for subsequent messages
    initialMessages: [],
    id: chatId,
    // body: { chatId }, // Removed - API gets chatId from URL
    onError: (error) => {
      console.error('useChat hook error:', error);
      if (error.message.includes('Unauthorized')) {
        router.push('/login');
      } else if (error.message.includes('Not Found') || error.message.includes('404')) {
        router.push('/dashboard/chat');
      }
      setIsInitialLoading(false);
    },
    onFinish: (message) => {
      console.log('Finished receiving AI message:', message.id);
      setLastMessageId(message.id);
      setTimeout(() => setLastMessageId(null), 1500);
    },
  });

  // Wrapper for form submission
  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isInitialLoading) return;
    console.log("Submitting user message via input form.");
    originalHandleSubmit(e);
  }, [input, isLoading, isInitialLoading, originalHandleSubmit]);

  // --- Initial Load Effect (No Changes) ---
  useEffect(() => {
    let isMounted = true;
    setIsInitialLoading(true);
    setHasLoadedInitialMessages(false);
    hasAutoStarted.current = false;
    const loadInitialData = async () => {
      if (!chatId || chatId === 'undefined') { if (router) router.push('/dashboard/chat'); return; }
      console.log("Starting initial data load for chat:", chatId);
      try {
        console.log("Fetching initial messages...");
        const messagesResponse = await fetch(`/api/chats/${chatId}/messages`);
        if (!messagesResponse.ok) {
          console.error("Failed to load messages, status:", messagesResponse.status);
          if ((messagesResponse.status === 404 || messagesResponse.status === 401 || messagesResponse.status === 403) && isMounted && router) { router.push('/dashboard/chat'); }
          throw new Error(`Failed to load messages: ${messagesResponse.statusText}`);
        }
        const initialMessages: Message[] = await messagesResponse.json();
        console.log("Initial messages fetched:", initialMessages.length);
        if (isMounted) {
          setMessages(initialMessages);
          setHasLoadedInitialMessages(true);
          console.log("Initial messages set in useChat state.");
        }
      } catch (err) { console.error('Error during initial data load:', err); }
      finally { if (isMounted) { setIsInitialLoading(false); console.log("Initial data load cycle finished."); } }
    };
    loadInitialData();
    return () => { isMounted = false; console.log("ChatPage initial load effect cleanup."); };
  }, [chatId, setMessages, router]);

  // --- Auto-Start Effect (USING reload) ---
  useEffect(() => {
    if (
      shouldAutoStart &&
      hasLoadedInitialMessages &&
      !hasAutoStarted.current &&
      !isLoading && // Check isLoading from useChat
      messages.length === 1 &&
      messages[0].role === 'user'
    ) {
      console.log("Auto-starting AI response using reload() for chat:", chatId);
      hasAutoStarted.current = true;

      // --- FIX: Use reload() ---
      reload(); // Call the reload function from useChat
      // --- End Fix ---

      // Clean the URL
      try {
        const currentPath = window.location.pathname;
        window.history.replaceState({...window.history.state, as: currentPath, url: currentPath }, '', currentPath);
        console.log("Autostart parameter removed from URL.");
      } catch(e) { console.error("Could not clean URL:", e) }
    }
  }, [
    shouldAutoStart,
    hasLoadedInitialMessages,
    isLoading, // Depend on isLoading from useChat
    messages,
    reload, // Add reload to dependencies
    chatId // Keep chatId just in case
    // originalHandleSubmit is removed as it's not used here
  ]);

  // --- Auto-Scroll Effect (No Changes) ---
  useEffect(() => {
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 150);
    return () => clearTimeout(timer);
  }, [messages]);

  // --- Render Logic (No Changes) ---
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <main className="flex-1 flex flex-col bg-background">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Loading/Empty/Messages */}
          {isInitialLoading && (<div className="flex justify-center items-center h-full"><p className="text-muted-foreground">Loading chat...</p></div>)}
          {!isInitialLoading && !messages.length && (<div className="flex justify-center items-center h-full text-muted-foreground"><p>Send a message to start.</p></div>)}
          {!isInitialLoading && messages.map((message) => (
            <ChatMessage key={message.id} message={message} isNew={message.id === lastMessageId} />
          ))}
          <div ref={messagesEndRef} />
        </div>
        {/* Error */}
        {error && (<div className="p-4 text-red-600 border-t border-border bg-red-50"><p>Error: {error.message}</p></div>)}
        {/* Input */}
        <div className="border-t border-border p-4 bg-background">
          <ChatInput
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            isLoading={isLoading} // isLoading from useChat
            disabled={isInitialLoading || isLoading}
          />
        </div>
      </main>
    </div>
  );
}