// app/dashboard/chat/page.tsx

"use client";

import { useRouter } from "next/navigation";
import { ChatInput } from "./components/ChatInput"; // Corrected import path
import { useState, ChangeEvent, FormEvent } from "react"; // Added FormEvent
import { ChatSidebar } from "./components/ChatSidebar"; // Corrected import path

export default function NewChatPage() { // Renamed component for clarity
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");

  // Update handleSubmit signature to match ChatInput expectation (only needs event)
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const message = input; // Get message from state
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const chatResponse = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: message.slice(0, 50), // Use first 50 chars as potential title
          initialMessage: message      // Pass the full initial message
        }),
      });

      if (!chatResponse.ok) {
         const errorData = await chatResponse.json().catch(() => ({})); // Try to get error details
         console.error('Failed to create chat:', chatResponse.status, errorData);
         throw new Error(`Failed to create chat: ${errorData.error || chatResponse.statusText}`);
      }

      const newChat = await chatResponse.json();

      // Check if ID exists before redirecting
      if (newChat.id) {
         console.log(`Redirecting to new chat: /dashboard/chat/${newChat.id}?autostart=true`);
         router.push(`/dashboard/chat/${newChat.id}?autostart=true`); // Add autostart parameter
      } else {
         throw new Error("Chat created but no ID received.");
      }

    } catch (error) {
      console.error('Error in handleSubmit:', error);
      // TODO: Show error feedback to the user (e.g., using a toast notification)
      setIsLoading(false); // Ensure loading state is reset on error
    }
    // Don't reset loading state on success, as navigation will occur
  };

  // Corrected type for handleInputChange
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    setInput(e.target.value);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <ChatSidebar />

      <main className="flex-1 flex flex-col bg-background justify-end"> {/* Align content bottom */}
         {/* Optional: Add a welcome message or instructions here */}
         <div className="flex-1 flex items-center justify-center text-muted-foreground">
            {/* You can add a placeholder/welcome message here if desired */}
         </div>
         <div className="border-t border-border p-4 bg-background">
            <ChatInput
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit} // Pass the correct handler
            isLoading={isLoading}
            placeholder="Type a message to start a new chat..."
            disabled={isLoading}
            />
         </div>
      </main>
    </div>
  );
}