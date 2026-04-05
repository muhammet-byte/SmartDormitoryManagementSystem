package com.dormitory.management_system.config; // Kendi paket adına göre düzenle

import com.dormitory.management_system.entity.Room;
import com.dormitory.management_system.repository.RoomRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class RoomSeeder implements CommandLineRunner {

    private final RoomRepository roomRepository;

    public RoomSeeder(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @Override
    public void run(String... args) throws Exception {

        // Sadece veritabanında hiç oda yoksa bu inşaatı yap (Yeniden başlatmalarda üst üste eklemesin)
        if (roomRepository.count() == 0) {
            System.out.println("🏢 Oda veritabanı boş. 16 Blokluk dev tesis inşa ediliyor...");

            // A'dan P'ye kadar 16 blok döngüsü (A'nın harf değeri 65, P'ninki 80'dir)
            for (char block = 'A'; block <= 'P'; block++) {
                String blockName = String.valueOf(block);

                // Her blokta 2 Kat
                for (int floor = 1; floor <= 2; floor++) {

                    // Her katta 2 Oda
                    for (int roomNum = 1; roomNum <= 2; roomNum++) {

                        // Kapı numarası formatı (Örn: A-101, A-102, C-201)
                        String roomIdentifier = blockName + "-" + floor + "0" + roomNum;

                        // Yeni odayı oluştur ve veritabanına (MySQL) kaydet
                        Room newRoom = new Room(blockName, floor, roomIdentifier);
                        roomRepository.save(newRoom);
                    }
                }
            }
            System.out.println("✅ 64 Oda başarıyla veritabanına yazıldı! Toplam Kapasite: 256");
        } else {
            System.out.println("ℹ️ Odalar zaten veritabanında mevcut. İnşaat atlandı.");
        }
    }
}