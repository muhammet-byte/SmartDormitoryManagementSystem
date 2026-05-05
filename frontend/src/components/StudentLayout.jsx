import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Search as SearchIcon, LogOut, Menu, Bell, User, BedDouble, Calendar } from 'lucide-react';

export default function StudentLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    const menuItems = [
        { path: '/student/dashboard', label: 'Ana Sayfa', icon: Home },
        { path: '/student/room-status', label: 'Oda Durumu', icon: BedDouble },
        { path: '/student/leaves', label: 'İzin İşlemleri', icon: Calendar },
        { path: '/student/room-search', label: 'Akıllı Oda Arama', icon: SearchIcon },
    ];

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden selection:bg-indigo-100">

            {/* Mobil Karartma */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sol Menü (Sidebar) */}
            <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-slate-900 text-slate-300 
        transition-transform duration-300 ease-in-out flex flex-col border-r border-slate-800
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                <div className="h-20 flex items-center justify-between px-6 bg-slate-950 border-b border-slate-800/50">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-500 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
                            <User size={20} className="text-white" />
                        </div>
                        <span className="text-xl font-black text-white tracking-tight">Öğrenci Paneli</span>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname.includes(item.path);

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm
                  ${isActive
                                        ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                                    }
                `}
                            >
                                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-rose-400 hover:bg-rose-500/10 transition-colors">
                        <LogOut size={18} /> Çıkış Yap
                    </button>
                </div>
            </aside>

            {/* Ana İçerik Alanı */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-6 lg:px-8 z-10 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <button className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-xl" onClick={() => setSidebarOpen(true)}>
                            <Menu size={20} />
                        </button>
                        <div className="hidden sm:block">
                            <h2 className="text-xl font-black text-gray-800 tracking-tight">SmartDorm</h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors">
                            <Bell size={20} />
                        </button>
                        <div className="w-px h-8 bg-gray-200 hidden sm:block"></div>
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md flex items-center justify-center text-white font-bold border border-indigo-400">
                            CK
                        </div>
                    </div>
                </header>

                {/* Dinamik Sayfa İçeriği */}
                <div className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}