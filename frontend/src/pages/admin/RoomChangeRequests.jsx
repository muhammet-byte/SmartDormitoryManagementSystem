import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, CheckCircle, Clock, Check, Loader2, Home } from 'lucide-react';
import { getAllRoomChangeRequests, approveRoomChangeRequest } from '../../services/roomChangeService';

export default function RoomChangeRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const data = await getAllRoomChangeRequests();
            // En yeniler en üstte olacak şekilde tersine çeviriyoruz
            setRequests(data.reverse());
        } catch (error) {
            console.error("Talepler yüklenemedi", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleApprove = async (id) => {
        if (window.confirm("Bu öğrencinin odasını değiştirmeyi onaylıyor musunuz? (Bu işlem öğrencinin sistemdeki yatak numarasını ve odasını anında güncelleyecektir)")) {
            try {
                await approveRoomChangeRequest(id);
                alert("Oda değişikliği başarıyla onaylandı ve sisteme işlendi!");
                fetchRequests(); // Listeyi güncelle
            } catch (error) {
                alert("Onaylama işlemi başarısız oldu. Seçilen oda tam kapasite dolu olabilir!");
            }
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-gray-800 flex items-center gap-3">
                        <ArrowRightLeft className="text-indigo-600" size={32} /> Oda Değişiklik Talepleri
                    </h1>
                    <p className="text-gray-500 font-medium mt-1">Öğrencilerin yapay zeka ile eşleşerek gönderdiği transfer istekleri.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {requests.length > 0 ? (
                    requests.map((req) => (
                        <div key={req.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:shadow-md">

                            <div className="flex items-center gap-4 flex-1">
                                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-black text-xl">
                                    {req.student?.firstName?.charAt(0)}{req.student?.lastName?.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-800">{req.student?.firstName} {req.student?.lastName}</h3>
                                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                        <Clock size={14} /> Talep Tarihi: {new Date(req.createdAt).toLocaleString('tr-TR')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 flex-1 justify-center">
                                <div className="text-center p-3 bg-gray-50 rounded-xl border border-gray-100 min-w-[120px]">
                                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Geçmek İstediği Oda</p>
                                    <p className="font-black text-indigo-600 flex items-center justify-center gap-1">
                                        <Home size={16} /> {req.requestedRoom?.block?.blockNumber}. Blok - {req.requestedRoom?.roomNumber}
                                    </p>
                                </div>
                            </div>

                            <div className="flex-1 flex justify-end">
                                {req.status === 'PENDING' ? (
                                    <button
                                        onClick={() => handleApprove(req.id)}
                                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-sm">
                                        <Check size={18} /> Talebi Onayla & Transfer Et
                                    </button>
                                ) : (
                                    <span className="flex items-center gap-2 bg-emerald-50 text-emerald-600 font-bold py-2.5 px-6 rounded-xl border border-emerald-100">
                                        <CheckCircle size={18} /> Onaylandı ve İşlendi
                                    </span>
                                )}
                            </div>

                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200">
                        <ArrowRightLeft className="mx-auto text-gray-300 mb-3" size={48} />
                        <p className="text-gray-500 font-medium">Şu anda bekleyen bir oda değişiklik talebi bulunmuyor.</p>
                    </div>
                )}
            </div>
        </div>
    );
}