import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import {
    Home, Search as SearchIcon, LogOut, Menu,
    BedDouble, Calendar, GraduationCap
} from 'lucide-react'; // Bell importu temizlendi

export default function StudentLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isSplashActive, setIsSplashActive] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsSplashActive(false);
        }, 600);
        return () => clearTimeout(timer);
    }, []);

    const handleLogout = () => {
        navigate('/login');
    };

    const menuItems = [
        { path: '/student/dashboard', label: 'Ana Sayfa', icon: Home },
        { path: '/student/room-status', label: 'Oda Durumu', icon: BedDouble },
        { path: '/student/leaves', label: 'İzin İşlemleri', icon: Calendar },
        { path: '/student/room-search', label: 'Akıllı Oda Arama', icon: SearchIcon },
    ];

    return (
        <LayoutGroup>

            {/* ENTEGRE SPLASH ALANI */}
            <AnimatePresence>
                {isSplashActive && (
                    <motion.div
                        className="fixed inset-0 z-[9999] bg-[#060F1E]"
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div
                            layoutId="agu-logo"
                            className="fixed inset-0 m-auto bg-white p-8 rounded-[2rem] w-48 h-48 flex items-center justify-center z-50"
                        >
                            <img src="/agu-logo.png" alt="AGU Logo" className="w-full h-full object-contain" />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ANA PANEL */}
            <div className="flex h-screen bg-[#F4F7FA] font-sans antialiased overflow-hidden selection:bg-[#060F1E] selection:text-white">
                {sidebarOpen && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
                )}

                <aside className={`
                    fixed lg:static inset-y-0 left-0 z-30 w-[260px] bg-[#060F1E] text-slate-400
                    transition-transform duration-300 ease-in-out flex flex-col border-r border-white/5 shadow-2xl lg:shadow-none
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}>
                    <div className="h-24 flex items-center px-5 border-b border-white/5 relative overflow-hidden shrink-0">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-900/20 to-transparent pointer-events-none"></div>

                        <div className="relative z-10 flex items-center gap-3">
                            {!isSplashActive ? (
                                <motion.div
                                    layoutId="agu-logo"
                                    transition={{ type: "spring", stiffness: 100, damping: 18 }}
                                    className="bg-white p-1.5 rounded-xl shadow-lg flex items-center justify-center h-11 w-11 shrink-0 z-50"
                                >
                                    <img src="/agu-logo.png" alt="AGU Logo" className="w-full h-full object-contain" />
                                </motion.div>
                            ) : (
                                <div className="h-11 w-11 shrink-0 opacity-0" />
                            )}

                            <motion.div
                                className="flex flex-col justify-center mt-0.5"
                                animate={{ opacity: isSplashActive ? 0 : 1, x: isSplashActive ? -10 : 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <span className="text-[14px] font-bold text-white tracking-wide leading-tight">Smart Dormitory</span>
                                <span className="text-[12px] font-bold text-white tracking-wide leading-tight mb-1">Management System</span>
                                <div className="flex items-center">
                                    <span className="text-[9px] font-bold text-indigo-400 tracking-widest uppercase bg-indigo-500/10 px-1.5 py-0.5 rounded">Student Portal</span>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 custom-scrollbar">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname.includes(item.path);

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`
                                        w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all font-medium text-[15px]
                                        ${isActive ? 'bg-white/10 text-white shadow-inner border border-white/5' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}
                                    `}
                                >
                                    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-white" : "text-slate-500"} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-white/5 shrink-0">
                        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors border border-transparent hover:border-red-500/20">
                            <LogOut size={18} /> Çıkış Yap
                        </button>
                    </div>
                </aside>

                <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                    <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-slate-200/80 flex items-center justify-between px-6 lg:px-10 z-10 flex-shrink-0">
                        <div className="flex items-center gap-4">
                            <button className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl" onClick={() => setSidebarOpen(true)}>
                                <Menu size={20} />
                            </button>
                            <div className="hidden sm:flex items-center gap-2.5">
                                <GraduationCap size={24} className="text-[#060F1E]" />
                                <h2 className="text-xl font-bold text-slate-800 tracking-tight">Öğrenci Paneli</h2>
                            </div>
                        </div>

                        {/* Sağ Üst Alan: Zil tuşu ve ayırıcı çizgi tamamen kaldırıldı */}
                        <div className="flex items-center gap-4 lg:gap-6">
                            <div className="flex items-center gap-3 cursor-pointer group">
                                <div className="text-right hidden md:block">
                                    <p className="text-sm font-bold text-slate-800 leading-tight">Öğrenci Hesabı</p>
                                    <p className="text-xs font-semibold text-slate-500 mt-0.5">Aktif Kullanıcı</p>
                                </div>
                                <div className="w-11 h-11 bg-[#060F1E] rounded-xl shadow-md flex items-center justify-center text-white font-bold tracking-wider group-hover:scale-105 transition-transform border border-slate-700">
                                    CK
                                </div>
                            </div>
                        </div>
                    </header>

                    <div className="flex-1 overflow-y-auto p-4 lg:p-10">
                        <div className="max-w-7xl mx-auto">
                            <Outlet />
                        </div>
                    </div>
                </main>
            </div>
        </LayoutGroup>
    );
}