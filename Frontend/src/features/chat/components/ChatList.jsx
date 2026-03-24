import ChatListItem from "./ChatListItem";

const ChatList = ({ chats = [], onRenameChat, onDeleteChat, onSelectChat }) => {
    if (!chats.length) {
        return (
            <div className="rounded-sm  border border-dashed border-slate-300 bg-slate-50 px-3 py-5 text-center text-sm text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
                No chats found
            </div>
        );
    }

    return (
        <div className="grid gap-2">
            {chats.map((chat) => (
                <ChatListItem
                    key={chat._id}
                    chat={chat}
                    onRenameChat={onRenameChat}
                    onDeleteChat={onDeleteChat}
                    onSelectChat={onSelectChat}
                />
            ))}
        </div>
    );
};

export default ChatList;
