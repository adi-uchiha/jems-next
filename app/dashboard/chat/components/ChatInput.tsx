import { FormEvent, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  input?: string;
  handleInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>, input: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

export function ChatInput({ 
  input: externalInput, 
  handleInputChange: externalHandleChange,
  handleSubmit,
  isLoading,
  placeholder = "Type a message..."
}: ChatInputProps) {
  const [localInput, setLocalInput] = useState('');
  
  const isControlled = externalInput !== undefined;
  const inputValue = isControlled ? externalInput : localInput;
  
  const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setLocalInput(e.target.value);
    }
    externalHandleChange?.(e);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    handleSubmit(e, inputValue);
    if (!isControlled) {
      setLocalInput('');
    }
  };

  return (
    <form onSubmit={onSubmit} className="p-4 border-t">
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={handleLocalChange}
          placeholder={placeholder}
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send'}
        </Button>
      </div>
    </form>
  );
}