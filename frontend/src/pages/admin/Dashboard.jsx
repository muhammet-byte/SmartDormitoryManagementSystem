import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Users, Home, Calendar, ChevronRight, LayoutDashboard, CalendarDays, Wrench
} from 'lucide-react';

export default function AdminDashboard() {
    // Dinamik Durum (State) Yönetimi
    const [stats, setStats] = useState({
        registeredStudents: 0,
        occupancyRate: 0,
        pendingMaintenance: 0,
        pendingLeaves: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Sayfa açıldığında Backend'den güncel verileri çeken hook
    useEffect(() => {
        axios.get('http://localhost:8080/api/admin/stats')
            .then(response => {
                setStats(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Dashboard verileri çekilemedi:", err);
                setError("Sistem özet verileri yüklenirken bir bağlantı hatası oluştu.");
                setLoading(false);
            });
    }, []);

    // Kartların elit renk ve tasarım stilleri
    const cardStyles = {
        students: { bg: 'bg-slate-50', text: 'text-slate-700' },
        occupancy: { bg: 'bg-slate-50', text: 'text-slate-700' },
        maintenance: {
            bg: stats.pendingMaintenance > 0 ? 'bg-rose-50/60' : 'bg-slate-50',
            text: stats.pendingMaintenance > 0 ? 'text-rose-600' : 'text-slate-400',
            line: stats.pendingMaintenance > 0 ? 'border-l-rose-500' : 'border-l-transparent'
        },
        leaves: {
            bg: stats.pendingLeaves > 0 ? 'bg-amber-50/60' : 'bg-slate-50',
            text: stats.pendingLeaves > 0 ? 'text-amber-600' : 'text-slate-400',
            line: stats.pendingLeaves > 0 ? 'border-l-amber-500' : 'border-l-transparent'
        }
    };

    const formattedDate = "17 Mayıs 2026 Pazar";

    // Yüklenme Durumu Ekranı
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <p className="text-sm font-bold text-slate-400 animate-pulse">Sistem verileri veritabanından anlık taranıyor...</p>
            </div>
        );
    }

    // Hata Durumu Ekranı
    if (error) {
        return (
            <div className="text-center py-20 bg-rose-50/30 border border-rose-100 rounded-3xl max-w-2xl mx-auto">
                <p className="text-sm font-bold text-rose-500">{error}</p>
                <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl shadow-sm">Yeniden Dene</button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-10 px-4 py-2 animate-in fade-in duration-500">

            {/* --- ÜST BAR --- */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                        Sistem Özeti
                    </h1>
                    <p className="text-slate-400 text-xs font-medium mt-0.5">
                        SmartDorm yurt yönetim panelinin güncel durumu ve sistem verileri.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 shadow-sm">
                        <CalendarDays size={14} className="text-slate-400" />
                        {formattedDate}
                    </div>

                    <div className="flex items-center gap-3 bg-white p-2 pr-4 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="w-9 h-9 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xs shadow-sm">
                            AD
                        </div>
                        <div className="text-left">
                            <p className="text-xs font-bold text-slate-800 leading-none">Admin Kullanıcısı</p>
                            <p className="text-[10px] font-semibold text-slate-400 tracking-tight mt-1">Sistem Yöneticisi</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* --- İSTATİSTİK KARTLARI --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">

                {/* Kayıtlı Öğrenci Kartı */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
                    <div className="flex justify-between items-start mb-4">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Kayıtlı Öğrenci</p>
                            <h3 className="text-3xl font-black text-slate-900">{stats.registeredStudents}</h3>
                        </div>
                        <div className={`w-10 h-10 ${cardStyles.students.bg} ${cardStyles.students.text} rounded-xl flex items-center justify-center border border-slate-200/50 shadow-sm`}>
                            <Users size={18} />
                        </div>
                    </div>
                    <div className="pt-2 border-t border-slate-50">
                        <span className="text-[11px] font-medium text-slate-400">Aktif barınan toplam öğrenci</span>
                    </div>
                </div>

                {/* Doluluk Oranı Kartı */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
                    <div className="flex justify-between items-start mb-4">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Doluluk Oranı</p>
                            <h3 className="text-3xl font-black text-slate-900">%{stats.occupancyRate}</h3>
                        </div>
                        <div className={`w-10 h-10 ${cardStyles.occupancy.bg} ${cardStyles.occupancy.text} rounded-xl flex items-center justify-center border border-slate-200/50 shadow-sm`}>
                            <Home size={18} />
                        </div>
                    </div>
                    <div className="pt-2 border-t border-slate-50">
                        <span className="text-[11px] font-medium text-slate-400">Yatak kapasitesi kullanım oranı</span>
                    </div>
                </div>

                {/* Bekleyen Arıza Kartı */}
                <div className={`bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between transition-all hover:shadow-md border-l-4 ${cardStyles.maintenance.line}`}>
                    <div className="flex justify-between items-start mb-4">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Bekleyen Arıza</p>
                            <h3 className={`text-3xl font-black ${stats.pendingMaintenance > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                                {stats.pendingMaintenance}
                            </h3>
                        </div>
                        <div className={`w-10 h-10 ${cardStyles.maintenance.bg} ${cardStyles.maintenance.text} rounded-xl flex items-center justify-center border border-slate-200/50 shadow-sm`}>
                            <Wrench size={18} />
                        </div>
                    </div>
                    <Link to="/admin/maintenance" className="pt-2 border-t border-slate-50 flex items-center justify-between text-[11px] font-bold text-slate-500 hover:text-slate-900 transition-colors group">
                        Talepleri İncele <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>

                {/* Bekleyen İzin Kartı */}
                <div className={`bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between transition-all hover:shadow-md border-l-4 ${cardStyles.leaves.line}`}>
                    <div className="flex justify-between items-start mb-4">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Bekleyen İzin</p>
                            <h3 className={`text-3xl font-black ${stats.pendingLeaves > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
                                {stats.pendingLeaves}
                            </h3>
                        </div>
                        <div className={`w-10 h-10 ${cardStyles.leaves.bg} ${cardStyles.leaves.text} rounded-xl flex items-center justify-center border border-slate-200/50 shadow-sm`}>
                            <Calendar size={18} />
                        </div>
                    </div>
                    <Link to="/admin/leaves" className="pt-2 border-t border-slate-50 flex items-center justify-between text-[11px] font-bold text-slate-500 hover:text-slate-900 transition-colors group">
                        Onay Bekleyenleri Gör <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>

            </div>

            {/* --- ALT ALAN --- */}
            <div className="bg-slate-50/50 border border-slate-200 border-dashed rounded-[32px] py-16 text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-300 mb-3 border border-slate-100 shadow-sm">
                   <LayoutDashboard size={20} />
                </div>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-wider">Son Aktivite ve Canlı Akış</p>
                <p className="text-slate-400 text-xs mt-1 max-w-xs mx-auto">Yurttan anlık arıza bildirimleri ve izin talepleri düştükçe burada gerçek zamanlı listelenecektir.</p>
            </div>

        </div>
    );
}