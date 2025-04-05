'use client'

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Chat {
  id: string;
  title: string;
  updatedAt: string;
}

export function ChatSidebar() {
  const [chats, setChats] = useState<Chat[]>([]);
  const pathname = usePathname();
  const currentChatId = pathname.split('/').pop();

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const response = await fetch('/api/chats');
      const data = await response.json();
      setChats(data);
    } catch (error) {
      console.error('Failed to fetch chats:', error);
    }
  };

  const createNewChat = async () => {
    try {
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Chat' }),
      });
      const newChat = await response.json();
      window.location.href = `/dashboard/chat/${newChat.id}`;
    } catch (error) {
      console.error('Failed to create chat:', error);
    }
  };

  return (
    <div className="w-64 border-r border-border/50 dark:border-border/30 h-full flex flex-col">
      <div className="p-4">
        <Button
          onClick={createNewChat}
          className="w-full gap-2"
          variant="outline"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {chats.map((chat) => (
            <Link
              key={chat.id}
              href={`/dashboard/chat/${chat.id}`}
            >
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2 text-left",
                  chat.id === currentChatId && "bg-accent"
                )}
              >
                <MessageCircle className="h-4 w-4" />
                <span className="truncate">{chat.title}</span>
              </Button>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}