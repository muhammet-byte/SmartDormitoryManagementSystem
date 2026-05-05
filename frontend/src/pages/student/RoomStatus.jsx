import React, { useState } from 'react';
import { BedDouble, User, AlertTriangle, Wrench, Send, DoorOpen, LayoutDashboard } from 'lucide-react';
export default function RoomStatus() {
    const [complaintType, setComplaintType] = useState('REPAIR');
    const [description, setDescription] = useState('');

    // Şimdilik sahte veriler. Backend bağlandığında "/api/students/me" üzerinden gelecek.
    const roomData = {
        block: 2, floor: 1, apartment: 2, roomNumber: 5,
        myBed: 1
    };

    const roommate = {
        name: 'Ege Yılmaz',
        department: 'Bilgisayar Mühendisliği',
        bedNumber: 2,
        vibes: ['Oyun', 'Müzik', 'Kahve']
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Backend'e veriyi gönderiyoruz
            await studentcreateMaintenanceRequest({
                type: complaintType,
                description: description
            });

            alert(`Talebiniz yöneticiye başarıyla iletildi!`);
            setDescription(''); // Formu temizle
        } catch (error) {
            alert("Talebiniz iletilemedi. Lütfen tekrar deneyin.");
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">

            {/* Üst Başlık */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-gray-800 tracking-tight">Oda Durumum</h1>
                    <p className="text-gray-500 font-medium mt-1">Odanızın güncel yerleşimi ve detayları.</p>
                </div>
                <div className="flex gap-2 text-center">
                    <div className="bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100"><p className="text-[10px] font-bold text-indigo-400 uppercase">Blok</p><p className="font-black text-indigo-700">{roomData.block}</p></div>
                    <div className="bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100"><p className="text-[10px] font-bold text-indigo-400 uppercase">Kat</p><p className="font-black text-indigo-700">{roomData.floor}</p></div>
                    <div className="bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100"><p className="text-[10px] font-bold text-indigo-400 uppercase">Daire</p><p className="font-black text-indigo-700">{roomData.apartment}</p></div>
                    <div className="bg-indigo-600 px-4 py-2 rounded-xl shadow-md"><p className="text-[10px] font-bold text-indigo-200 uppercase">Oda</p><p className="font-black text-white">{roomData.roomNumber}</p></div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* SOL SÜTUN: 2D Oda Krokisi */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
                    <h3 className="w-full text-lg font-bold text-gray-800 mb-6 flex items-center gap-2"><LayoutDashboard className="text-indigo-600" /> 2D Oda Planı</h3>

                    {/* CSS ile çizilmiş 2D Kuşbakışı Oda */}
                    <div className="relative w-full max-w-sm aspect-[3/4] bg-orange-50 border-8 border-slate-700 rounded-lg shadow-inner flex flex-col justify-between p-4">
                        {/* Kapı */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-16 h-2 bg-amber-600 flex items-center justify-center">
                            <DoorOpen size={16} className="text-white absolute -top-5" />
                        </div>
                        {/* Pencere */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-24 h-4 bg-sky-200 border-2 border-sky-400 rounded-full"></div>

                        {/* Yatak 1 (Senin Yatağın) */}
                        <div className={`w-20 h-40 rounded-lg border-2 flex flex-col items-center justify-center relative shadow-md ${roomData.myBed === 1 ? 'bg-indigo-100 border-indigo-400' : 'bg-gray-100 border-gray-300'}`}>
                            <div className="absolute top-2 w-14 h-8 bg-white rounded-md opacity-70"></div> {/* Yastık */}
                            <BedDouble size={24} className={roomData.myBed === 1 ? 'text-indigo-600 mt-4' : 'text-gray-400 mt-4'} />
                            <span className={`text-xs font-bold mt-2 px-2 py-1 rounded bg-white/80 ${roomData.myBed === 1 ? 'text-indigo-800' : 'text-gray-600'}`}>Yatak 1 {roomData.myBed === 1 && '(Sen)'}</span>
                        </div>

                        {/* Çalışma Masaları (Ortada) */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-4">
                            <div className="w-12 h-16 bg-amber-700 rounded-sm border-b-4 border-amber-900 shadow-lg"></div>
                            <div className="w-12 h-16 bg-amber-700 rounded-sm border-b-4 border-amber-900 shadow-lg"></div>
                        </div>

                        {/* Yatak 2 (Oda Arkadaşı) */}
                        <div className={`absolute right-4 bottom-4 w-20 h-40 rounded-lg border-2 flex flex-col items-center justify-center shadow-md ${roomData.myBed === 2 ? 'bg-indigo-100 border-indigo-400' : 'bg-emerald-50 border-emerald-300'}`}>
                            <div className="absolute top-2 w-14 h-8 bg-white rounded-md opacity-70"></div> {/* Yastık */}
                            <BedDouble size={24} className={roomData.myBed === 2 ? 'text-indigo-600 mt-4' : 'text-emerald-600 mt-4'} />
                            <span className={`text-xs font-bold mt-2 px-2 py-1 rounded bg-white/80 ${roomData.myBed === 2 ? 'text-indigo-800' : 'text-emerald-800'}`}>Yatak 2 {roomData.myBed === 2 && '(Sen)'}</span>
                        </div>
                    </div>
                </div>

                {/* SAĞ SÜTUN: Oda Arkadaşı ve Şikayet Formu */}
                <div className="space-y-6 flex flex-col">

                    {/* Oda Arkadaşı Kartı */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><User className="text-emerald-500" /> Oda Arkadaşım</h3>
                        <div className="flex items-center gap-4 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                            <div className="w-14 h-14 bg-emerald-200 text-emerald-700 font-black rounded-full flex items-center justify-center text-xl shadow-inner">
                                {roommate.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                                <p className="font-black text-gray-800 text-lg">{roommate.name}</p>
                                <p className="text-sm font-semibold text-gray-500 mb-2">{roommate.department}</p>
                                <div className="flex gap-2">
                                    {roommate.vibes.map(vibe => (
                                        <span key={vibe} className="text-[10px] bg-white border border-emerald-200 text-emerald-700 px-2 py-1 rounded-md font-bold shadow-sm">{vibe}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Talep ve Şikayet Formu */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-rose-100 flex-1 flex flex-col">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Wrench className="text-rose-500" /> Talep & Şikayet Bildirimi</h3>
                        <p className="text-sm text-gray-500 mb-4 font-medium">Odanızla ilgili teknik bir arızayı veya oda arkadaşınızla ilgili bir durumu yönetime hızlıca iletebilirsiniz.</p>

                        <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-4">
                            <div className="flex gap-2 bg-gray-50 p-1 rounded-xl border border-gray-200">
                                <button type="button" onClick={() => setComplaintType('REPAIR')} className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${complaintType === 'REPAIR' ? 'bg-white text-indigo-700 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>
                                    <Wrench size={16} /> Arıza / Tamir
                                </button>
                                <button type="button" onClick={() => setComplaintType('COMPLAINT')} className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${complaintType === 'COMPLAINT' ? 'bg-white text-rose-700 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>
                                    <AlertTriangle size={16} /> Oda İçi Şikayet
                                </button>
                            </div>

                            <div className="flex-1">
                                <textarea
                                    required
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full h-full min-h-[120px] border border-gray-200 rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none bg-gray-50 transition-all placeholder-gray-400"
                                    placeholder={complaintType === 'REPAIR' ? "Örn: Banyo musluğumuz su sızdırıyor, tamir edilmesi gerekiyor." : "Örn: Oda arkadaşım geceleri yüksek sesle müzik dinliyor..."}
                                ></textarea>
                            </div>

                            <button type="submit" className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2 mt-auto">
                                <Send size={18} /> Yöneticiye Gönder
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}