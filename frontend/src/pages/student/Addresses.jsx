import React, { useState } from 'react';
import { MapPin, Save, Home, Trash2 } from 'lucide-react';

export default function Addresses() {
    const [addresses, setAddresses] = useState([
        { id: 1, title: 'Aile Evi', city: 'Kayseri', fullAddress: 'Melikgazi, Alpaslan Mah. No: 12' },
        { id: 2, title: 'Akraba (Amcamlar)', city: 'Ankara', fullAddress: 'Çankaya, Atatürk Bulvarı No: 45' }
    ]);

    const [newAddress, setNewAddress] = useState({ title: '', city: 'Kayseri', fullAddress: '' });

    const cities = ['Kayseri', 'Ankara', 'İstanbul', 'İzmir', 'Antalya', 'Bursa', 'Sivas', 'Nevşehir'];

    const handleSave = (e) => {
        e.preventDefault();
        const addressToSave = { ...newAddress, id: Date.now() };
        setAddresses([addressToSave, ...addresses]);
        setNewAddress({ title: '', city: 'Kayseri', fullAddress: '' });
        alert("Yeni adres başarıyla kaydedildi!");
    };

    const handleDelete = (id) => {
        if (window.confirm("Bu adresi silmek istediğinize emin misiniz?")) {
            setAddresses(addresses.filter(a => a.id !== id));
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-gray-800 tracking-tight">Adreslerim</h1>
                    <p className="text-gray-500 font-medium mt-1">İzin taleplerinde kullanacağınız adresleri buradan yönetebilirsiniz.</p>
                </div>
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                    <MapPin size={24} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Yeni Adres Ekleme Formu */}
                <form onSubmit={handleSave} className="bg-white p-6 rounded-3xl shadow-sm border border-indigo-100 space-y-5">
                    <h3 className="text-lg font-bold text-indigo-900 border-b border-indigo-50 pb-3">Yeni Adres Ekle</h3>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Adres Başlığı (Örn: Dayımın Evi)</label>
                        <input type="text" required value={newAddress.title} onChange={e => setNewAddress({ ...newAddress, title: e.target.value })} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Adres Başlığı" />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">İl</label>
                        <select value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none">
                            {cities.map(city => <option key={city} value={city}>{city}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Açık Adres</label>
                        <textarea required value={newAddress.fullAddress} onChange={e => setNewAddress({ ...newAddress, fullAddress: e.target.value })} placeholder="Mahalle, Sokak, No..." className="w-full min-h-[100px] border border-gray-200 rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"></textarea>
                    </div>

                    <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                        <Save size={18} /> Adresi Kaydet
                    </button>
                </form>

                {/* Kayıtlı Adresler Listesi */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-800 ml-2">Kayıtlı Adresleriniz</h3>
                    {addresses.map(addr => (
                        <div key={addr.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 relative group transition-all hover:border-indigo-200 hover:shadow-md">
                            <div className="flex items-start gap-3">
                                <div className="bg-gray-100 p-2.5 rounded-xl text-gray-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                    <Home size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 text-lg">{addr.title}</h4>
                                    <p className="text-xs font-bold text-indigo-600 mb-1">{addr.city}</p>
                                    <p className="text-sm font-medium text-gray-500 leading-relaxed">{addr.fullAddress}</p>
                                </div>
                            </div>
                            <button onClick={() => handleDelete(addr.id)} type="button" className="absolute top-4 right-4 p-2 text-gray-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                    {addresses.length === 0 && (
                        <p className="text-gray-400 text-center py-10 font-medium">Henüz kayıtlı bir adresiniz bulunmamaktadır.</p>
                    )}
                </div>

            </div>
        </div>
    );
}