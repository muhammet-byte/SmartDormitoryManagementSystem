import React, { useState, useEffect } from 'react';
import { Wrench, AlertTriangle, CheckCircle, Clock, Info, BedDouble, Loader2, Send } from 'lucide-react';
import { createMaintenanceRequest, getStudentMaintenanceRequests } from '../../services/maintenanceService';
import { getAllStudents } from '../../services/studentService';

export default function RoomStatus() {
    const [complaintType, setComplaintType] = useState('REPAIR');
    const [description, setDescription] = useState('');
    const [pastRequests, setPastRequests] = useState([]);

    const [myRoom, setMyRoom] = useState(null);
    const [myBedNumber, setMyBedNumber] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        const currentUserId = localStorage.getItem('userId');
        if (!currentUserId) return;

        try {
            // 1. Geçmiş Talepleri Çek
            const historyData = await getStudentMaintenanceRequests(currentUserId);
            setPastRequests(historyData.reverse());

            // 2. Güncel Oda Bilgisini Bul
            const allStudents = await getAllStudents();
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
            alert("Hata: Henüz bir odaya yerleştirilmemişsiniz! Lütfen yöneticiyle iletişime geçin.");
            return;
        }

        const payload = { type: complaintType, description, userId: currentUserId, roomId: myRoom.id };

        try {
            await createMaintenanceRequest(payload);
            alert(`Talebiniz başarıyla iletildi!`);
            setDescription('');
            loadData();
        } catch (error) {
            const backendError = error.response?.data || error.message;
            alert("TALEBİNİZ İLETİLEMEDİ!\n\nHata Detayı: " + backendError);
        }
    };

    const getStatusDetails = (status) => {
        switch (status) {
            case 'COMPLETED':
                return {
                    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    line: 'border-l-emerald-500',
                    icon: <CheckCircle size={12} className="text-emerald-600" />,
                    text: 'Çözüldü'
                };
            case 'IN_PROGRESS':
                return {
                    bg: 'bg-blue-50 text-blue-700 border-blue-200',
                    line: 'border-l-blue-500',
                    icon: <Wrench size={12} className="text-blue-600" />,
                    text: 'İşlemde'
                };
            default:
                return {
                    bg: 'bg-amber-50 text-amber-700 border-amber-200',
                    line: 'border-l-amber-500',
                    icon: <Clock size={12} className="text-amber-600" />,
                    text: 'Beklemede'
                };
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="animate-spin text-indigo-600" size={32} />
                    <p className="text-slate-500 text-sm font-bold tracking-wide uppercase">Veriler Yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-10 px-4 py-2 animate-in fade-in duration-500">

            {/* --- 1. ANA BAŞLIK (Tamamen Kurumsal ve Profesyonel Yazım) --- */}
            <div className="space-y-1">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    Oda Durumu ve Destek <Wrench className="text-indigo-500" size={24} />
                </h1>
                <p className="text-slate-400 text-xs font-medium">
                    Mevcut odanızın yerleşim planını görebilir, arıza veya şikayet bildirimlerinizi iletebilirsiniz.
                </p>
            </div>

            {/* --- 2. 2D KROKİ ALANI --- */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm shadow-slate-100/40 space-y-6">
                <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                    <span className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                        <BedDouble size={14} className="text-indigo-500" /> Odamın Yerleşim Planı (2D)
                    </span>
                    {myRoom && (
                        <span className="text-xs font-bold text-slate-400 bg-slate-50 border border-slate-100 px-3 py-1 rounded-xl">
                            {myRoom.block?.blockNumber}. Blok — Oda {myRoom.roomNumber}
                        </span>
                    )}
                </div>

                {myRoom ? (
                    <div className="relative w-full max-w-xl mx-auto h-72 bg-slate-50 border-[8px] border-slate-700 rounded-2xl shadow-inner overflow-hidden">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-2 bg-sky-200 rounded-b-md shadow-[0_0_12px_rgba(125,211,252,0.5)]"></div>
                        <div className="absolute bottom-0 right-8 w-24 h-2 bg-amber-700 rounded-t-md"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-44 bg-rose-50 border border-rose-100/70 rounded-xl opacity-60 bg-[radial-gradient(#fecdd3_1.5px,transparent_1.5px)] [background-size:8px_8px]"></div>

                        {/* YATAK 1 */}
                        <div className={`absolute top-8 left-6 w-24 h-40 border rounded-xl shadow-sm flex flex-col transition-all ${
                            myBedNumber === 1 ? 'bg-indigo-50/60 border-indigo-400 ring-4 ring-indigo-50' : 'bg-white border-slate-200'
                        }`}>
                            <div className={`h-9 border-b rounded-t-xl flex items-center justify-center ${myBedNumber === 1 ? 'bg-indigo-100/80 border-indigo-300' : 'bg-slate-100 border-slate-200'}`}>
                                <span className="text-[10px] font-semibold text-slate-500">Yastık</span>
                            </div>
                            <div className="flex-1 flex flex-col items-center justify-center relative gap-1">
                                <span className={`text-xs font-bold ${myBedNumber === 1 ? 'text-indigo-600' : 'text-slate-400'}`}>Yatak 1</span>
                                {myBedNumber === 1 && <span className="text-[9px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-full shadow-sm">Sizin</span>}
                            </div>
                        </div>

                        {/* YATAK 2 */}
                        <div className={`absolute top-8 right-6 w-24 h-40 border rounded-xl shadow-sm flex flex-col transition-all ${
                            myBedNumber === 2 ? 'bg-emerald-50/60 border-emerald-400 ring-4 ring-emerald-50' : 'bg-white border-slate-200'
                        }`}>
                            <div className={`h-9 border-b rounded-t-xl flex items-center justify-center ${myBedNumber === 2 ? 'bg-emerald-100/80 border-emerald-300' : 'bg-slate-100 border-slate-200'}`}>
                                <span className="text-[10px] font-semibold text-slate-500">Yastık</span>
                            </div>
                            <div className="flex-1 flex flex-col items-center justify-center relative gap-1">
                                <span className={`text-xs font-bold ${myBedNumber === 2 ? 'text-emerald-600' : 'text-slate-400'}`}>Yatak 2</span>
                                {myBedNumber === 2 && <span className="text-[9px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full shadow-sm">Sizin</span>}
                            </div>
                        </div>

                        {/* MASALAR */}
                        <div className="absolute bottom-6 left-6 w-24 h-12 bg-amber-50 border border-amber-200 rounded-xl flex flex-col items-center justify-center shadow-sm">
                            <span className="text-[10px] font-bold text-amber-800/80">Çalışma Masası 1</span>
                        </div>
                        <div className="absolute bottom-6 right-[148px] w-24 h-12 bg-amber-50 border border-amber-200 rounded-xl flex flex-col items-center justify-center shadow-sm">
                            <span className="text-[10px] font-bold text-amber-800/80">Çalışma Masası 2</span>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center">
                        <BedDouble className="text-slate-300 mb-3" size={40} />
                        <p className="text-slate-500 font-medium text-sm">Henüz aktif bir odaya yerleştirilmemişsiniz.</p>
                    </div>
                )}
            </div>

            {/* --- 3. İKİLİ KOLON DÜZENİ --- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* SOL TARAF: FORM KARTI */}
                <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm shadow-slate-100/40 space-y-5">
                    <span className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                        <Wrench size={14} className="text-indigo-500" /> Yeni Talep Oluştur
                    </span>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Tip Seçim Butonları */}
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setComplaintType('REPAIR')}
                                className={`flex-1 py-3 px-4 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                                    complaintType === 'REPAIR'
                                        ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700 shadow-sm'
                                        : 'border-slate-200 text-slate-400 hover:border-slate-300 bg-white'
                                }`}
                            >
                                Teknik Arıza
                            </button>
                            <button
                                type="button"
                                onClick={() => setComplaintType('COMPLAINT')}
                                className={`flex-1 py-3 px-4 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                                    complaintType === 'COMPLAINT'
                                        ? 'border-rose-500 bg-rose-50/50 text-rose-700 shadow-sm'
                                        : 'border-slate-200 text-slate-400 hover:border-slate-300 bg-white'
                                }`}
                            >
                                Oda Şikayeti
                            </button>
                        </div>

                        {/* Açıklama Giriş Alanı */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase ml-0.5">Sorun Açıklaması</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                rows="4"
                                placeholder="Lütfen sorunu detaylıca açıklayın..."
                                className="w-full bg-slate-50/60 border border-slate-100 rounded-2xl px-4 py-3 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none placeholder:text-slate-400 leading-relaxed"
                            />
                        </div>

                        {/* PREMIUM KOYU BUTON */}
                        <button
                            type="submit"
                            disabled={!myRoom}
                            className="w-full bg-slate-900 text-white font-black text-xs uppercase tracking-widest py-3.5 rounded-2xl hover:bg-indigo-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm shadow-slate-900/10 active:scale-[0.99] disabled:opacity-40"
                        >
                            <Send size={14} /> Talebi İlet
                        </button>
                    </form>
                </div>

                {/* SAĞ TARAF: GEÇMİŞ TALEPLER LİSTESİ */}
                <div className="lg:col-span-7 space-y-4">
                    <div className="flex justify-between items-center px-1">
                        <span className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                            <Info size={14} className="text-emerald-500" /> Talep Geçmişi
                        </span>
                        <span className="text-[10px] font-bold text-slate-300 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                            Toplam {pastRequests.length} Kayıt
                        </span>
                    </div>

                    <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1 custom-scrollbar">
                        {pastRequests.length > 0 ? (
                            pastRequests.map((req) => {
                                const status = getStatusDetails(req.status);
                                return (
                                    <div
                                        key={req.id}
                                        className={`bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 ${status.line} hover:shadow-md transition-all duration-200`}
                                    >
                                        <div className="flex gap-3.5 items-start min-w-0 flex-1">
                                            <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 border ${
                                                req.type === 'COMPLAINT' ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-indigo-50 border-indigo-100 text-indigo-600'
                                            }`}>
                                                {req.type === 'COMPLAINT' ? <AlertTriangle size={14} /> : <Wrench size={14} />}
                                            </div>
                                            <div className="min-w-0 space-y-1">
                                                <p className="font-bold text-slate-900 text-xs">
                                                    {req.type === 'COMPLAINT' ? 'Oda Şikayeti' : 'Teknik Arıza'}
                                                </p>
                                                <p className="text-slate-500 text-xs font-bold leading-relaxed break-words">
                                                    {req.description}
                                                </p>
                                                <p className="text-[10px] text-slate-400 font-semibold pt-0.5">
                                                    {new Date(req.createdAt).toLocaleDateString('tr-TR')} tarihinde oluşturuldu
                                                </p>
                                            </div>
                                        </div>

                                        <div className="shrink-0 pt-1 sm:pt-0">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase border ${status.bg}`}>
                                                {status.icon}
                                                {status.text}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="bg-slate-50/20 border-2 border-dashed border-slate-100 rounded-[32px] py-16 text-center flex flex-col items-center justify-center">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-200 mb-3 shadow-sm border border-slate-50">
                                   <Info size={22} />
                                </div>
                                <p className="text-slate-400 font-black text-xs uppercase tracking-tight">Henüz bir talebiniz bulunmuyor</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}