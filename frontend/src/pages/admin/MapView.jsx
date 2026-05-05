import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useState } from 'react'; // React importuna useState'i ekle
import BlockDetailModal from '../../components/BlockDetailModal';
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

// Haritanın merkez noktasını ortalama bir değer olarak belirliyoruz
const mapCenter = [38.741450, 35.478400];

export default function MapView() {
  const [selectedBlock, setSelectedBlock] = useState(null);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Yurt Haritası ve Bloklar</h1>

      <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
        <div className="h-[600px] w-full rounded-lg overflow-hidden relative z-0">
          <MapContainer center={mapCenter} zoom={18} scrollWheelZoom={true} className="h-full w-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {blocks.map((block) => (
              <Marker key={block.id} position={[block.lat, block.lng]}>
                <Popup>
                  <div className="text-center">
                    <h3 className="font-bold text-lg mb-2">{block.name}</h3>
                    <button
                      onClick={() => setSelectedBlock(block)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition-colors">
                      Blok Detayını Gör
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Modal Bileşeni */}
      {selectedBlock && (
        <BlockDetailModal
          block={selectedBlock}
          onClose={() => setSelectedBlock(null)}
        />
      )}
    </div>
  );
}