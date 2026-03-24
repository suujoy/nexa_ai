import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../features/theme/themeSlice";
import ChangeAiModel from "../features/aiModel/components/ChangeAiModel";

const Navbar = ({
    userName = "Sujoy",
    models = [],
    pinnedChats,
    archivedChats,
    onToggleSidebar,
}) => {
    const dispatch = useDispatch();
    const currentTheme = useSelector((state) => state.theme.theme);
    const [openChatMenu, setOpenChatMenu] = useState(null);
    const menuRef = useRef(null);
    const hasChatMenus =
        Array.isArray(pinnedChats) && Array.isArray(archivedChats);

    useEffect(() => {
        const closeMenuOnOutsideClick = (event) => {
            if (!menuRef.current?.contains(event.target)) {
                setOpenChatMenu(null);
            }
        };

        document.addEventListener("mousedown", closeMenuOnOutsideClick);
        return () => {
            document.removeEventListener("mousedown", closeMenuOnOutsideClick);
        };
    }, []);

    const getMenuChats = () =>
        openChatMenu === "pinned" ? pinnedChats : archivedChats;

    const getMenuTitle = () =>
        openChatMenu === "pinned" ? "Pinned Chats" : "Archived Chats";

    return (
        <header className="relative z-[120] px-3 pt-2 sm:px-5">
            <div className="mx-auto max-w-[1700px]">
                <nav className="relative z-[120] overflow-visible rounded-md border border-slate-200/80 bg-white/88 px-2 py-2 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/78 dark:shadow-[0_24px_90px_rgba(0,0,0,0.42)] sm:px-4 sm:py-0">
                    <div className="flex min-h-[44px] min-w-0 flex-wrap items-center justify-between gap-2 sm:h-[60px] sm:flex-nowrap">
                        <div className="flex min-w-0 flex-1 items-center gap-2">
                            {onToggleSidebar ? (
                                <button
                                    type="button"
                                    onClick={onToggleSidebar}
                                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white/90 text-slate-700 shadow-[0_8px_18px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/5 dark:text-slate-200 lg:hidden"
                                    aria-label="Open chats"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        className="h-4 w-4"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    </svg>
                                </button>
                            ) : null}

                            <div className="hidden shrink-0 items-center gap-2 rounded-md bg-[linear-gradient(135deg,#ffffff,#f1f5f9)] px-2 py-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_8px_20px_rgba(15,23,42,0.06)] dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.95),rgba(30,41,59,0.72))] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:flex">
                                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#0f172a,#155e75)] text-xs font-semibold text-white shadow-[0_8px_18px_rgba(8,47,73,0.35)]">
                                    {userName
                                        ?.trim()
                                        ?.charAt(0)
                                        ?.toUpperCase() || "U"}
                                </div>

                                <div className="hidden min-w-0 pr-1 sm:block">
                                    <p className="truncate text-[13px] font-semibold text-slate-900 dark:text-white">
                                        {userName}
                                    </p>
                                </div>
                            </div>

                            <ChangeAiModel models={models} />
                        </div>

                        <div className="relative flex items-center gap-1.5 sm:gap-2" ref={menuRef}>
                            {hasChatMenus ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setOpenChatMenu((value) =>
                                                value === "pinned" ? null : "pinned",
                                            )
                                        }
                                        className="h-9 rounded-md border border-slate-200 bg-[linear-gradient(135deg,#ffffff,#f8fafc)] px-2 text-[12px] font-semibold text-slate-700 shadow-[0_8px_20px_rgba(15,23,42,0.06)] transition hover:border-sky-300 hover:text-sky-700 dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.95),rgba(30,41,59,0.72))] dark:text-slate-100 dark:hover:border-sky-400/40 dark:hover:text-cyan-200 sm:px-3 sm:text-[13px]"
                                    >
                                        <span className="sm:hidden">
                                            Pin ({pinnedChats.length})
                                        </span>
                                        <span className="hidden sm:inline">
                                            Pinned ({pinnedChats.length})
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setOpenChatMenu((value) =>
                                                value === "archived"
                                                    ? null
                                                    : "archived",
                                            )
                                        }
                                        className="h-9 rounded-md border border-slate-200 bg-[linear-gradient(135deg,#ffffff,#f8fafc)] px-2 text-[12px] font-semibold text-slate-700 shadow-[0_8px_20px_rgba(15,23,42,0.06)] transition hover:border-sky-300 hover:text-sky-700 dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.95),rgba(30,41,59,0.72))] dark:text-slate-100 dark:hover:border-sky-400/40 dark:hover:text-cyan-200 sm:px-3 sm:text-[13px]"
                                    >
                                        <span className="sm:hidden">
                                            Arc ({archivedChats.length})
                                        </span>
                                        <span className="hidden sm:inline">
                                            Archived ({archivedChats.length})
                                        </span>
                                    </button>
                                </>
                            ) : null}

                            <button
                                type="button"
                                onClick={() => dispatch(toggleTheme())}
                                className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-md border border-slate-200 bg-[linear-gradient(135deg,#ffffff,#f8fafc)] px-3 text-slate-700 shadow-[0_8px_20px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:border-sky-300 hover:text-sky-700 dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.95),rgba(30,41,59,0.72))] dark:text-slate-100 dark:hover:border-sky-400/40 dark:hover:text-cyan-200"
                            >
                                <span className="sm:hidden">
                                    {currentTheme === "dark" ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            className="h-5 w-5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            className="h-5 w-5"
                                        >
                                            <circle cx="12" cy="12" r="4" />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 2v2.2M12 19.8V22M4.93 4.93l1.56 1.56M17.51 17.51l1.56 1.56M2 12h2.2M19.8 12H22M4.93 19.07l1.56-1.56M17.51 6.49l1.56-1.56"
                                            />
                                        </svg>
                                    )}
                                </span>

                                <span className="hidden sm:inline-flex sm:items-center sm:gap-2">
                                    {currentTheme === "dark" ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            className="h-4.5 w-4.5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            className="h-4.5 w-4.5"
                                        >
                                            <circle cx="12" cy="12" r="4" />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 2v2.2M12 19.8V22M4.93 4.93l1.56 1.56M17.51 17.51l1.56 1.56M2 12h2.2M19.8 12H22M4.93 19.07l1.56-1.56M17.51 6.49l1.56-1.56"
                                            />
                                        </svg>
                                    )}

                                    <span className="text-[13px] font-semibold">
                                        {currentTheme === "dark" ? "Dark" : "Light"}
                                    </span>
                                </span>
                            </button>

                            {hasChatMenus && openChatMenu ? (
                                <div className="absolute right-0 top-[calc(100%+8px)] z-[140] w-[340px] max-w-[calc(100vw-2rem)] rounded-md border border-slate-200 bg-white p-2 shadow-[0_20px_45px_rgba(15,23,42,0.18)] dark:border-white/10 dark:bg-slate-950">
                                    <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                                        {getMenuTitle()}
                                    </p>
                                    <div className="custom-scrollbar mt-1 max-h-56 space-y-1 overflow-y-auto pr-1">
                                        {getMenuChats().length ? (
                                            getMenuChats().map((chat) => (
                                                <Link
                                                    key={chat._id}
                                                    to={`/chat/${chat._id}`}
                                                    onClick={() => setOpenChatMenu(null)}
                                                    className="block rounded-sm border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:border-sky-300 hover:text-sky-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:border-sky-400/40 dark:hover:text-cyan-200"
                                                >
                                                    <p className="truncate font-semibold">
                                                        {chat.title}
                                                    </p>
                                                    <p className="truncate text-[11px] uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                                                        {chat.model?.name ||
                                                            chat.model?.model ||
                                                            "AI Model"}
                                                    </p>
                                                </Link>
                                            ))
                                        ) : (
                                            <div className="rounded-sm border border-dashed border-slate-300 bg-slate-50 px-3 py-4 text-center text-sm text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
                                                No chats found
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
