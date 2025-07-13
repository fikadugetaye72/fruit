# Fruit Backend API

A robust Node.js backend API for a fruit management system using MySQL and Sequelize ORM.

## Features

- **MySQL Database** with Sequelize ORM
- **RESTful API** for fruit management
- **Security** with Helmet, CORS, and rate limiting
- **Error handling** and validation
- **Service layer** architecture

## Database Setup

### Prerequisites

- MySQL server installed and running
- Node.js and npm

### Environment Configuration

1. Copy the example environment file:

```bash
cp env.example .env
```

2. Update `.env` with your database credentials:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=fruit_db
DB_USER=root
DB_PASSWORD=your_password_here
PORT=3000
NODE_ENV=development
```

### Database Creation

Create the MySQL database:

```sql
CREATE DATABASE fruit_db;
```

## Installation

```bash
cd Backend
npm install
```

## Running the Application

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

## API Endpoints

### Fruits

- `GET /api/fruits` - Get all fruits
- `GET /api/fruits/:id` - Get fruit by ID
- `POST /api/fruits` - Create new fruit
- `PUT /api/fruits/:id` - Update fruit
- `DELETE /api/fruits/:id` - Delete fruit
- `GET /api/fruits/search?q=apple` - Search fruits
- `GET /api/fruits/category/:category` - Get fruits by category
- `PATCH /api/fruits/:id/stock` - Update stock quantity

### Health Check

- `GET /health` - Server health status

## Database Models

### User Model

- `id` (Primary Key)
- `username` (Unique)
- `email` (Unique)
- `password`
- `firstName`
- `lastName`
- `isActive`

### Fruit Model

- `id` (Primary Key)
- `name` (Unique)
- `description`
- `price`
- `category` (ENUM: citrus, berry, tropical, stone, pome, other)
- `stockQuantity`
- `imageUrl`
- `isAvailable`

## ORM Benefits

Using Sequelize ORM provides:

1. **Type Safety** - Data validation and type checking
2. **Migrations** - Database schema version control
3. **Associations** - Easy relationship management
4. **Query Building** - Safe SQL query construction
5. **Connection Pooling** - Efficient database connections
6. **Validation** - Built-in data validation
7. **Hooks** - Lifecycle events for models

## Example Usage

### Creating a Fruit

```javascript
const fruit = await Fruit.create({
  name: "Apple",
  description: "Fresh red apple",
  price: 1.99,
  category: "pome",
  stockQuantity: 100,
});
```

### Finding Fruits

```javascript
// Find all available fruits
const fruits = await Fruit.findAll({
  where: { isAvailable: true },
});

// Find by category
const citrusFruits = await Fruit.findAll({
  where: { category: "citrus" },
});
```

### Updating Stock

```javascript
// Add 10 to stock
await fruit.update({ stockQuantity: fruit.stockQuantity + 10 });
```

## Project Structure

```
Backend/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   └── fruitController.js   # HTTP request handlers
├── models/
│   ├── index.js            # Model associations
│   ├── User.js            # User model
│   └── Fruit.js           # Fruit model
├── routes/
│   └── fruitRoutes.js     # API routes
├── services/
│   └── fruitService.js    # Business logic
├── middlewares/           # Custom middleware
├── utils/                 # Utility functions
├── server.js             # Main application file
└── package.json
```

## Security Features

- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API request throttling
- **Input Validation** - Data sanitization
- **Error Handling** - Graceful error responses
