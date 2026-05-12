import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Home, Calendar, Wrench, ArrowRight, Clock, ShieldCheck, Users, Loader2 } from 'lucide-react';

export default function StudentDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Giriş yaparken Login.jsx içinde kaydettiğimiz userId'yi alıyoruz
        const userId = localStorage.getItem('userId');

        if (!userId) {
            setError("Oturum bilgisi bulunamadı. Lütfen tekrar giriş yapın.");
            setLoading(false);
            return;
        }

        const fetchStudentData = async () => {
            try {
                // Kendi oluşturduğumuz "/me/{userId}" ucuna istek atıyoruz
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
            <div className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="animate-spin text-indigo-600" size={40} />
                    <p className="text-gray-500 font-medium">Bilgileriniz hazırlanıyor...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-6 rounded-2xl text-center">
                <p className="font-bold">{error}</p>
                <Link to="/login" className="text-sm underline mt-2 inline-block">Giriş sayfasına dön</Link>
            </div>
        );
    }

    // Backend'den gelen verileri parçalıyoruz
    const { profile, roommates } = data;
    const studentName = profile.user.firstName;
    const room = profile.room;

    return (
        <div className="max-w-6xl mx-auto space-y-6">

            {/* 1. Karşılama Alanı */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-700 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-black mb-2">Hoş Geldin, {studentName} 👋</h1>
                    <p className="text-indigo-100 font-medium">SmartDorm'daki güncel durumun ve oda bilgilerin aşağıdadır.</p>
                </div>
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-white opacity-10 rounded-full blur-2xl"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* 2. Oda Bilgileri Kartı (Veritabanından Gelen) */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-indigo-600 font-bold">
                            <Home size={20} /> Oda Bilgim
                        </div>
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${room ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                            {room ? 'Yerleşti' : 'Atama Bekliyor'}
                        </span>
                    </div>

                    <div className="flex-1 grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <p className="text-[10px] text-gray-400 font-bold mb-1">BLOK</p>
                            <p className="text-xl font-black text-gray-800">{room?.block?.blockNumber || '-'}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <p className="text-[10px] text-gray-400 font-bold mb-1">ODA NO</p>
                            <p className="text-xl font-black text-gray-800">{room?.roomNumber || '-'}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <p className="text-[10px] text-gray-400 font-bold mb-1">KAT</p>
                            <p className="text-xl font-black text-gray-800">{room?.floorNumber || '-'}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <p className="text-[10px] text-gray-400 font-bold mb-1">BÖLÜM</p>
                            <p className="text-xs font-bold text-indigo-600 truncate">{profile.department || '-'}</p>
                        </div>
                    </div>

                    <Link to="/student/room-status" className="flex items-center justify-between px-4 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold transition-all group">
                        Oda Detayları <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* 3. Oda Arkadaşı Kartı (Veritabanından Dinamik Çekilen) */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
                    <div className="flex items-center gap-2 text-emerald-600 font-bold mb-4">
                        <Users size={20} /> Oda Arkadaşım
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3">
                        {roommates && roommates.length > 0 ? (
                            roommates.map((friend, index) => (
                                // key={friend.id} yerine key={friend.id || index} kullanıyoruz
                                <div key={friend.id || index} className="w-full flex items-center gap-3 p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                                    <div className="w-10 h-10 bg-emerald-200 rounded-full flex items-center justify-center font-bold text-emerald-700 uppercase">
                                        {friend.user?.firstName?.[0]}{friend.user?.lastName?.[0]}
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-gray-800">{friend.user?.firstName} {friend.user?.lastName}</p>
                                        <p className="text-[10px] text-emerald-600 font-bold uppercase">{friend.department}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-8">
                                <Users size={40} className="text-gray-200 mx-auto mb-2" />
                                <p className="text-gray-400 text-sm font-medium">Henüz bir oda arkadaşınız bulunmuyor.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 4. Hızlı İşlemler */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">Hızlı Kısayollar</h3>
                    <div className="space-y-3">
                        <Link to="/student/leaves" className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all group">
                            <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600"><Calendar size={20} /></div>
                            <div>
                                <h4 className="font-bold text-gray-800 text-sm">İzin Talebi</h4>
                                <p className="text-[10px] text-gray-500 font-medium">Yeni izin oluştur</p>
                            </div>
                        </Link>
                        <Link to="/student/room-status" className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all group">
                            <div className="bg-orange-50 p-3 rounded-xl text-orange-600"><Wrench size={20} /></div>
                            <div>
                                <h4 className="font-bold text-gray-800 text-sm">Arıza Bildir</h4>
                                <p className="text-[10px] text-gray-500 font-medium">Yöneticiye ilet</p>
                            </div>
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}