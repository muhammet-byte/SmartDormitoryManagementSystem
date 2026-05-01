# SmartDormitoryManagementSystem
## 🛠️ Veritabanı Kurulumu (Geliştiriciler İçin)

Bu proje veritabanı olarak **MySQL** kullanmaktadır. Projeyi lokalinizde çalıştırmadan önce veritabanını manuel olarak kurmanız gerekmektedir:

1. MySQL Workbench'i (veya tercih ettiğiniz bir SQL istemcisini) açın.
2. Proje dizininde bulunan `database_init.sql` dosyasının içeriğini kopyalayın ve çalıştırın. Bu işlem `dormitory_management` veritabanını ve gerekli tüm tabloları oluşturacaktır.
3. `backend/src/main/resources/application.properties` dosyasını açın.
4. `spring.datasource.username` ve `spring.datasource.password` alanlarına kendi lokal MySQL kullanıcı adı ve şifrenizi girin.
5. Backend'i çalıştırabilirsiniz!