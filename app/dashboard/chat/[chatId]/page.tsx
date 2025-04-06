// app/dashboard/chat/[chatId]/page.tsx

'use client';

import { useChat, Message } from "ai/react"; // Import Message type
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react"; // Added useState
import { ChatSidebar } from "../components/ChatSidebar";
import { ChatInput } from "../components/ChatInput";
import { ChatMessage } from "../components/ChatMessage";
// import { Spinner } from "@/components/ui/spinner"; // Assuming you have a Spinner component

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const chatId = params?.chatId as string;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true); // State for initial load

  // useChat Hook
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading, // This is for ongoing AI responses, not initial load
    error,     // Added error handling from useChat
    setMessages // Function to update messages state
  } = useChat({
    api: `/api/chats/${chatId}/messages`,
    initialMessages: [], // Start empty, load manually
    id: chatId,
    body: {
      chatId // Send chatId in the body for POST requests
    },
    onError: (error) => {
      console.error('Chat hook error:', error);
      // Example: Redirect on specific errors or show a toast
      if (error.message.includes('Unauthorized')) {
         console.error("Unauthorized access detected, redirecting to login.");
         router.push('/login');
      } else if (error.message.includes('Not Found') || error.message.includes('404')) {
         console.error("Chat not found, redirecting.");
         router.push('/dashboard/chat');
      }
      // Optionally show a user-friendly error message (e.g., using a toast library)
    },
    // onFinish: (message) => {
    //   console.log('Finished receiving message:', message);
    // },
  });

  // Effect for Initial Verification and Loading
  useEffect(() => {
    let isMounted = true; // Prevent state updates if component unmounts

    const loadInitialData = async () => {
      if (!chatId || !isMounted) return;

      console.log("Starting initial data load for chat:", chatId);
      setIsInitialLoading(true);

      try {
        // 1. Verify chat existence (optional, could be combined with message fetch)
        console.log("Verifying chat existence...");
        const verifyResponse = await fetch(`/api/chats/${chatId}`); // Use GET for verification
        if (!verifyResponse.ok) {
          console.error("Chat verification failed, status:", verifyResponse.status);
          if (isMounted) router.push('/dashboard/chat');
          return; // Stop if chat doesn't exist or access denied
        }
        console.log("Chat verified.");

        // 2. Load initial messages only if messages array is currently empty
        if (messages.length === 0) {
          console.log("Loading initial messages...");
          const messagesResponse = await fetch(`/api/chats/${chatId}/messages`); // Use GET for messages
          if (!messagesResponse.ok) {
            console.error("Failed to load messages, status:", messagesResponse.status);
            // Handle appropriately - maybe show error, but don't necessarily redirect
            // unless the error indicates lack of access (e.g., 401, 403, 404)
             if (messagesResponse.status === 404 && isMounted) {
                router.push('/dashboard/chat'); // Redirect if chat truly not found
             }
             throw new Error(`Failed to load messages: ${messagesResponse.statusText}`);
          }

          const initialMessages: Message[] = await messagesResponse.json();
          console.log("Initial messages fetched:", initialMessages.length);
          if (isMounted) {
            setMessages(initialMessages); // Update useChat state
             console.log("Messages set in useChat state.");
          }
        } else {
           console.log("Messages already loaded, skipping fetch.");
        }

      } catch (err) {
        console.error('Error during initial data load:', err);
        if (isMounted) {
           // Optionally show error to user
           // Consider redirecting only on specific errors like 404 or auth issues
           // router.push('/dashboard/chat'); // Reconsider redirecting on generic fetch errors
        }
      } finally {
        if (isMounted) {
          setIsInitialLoading(false);
          console.log("Initial data load finished.");
        }
      }
    };

    loadInitialData();

    // Cleanup function
    return () => {
      isMounted = false;
      console.log("ChatPage unmounting or chatId changed.");
    };
  }, [chatId, setMessages, router, messages.length]); // Add messages.length dependency

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    // Scroll immediately only if not initial loading and not loading AI response
    // Give a slight delay after initial load or AI response for smoother feel
    const timer = setTimeout(() => {
       messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100); // 100ms delay

    return () => clearTimeout(timer); // Cleanup timer on unmount or message change
  }, [messages]); // Rerun whenever messages array updates


  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Consider adding loading/error state handling for sidebar if needed */}
      <ChatSidebar />

      <main className="flex-1 flex flex-col bg-background"> {/* Added background color */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4"> {/* Added spacing */}
          {isInitialLoading && (
             <div className="flex justify-center items-center h-full">
               {/* <Spinner size="large" /> */}
               <p>Loading chat...</p> {/* Placeholder for spinner */}
             </div>
          )}

          {!isInitialLoading && messages.length === 0 && (
             <div className="flex justify-center items-center h-full text-muted-foreground">
               <p>Send a message to start the conversation.</p>
             </div>
          )}

           {!isInitialLoading && messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {/* Div to target for scrolling */}
          <div ref={messagesEndRef} />
        </div>

         {/* Optional: Display chat hook errors */}
         {error && (
             <div className="p-4 text-red-600 border-t border-border">
               <p>Error: {error.message}</p>
               {/* You could add a retry button here if applicable */}
             </div>
          )}

        {/* Input area at the bottom */}
        <div className="border-t border-border p-4 bg-background"> {/* Ensure input area has background */}
          <ChatInput
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            // Pass the correct loading state (isLoading for AI response)
            isLoading={isLoading}
            // Disable input during initial load as well
            disabled={isInitialLoading || isLoading}
          />
        </div>
      </main>
    </div>
  );
}