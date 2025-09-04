import ChatBox from "../components/ChatBox";
import ProtectedRoute from "../components/auth/ProtectedRoute";

export default function Home() {
  return (
    <ProtectedRoute>
      <div className="flex items-center justify-center min-h-screen p-2 sm:p-4">
        <div className="w-full max-w-5xl h-[calc(100vh-1rem)]">
          <ChatBox />
        </div>
      </div>
    </ProtectedRoute>
  );
}
