import React, { useState, useEffect } from 'react';
import { Wrench, AlertTriangle, CheckCircle, Clock, Info, BedDouble, Loader2 } from 'lucide-react';
import { createMaintenanceRequest, getStudentMaintenanceRequests } from '../../services/maintenanceService';
import { getAllStudents } from '../../services/studentService'; // 🌟 YENİ EKLENDİ

export default function RoomStatus() {
    const [complaintType, setComplaintType] = useState('REPAIR');
    const [description, setDescription] = useState('');
    const [pastRequests, setPastRequests] = useState([]);

    // 🌟 Odayı ve yatağı tutacağımız yeni State'ler
    const [myRoom, setMyRoom] = useState(null);
    const [myBedNumber, setMyBedNumber] = useState(null);
    const [loading, setLoading] = useState(true);

    // Sayfa açıldığında hem geçmiş talepleri hem de güncel oda bilgisini çeker
    const loadData = async () => {
        const currentUserId = localStorage.getItem('userId');
        if (!currentUserId) return;

        try {
            // 1. Geçmiş Talepleri Çek
            const historyData = await getStudentMaintenanceRequests(currentUserId);
            setPastRequests(historyData.reverse());

            // 2. Güncel Oda Bilgisini Bul (SİHİRLİ KISIM)
            const allStudents = await getAllStudents();
            // Öğrencinin kendi profilini buluyoruz
            const me = allStudents.find(s => Number(s.user?.id) === Number(currentUserId) || Number(s.id) === Number(currentUserId));

            if (me && me.room) {
                setMyRoom(me.room);
                setMyBedNumber(me.bedNumber);
            }
        } catch (error) {
            console.error("Veriler yüklenemedi", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const currentUserId = localStorage.getItem('userId');

        if (!myRoom) {
            alert("Hata: Henüz bir odaya yerleştirilmemişsiniz! Lütfen yöneticiyle iletişime geçin veya oda değişikliği talebinde bulunun.");
            return;
        }

        const payload = { type: complaintType, description, userId: currentUserId, roomId: myRoom.id };

        try {
            await createMaintenanceRequest(payload);
            alert(`Talebiniz başarıyla iletildi!`);
            setDescription('');
            loadData(); // Listeyi anında güncelle
        } catch (error) {
            const backendError = error.response?.data || error.message;
            alert("TALEBİNİZ İLETİLEMEDİ!\n\nHata Detayı: " + backendError);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center py-20"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;
    }

    return (
        <div className="space-y-6">

            {/* 🌟 2D ODA KROKİSİ 🌟 */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <BedDouble className="text-indigo-500" /> Odamın 2D Görünümü
                    </h2>
                    {myRoom && (
                        <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg font-black text-sm border border-indigo-100">
                            {myRoom.block?.blockNumber}. Blok - {myRoom.roomNumber}
                        </span>
                    )}
                </div>

                {myRoom ? (
                    <div className="relative w-full max-w-lg mx-auto h-72 bg-slate-50 border-[10px] border-slate-600 rounded-xl shadow-inner overflow-hidden">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-3 bg-sky-300 rounded-b-md shadow-[0_0_15px_rgba(125,211,252,0.6)]" title="Pencere"></div>
                        <div className="absolute bottom-0 right-6 w-20 h-3 bg-amber-600 rounded-t-md" title="Oda Kapısı"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-40 bg-rose-100 border-2 border-rose-200 rounded-lg opacity-60 bg-[radial-gradient(#fecdd3_2px,transparent_2px)] [background-size:8px_8px]"></div>

                        {/* YATAK 1 */}
                        <div className={`absolute top-10 left-4 w-20 h-40 border-2 rounded-lg shadow-sm flex flex-col transition-all ${myBedNumber === 1 ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-200' : 'bg-white border-gray-300'}`}>
                            <div className={`h-10 border-b-2 rounded-t-md flex items-center justify-center ${myBedNumber === 1 ? 'bg-indigo-200 border-indigo-400' : 'bg-gray-200 border-gray-300'}`}>
                                <span className="text-[10px] font-bold text-gray-500">Yastık</span>
                            </div>
                            <div className="flex-1 flex items-center justify-center relative">
                                <span className={`text-xs font-black -rotate-90 whitespace-nowrap ${myBedNumber === 1 ? 'text-indigo-600' : 'text-gray-400'}`}>YATAK 1</span>
                                {myBedNumber === 1 && <span className="absolute bottom-2 text-[10px] font-bold bg-indigo-500 text-white px-2 py-0.5 rounded-full">Sen</span>}
                            </div>
                        </div>

                        {/* YATAK 2 */}
                        <div className={`absolute top-10 right-4 w-20 h-40 border-2 rounded-lg shadow-sm flex flex-col transition-all ${myBedNumber === 2 ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-200' : 'bg-white border-gray-300'}`}>
                            <div className={`h-10 border-b-2 rounded-t-md flex items-center justify-center ${myBedNumber === 2 ? 'bg-emerald-200 border-emerald-400' : 'bg-gray-200 border-gray-300'}`}>
                                <span className="text-[10px] font-bold text-gray-500">Yastık</span>
                            </div>
                            <div className="flex-1 flex items-center justify-center relative">
                                <span className={`text-xs font-black -rotate-90 whitespace-nowrap ${myBedNumber === 2 ? 'text-emerald-600' : 'text-gray-400'}`}>YATAK 2</span>
                                {myBedNumber === 2 && <span className="absolute bottom-2 text-[10px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full">Sen</span>}
                            </div>
                        </div>

                        <div className="absolute bottom-8 left-4 w-20 h-12 bg-amber-100 border-2 border-amber-300 rounded-md flex flex-col items-center justify-center shadow-sm">
                            <span className="text-[9px] font-bold text-amber-700">Masa 1</span>
                            <div className="w-6 h-1 bg-gray-400 mt-1 rounded-full"></div>
                        </div>
                        <div className="absolute bottom-8 right-[100px] w-20 h-12 bg-amber-100 border-2 border-amber-300 rounded-md flex flex-col items-center justify-center shadow-sm">
                            <span className="text-[9px] font-bold text-amber-700">Masa 2</span>
                            <div className="w-6 h-1 bg-gray-400 mt-1 rounded-full"></div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <BedDouble className="mx-auto text-gray-300 mb-3" size={48} />
                        <p className="text-gray-500 font-bold">Henüz bir odaya yerleştirilmemişsiniz.</p>
                    </div>
                )}
            </div>

            {/* 🛠️ ARIZA BİLDİRİM FORMU 🛠️ */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Wrench className="text-indigo-500" /> Arıza & Şikayet Bildirimi
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-4">
                        <button type="button" onClick={() => setComplaintType('REPAIR')} className={`flex-1 p-3 rounded-xl border-2 font-bold transition-all ${complaintType === 'REPAIR' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-100 text-gray-500 hover:border-indigo-200'}`}>🛠️ Teknik Arıza</button>
                        <button type="button" onClick={() => setComplaintType('COMPLAINT')} className={`flex-1 p-3 rounded-xl border-2 font-bold transition-all ${complaintType === 'COMPLAINT' ? 'border-rose-500 bg-rose-50 text-rose-700' : 'border-gray-100 text-gray-500 hover:border-rose-200'}`}>⚠️ Oda Şikayeti</button>
                    </div>
                    <div>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows="3" placeholder="Lütfen sorunu detaylıca açıklayın..." className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"></textarea>
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-indigo-200 disabled:opacity-50" disabled={!myRoom}>Talebi İlet</button>
                </form>
            </div>

            {/* 📋 GEÇMİŞ TALEPLERİM 📋 */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Info className="text-indigo-500" /> Geçmiş Taleplerim
                </h2>

                <div className="space-y-3">
                    {pastRequests.length > 0 ? (
                        pastRequests.map((req) => (
                            <div key={req.id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50 flex items-start justify-between gap-4">
                                <div className="flex gap-3 items-start">
                                    <div className={`p-2 rounded-lg mt-1 ${req.type === 'COMPLAINT' ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                        {req.type === 'COMPLAINT' ? <AlertTriangle size={18} /> : <Wrench size={18} />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">{req.type === 'COMPLAINT' ? 'Oda Şikayeti' : 'Teknik Arıza'}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{req.description}</p>
                                        <p className="text-[10px] text-gray-400 mt-2 font-medium">{new Date(req.createdAt).toLocaleDateString('tr-TR')} tarihinde iletildi</p>
                                    </div>
                                </div>

                                <div className="shrink-0">
                                    {req.status === 'COMPLETED' ? (
                                        <span className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1">
                                            <CheckCircle size={14} /> Çözüldü
                                        </span>
                                    ) : req.status === 'IN_PROGRESS' ? (
                                        <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1">
                                            <Wrench size={14} /> İşlemde
                                        </span>
                                    ) : (
                                        <span className="bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1">
                                            <Clock size={14} /> Bekliyor
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">Henüz bir talebiniz bulunmuyor.</p>
                    )}
                </div>
            </div>

        </div>
    );
}