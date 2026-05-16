import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, CheckCircle, Clock, Check, X, Loader2, Home } from 'lucide-react';
import { getAllRoomChangeRequests, approveRoomChangeRequest, rejectRoomChangeRequest } from '../../services/roomChangeService';

export default function RoomChangeRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const data = await getAllRoomChangeRequests();
            setRequests(data.reverse()); // En yeni talepler en üstte listelenir
        } catch (error) {
            console.error("Talepler yüklenemedi", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    // Onaylama İşlemi
    const handleApprove = async (id) => {
        if (window.confirm("Bu öğrencinin oda değişikliği talebini onaylıyor musunuz?")) {
            try {
                await approveRoomChangeRequest(id);
                alert("Oda değişikliği başarıyla onaylandı!");
                fetchRequests();
            } catch (error) {
                alert("Onaylama işlemi başarısız oldu. Hedef oda dolu olabilir.");
            }
        }
    };

    // Reddetme İşlemi
    const handleReject = async (id) => {
        if (window.confirm("Bu oda değişikliği talebini reddetmek istediğinize emin misiniz?")) {
            try {
                await rejectRoomChangeRequest(id);
                alert("Oda değişikliği talebi reddedildi.");
                fetchRequests();
            } catch (error) {
                alert("Reddetme işlemi sırasında bir hata oluştu.");
            }
        }
    };

    // Küp avatarlar için baş harf fonksiyonu
    const getInitials = (firstName, lastName) => {
        return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
    };

    // Durum çizgileri ve rozet renk hiyerarşisi
    const getStatusDetails = (status) => {
        switch (status) {
            case 'APPROVED':
                return {
                    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    line: 'border-l-emerald-500',
                    text: 'Onaylandı'
                };
            case 'REJECTED':
                return {
                    bg: 'bg-rose-50 text-rose-700 border-rose-200',
                    line: 'border-l-rose-500',
                    text: 'Reddedildi'
                };
            default:
                return {
                    bg: 'bg-amber-50 text-amber-700 border-amber-200',
                    line: 'border-l-amber-500',
                    text: 'Beklemede'
                };
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="animate-spin text-slate-800" size={32} />
                    <p className="text-slate-500 text-sm font-bold tracking-wide uppercase">Talepler Yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 px-4 py-2 animate-in fade-in duration-300">

            {/* BAŞLIK ALANI */}
            <div className="border-b border-slate-100 pb-5">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Oda Değişiklik Talepleri</h1>
                <p className="text-sm text-slate-500 mt-1">Öğrencilerin akıllı yapay zeka algoritması ile eşleşerek yönetime gönderdiği oda transfer istekleri.</p>
            </div>

            {/* TALEPLER LİSTESİ */}
            <div className="grid grid-cols-1 gap-4">
                {requests.length > 0 ? (
                    requests.map((req) => {
                        const status = getStatusDetails(req.status);
                        return (
                            <div
                                key={req.id}
                                className={`bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 border-l-4 ${status.line} hover:shadow-md transition-all duration-200`}
                            >
                                {/* 1. ÖĞRENCİ BİLGİSİ */}
                                <div className="flex items-center gap-3.5 flex-1 min-w-0 w-full sm:w-auto">
                                    <div className="w-9 h-9 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
                                        {getInitials(req.student?.firstName, req.student?.lastName)}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-semibold text-slate-900 text-sm truncate">
                                            {req.student?.firstName} {req.student?.lastName}
                                        </h3>
                                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-1 font-medium">
                                            <Clock size={13} className="text-slate-300" /> İstek Tarihi: {new Date(req.createdAt).toLocaleDateString('tr-TR')}
                                        </p>
                                    </div>
                                </div>

                                {/* 2. TALEP EDİLEN ODA HÜCRESİ */}
                                <div className="flex items-center gap-3 flex-1 justify-center w-full sm:w-auto">
                                    <div className="text-center px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl min-w-[160px]">
                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Talep Edilen Oda</p>
                                        <p className="text-xs font-bold text-indigo-600 flex items-center justify-center gap-1.5">
                                            <Home size={13} className="text-indigo-400" /> {req.requestedRoom?.block?.blockNumber}. Blok — {req.requestedRoom?.roomNumber}
                                        </p>
                                    </div>
                                </div>

                                {/* 3. SADECE ONAYLA VE REDDET BUTONLARI */}
                                <div className="flex flex-col items-stretch sm:items-end gap-2 shrink-0 w-full md:w-auto md:flex-1 justify-end">
                                    {req.status === 'PENDING' ? (
                                        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                                            <button
                                                onClick={() => handleApprove(req.id)}
                                                className="flex-1 md:flex-none inline-flex items-center justify-center gap-1 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-150"
                                            >
                                                <Check size={12} /> Onayla
                                            </button>
                                            <button
                                                onClick={() => handleReject(req.id)}
                                                className="flex-1 md:flex-none inline-flex items-center justify-center gap-1 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-150"
                                            >
                                                <X size={12} /> Reddet
                                            </button>
                                        </div>
                                    ) : (
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 border text-xs font-semibold rounded-md ${status.bg}`}>
                                            {status.text}
                                        </span>
                                    )}
                                </div>

                            </div>
                        );
                    })
                ) : (
                    <div className="bg-slate-50/50 border border-slate-200 border-dashed rounded-2xl py-16 text-center flex flex-col items-center justify-center">
                        <ArrowRightLeft className="text-slate-300 mb-2" size={36} />
                        <p className="text-slate-500 font-medium text-sm">Şu anda işlem bekleyen herhangi bir transfer talebi bulunmuyor.</p>
                    </div>
                )}
            </div>
        </div>
    );
}