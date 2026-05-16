import React, { useState } from 'react';
import {
  Sparkles, Search, Users, Home, ArrowLeft,
  Moon, Sun, Volume2, Gamepad2, BookOpen,
  Headphones, Coffee, Dumbbell, PawPrint, Film,
  Utensils, GraduationCap
} from 'lucide-react';
import { findBestRoomMatch, sendRoomChangeRequest } from '../../services/matchService';

export default function RoomSearch() {
  const [formData, setFormData] = useState({
    sleepSchedule: '11PM',
    wakeSchedule: '8AM',
    cleanlinessLevel: 3,
    noiseTolerance: 3,
    vibes: [],
    department: 'Bilgisayar Mühendisliği',
    kitchenUsage: 3
  });

  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState(null);

  const availableVibes = [
    { name: 'Oyun', icon: <Gamepad2 size={22} /> },
    { name: 'Kitap', icon: <BookOpen size={22} /> },
    { name: 'Müzik', icon: <Headphones size={22} /> },
    { name: 'Kahve', icon: <Coffee size={22} /> },
    { name: 'Spor', icon: <Dumbbell size={22} /> },
    { name: 'Hayvanlar', icon: <PawPrint size={22} /> },
    { name: 'Sinema', icon: <Film size={22} /> }
  ];

  // Backend'den gelen mükerrer "Oda" kelimelerini temizleyen akıllı fonksiyon
  const formatRoomName = (roomStr) => {
    if (!roomStr) return '';
    // "4. Blok - Oda 5" ifadesindeki "- Oda" kısmını normal tireye çekip temizler
    let clean = roomStr.replace(/-\s*Oda\s*/i, '- ');
    // Sonuna senin istediğin gibi temiz ". Oda" takısını ekler
    if (!clean.includes('Oda')) {
      clean = `${clean}. Oda`;
    }
    return clean;
  };

  const toggleVibe = (vibeName) => {
    setFormData(prev => {
      if (prev.vibes.includes(vibeName)) return { ...prev, vibes: prev.vibes.filter(v => v !== vibeName) };
      if (prev.vibes.length < 3) return { ...prev, vibes: [...prev.vibes, vibeName] };
      return prev;
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);

    try {
      const data = await findBestRoomMatch(formData);
      setTimeout(() => {
        setResults(data);
        setIsSearching(false);
      }, 1500);
    } catch (error) {
      alert("Algoritma çalışırken bir hata oluştu!");
      setIsSearching(false);
    }
  };

  const handleSelectRoom = async (roomId) => {
    const currentUserId = localStorage.getItem('userId');
    if (!currentUserId || !roomId) {
      alert("Hata: Sistem oda veya kullanıcı kimliğini bulamadı.");
      return;
    }

    if (window.confirm("Bu odaya geçiş talebi göndermek istediğinize emin misiniz?")) {
      try {
        await sendRoomChangeRequest(currentUserId, roomId);
        alert("Talebiniz yöneticiye başarıyla iletildi!");
      } catch (error) {
        alert("Talep iletilemedi. Bekleyen bir talebiniz olabilir.");
      }
    }
  };

  const ResultCard = ({ match, isEmpty }) => (
    <div className={`p-5 rounded-2xl border ${isEmpty ? 'bg-emerald-50/30 border-emerald-100' : 'bg-slate-50/50 border-slate-100'} hover:shadow-md transition-all duration-300 relative overflow-hidden group`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          {/* Akıllı metin biçimlendirici buraya entegre edildi */}
          <h4 className="font-black text-slate-800 text-lg">{formatRoomName(match.roomNumber)}</h4>
          <p className={`text-sm font-semibold ${isEmpty ? 'text-emerald-600' : 'text-indigo-600'}`}>
            {isEmpty ? 'Tamamen Boş Oda' : match.roommateName}
          </p>
        </div>
        <div className={`flex items-center justify-center w-12 h-12 rounded-full font-black text-sm shadow-sm border ${isEmpty ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-indigo-100 text-indigo-700 border-indigo-200'}`}>
          %{match.matchPercentage}
        </div>
      </div>

      {!isEmpty && match.commonVibes?.length > 0 && (
        <div className="mt-4 flex gap-1.5 flex-wrap items-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Ortak Bağlar:</span>
          {match.commonVibes.map(v => (
            <span key={v} className="text-[11px] bg-white border border-slate-200 text-slate-600 px-2.5 py-0.5 rounded-full font-medium shadow-sm">{v}</span>
          ))}
        </div>
      )}

      <button
        onClick={() => handleSelectRoom(match.roomId)}
        className={`w-full mt-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${isEmpty ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'} opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0`}>
        Odayı Seç ve Talep Gönder
      </button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 px-4 py-6">

      {!results ? (
        <>
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center p-3.5 bg-indigo-50 text-indigo-600 rounded-2xl mb-4 shadow-sm">
              <Sparkles size={28} />
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Akıllı Oda Eşleştirme</h1>
            <p className="text-slate-500 mt-2 text-sm max-w-md mx-auto">Yaşam tarzınıza ve ilgi alanlarınıza en uygun oda arkadaşını saniyeler içinde bulun.</p>
          </div>

          <form onSubmit={handleSearch} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 max-w-3xl mx-auto space-y-10">

            {/* ZAMAN DİLİMLERİ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50/60 p-5 rounded-2xl border border-slate-100 flex items-start gap-4">
                <div className="p-3 bg-indigo-100 text-indigo-700 rounded-xl mt-1 shadow-sm">
                  <Moon size={22} className="animate-pulse" />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Uyku Saati (Ay Dede)</label>
                  <select
                    value={formData.sleepSchedule}
                    onChange={e => setFormData({ ...formData, sleepSchedule: e.target.value })}
                    className="w-full bg-transparent font-bold text-slate-700 text-base outline-none cursor-pointer py-1"
                  >
                    <option value="10PM">22:00 ve öncesi</option>
                    <option value="11PM">23:00 civarı</option>
                    <option value="12PM">00:00 civarı</option>
                    <option value="1AM">01:00 civarı</option>
                    <option value="2AM">02:00 ve sonrası</option>
                  </select>
                </div>
              </div>

              <div className="bg-slate-50/60 p-5 rounded-2xl border border-slate-100 flex items-start gap-4">
                <div className="p-3 bg-amber-100 text-amber-700 rounded-xl mt-1 shadow-sm">
                  <Sun size={22} />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Uyanma Saati</label>
                  <select
                    value={formData.wakeSchedule}
                    onChange={e => setFormData({ ...formData, wakeSchedule: e.target.value })}
                    className="w-full bg-transparent font-bold text-slate-700 text-base outline-none cursor-pointer py-1"
                  >
                    <option value="7AM">07:00 ve öncesi</option>
                    <option value="8AM">08:00 civarı</option>
                    <option value="9AM">09:00 civarı</option>
                    <option value="10AM">10:00 ve sonrası</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ALIŞKANLIKLAR VE AKADEMİK KÜTÜPHANE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 pt-2">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <Sparkles size={18} className="text-emerald-500" /> Titizlik & Hijyen
                  </span>
                  <span className="text-xs font-black bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-lg border border-emerald-100">Seviye {formData.cleanlinessLevel}</span>
                </div>
                <input type="range" min="1" max="5" value={formData.cleanlinessLevel} onChange={e => setFormData({ ...formData, cleanlinessLevel: Number(e.target.value) })} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                <div className="flex justify-between text-[10px] font-bold text-slate-400 px-0.5"><span>Rahat</span><span>Çok Titiz</span></div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <Volume2 size={18} className="text-indigo-500" /> Sese Tolerans
                  </span>
                  <span className="text-xs font-black bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-lg border border-indigo-100">Seviye {formData.noiseTolerance}</span>
                </div>
                <input type="range" min="1" max="5" value={formData.noiseTolerance} onChange={e => setFormData({ ...formData, noiseTolerance: Number(e.target.value) })} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                <div className="flex justify-between text-[10px] font-bold text-slate-400 px-0.5"><span>Sessiz Ortam</span><span>Fark Etmez</span></div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <Utensils size={18} className="text-amber-500" /> Mutfak Kullanımı
                  </span>
                  <span className="text-xs font-black bg-amber-50 text-amber-600 px-2 py-0.5 rounded-lg border border-amber-100">Seviye {formData.kitchenUsage}</span>
                </div>
                <input type="range" min="1" max="5" value={formData.kitchenUsage} onChange={e => setFormData({ ...formData, kitchenUsage: Number(e.target.value) })} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500" />
                <div className="flex justify-between text-[10px] font-bold text-slate-400 px-0.5"><span>Hiç Kullanmam</span><span>Çok Sık</span></div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-1">
                  <GraduationCap size={18} className="text-indigo-600" /> Okuduğunuz Bölüm
                </label>
                <select
                  value={formData.department}
                  onChange={e => setFormData({ ...formData, department: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all cursor-pointer h-[42px]"
                >
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

            {/* İLGİ ALANLARI */}
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-baseline border-b border-slate-100 pb-2">
                <h3 className="font-bold text-slate-800 text-sm tracking-wide uppercase">İlgi Alanları Seçimi</h3>
                <span className="text-xs font-semibold text-slate-400">En fazla 3 adet ({formData.vibes.length}/3)</span>
              </div>

              <div className="flex flex-wrap justify-center sm:justify-between gap-6 py-2">
                {availableVibes.map(vibe => {
                  const isSelected = formData.vibes.includes(vibe.name);
                  return (
                    <button
                      key={vibe.name}
                      type="button"
                      onClick={() => toggleVibe(vibe.name)}
                      className="flex flex-col items-center group focus:outline-none"
                    >
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 border-2 shadow-sm ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-600 text-white scale-110 shadow-indigo-200'
                          : 'bg-white border-slate-200 text-slate-500 group-hover:border-slate-300 group-hover:text-slate-700'
                      }`}>
                        {vibe.icon}
                      </div>
                      <span className={`text-xs mt-2.5 font-bold transition-colors ${
                        isSelected ? 'text-indigo-600' : 'text-slate-500 group-hover:text-slate-800'
                      }`}>
                        {vibe.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              disabled={isSearching}
              type="submit"
              className="w-full bg-slate-900 text-white font-bold text-base py-4 rounded-2xl hover:bg-indigo-600 active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 disabled:opacity-60 shadow-md shadow-slate-900/10"
            >
              {isSearching ? <Sparkles className="animate-spin text-indigo-400" size={20} /> : <Search size={20} />}
              {isSearching ? 'En Uygun Odalar Analiz Ediliyor...' : 'Eşleşen Odaları Bul'}
            </button>
          </form>
        </>
      ) : (
        /* SONUÇ EKRANI */
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-2xl font-black text-slate-800">Eşleşme Sonuçları</h2>
              <p className="text-slate-500 text-sm mt-0.5">Algoritma analizi tamamlandı. Sizin için listelenen alternatifler:</p>
            </div>
            <button
              onClick={() => setResults(null)}
              className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <ArrowLeft size={14} /> Kriterleri Güncelle
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
              <div className="pb-2 border-b border-slate-50">
                <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                  <Users className="text-indigo-600" size={18} /> Oda Arkadaşı Önerileri
                </h3>
              </div>
              <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1 custom-scrollbar">
                {results.matchedRooms.length > 0 ? (
                  results.matchedRooms.map((match, idx) => <ResultCard key={`match-${idx}`} match={match} isEmpty={false} />)
                ) : (
                  <p className="text-center text-slate-400 py-8 text-sm font-medium">Tam uyumlu bir oda arkadaşı bulunamadı.</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
              <div className="pb-2 border-b border-slate-50">
                <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                  <Home className="text-emerald-600" size={18} /> Tamamen Boş Odalar
                </h3>
              </div>
              <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1 custom-scrollbar">
                {results.emptyRooms.length > 0 ? (
                  results.emptyRooms.map((match, idx) => <ResultCard key={`empty-${idx}`} match={match} isEmpty={true} />)
                ) : (
                  <p className="text-center text-slate-400 py-8 text-sm font-medium">Şu an tamamen boş oda kalmamış.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}