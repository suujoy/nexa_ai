import { useState } from "react";
import Nav from "../components/Nav";
import Sidebar from "../components/Sidebar";
import MessageBox from "../components/MessageBox";
import ChatWindow from "../components/ChatWindow";
import { useChat } from "../hooks/useChat";

const Dashboard = () => {
    const { currentChat, handleSendMessage, handleCreateChat } = useChat();
    const [sending, setSending] = useState(false);

    const handleSend = async (message) => {
        if (sending) return;
        setSending(true);
        try {
            let chatId = currentChat?._id;
            if (!chatId) {
                const newChat = await handleCreateChat();
                chatId = newChat?._id;
            }
            if (chatId) await handleSendMessage(chatId, message);
        } finally {
            setSending(false);
        }
    };

    return (
        <main className="h-screen flex flex-col overflow-hidden transition-colors">
            <Nav />
            <div className="flex flex-1 min-h-0">
                <Sidebar />
                <div className="flex flex-1 flex-col min-h-0">
                    <div className="flex-1 min-h-0 overflow-hidden">
                        <ChatWindow />
                    </div>
                    <MessageBox onSend={handleSend} disabled={sending} />
                </div>
            </div>
        </main>
    );
};

export default Dashboard;