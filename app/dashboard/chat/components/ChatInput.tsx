// components/ChatInput.tsx

import React, { FormEvent, ChangeEvent } from 'react'; // Import ChangeEvent
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChatRequestOptions } from 'ai';

interface ChatInputProps {
  input: string;
  // Update this type to exactly match useChat's handleInputChange
  handleInputChange: (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => void;
  handleSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    chatRequestOptions?: ChatRequestOptions | undefined
  ) => void;
  isLoading: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export function ChatInput({
  input,
  handleInputChange, // Prop name remains the same
  handleSubmit,
  isLoading,
  placeholder = "Type a message...",
  disabled = false
}: ChatInputProps) {

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e);
  };

  // No changes needed here, the Input component's onChange provides
  // ChangeEvent<HTMLInputElement>, which is compatible with the prop type.
  return (
    <form onSubmit={onSubmit} className="">
      <div className="flex items-center gap-2">
        <Input
          value={input}
          onChange={handleInputChange} // Pass the handler directly
          placeholder={placeholder}
          disabled={isLoading || disabled}
          className="flex-1"
          aria-label="Chat input"
        />
        <Button
           type="submit"
           disabled={isLoading || disabled || !input.trim()}
           aria-label={isLoading ? "Sending message" : "Send message"}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </Button>
      </div>
    </form>
  );
}