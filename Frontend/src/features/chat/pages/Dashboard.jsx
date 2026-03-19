import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";

export default function Dashboard() {
    const [open, setOpen] = useState(false);
    const [featureOpen, setFeatureOpen] = useState(false);
    const [selectedFeature, setSelectedFeature] = useState(null);
    const popupRef = useRef();
    const { handleSendMessage } = useChat();

    const [message, setMessage] = useState("");

    const chats = useSelector((state) => state.chat.chats);
    const currentChatId = useSelector((state) => state.chat.currentChatId);
    const isLoading = useSelector((state) => state.chat.isLoading);

    const handleSubmitMessage = async () => {
        if (!message.trim()) return;

        await handleSendMessage({
            message: message.trim(),
            chatId: currentChatId,
        });

        setMessage("");
    };

    // close popup on outside click
    useEffect(() => {
        function handleClick(e) {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                setFeatureOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <div className="h-screen w-full bg-gray-950 text-white flex justify-center">
            <div className="w-full max-w-[1600px] flex">
                {/* Sidebar */}
                <div
                    className={`
                    fixed md:static z-50 top-0 left-0 h-full w-[70%] sm:w-[280px] 
                    bg-gray-900 p-4 border-r border-gray-800
                    transform ${open ? "translate-x-0" : "-translate-x-full"} 
                    md:translate-x-0 transition duration-300
                `}
                >
                    <h2 className="text-lg font-semibold mb-4 text-gray-300">
                        All Chats
                    </h2>

                    <div className="space-y-3 overflow-y-auto h-[85%]">
                        {[1, 2, 3, 4, 5, 6].map((chat) => (
                            <div
                                key={chat}
                                className="p-3 rounded-xl bg-gray-800 hover:bg-gray-700 cursor-pointer border border-gray-700"
                            >
                                Chat Title {chat}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Overlay */}
                {open && (
                    <div
                        className="fixed inset-0 bg-black/50 md:hidden"
                        onClick={() => setOpen(false)}
                    />
                )}

                {/* Main */}
                <div className="flex-1 flex flex-col w-full">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                        <button
                            onClick={() => setOpen(true)}
                            className="md:hidden px-3 py-1 rounded-lg bg-gray-800"
                        >
                            ☰
                        </button>

                        <h2 className="text-lg font-semibold text-gray-300">
                            Profile
                        </h2>
                    </div>

                    {/* Content Wrapper */}
                    <div className="flex-1 flex flex-col w-full max-w-[1600px] mx-auto">
                        <div className="flex-1 flex flex-col w-full max-w-3xl lg:max-w-4xl mx-auto">
                            {/* Chat */}
                            <div className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6">
                                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-3 sm:p-4 space-y-4">
                                    {/* Empty State */}
                                    {!chats?.[currentChatId]?.messages
                                        ?.length && (
                                        <p className="text-center text-gray-500">
                                            Start a conversation...
                                        </p>
                                    )}

                                    {/* Messages */}
                                    {chats?.[currentChatId]?.messages?.map(
                                        (message, index) => (
                                            <div
                                                key={message._id || index}
                                                className={`flex ${
                                                    message.role === "user"
                                                        ? "justify-end"
                                                        : "justify-start"
                                                }`}
                                            >
                                                <div
                                                    className={`max-w-[90%] sm:max-w-[75%] lg:max-w-[60%] rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base ${
                                                        message.role === "user"
                                                            ? "bg-gray-600 rounded-br-none"
                                                            : "bg-gray-500 rounded-bl-none"
                                                    }`}
                                                >
                                                    {message.content}
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>

                            {/* Input */}
                            <div className="p-3 sm:p-4 border-t border-gray-800 bg-gray-950">
                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center">
                                    {/* Input */}
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={(event) =>
                                            setMessage(event.target.value)
                                        }
                                        onKeyDown={(event) => {
                                            if (event.key === "Enter") {
                                                handleSubmitMessage();
                                            }
                                        }}
                                        placeholder="Type your message..."
                                        className="flex-1 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-300"
                                    />

                                    {/* Send */}
                                    <button
                                        onClick={handleSubmitMessage}
                                        disabled={isLoading || !message.trim()}
                                        className="w-full sm:w-auto px-5 py-3 bg-gray-300 hover:bg-gray-200 disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300 text-gray-950 rounded-xl"
                                    >
                                        {isLoading ? "Sending..." : "Send"}
                                    </button>

                                    {/* Mobile Feature */}
                                    <div className="sm:hidden relative w-full">
                                        <button
                                            onClick={() =>
                                                setFeatureOpen(!featureOpen)
                                            }
                                            className="w-full px-5 py-3 bg-gray-800 rounded-xl border border-gray-700 text-sm"
                                        >
                                            {selectedFeature
                                                ? selectedFeature
                                                : "+"}
                                        </button>

                                        {featureOpen && (
                                            <div
                                                ref={popupRef}
                                                className="absolute bottom-14 left-0 w-full bg-gray-900 border border-gray-700 rounded-xl p-3 space-y-2 shadow-lg"
                                            >
                                                {[
                                                    "Search Web",
                                                    "Create Image",
                                                    "Features",
                                                ].map((item) => (
                                                    <button
                                                        key={item}
                                                        onClick={() => {
                                                            setSelectedFeature(
                                                                item,
                                                            );
                                                            setFeatureOpen(
                                                                false,
                                                            );
                                                        }}
                                                        className={`w-full px-4 py-2 rounded-lg text-sm ${
                                                            selectedFeature ===
                                                            item
                                                                ? "bg-gray-600 border border-gray-500"
                                                                : "bg-gray-800 hover:bg-gray-700"
                                                        }`}
                                                    >
                                                        {item}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Desktop Features */}
                                    <div className="hidden sm:flex gap-2">
                                        {[
                                            "Search Web",
                                            "Create Image",
                                            "Features",
                                        ].map((item) => (
                                            <button
                                                key={item}
                                                className="px-4 py-3 bg-gray-800 rounded-xl border border-gray-700 hover:bg-gray-700 text-sm"
                                            >
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
