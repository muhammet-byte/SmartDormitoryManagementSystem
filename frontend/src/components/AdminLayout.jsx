import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Users, Map as MapIcon, DollarSign,
    Wrench, CalendarDays, Home, LogOut, Menu, Bell, ArrowRightLeft
} from 'lucide-react';

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation(); // Hangi sayfada olduğumuzu anlar

    const menuItems = [
        { path: '/admin/dashboard', label: 'Kontrol Paneli', icon: LayoutDashboard },
        { path: '/admin/students', label: 'Öğrenciler', icon: Users },
        { path: '/admin/map', label: 'Yerleşke Planı', icon: MapIcon },
        { path: '/admin/payments', label: 'Ödemeler', icon: DollarSign },
        { path: '/admin/maintenance', label: 'Bakım Talepleri', icon: Wrench },
        { path: '/admin/leaves', label: 'İzin Talepleri', icon: CalendarDays },
        { path: '/admin/room-changes', label: 'Oda Değişiklikleri', icon: ArrowRightLeft }, // YENİ EKLENEN MENÜ BUTONU
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
                            <Home size={20} className="text-white" />
                        </div>
                        <span className="text-xl font-black text-white tracking-tight">SmartDorm</span>
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

                {/* Üst Menü (Header) */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-6 lg:px-8 z-10 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <button className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-xl" onClick={() => setSidebarOpen(true)}>
                            <Menu size={20} />
                        </button>
                        <div className="hidden sm:block">
                            <h2 className="text-xl font-black text-gray-800 tracking-tight">Yönetici Paneli</h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="w-px h-8 bg-gray-200 hidden sm:block"></div>
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-md flex items-center justify-center text-white font-bold border border-indigo-400">
                            AD
                        </div>
                    </div>
                </header>

                {/* Dinamik Sayfa İçeriği Buraya Gelecek */}
                <div className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <div className="max-w-6xl mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
}