import { useState } from "react";
import Nav from "../components/Nav";
import Sidebar from "../components/Sidebar";
import MessageBox from "../components/MessageBox";
import ChatWindow from "../components/ChatWindow";
import { useChat } from "../hooks/useChat";

const Dashboard = () => {
    const { currentChat, handleSendMessage, handleCreateChat } = useChat();
    const [sending, setSending] = useState(false);
    const [openSidebar, setOpenSidebar] = useState(false);

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
        <main className="h-screen flex flex-col overflow-hidden">
            {/* NAV (pass toggle) */}
            <Nav onMenuClick={() => setOpenSidebar(true)} />

            <div className="flex flex-1 min-h-0 w-full max-w-[1700px] mx-auto relative">
                {/* SIDEBAR DESKTOP */}
                <div className="hidden md:flex">
                    <Sidebar />
                </div>

                {/* SIDEBAR MOBILE */}
                {openSidebar && (
                    <div className="fixed top-[64px] left-0 right-0 bottom-0 z-50 flex md:hidden">
                        {/* Overlay */}
                        <div
                            className="absolute inset-0 bg-black/40"
                            onClick={() => setOpenSidebar(false)}
                        />

                        {/* Sidebar */}
                        <div className="relative z-50 w-64 h-full">
                            <Sidebar />
                        </div>
                    </div>
                )}

                {/* CHAT AREA */}
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
