import React, { useState, useEffect } from 'react';
import { Search, Plus, SlidersHorizontal, Home, Phone, Mail, Trash2, Loader2, X, UserPlus, Check } from 'lucide-react';
import { getAllStudents, deleteStudent, addStudent } from '../../services/studentService';

export default function StudentsList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // 🔥 YENİ: Arama çubuğunu canlandırmak için state
  const [searchTerm, setSearchTerm] = useState('');

  // MODAL VE FORM STATE'LERİ
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    university: '',
    department: ''
  });

  useEffect(() => {
    fetchStudents();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addStudent(formData);
      alert("Öğrenci başarıyla eklendi!");
      setIsModalOpen(false);
      setFormData({ firstName: '', lastName: '', email: '', phone: '', university: '', department: '' });
      fetchStudents();
    } catch (error) {
      alert("Öğrenci eklenirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🔥 SİHİRLİ KISIM: Hem Sekmelere Hem de Arama Çubuğuna Göre Dinamik Filtreleme
  const filteredStudents = students.filter((detail) => {
    // 1. Sekme Filtrelemesi
    if (activeTab === 'active' && detail.user?.status !== 'ACTIVE') return false;
    if (activeTab === 'leave' && detail.user?.status === 'ACTIVE') return false;

    // 2. Arama Çubuğu Filtrelemesi
    const firstName = detail.user?.firstName?.toLowerCase() || '';
    const lastName = detail.user?.lastName?.toLowerCase() || '';
    const fullName = `${firstName} ${lastName}`;
    const email = detail.user?.email?.toLowerCase() || '';
    const department = detail.department?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();

    return fullName.includes(search) || email.includes(search) || department.includes(search);
  });

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
    <div className="max-w-7xl mx-auto space-y-6 px-4 py-2 animate-in fade-in duration-300 relative">

      {/* --- BAŞLIK ALANI --- */}
      <div className="border-b border-slate-100 pb-5">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Öğrenci Yönetimi</h1>
        <p className="text-sm text-slate-500 mt-1">Yurtta kayıtlı tüm öğrencilerin oda durumlarını, iletişim ve akademik bilgilerini inceleyin.</p>
      </div>

      {/* --- KONTROL BARİ --- */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1 max-w-lg">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Öğrenci adı, e-posta veya Bölüm ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Klavyeden girilen her harfi yakalar
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 transition-all"
            />
          </div>
          <button className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-600 shadow-sm" title="Gelişmiş Filtreler">
            <SlidersHorizontal size={16} />
          </button>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
        >
          <Plus size={14} /> Yeni Öğrenci Ekle
        </button>
      </div>

      {/* --- TABLO VE SEKMELER --- */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden shadow-slate-100/50 flex flex-col">

        {/* 🔥 YENİLENEN DİNAMİK SAYAÇLI SEKMELER 🔥 */}
        <div className="flex border-b border-slate-100 px-2 overflow-x-auto custom-scrollbar">
          <button onClick={() => setActiveTab('all')} className={`px-5 py-3.5 font-semibold text-sm transition-all relative ${activeTab === 'all' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400'}`}>
            Tüm Öğrenciler ({students.length})
          </button>
          <button onClick={() => setActiveTab('active')} className={`px-5 py-3.5 font-semibold text-sm transition-all relative ${activeTab === 'active' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400'}`}>
            Aktif ({students.filter(s => s.user?.status === 'ACTIVE').length})
          </button>
          <button onClick={() => setActiveTab('leave')} className={`px-5 py-3.5 font-semibold text-sm transition-all relative ${activeTab === 'leave' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400'}`}>
            İzinde ({students.filter(s => s.user?.status !== 'ACTIVE').length})
          </button>
        </div>

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
              {/* 🔥 Artık filtrelenmiş liste (filteredStudents) ekrana basılıyor */}
              {filteredStudents.map((detail) => (
                <tr key={detail.userId} className="hover:bg-slate-50/40 transition-colors group">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl flex items-center justify-center font-bold text-xs shadow-sm group-hover:bg-white group-hover:border-slate-300 transition-all">
                        {getInitials(detail.user?.firstName, detail.user?.lastName)}
                      </div>
                      <div className="space-y-0.5">
                        <p className="font-semibold text-slate-900">{detail.user?.firstName} {detail.user?.lastName}</p>
                        <p className="text-xs text-slate-400 font-medium">{detail.user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs rounded-xl shadow-sm">
                      <Home size={13} className="text-slate-400" />
                      {detail.room ? `${detail.room.block?.blockNumber}. Blok — Oda ${detail.room.roomNumber}` : 'Atanmadı'}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <div className="space-y-0.5">
                      <p className="font-medium text-slate-800">{detail.university}</p>
                      <p className="text-xs text-slate-400 font-medium">{detail.department}</p>
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <span className="font-medium text-slate-600 font-mono text-xs tracking-tight">{detail.user?.phone}</span>
                  </td>
                  <td className="py-4 px-5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 border text-xs font-semibold rounded-full ${detail.user?.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                      <span className={`w-1 h-1 rounded-full ${detail.user?.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      {detail.user?.status === 'ACTIVE' ? 'Aktif' : 'İzinde'}
                    </span>
                  </td>
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

          {filteredStudents.length === 0 && (
             <div className="text-center py-12 text-slate-400 font-medium bg-slate-50/20">
               Arama kriterlerine veya seçilen sekmeye uygun öğrenci kaydı bulunamadı.
             </div>
          )}
        </div>
      </div>

      {/* --- MODAL (YENİ ÖĞRENCİ EKLEME EKRANI) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100">

            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                  <UserPlus size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-800">Sisteme Öğrenci Kaydet</h2>
                  <p className="text-xs font-medium text-slate-500">Öğrenci bilgilerini eksiksiz giriniz.</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Ad</label>
                  <input required type="text" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" placeholder="Ahmet" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Soyad</label>
                  <input required type="text" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" placeholder="Yılmaz" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Telefon Numarası</label>
                <input required type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" placeholder="0555 555 5555" />
              </div>

              <div className="grid grid-cols-2 gap-4 pb-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Üniversite</label>
                  <input required type="text" value={formData.university} onChange={(e) => setFormData({...formData, university: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" placeholder="Örn: AGÜ" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Bölüm</label>
                  <select
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer appearance-none"
                  >
                    <option value="" disabled>Lütfen bölüm seçiniz...</option>
                    <optgroup label="Mühendislik & Teknoloji">
                      <option value="Bilgisayar Mühendisliği">Bilgisayar Mühendisliği</option>
                      <option value="Yazılım Mühendisliği">Yazılım Mühendisliği</option>
                      <option value="Yapay Zeka Mühendisliği">Yapay Zeka Mühendisliği</option>
                      <option value="Elektrik-Elektronik Mühendisliği">Elektrik-Elektronik Mühendisliği</option>
                      <option value="Endüstri Mühendisliği">Endüstri Mühendisliği</option>
                      <option value="Makine Mühendisliği">Makine Mühendisliği</option>
                      <option value="Mekatronik Mühendisliği">Mekatronik Mühendisliği</option>
                      <option value="İnşaat Mühendisliği">İnşaat Mühendisliği</option>
                      <option value="Havacılık ve Uzay Mühendisliği">Havacılık ve Uzay Mühendisliği</option>
                      <option value="Biyomühendislik">Biyomühendislik</option>
                      <option value="Kimya Mühendisliği">Kimya Mühendisliği</option>
                    </optgroup>
                    <optgroup label="Sağlık Bilimleri">
                      <option value="Tıp">Tıp</option>
                      <option value="Diş Hekimliği">Diş Hekimliği</option>
                      <option value="Eczacılık">Eczacılık</option>
                      <option value="Hemşirelik">Hemşirelik</option>
                      <option value="Fizyoterapi ve Rehabilitasyon">Fizyoterapi ve Rehabilitasyon</option>
                      <option value="Beslenme ve Diyetetik">Beslenme ve Diyetetik</option>
                    </optgroup>
                    <optgroup label="Mimarlık & Tasarım">
                      <option value="Mimarlık">Mimarlık</option>
                      <option value="İç Mimarlık">İç Mimarlık</option>
                      <option value="Endüstriyel Tasarım">Endüstriyel Tasarım</option>
                      <option value="Şehir ve Bölge Planlama">Şehir ve Bölge Planlama</option>
                      <option value="Görsel İletişim Tasarımı">Görsel İletişim Tasarımı</option>
                    </optgroup>
                    <optgroup label="İktisadi, İdari & Sosyal Bilimler">
                      <option value="İşletme">İşletme</option>
                      <option value="Ekonomi">Ekonomi</option>
                      <option value="Yönetim Bilişim Sistemleri">Yönetim Bilişim Sistemleri (MIS)</option>
                      <option value="Siyaset Bilimi ve Uluslararası İlişkiler">Siyaset Bilimi ve Uluslararası İlişkiler</option>
                      <option value="Uluslararası Ticaret ve Lojistik">Uluslararası Ticaret ve Lojistik</option>
                      <option value="Psikoloji">Psikoloji</option>
                      <option value="Sosyoloji">Sosyoloji</option>
                      <option value="Hukuk">Hukuk</option>
                    </optgroup>
                    <optgroup label="Temel Bilimler & İletişim">
                      <option value="Moleküler Biyoloji ve Genetik">Moleküler Biyoloji ve Genetik</option>
                      <option value="Matematik">Matematik</option>
                      <option value="Fizik">Fizik</option>
                      <option value="Yeni Medya ve İletişim">Yeni Medya ve İletişim</option>
                      <option value="İngiliz Dili ve Edebiyatı">İngiliz Dili ve Edebiyatı</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-50 transition-colors">
                  İptal
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-3 bg-slate-900 text-white font-bold text-sm rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                  Öğrenciyi Kaydet
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}