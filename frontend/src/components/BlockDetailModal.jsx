import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { getAllStudents } from '../services/studentService';
import { getAllMaintenanceRequests } from '../services/maintenanceService';

export default function BlockDetailModal({ block, onClose }) {
    const [students, setStudents] = useState([]);
    const [maintenanceRequests, setMaintenanceRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!block) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const [studentsData, maintenanceData] = await Promise.all([
                    getAllStudents(),
                    getAllMaintenanceRequests()
                ]);

                const currentBlockId = Number(block.id);

                const blockStudents = studentsData.filter(s =>
                    s.room && Number(s.room.block?.id) === currentBlockId
                );
                setStudents(blockStudents);

                const blockRequests = maintenanceData.filter(m =>
                    m.room && Number(m.room.block?.id) === currentBlockId
                );
                setMaintenanceRequests(blockRequests);

            } catch (error) {
                console.error("Blok verileri yüklenemedi:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [block]);

    if (!block) return null;

    const generateFloors = () => {
        const floors = [];
        let globalRoomNum = (Number(block.id) - 1) * 8 + 1;

        for (let f = 1; f <= 2; f++) {
            const apartments = [];
            for (let a = 1; a <= 2; a++) {
                const rooms = [];
                for (let r = 1; r <= 2; r++) {

                    const roomStudents = students.filter(s =>
                        Number(s.room?.roomNumber) === globalRoomNum ||
                        Number(s.room?.id) === globalRoomNum
                    );

                    const bed1 = roomStudents.find(s => s.bedNumber == 1);
                    const bed2 = roomStudents.find(s => s.bedNumber == 2);

                    const roomComplaints = maintenanceRequests.filter(m =>
                        (Number(m.room?.roomNumber) === globalRoomNum || Number(m.room?.id) === globalRoomNum)
                        && m.status !== 'COMPLETED'
                    );

                    const hasRepair = roomComplaints.some(m => m.type === 'REPAIR');
                    const hasComplaint = roomComplaints.some(m => m.type === 'COMPLAINT');

                    const getStudentName = (bedInfo) => {
                        if (!bedInfo) return "Boş";
                        const fName = bedInfo.user?.firstName || bedInfo.firstName || "İsimsiz";
                        const lName = bedInfo.user?.lastName || bedInfo.lastName || "Öğrenci";
                        return `${fName} ${lName}`;
                    };

                    // ============================================================
                    // 🔥 ÇÖZÜM: LOKAL ODA NUMARASI HESAPLAMA 🔥
                    // ============================================================
                    // globalRoomNum veritabanı ID'si (41) olarak kalıyor (Filtreler kırılmasın diye)
                    // localRoomNum ise ekranda her blokta bağımsız olarak 1, 2, 3... yazar.
                    const localRoomNum = globalRoomNum - ((Number(block.id) - 1) * 8);

                    rooms.push({
                        id: globalRoomNum,
                        name: `Oda ${localRoomNum}`, // 🌟 Değişen satır: Artık global değil lokal numara yazıyor!
                        beds: [
                            { id: 1, student: getStudentName(bed1), isFull: !!bed1 },
                            { id: 2, student: getStudentName(bed2), isFull: !!bed2 }
                        ],
                        hasRepair,
                        hasComplaint
                    });
                    globalRoomNum++;
                }
                apartments.push({ id: a, name: `Daire ${a}`, rooms });
            }
            floors.unshift({ id: f, name: `${f}. Kat`, apartments });
        }
        return floors;
    };

    const dynamicFloors = generateFloors();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[9999] p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-3xl font-bold">
                    &times;
                </button>

                <div className="p-6">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">{block.name} Detay Görünümü</h2>

                    {loading ? (
                        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>
                    ) : (
                        <div className="space-y-8">
                            {dynamicFloors.map(floor => (
                                <div key={floor.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <h3 className="text-xl font-bold text-indigo-700 mb-4">{floor.name}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {floor.apartments.map(apt => (
                                            <div key={apt.id} className="bg-white p-4 rounded border-2 border-indigo-100 shadow-sm relative">
                                                <div className="flex justify-between items-center mb-3 border-b pb-1">
                                                    <h4 className="font-semibold text-gray-700">{apt.name}</h4>
                                                    <span className="text-xs text-gray-400">Ortak Mutfak & Banyo</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    {apt.rooms.map(room => (
                                                        <div key={room.id} className={`p-3 rounded border ${room.hasComplaint || room.hasRepair ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
                                                            <div className="flex justify-between items-center mb-2">
                                                                <span className="font-bold text-sm text-gray-600">{room.name}</span>
                                                                <div className="flex gap-1">
                                                                    {room.hasRepair && <span className="text-orange-500 cursor-help" title="Aktif Tamir Talebi">🔧</span>}
                                                                    {room.hasComplaint && <span className="text-red-600 cursor-help" title="Oda İçi Şikayet">⚠️</span>}
                                                                </div>
                                                            </div>
                                                            <div className="space-y-2">
                                                                {room.beds.map(bed => (
                                                                    <div key={bed.id} className={`text-[11px] p-1.5 rounded flex justify-between items-center ${bed.isFull ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                                                        <span>🛏️ Yatak {bed.id}</span>
                                                                        <span className="font-semibold truncate max-w-[80px]" title={bed.student}>{bed.student}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}