import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Home, Calendar, Wrench, ArrowRight, Users, Loader2, Sparkles, ChevronRight } from 'lucide-react';

export default function StudentDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const userId = localStorage.getItem('userId');

        if (!userId) {
            setError("Oturum bilgisi bulunamadı. Lütfen tekrar giriş yapın.");
            setLoading(false);
            return;
        }

        const fetchStudentData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/students/me/${userId}`);
                setData(response.data);
            } catch (err) {
                console.error("Veri çekme hatası:", err);
                setError("Bilgileriniz yüklenirken bir sorun oluştu.");
            } finally {
                setLoading(false);
            }
        };

        fetchStudentData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="animate-spin text-slate-800" size={32} />
                    <p className="text-slate-500 text-sm font-bold tracking-wide uppercase">Profiliniz Hazırlanıyor...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-md mx-auto my-12 bg-rose-50/50 border border-rose-100 p-8 rounded-3xl text-center shadow-sm">
                <p className="font-black text-rose-800 text-base">{error}</p>
                <Link to="/login" className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all shadow-sm">
                    Giriş Sayfasına Dön
                </Link>
            </div>
        );
    }

    const { profile, roommates } = data;
    const studentName = profile?.user?.firstName || "Öğrenci";
    const studentLastName = profile?.user?.lastName || "";
    const room = profile?.room;

    return (
        <div className="max-w-6xl mx-auto space-y-8 px-4 py-2 animate-in fade-in duration-500">

            {/* 1. ÜST BAR VE KARŞILAMA ALANI */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                        Hoş Geldin, {studentName} 👋
                    </h1>
                    <p className="text-slate-400 text-xs font-medium mt-0.5">SmartDorm konaklama durumun ve oda yönetim panelin.</p>
                </div>

                {/* ARTIK CIVIK MAVİ DEĞİL: Tamamen Koyu ve Elit Profil Kartı */}
                <div className="flex items-center gap-3.5 bg-white p-2 pr-5 rounded-2xl border border-slate-100 shadow-sm shadow-slate-100/50">
                    <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-sm">
                        {studentName[0]}{(studentLastName[0] || '')}
                    </div>
                    <div className="text-left">
                        <p className="text-xs font-bold text-slate-800 leading-none">{studentName} {studentLastName}</p>
                    </div>
                </div>
            </header>

            {/* ANA GRID YAPISI */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">

                {/* 2. ODA BİLGİLERİ KARTI */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between h-full">
                    <div>
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider">
                                <Home size={16} className="text-slate-700" /> Oda Bilgim
                            </div>
                            <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-full border ${
                                room ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                            }`}>
                                {room ? 'Yerleşti' : 'Atama Bekliyor'}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">BLOK</p>
                                <p className="text-base font-bold text-slate-800">{room?.block?.blockNumber || '-'}</p>
                            </div>
                            <div className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">ODA NO</p>
                                <p className="text-base font-bold text-slate-800">{room?.roomNumber || '-'}</p>
                            </div>
                            <div className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">KAT</p>
                                <p className="text-base font-bold text-slate-800">{room?.floorNumber || '-'}</p>
                            </div>
                            <div className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">BÖLÜM</p>
                                <p className="text-xs font-bold text-slate-800 truncate mt-1">{profile?.department || '-'}</p>
                            </div>
                        </div>
                    </div>

                    <Link to="/student/room-status" className="flex items-center justify-between px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-sm group">
                        Oda Detaylarını İncele <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform text-slate-400 group-hover:text-white" />
                    </Link>
                </div>

                {/* 3. ODA ARKADAŞI KARTTI */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col h-full">
                    <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider mb-5">
                        <Users size={16} className="text-emerald-500" /> Oda Arkadaşım
                    </div>

                    <div className="flex-1 flex flex-col justify-start space-y-3">
                        {roommates && roommates.length > 0 ? (
                            roommates.map((friend, index) => (
                                <div key={friend.id || index} className="w-full flex items-center gap-3.5 p-3.5 bg-slate-50/40 rounded-2xl border border-slate-100 hover:border-emerald-100 transition-colors group">
                                    <div className="w-10 h-10 bg-white border border-slate-200 text-slate-600 rounded-xl flex items-center justify-center font-bold text-xs uppercase shadow-sm group-hover:border-emerald-200 transition-colors">
                                        {friend.user?.firstName?.[0]}{friend.user?.lastName?.[0]}
                                    </div>
                                    <div className="text-left min-w-0 flex-1">
                                        <p className="font-bold text-slate-800 text-xs truncate">{friend.user?.firstName} {friend.user?.lastName}</p>
                                        <p className="text-[10px] text-slate-400 font-bold truncate uppercase tracking-tight mt-0.5">{friend.department || 'Bölüm Belirtilmemiş'}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
                                <div className="w-11 h-11 bg-slate-50 border border-slate-100 text-slate-300 rounded-full flex items-center justify-center mb-2.5">
                                    <Users size={18} />
                                </div>
                                <p className="text-slate-400 text-xs font-bold">Henüz bir oda arkadaşınız bulunmuyor.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 4. HIZLI KISAYOLLAR KARTTI */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col h-full">
                    <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider mb-5">
                        <Sparkles size={16} className="text-amber-500" /> Hızlı Kısayollar
                    </div>

                    <div className="space-y-3 flex-1 flex flex-col justify-start">
                        {/* İzin Talebi Butonu */}
                        <Link to="/student/leaves" className="flex items-center justify-between p-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl transition-all duration-200 shadow-sm group">
                            <div className="flex items-center gap-3.5 min-w-0">
                                <div className="bg-slate-800 border border-slate-700 p-2.5 rounded-xl text-slate-300 group-hover:text-white transition-all">
                                    <Calendar size={16} />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-bold text-white text-xs">İzin Talebi Oluştur</h4>
                                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">Yeni resmi izin başvurusu yap</p>
                                </div>
                            </div>
                            <ArrowRight size={14} className="text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                        </Link>

                        {/* Arıza Bildir Butonu */}
                        <Link to="/student/room-status" className="flex items-center justify-between p-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl transition-all duration-200 shadow-sm group">
                            <div className="flex items-center gap-3.5 min-w-0">
                                <div className="bg-slate-800 border border-slate-700 p-2.5 rounded-xl text-slate-300 group-hover:text-white transition-all">
                                    <Wrench size={16} />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-bold text-white text-xs">Arıza & Bakım Bildir</h4>
                                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">Teknik sorunları anında ilet</p>
                                </div>
                            </div>
                            <ArrowRight size={14} className="text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}