// components/chat-interface.tsx
'use client';

import { useChat } from '@ai-sdk/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ChatInterface() {
	const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
		api: '/api/chat',
		streamProtocol: 'text', // Explicitly set streaming protocol (default in 4.x)
	});

	return (
		<main className="min-h-screen flex items-center justify-center p-4">

			<div className="flex flex-col h-[500px] w-full max-w-2xl mx-auto border rounded-lg">
				<ScrollArea className="flex-1 p-4">
					{messages.map((message) => (
						<div
							key={message.id}
							className={`mb-2 ${message.role === 'user' ? 'text-right' : 'text-left'
								}`}
						>
							<span
								className={`inline-block p-2 rounded-lg ${message.role === 'user'
										? 'bg-blue-500 text-white'
										: 'bg-gray-200 text-black'
									}`}
							>
								{message.content}
							</span>
						</div>
					))}
				</ScrollArea>
				<form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
					<Input
						value={input}
						onChange={handleInputChange}
						placeholder="Type your message..."
						disabled={isLoading}
						className="flex-1"
					/>
					<Button type="submit" disabled={isLoading}>
						{isLoading ? 'Sending...' : 'Send'}
					</Button>
				</form>
			</div>
		</main>
	);
}