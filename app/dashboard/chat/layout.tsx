import { ChatSidebar } from "./components/ChatSidebar";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <ChatSidebar />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}