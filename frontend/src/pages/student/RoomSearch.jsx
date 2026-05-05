import React, { useState } from 'react';
import { Sparkles, Search, CheckCircle, Users, Home, ArrowLeft } from 'lucide-react';
import { findBestRoomMatch } from '../../services/matchService';

export default function RoomSearch() {
  const [formData, setFormData] = useState({
    sleepSchedule: '11PM',
    wakeSchedule: '8AM',
    cleanlinessLevel: 3,
    noiseTolerance: 3,
    vibes: []
  });

  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState(null);

  const availableVibes = ['Oyun', 'Kitap', 'Müzik', 'Kahve', 'Spor', 'Hayvanlar', 'Sinema'];

  const toggleVibe = (vibe) => {
    setFormData(prev => {
      if (prev.vibes.includes(vibe)) return { ...prev, vibes: prev.vibes.filter(v => v !== vibe) };
      if (prev.vibes.length < 3) return { ...prev, vibes: [...prev.vibes, vibe] };
      return prev;
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);

    try {
      const data = await findBestRoomMatch(formData);
      setTimeout(() => {
        setResults(data); // Artık içinde matchedRooms ve emptyRooms olan bir obje geliyor
        setIsSearching(false);
      }, 1500);
    } catch (error) {
      alert("Algoritma çalışırken bir hata oluştu!");
      setIsSearching(false);
    }
  };

  // Sonuç Kartı Şablonu
  const ResultCard = ({ match, isEmpty }) => (
    <div className={`p-4 rounded-2xl border ${isEmpty ? 'bg-emerald-50/50 border-emerald-100' : 'bg-gray-50/50 border-gray-100'} hover:shadow-md transition-shadow relative overflow-hidden group`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-black text-gray-800 text-lg">{match.roomNumber}</h4>
          <p className={`text-sm font-semibold ${isEmpty ? 'text-emerald-600' : 'text-indigo-600'}`}>{match.roommateName}</p>
        </div>
        <div className={`flex items-center justify-center w-12 h-12 rounded-full font-black text-lg shadow-sm border-2 ${isEmpty ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-indigo-100 text-indigo-700 border-indigo-200'}`}>
          %{match.matchPercentage}
        </div>
      </div>

      {!isEmpty && match.commonVibes?.length > 0 && (
        <div className="mt-3 flex gap-2 flex-wrap">
          <span className="text-[10px] uppercase font-bold text-gray-400 mt-1">Ortak Noktalar:</span>
          {match.commonVibes.map(v => (
            <span key={v} className="text-[10px] bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-bold">{v}</span>
          ))}
        </div>
      )}

      <button className={`w-full mt-4 py-2 rounded-xl font-bold text-sm transition-colors ${isEmpty ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'} opacity-0 group-hover:opacity-100 transition-opacity`}>
        Bu Odayı Seç
      </button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {!results ? (
        <>
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center p-3 bg-indigo-100 text-indigo-700 rounded-2xl mb-4"><Sparkles size={32} /></div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight">Akıllı Oda Eşleştirme</h1>
            <p className="text-gray-500 mt-2">Yapay zeka algoritmamız, tercihlerinizi analiz ederek size en uygun oda arkadaşını bulur.</p>
          </div>

          <form onSubmit={handleSearch} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Form Alanları (Öncekiyle Aynı) */}
              <div className="space-y-4">
                <h3 className="font-bold text-gray-700 border-b pb-2">Uyku Düzeni</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Uyku Saati</label>
                  <select value={formData.sleepSchedule} onChange={e => setFormData({ ...formData, sleepSchedule: e.target.value })} className="w-full border-gray-200 rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option value="10PM">22:00 ve öncesi</option><option value="11PM">23:00</option><option value="12PM">00:00</option><option value="1AM">01:00</option><option value="2AM">02:00 ve sonrası</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Uyanma Saati</label>
                  <select value={formData.wakeSchedule} onChange={e => setFormData({ ...formData, wakeSchedule: e.target.value })} className="w-full border-gray-200 rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option value="7AM">07:00 ve öncesi</option><option value="8AM">08:00</option><option value="9AM">09:00</option><option value="10AM">10:00 ve sonrası</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-gray-700 border-b pb-2">Alışkanlıklar</h3>
                <div>
                  <label className="flex justify-between text-sm font-medium text-gray-600 mb-2"><span>Titizlik Seviyesi</span> <span className="font-bold text-indigo-600">{formData.cleanlinessLevel}</span></label>
                  <input type="range" min="1" max="5" value={formData.cleanlinessLevel} onChange={e => setFormData({ ...formData, cleanlinessLevel: Number(e.target.value) })} className="w-full accent-indigo-600" />
                </div>
                <div className="pt-2">
                  <label className="flex justify-between text-sm font-medium text-gray-600 mb-2"><span>Sese Tolerans</span> <span className="font-bold text-indigo-600">{formData.noiseTolerance}</span></label>
                  <input type="range" min="1" max="5" value={formData.noiseTolerance} onChange={e => setFormData({ ...formData, noiseTolerance: Number(e.target.value) })} className="w-full accent-indigo-600" />
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-bold text-gray-700 border-b pb-2 mb-4">İlgi Alanları (Maksimum 3)</h3>
              <div className="flex flex-wrap gap-3">
                {availableVibes.map(vibe => (
                  <button key={vibe} type="button" onClick={() => toggleVibe(vibe)} className={`px-4 py-2 rounded-full border-2 text-sm font-bold transition-all ${formData.vibes.includes(vibe) ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'}`}>{vibe}</button>
                ))}
              </div>
            </div>

            <button disabled={isSearching} type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-black text-lg py-4 rounded-2xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
              {isSearching ? <Sparkles className="animate-pulse" /> : <Search />}
              {isSearching ? 'Büyük Veri Taranıyor...' : 'Oda Bul'}
            </button>
          </form>
        </>
      ) : (
        /* Yapay Zeka Çift Sütunlu Sonuç Ekranı */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-gray-800">Analiz Tamamlandı</h2>
              <p className="text-gray-500 text-sm">Sizin için en uygun ev arkadaşları ve boş odalar listelendi.</p>
            </div>
            <button onClick={() => setResults(null)} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors">
              <ArrowLeft size={16} /> Kriterleri Değiştir
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in zoom-in duration-500">

            {/* SOL SÜTUN: Oda Arkadaşı Eşleşmeleri */}
            <div className="bg-white rounded-3xl shadow-sm border border-indigo-100 flex flex-col h-[600px]">
              <div className="p-6 border-b border-gray-100 bg-indigo-50/30 rounded-t-3xl">
                <h3 className="text-xl font-black text-indigo-900 flex items-center gap-2"><Users className="text-indigo-600" /> Oda Arkadaşı Önerileri</h3>
                <p className="text-sm text-indigo-600/70 mt-1 font-medium">Size en uygun kişilerin bulunduğu odalar.</p>
              </div>
              <div className="p-6 overflow-y-auto flex-1 space-y-4 custom-scrollbar">
                {results.matchedRooms.length > 0 ? (
                  results.matchedRooms.map((match, idx) => <ResultCard key={`match-${idx}`} match={match} isEmpty={false} />)
                ) : (
                  <p className="text-center text-gray-400 py-10 font-medium">Kriterlerinize uygun ev arkadaşı bulunamadı.</p>
                )}
              </div>
            </div>

            {/* SAĞ SÜTUN: Tamamen Boş Odalar */}
            <div className="bg-white rounded-3xl shadow-sm border border-emerald-100 flex flex-col h-[600px]">
              <div className="p-6 border-b border-gray-100 bg-emerald-50/30 rounded-t-3xl">
                <h3 className="text-xl font-black text-emerald-900 flex items-center gap-2"><Home className="text-emerald-600" /> Tamamen Boş Odalar</h3>
                <p className="text-sm text-emerald-600/70 mt-1 font-medium">Yeni bir başlangıç yapmak isteyenler için.</p>
              </div>
              <div className="p-6 overflow-y-auto flex-1 space-y-4 custom-scrollbar">
                {results.emptyRooms.length > 0 ? (
                  results.emptyRooms.map((match, idx) => <ResultCard key={`empty-${idx}`} match={match} isEmpty={true} />)
                ) : (
                  <p className="text-center text-gray-400 py-10 font-medium">Şu anda tamamen boş oda bulunmamaktadır.</p>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}