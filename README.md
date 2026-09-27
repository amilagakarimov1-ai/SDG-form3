# FixiFy — Ağıllı Ekoloji Şəhər Platforması 🍃

> Vətəndaşların şəhər problemlərini bildirdiyi, bələdiyyənin real vaxtda idarə etdiyi, AI ilə dəstəklənən ekoloji platforma.

## Layihə Strukturu

```
fixify/
├── backend/          # Python FastAPI REST API
│   ├── app/
│   │   ├── models/       # SQLAlchemy modelleri
│   │   ├── schemas/      # Pydantic sxemləri
│   │   ├── routers/      # API endpoint-ləri
│   │   ├── services/     # AI, Coin, Route servislər
│   │   └── core/         # Auth, S3, Notifications
│   ├── alembic/          # DB miqrasiyaları
│   └── Dockerfile
│
├── mobile/           # Flutter mobil tətbiq (iOS + Android)
│   ├── lib/
│   │   ├── features/     # Report, Wallet, QR, Auth, Profile
│   │   ├── core/         # Router, Theme, API Client
│   │   └── shared/       # Ümumi Widget-lər
│   └── pubspec.yaml
│
├── dashboard/        # React.js Bələdiyyə Paneli
│   ├── src/
│   │   ├── components/   # Map, Tasks, Analytics
│   │   ├── pages/        # Səhifələr
│   │   ├── api/          # API funksiyaları
│   │   └── store/        # Zustand state
│   └── package.json
│
├── nginx/            # Reverse Proxy
├── docker-compose.yml
└── README.md
```

## Tez Başlamaq (Quick Start)

### Tələblər
- Docker Desktop
- Node.js 20+ (dashboard local development üçün)
- Flutter 3.24+ (mobile development üçün)
- Python 3.11+ (backend local development üçün)

### 1. Layihəni Klonlayın

```bash
git clone https://github.com/your-org/fixify.git
cd fixify
```

### 2. Environment Dəyişənlərini Qurun

```bash
cp backend/.env.example backend/.env
cp dashboard/.env.example dashboard/.env
```

Hər iki `.env` faylını öz API açarlarınızla doldurun:
- `OPENAI_API_KEY` - GPT-4o Vision üçün
- `GOOGLE_MAPS_API_KEY` - Xəritə və marşrut üçün
- `VITE_MAPBOX_TOKEN` - Dashboard xəritəsi üçün
- AWS S3 açarları (şəkillərin saxlanması üçün)

### 3. Docker ilə Bütün Sistemi İşə Salın

```bash
docker-compose up -d
```

Bu komanda aşağıdakıları avtomatik işə salır:
| Servis | URL |
|---|---|
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |
| Municipality Dashboard | http://localhost:3000 |
| PostgreSQL | localhost:5432 |

### 4. Verilənlər Bazasını Hazırlayın

```bash
docker exec fixify_backend alembic upgrade head
```

### 5. Mobil Tətbiq (Flutter)

```bash
cd mobile
flutter pub get
flutter run
```

## API Strukturu

| Endpoint | Metod | Təsvir |
|---|---|---|
| `/auth/register/citizen` | POST | Vətəndaş qeydiyyatı |
| `/auth/register/municipality` | POST | Bələdiyyə qeydiyyatı |
| `/auth/login` | POST | Daxil olma |
| `/reports` | POST | Şəkil + GPS ilə problem bildirişi |
| `/bins/map` | GET | Bütün zibil qutularını xəritə üçün al |
| `/truck-routes/optimize` | GET | Optimal zibil maşını marşrutu |
| `/coins/wallet` | GET | Green Coin balansı |
| `/coins/spend/qr` | POST | QR ilə coin xərcləmə |
| `/tasks` | GET/POST | Task idarəetmə |

## Əsas Xüsusiyyətlər

### 🤖 AI Analizi
- GPT-4o Vision ilə zibil qutusunun doluluğunu analiz edir
- >75% etibar dərəcəsində avtomatik 25 Green Coin mükafatlandırır
- EXIF metadata yoxlaması ilə saxtakarlığın qarşısını alır

### 🗺️ İnteraktiv Xəritə
- 🟢 Yaşıl = Boş | 🟡 Sarı = Yarımdolu | 🔴 Qırmızı = Dolu
- Dolu qutular üçün optimal marşrut hesablama
- Real vaxtda 60 saniyədə bir yenilənir

### 🪙 Green Coin Sistemi
- Zibil bildirişi: **+25 coin**
- EV şarj stansiyalarında ödəniş: QR kod ilə
- Partnyor mağazalarda endirim: QR kod ilə
- Aylıq Liderboard mükafatları

### 📋 Task Menecment
- AI bildirişi → Avtomatik müvafiq işçiyə tapşırıq
- Kanban board: Açıq → Qəbul → İşdə → Həll Olundu
- İşçi həlldən əvvəl/sonra foto çəkir

## Texnologiya Yığını

| Hissə | Texnologiya |
|---|---|
| Backend | Python FastAPI, SQLAlchemy, Alembic |
| Verilənlər Bazası | PostgreSQL 16 + PostGIS |
| AI | OpenAI GPT-4o Vision API |
| Mobil | Flutter 3.24 (iOS + Android) |
| Dashboard | React 18, Mapbox GL JS, Recharts |
| Bulud | AWS S3 (şəkillər), Firebase (push notifications) |
| Deployment | Docker, Nginx |

## Lisenziya
MIT
