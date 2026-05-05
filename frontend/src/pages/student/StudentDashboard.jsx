import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Calendar, Wrench, ArrowRight, Clock, ShieldCheck, Users } from 'lucide-react';

export default function StudentDashboard() {
    // İleride bu veriler backend API'sinden (örneğin /api/students/me) gerçek olarak gelecek
    const studentData = {
        firstName: 'Caner',
        remainingLeaveDays: 60,
        room: {
            block: 2,
            floor: 1,
            apartment: 2,
            roomNumber: 5
        },
        activeIssues: 1,
        pendingLeaves: 0
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">

            {/* 1. Karşılama ve Özet (Hero Section) */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-700 rounded-3xl p-8 text-white shadow-lg shadow-indigo-200 relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black mb-2">Hoş Geldin, {studentData.firstName} 👋</h1>
                        <p className="text-indigo-100 font-medium">SmartDorm öğrenci paneline hoş geldin. İşte bugünkü güncel durumun:</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white/20 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 text-center">
                            <p className="text-xs font-bold uppercase tracking-wider text-indigo-100 mb-1">Kalan İzin</p>
                            <p className="text-3xl font-black">{studentData.remainingLeaveDays} <span className="text-lg font-medium opacity-80">Gün</span></p>
                        </div>
                    </div>
                </div>
                {/* Dekoratif Arka Plan Çemberleri */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-white opacity-10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-400 opacity-20 rounded-full blur-2xl"></div>
            </div>

            {/* 2. Ana İstatistikler ve Durum Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Oda Özeti Kartı */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-indigo-600 font-bold">
                            <Home size={20} /> Oda Bilgim
                        </div>
                        <span className="px-2.5 py-1 text-xs font-bold bg-emerald-100 text-emerald-700 rounded-full flex items-center gap-1">
                            <ShieldCheck size={14} /> Aktif
                        </span>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <p className="text-xs text-gray-400 font-bold mb-1">BLOK</p>
                            <p className="text-xl font-black text-gray-800">{studentData.room.block}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <p className="text-xs text-gray-400 font-bold mb-1">KAT</p>
                            <p className="text-xl font-black text-gray-800">{studentData.room.floor}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <p className="text-xs text-gray-400 font-bold mb-1">DAİRE</p>
                            <p className="text-xl font-black text-gray-800">{studentData.room.apartment}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <p className="text-xs text-gray-400 font-bold mb-1">ODA</p>
                            <p className="text-xl font-black text-gray-800">{studentData.room.roomNumber}</p>
                        </div>
                    </div>
                    {/* İleride Oda Durumu (RoomStatus.jsx) sayfasına yönlendirecek */}
                    <Link to="/student/room-status" className="mt-auto flex items-center justify-between px-4 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold transition-colors group">
                        Oda Detayları ve Şikayetler <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* İzinler Özeti Kartı */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
                    <div className="flex items-center gap-2 text-rose-500 font-bold mb-6">
                        <Calendar size={20} /> İzin Durumum
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 mb-6">
                        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-2">
                            <Clock size={32} />
                        </div>
                        {studentData.pendingLeaves > 0 ? (
                            <p className="text-gray-600 font-medium"><span className="font-bold text-gray-800">{studentData.pendingLeaves}</span> adet izin talebiniz yönetici onayı bekliyor.</p>
                        ) : (
                            <p className="text-gray-500 font-medium">Şu anda onay bekleyen veya aktif bir izin talebiniz bulunmamaktadır.</p>
                        )}
                    </div>
                    {/* İleride İzinler (LeaveOperations.jsx) sayfasına yönlendirecek */}
                    <Link to="/student/leaves" className="mt-auto flex items-center justify-between px-4 py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold transition-colors group">
                        İzin Talebi Oluştur <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Hızlı Kısayollar Kartı */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
                    <div className="flex items-center gap-2 text-gray-800 font-bold mb-6">
                        <Wrench size={20} /> Hızlı İşlemler
                    </div>
                    <div className="flex-1 space-y-3">
                        <Link to="/student/room-search" className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all group">
                            <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600 group-hover:scale-110 transition-transform"><Users size={20} /></div>
                            <div>
                                <h4 className="font-bold text-gray-800">Oda Arkadaşı Bul</h4>
                                <p className="text-xs text-gray-500 font-medium">Yapay zeka ile eşleş</p>
                            </div>
                        </Link>
                        <Link to="/student/room-status" className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all group">
                            <div className="bg-orange-50 p-3 rounded-xl text-orange-600 group-hover:scale-110 transition-transform"><Wrench size={20} /></div>
                            <div>
                                <h4 className="font-bold text-gray-800">Arıza Bildir</h4>
                                <p className="text-xs text-gray-500 font-medium">Oda içi teknik destek al</p>
                            </div>
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}