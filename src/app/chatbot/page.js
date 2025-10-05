import Chatbot from '@/components/Chatbot';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ChatbotPage() {
  return (
    <ProtectedRoute>
      <Chatbot />
    </ProtectedRoute>
  );
}
