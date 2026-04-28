# 📘 README.md (Versi Simpel)

```markdown
# Product API - NestJS & MySQL

REST API untuk manajemen produk dengan relasi parent-child.

## Tech Stack
- NestJS 10.x
- TypeORM
- MySQL 8.0
- TypeScript

## Prasyarat
- Node.js 18+
- MySQL 8.0+

## Instalasi

```bash
# 1. Install dependencies
npm install

# 2. Buat database MySQL
CREATE DATABASE product_db;

# 3. Konfigurasi .env (isi password MySQL anda)
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=product_db

# 4. Jalankan server
npm run start:dev
```

Server running di: **http://localhost:3000**

## API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | /api/products | Create product |
| GET | /api/products?page=1&limit=10 | Get all products (pagination) |
| GET | /api/products/:id | Get product by ID |
| PATCH | /api/products/:id | Update product |
| DELETE | /api/products/:id | Delete product |

## Contoh Request

### Create Product
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Laptop","price":15000000,"stock":10}'
```

### Create Child Product (dengan parent)
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Laptop Case","price":200000,"stock":50,"parent_id":"PARENT_ID"}'
```

### Get All Products (with pagination)
```bash
curl "http://localhost:3000/api/products?page=1&limit=10"
```

### Update Product
```bash
curl -X PATCH http://localhost:3000/api/products/:id \
  -H "Content-Type: application/json" \
  -d '{"price":16000000}'
```

### Delete Product
```bash
curl -X DELETE http://localhost:3000/api/products/:id
```

## Validasi

| Field | Rule |
|-------|------|
| name | Required |
| price | Tidak boleh negatif |
| stock | Tidak boleh negatif |

## Arsitektur Proyek

```
product-api/
├── src/
│   ├── product/
│   │   ├── controllers/
│   │   │   └── product.controller.ts
│   │   ├── services/
│   │   │   └── product.service.ts
│   │   ├── entities/
│   │   │   └── product.entity.ts
│   │   ├── dtos/
│   │   │   ├── create-product.dto.ts
│   │   │   └── update-product.dto.ts
│   │   └── product.module.ts
│   ├── app.module.ts
│   └── main.ts
├── .env
├── package.json
└── tsconfig.json
```

## Database Schema

```sql
CREATE TABLE products (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  parent_id VARCHAR(36),
  stock INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES products(id)
);
```
```
