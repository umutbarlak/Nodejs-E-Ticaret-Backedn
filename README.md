<h1>Nodejs-E-Ticaret-Backend</h1>

Bu proje, bir e-ticaret uygulamasının backend API’sini oluşturmak amacıyla geliştirilmiştir. Kullanıcı yönetimi, ürün CRUD işlemleri, yorum sistemi ve rol bazlı erişim kontrolleri içermektedir.

<h2>🧰 Kullanılan Teknolojiler</h2>

- Node.js

- Express.js

- MongoDB & Mongoose

- Cloudinary – Görsel yükleme

- JWT (jsonwebtoken) – Kimlik doğrulama

- Bcrypt.js – Şifre şifreleme

- Dotenv – Ortam değişkenleri yönetimi

- Cors & Cookie-parser

- Body-parser

- Validator

- Nodemailer – (Şifre sıfırlama maili için, opsiyonel)

<h2>🚀 Özellikler</h2>

<h3>👤 Kullanıcı Yönetimi</h2>

- Kayıt olma (/register)

- Giriş yapma (/login)

- Çıkış yapma (/logout)

- Şifre sıfırlama (token ile)

- Giriş yapan kullanıcının detaylarını görme (/me)

<h2>🛍️ Ürün Yönetimi</h2>

Tüm ürünleri listeleme (/products)

- Ürün detayını görme (/products/id)

- Ürün ekleme (Admin) (/products/new)

- Ürün güncelleme (Admin) (/products/id [PATCH])

- Ürün silme (Admin) (/products/id [DELETE])

- Ürünlere yorum ekleme (/products/newReview)

- Admin paneli için tüm ürünleri listeleme (/products/admin/products)

<h2>🔐 Kimlik Doğrulama ve Rol Kontrolü</h2>

- JWT tabanlı kullanıcı kimlik doğrulama

- Rol bazlı yetkilendirme (örn. admin yetkileri)

- Cookie üzerinden token doğrulama
