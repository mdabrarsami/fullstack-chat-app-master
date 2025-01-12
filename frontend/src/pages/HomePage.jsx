import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  const navigate = useNavigate();

  useEffect(() => {
    const hasAccess = localStorage.getItem("hasSecretAccess") === "true";
    if (!hasAccess) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="h-screen bg-base-100">
      <div className="flex items-center justify-center pt-16">
        <div className="bg-base-100 rounded-lg shadow-cl w-full h-[calc(100vh-4.5rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            {!selectedUser ?<Sidebar /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
