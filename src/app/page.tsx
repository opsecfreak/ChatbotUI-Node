import ChatBox from "../components/ChatBox";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 sm:p-6">
      <div className="w-full max-w-4xl h-[calc(100vh-2rem)]">
        <ChatBox />
      </div>
    </div>
  );
}
