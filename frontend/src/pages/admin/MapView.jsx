import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import BlockDetailModal from '../../components/BlockDetailModal';
import { getAllMaintenanceRequests } from '../../services/maintenanceService';

// Leaflet'in varsayılan ikon sorununu çözen ufak bir ayar
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// AGÜ Öğrenci Köyü Koordinatları
const blocks = [
  { id: 1, name: "1. Blok", lat: 38.741819, lng: 35.477318 },
  { id: 2, name: "2. Blok", lat: 38.741992, lng: 35.477787 },
  { id: 3, name: "3. Blok", lat: 38.742205, lng: 35.478379 },
  { id: 4, name: "4. Blok", lat: 38.742375, lng: 35.478850 },
  { id: 5, name: "5. Blok", lat: 38.741387, lng: 35.477435 },
  { id: 6, name: "6. Blok", lat: 38.741598, lng: 35.478019 },
  { id: 7, name: "7. Blok", lat: 38.741774, lng: 35.478612 },
  { id: 8, name: "8. Blok", lat: 38.741950, lng: 35.479079 },
  { id: 9, name: "9. Blok", lat: 38.740937, lng: 35.477705 },
  { id: 10, name: "10. Blok", lat: 38.741112, lng: 35.478288 },
  { id: 11, name: "11. Blok", lat: 38.741323, lng: 35.478872 },
  { id: 12, name: "12. Blok", lat: 38.741499, lng: 35.479348 },
  { id: 13, name: "13. Blok", lat: 38.740521, lng: 35.477947 },
  { id: 14, name: "14. Blok", lat: 38.740754, lng: 35.478531 },
  { id: 15, name: "15. Blok", lat: 38.740922, lng: 35.479124 },
  { id: 16, name: "16. Blok", lat: 38.741091, lng: 35.479591 }
];

const mapCenter = [38.741450, 35.478400];

export default function MapView() {
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [blockAlerts, setBlockAlerts] = useState({});

  // 1. Veritabanındaki Aktif Arıza ve Şikayetleri Çekiyoruz
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const requests = await getAllMaintenanceRequests();
        const alerts = {};

        requests.forEach(req => {
          // Sadece çözülmemiş (aktif) kayıtları al
          if (req.status !== 'COMPLETED' && req.room) {
            // Backend'den block id gelmiyorsa, veritabanı yapısına göre
            // her 8 odanın 1 blok ettiği matematiksel formülle bloğu buluyoruz
            const blockId = req.room.block?.id || Math.ceil(req.room.id / 8);

            if (!alerts[blockId]) {
              alerts[blockId] = { repair: 0, complaint: 0 };
            }

            if (req.type === 'COMPLAINT') alerts[blockId].complaint += 1;
            if (req.type === 'REPAIR') alerts[blockId].repair += 1;
          }
        });

        setBlockAlerts(alerts);
      } catch (error) {
        console.error("Harita için arıza verileri çekilemedi:", error);
      }
    };

    fetchAlerts();
    
    // Harita açık kaldığı sürece her 30 saniyede bir verileri gizlice güncelleyebiliriz
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  // 2. Leaflet İçin Dinamik "Rozetli" İkon Oluşturucu
  const getMarkerIcon = (blockId) => {
    const alert = blockAlerts[blockId];

    // Eğer o blokta aktif bir sorun yoksa standart ikonu döndür
    if (!alert || (alert.repair === 0 && alert.complaint === 0)) {
      return new L.Icon.Default(); 
    }

    // Sorun varsa önceliğe göre renk belirle: Şikayet (Kırmızı) > Tamir (Turuncu)
    const isComplaint = alert.complaint > 0;
    const badgeColor = isComplaint ? '#ef4444' : '#f59e0b';
    const totalAlerts = alert.complaint + alert.repair;

    // Haritada belirecek HTML tabanlı özel ikon
    const customHtml = `
      <div style="position: relative; width: 25px; height: 41px;">
        <img src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png" style="width: 100%; height: 100%;" />
        <div style="
          position: absolute;
          top: -10px;
          right: -14px;
          background-color: ${badgeColor};
          color: white;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 900;
          border: 2px solid white;
          box-shadow: 0 2px 5px rgba(0,0,0,0.4);
          z-index: 1000;
        ">
          ${totalAlerts > 9 ? '9+' : totalAlerts}
        </div>
      </div>
    `;

    return L.divIcon({
      html: customHtml,
      className: 'custom-alert-marker', // Arka plan transparanlığı için
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-800">İnteraktif Yurt Haritası</h1>
        <p className="text-gray-500 font-medium">Blokların konumlarını ve anlık durumlarını görüntüleyin.</p>
      </div>

      {/* Harita Bilgi Çubuğu (Lejant) */}
      <div className="flex gap-4 mb-4">
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 text-sm font-bold text-gray-600">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div> Sorunsuz
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 text-sm font-bold text-gray-600">
          <div className="w-3 h-3 rounded-full bg-orange-500"></div> Bekleyen Tamir
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 text-sm font-bold text-gray-600">
          <div className="w-3 h-3 rounded-full bg-red-500"></div> Oda Şikayeti
        </div>
      </div>

      <div className="bg-white p-2 rounded-3xl shadow-sm border border-gray-200">
        <div className="h-[600px] w-full rounded-2xl overflow-hidden relative z-0">
          <MapContainer center={mapCenter} zoom={18} scrollWheelZoom={true} className="h-full w-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {blocks.map((block) => {
              const alert = blockAlerts[block.id];
              return (
                <Marker 
                  key={block.id} 
                  position={[block.lat, block.lng]}
                  icon={getMarkerIcon(block.id)} // Dinamik İkon Ataması
                >
                  <Popup className="rounded-xl">
                    <div className="text-center p-2">
                      <h3 className="font-black text-lg text-gray-800 mb-2">{block.name}</h3>
                      
                      {/* Tıklanan bloktaki arızaları Popup içinde göster */}
                      {alert && (alert.repair > 0 || alert.complaint > 0) && (
                        <div className="mb-4 bg-gray-50 p-2 rounded-lg text-left text-xs font-bold space-y-1 border border-gray-100">
                          {alert.repair > 0 && <p className="text-orange-600">🔧 {alert.repair} Bekleyen Tamir</p>}
                          {alert.complaint > 0 && <p className="text-red-600">⚠️ {alert.complaint} Aktif Şikayet</p>}
                        </div>
                      )}

                      <button
                        onClick={() => setSelectedBlock(block)}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl shadow-sm transition-colors">
                        Blok Detayını Gör
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>

      {selectedBlock && (
        <BlockDetailModal
          block={selectedBlock}
          onClose={() => setSelectedBlock(null)}
        />
      )}

      {/* Leaflet divIcon arka plan şeffaflığı için minimal CSS */}
      <style>{`
        .custom-alert-marker { background: transparent; border: none; }
      `}</style>
    </div>
  );
}