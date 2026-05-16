import React, { useState, useEffect } from 'react';
import { Search, Plus, SlidersHorizontal, Home, Phone, Mail, Trash2, Loader2 } from 'lucide-react';
import { getAllStudents, deleteStudent } from '../../services/studentService';

export default function StudentsList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // Sekme kontrolü için eklendi

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

  // İsimden baş harfleri çıkaran yardımcı fonksiyon
  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-slate-800" size={32} />
          <p className="text-slate-500 text-sm font-bold tracking-wide uppercase">Öğrenci Listesi Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-4 py-2 animate-in fade-in duration-300">

      {/* --- 1. BAŞLIK ALANI --- */}
      <div className="border-b border-slate-100 pb-5">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Öğrenci Yönetimi</h1>
        <p className="text-sm text-slate-500 mt-1">Yurtta kayıtlı tüm öğrencilerin oda durumlarını, iletişim ve akademik bilgilerini inceleyin.</p>
      </div>

      {/* --- 2. KONTROL BARİ (Arama & Premium Koyu Buton) --- */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1 max-w-lg">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Öğrenci adı, e-posta veya Bölüm ara..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 transition-all"
            />
          </div>
          <button className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-600 shadow-sm" title="Gelişmiş Filtreler">
            <SlidersHorizontal size={16} />
          </button>
        </div>

        {/* ARTIK MOR DEĞİL: Koyu Premium SaaS Buton Stili */}
        <button className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm">
          <Plus size={14} /> Yeni Öğrenci Ekle
        </button>
      </div>

      {/* --- 3. TABLO VE SEKMELER KAPSAYICISI --- */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden shadow-slate-100/50 flex flex-col">

        {/* Yenilenmiş Sade Sekmeler */}
        <div className="flex border-b border-slate-100 px-2 overflow-x-auto custom-scrollbar">
          <button onClick={() => setActiveTab('all')} className={`px-5 py-3.5 font-semibold text-sm transition-all relative ${activeTab === 'all' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400'}`}>
            Tüm Öğrenciler ({students.length})
          </button>
          <button onClick={() => setActiveTab('active')} className={`px-5 py-3.5 font-semibold text-sm transition-all relative ${activeTab === 'active' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400'}`}>
            Aktif
          </button>
          <button onClick={() => setActiveTab('leave')} className={`px-5 py-3.5 font-semibold text-sm transition-all relative ${activeTab === 'leave' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400'}`}>
            İzinde
          </button>
        </div>

        {/* Tablo Gövdesi */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-5">Öğrenci</th>
                <th className="py-3.5 px-5">Oda</th>
                <th className="py-3.5 px-5">Bölüm</th>
                <th className="py-3.5 px-5">İletişim</th>
                <th className="py-3.5 px-5">Durum</th>
                <th className="py-3.5 px-5 text-right">Aksiyon</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {students.map((detail) => (
                <tr key={detail.userId} className="hover:bg-slate-50/40 transition-colors group">

                  {/* 1. ÖĞRENCİ KÜNYESİ */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3.5">
                      {/* ARTIK PARLAK MAVİ DEĞİL: Soft Elit Gri Çerçeveli Küp Avatar */}
                      <div className="w-9 h-9 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl flex items-center justify-center font-bold text-xs shadow-sm group-hover:bg-white group-hover:border-slate-300 transition-all">
                        {getInitials(detail.user?.firstName, detail.user?.lastName)}
                      </div>
                      <div className="space-y-0.5">
                        <p className="font-semibold text-slate-900">{detail.user?.firstName} {detail.user?.lastName}</p>
                        <p className="text-xs text-slate-400 font-medium">{detail.user?.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* 2. ODA BİLGİSİ */}
                  <td className="py-4 px-5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs rounded-xl shadow-sm">
                      <Home size={13} className="text-slate-400" />
                      {detail.room ? `${detail.room.block?.blockNumber}. Blok — Oda ${detail.room.roomNumber}` : 'Atanmadı'}
                    </span>
                  </td>

                  {/* 3. AKADEMİK BİLGİ */}
                  <td className="py-4 px-5">
                    <div className="space-y-0.5">
                      <p className="font-medium text-slate-800">{detail.university}</p>
                      <p className="text-xs text-slate-400 font-medium">{detail.department}</p>
                    </div>
                  </td>

                  {/* 4. İLETİŞİM */}
                  <td className="py-4 px-5">
                    <span className="font-medium text-slate-600 font-mono text-xs tracking-tight">{detail.user?.phone}</span>
                  </td>

                  {/* 5. DURUM ROZETİ */}
                  <td className="py-4 px-5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 border text-xs font-semibold rounded-full ${
                      detail.user?.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      <span className={`w-1 h-1 rounded-full ${detail.user?.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      {detail.user?.status === 'ACTIVE' ? 'Aktif' : 'İzinde'}
                    </span>
                  </td>

                  {/* 6. AKSİYON BUTONLARI (Hover Durumunda Şık Geçiş) */}
                  <td className="py-4 px-5 text-right opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <div className="inline-flex gap-1">
                      <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"><Phone size={15} /></button>
                      <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"><Mail size={15} /></button>
                      <button onClick={() => handleDelete(detail.user.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 size={15} /></button>
                    </div>
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