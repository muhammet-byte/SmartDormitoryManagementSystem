import React, { useState, useEffect } from 'react';
import { Search, Plus, SlidersHorizontal, Home, Phone, Mail, Trash2, Loader2 } from 'lucide-react';
import { getAllStudents, deleteStudent } from '../../services/studentService';

export default function StudentsList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await getAllStudents();
        setStudents(data);
      } catch (error) {
        console.error("Öğrenciler yüklenemedi");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);
  const handleDelete = async (id) => {
    if (window.confirm('Bu öğrenciyi sistemden silmek istediğinize emin misiniz?')) {
      try {
        await deleteStudent(id);
        setStudents(students.filter(s => s.user.id !== id));
      } catch (error) {
        alert("Silme işlemi başarısız oldu.");
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-indigo-600" size={48} /></div>;
  }

  // İsimden baş harfleri çıkaran ufak bir yardımcı fonksiyon
  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-4">
      {/* Üst Bar: Arama ve Aksiyonlar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 shrink-0">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Öğrenci adı, e-posta veya Bölüm ara..." className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
          </div>
          <button className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors" title="Gelişmiş Filtreler">
            <SlidersHorizontal size={16} />
          </button>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 rounded-xl text-sm font-bold text-white hover:bg-indigo-700 transition-colors shadow-sm">
            <Plus size={16} /> Yeni Öğrenci
          </button>
        </div>
      </div>

      {/* Tablo */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden">
        {/* Sekmeler */}
        <div className="flex border-b border-gray-100 shrink-0 px-2 overflow-x-auto custom-scrollbar">
          <button className="px-5 py-3.5 border-b-2 border-indigo-600 text-indigo-600 text-sm font-bold whitespace-nowrap">Tüm Öğrenciler ({students.length})</button>
          <button className="px-5 py-3.5 border-b-2 border-transparent text-gray-500 hover:text-gray-800 text-sm font-semibold whitespace-nowrap transition-colors">Aktif</button>
          <button className="px-5 py-3.5 border-b-2 border-transparent text-gray-500 hover:text-gray-800 text-sm font-semibold whitespace-nowrap transition-colors">İzinde</button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="sticky top-0 bg-gray-50/95 backdrop-blur-sm z-10 shadow-sm border-b border-gray-200">
              <tr className="text-gray-500 text-xs uppercase tracking-wider">
                <th className="py-3 px-5 font-bold">Öğrenci</th>
                <th className="py-3 px-5 font-bold">Oda</th>
                <th className="py-3 px-5 font-bold">Bölüm</th>
                <th className="py-3 px-5 font-bold">İletişim</th>
                <th className="py-3 px-5 font-bold">Durum</th>
                <th className="py-3 px-5 font-bold text-right">Aksiyon</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {students.map((detail) => (
                <tr key={detail.userId} className="hover:bg-indigo-50/40 transition-colors group">
                  <td className="py-2.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 bg-blue-100 text-blue-700">
                        {getInitials(detail.user?.firstName, detail.user?.lastName)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{detail.user?.firstName} {detail.user?.lastName}</p>
                        <p className="text-[11px] text-gray-400 font-mono tracking-wide">{detail.user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-bold border border-gray-200">
                      <Home size={10} />
                      {detail.room ? `${detail.room.block?.blockNumber}. Blok - Oda ${detail.room.roomNumber}` : 'Atanmadı'}
                    </span>
                  </td>
                  <td className="py-2.5 px-5 text-gray-600 font-medium">
                    {detail.university}<br />
                    <span className="text-xs text-gray-400">{detail.department}</span>
                  </td>
                  <td className="py-2.5 px-5 text-gray-800 font-medium">{detail.user?.phone}</td>
                  <td className="py-2.5 px-5">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${detail.user?.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {detail.user?.status === 'ACTIVE' ? 'Aktif' : detail.user?.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-5 flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Phone size={16} /></button>
                    <button className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Mail size={16} /></button>
                    <button onClick={() => handleDelete(detail.user.id)} className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}