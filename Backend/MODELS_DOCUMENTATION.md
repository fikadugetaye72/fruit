# Database Models Documentation

## Overview

This document describes all the database models for the Fruit Shop Management System. The system uses MySQL with Sequelize ORM and includes comprehensive models for a real-world e-commerce fruit shop.

## Models Overview

### 1. User Model

**Table:** `users`
**Purpose:** Customer accounts and authentication

**Key Fields:**

- `id` - Primary key
- `username` - Unique username
- `email` - Unique email address
- `password` - Hashed password
- `firstName`, `lastName` - Customer name
- `isActive` - Account status

**Relationships:**

- Has many Orders
- Has many Payments

### 2. Admin Model

**Table:** `admins`
**Purpose:** Staff and administrative user management

**Key Fields:**

- `id` - Primary key
- `username`, `email` - Login credentials
- `role` - super_admin, admin, manager, staff
- `permissions` - JSON field for granular permissions
- `department` - Staff department
- `employeeId` - Unique employee identifier
- `salary` - Employee salary
- `hireDate` - Employment start date
- `isActive`, `isVerified` - Account status

**Relationships:**

- Has many Orders (assigned, prepared, delivered)
- Has many OrderItems (prepared, quality checked)
- Has many Payments (refunded)
- Has many Categories (created)
- Has many Juices (created)

### 3. Category Model

**Table:** `categories`
**Purpose:** Product categorization and organization

**Key Fields:**

- `id` - Primary key
- `name` - Category name
- `slug` - URL-friendly identifier
- `description` - Category description
- `parentId` - For hierarchical categories
- `sortOrder` - Display order
- `isActive`, `isFeatured` - Status flags
- `imageUrl`, `bannerUrl` - Visual assets
- `metaTitle`, `metaDescription` - SEO fields

**Relationships:**

- Has many Categories (children)
- Belongs to Category (parent)
- Has many Fruits
- Has many Juices

### 4. Fruit Model

**Table:** `fruits`
**Purpose:** Individual fruit products

**Key Fields:**

- `id` - Primary key
- `name` - Fruit name
- `description` - Product description
- `price` - Selling price
- `category` - ENUM: citrus, berry, tropical, stone, pome, other
- `stockQuantity` - Available inventory
- `imageUrl` - Product image
- `isAvailable` - Product status

**Relationships:**

- Belongs to Category (via categoryId)

### 5. Juice Model

**Table:** `juices`
**Purpose:** Juice products with detailed nutritional information

**Key Fields:**

- `id` - Primary key
- `name`, `description` - Product information
- `ingredients` - JSON array of ingredients
- `nutritionalInfo` - JSON nutritional data
- `price`, `salePrice`, `costPrice` - Pricing
- `categoryId` - Category reference
- `size` - ENUM: small, medium, large, extra_large
- `volume` - Volume in ml
- `stockQuantity`, `minStockLevel`, `maxStockLevel` - Inventory
- `sku`, `barcode` - Product identifiers
- `isOrganic`, `isGlutenFree`, `isVegan`, `isSugarFree` - Dietary flags
- `allergens` - JSON array of allergens
- `preparationTime` - Preparation time in minutes
- `shelfLife` - Shelf life in hours
- `servingTemperature` - ENUM: cold, room_temp, warm, hot
- `calories`, `protein`, `carbs`, `fat`, `fiber`, `sugar`, `sodium`, `vitaminC` - Nutritional values
- `rating`, `reviewCount` - Customer ratings
- `viewCount` - Product views
- `slug` - URL-friendly identifier
- `tags` - JSON array of tags

**Relationships:**

- Belongs to Category
- Belongs to Admin (created by)

### 6. Order Model

**Table:** `orders`
**Purpose:** Customer orders with comprehensive tracking

**Key Fields:**

- `id` - Primary key
- `orderNumber` - Unique order identifier
- `userId` - Customer reference
- `status` - ENUM: pending, confirmed, preparing, ready, out_for_delivery, delivered, cancelled, refunded
- `orderType` - ENUM: pickup, delivery, dine_in
- `paymentStatus` - ENUM: pending, paid, failed, refunded, partially_refunded
- `paymentMethod` - ENUM: cash, card, mobile_money, bank_transfer, paypal, stripe
- `subtotal`, `taxAmount`, `discountAmount`, `deliveryFee`, `totalAmount` - Financial breakdown
- `currency`, `exchangeRate` - Multi-currency support
- `customerName`, `customerEmail`, `customerPhone` - Customer information
- `deliveryAddress`, `deliveryCity`, `deliveryState`, `deliveryCountry`, `deliveryZipCode` - Delivery details
- `deliveryLatitude`, `deliveryLongitude` - GPS coordinates
- `estimatedDeliveryTime`, `actualDeliveryTime`, `pickupTime` - Timing information
- `specialInstructions` - Customer instructions
- `couponCode`, `discountPercentage` - Discount information
- `paymentTransactionId`, `paymentGateway`, `paymentResponse` - Payment details
- `assignedTo`, `preparedBy`, `deliveredBy` - Staff assignments
- `trackingNumber`, `trackingUrl` - Delivery tracking
- `adminNotes`, `customerNotes` - Notes
- `statusHistory` - JSON array of status changes
- `cancellationReason`, `cancelledBy`, `cancelledAt` - Cancellation details
- `refundAmount`, `refundReason`, `refundedBy`, `refundedAt` - Refund information
- `customerRating`, `customerReview`, `reviewDate` - Customer feedback
- `source` - ENUM: web, mobile_app, phone, walk_in, third_party
- `sourceDetails` - JSON source information
- `utmSource`, `utmMedium`, `utmCampaign` - Marketing tracking

**Relationships:**

- Belongs to User
- Has many OrderItems
- Has many Payments
- Belongs to Admin (assigned, prepared, delivered, created)

### 7. OrderItem Model

**Table:** `order_items`
**Purpose:** Individual items within orders

**Key Fields:**

- `id` - Primary key
- `orderId` - Order reference
- `productType` - ENUM: fruit, juice
- `productId` - Product reference
- `productName`, `productSku` - Product information
- `quantity` - Item quantity
- `unitPrice`, `salePrice`, `costPrice` - Pricing
- `subtotal`, `taxAmount`, `discountAmount`, `totalAmount` - Financial breakdown
- `size`, `weight`, `volume` - Product specifications
- `customization` - JSON customization options
- `specialInstructions` - Item-specific instructions
- `preparationTime` - Preparation time in minutes
- `isPrepared`, `preparedAt`, `preparedBy` - Preparation tracking
- `stockReserved`, `stockConsumed` - Inventory tracking
- `qualityCheck`, `qualityCheckedBy`, `qualityCheckedAt`, `qualityNotes` - Quality control
- `isRefunded`, `refundAmount`, `refundReason`, `refundedBy`, `refundedAt` - Refund information
- `productSnapshot` - JSON product state at time of order

**Relationships:**

- Belongs to Order
- Belongs to Admin (prepared, quality checked, refunded)

### 8. Payment Model

**Table:** `payments`
**Purpose:** Comprehensive payment transaction tracking

**Key Fields:**

- `id` - Primary key
- `orderId`, `userId` - References
- `paymentNumber` - Unique payment identifier
- `transactionId` - Gateway transaction ID
- `paymentMethod` - ENUM: cash, card, mobile_money, bank_transfer, paypal, stripe, apple_pay, google_pay
- `paymentGateway` - Payment processor
- `status` - ENUM: pending, processing, completed, failed, cancelled, refunded, partially_refunded
- `amount`, `currency`, `exchangeRate`, `amountInBaseCurrency` - Financial information
- `cardLast4`, `cardBrand`, `cardExpiryMonth`, `cardExpiryYear` - Card information
- `bankName`, `accountNumber`, `routingNumber` - Bank transfer details
- `mobileProvider`, `mobileNumber` - Mobile money details
- `processingFee`, `gatewayFee`, `netAmount` - Fee breakdown
- `processedAt`, `completedAt`, `failedAt`, `refundedAt` - Timing information
- `gatewayResponse`, `gatewayError`, `gatewayErrorCode` - Gateway communication
- `refundAmount`, `refundReason`, `refundTransactionId`, `refundedBy` - Refund details
- `ipAddress`, `userAgent`, `deviceFingerprint` - Security information
- `riskScore`, `isHighRisk`, `riskFactors` - Risk assessment
- `isDisputed`, `disputeReason`, `disputeDate`, `disputeResolvedAt`, `disputeResolution` - Dispute handling
- `receiptNumber`, `receiptUrl` - Receipt information
- `adminNotes`, `customerNotes` - Notes

**Relationships:**

- Belongs to Order
- Belongs to User
- Belongs to Admin (refunded, created)

## Database Relationships

### One-to-Many Relationships:

- User → Orders
- User → Payments
- Category → Fruits
- Category → Juices
- Admin → Orders (assigned, prepared, delivered)
- Admin → OrderItems (prepared, quality checked)
- Admin → Payments (refunded)
- Order → OrderItems
- Order → Payments

### Many-to-One Relationships:

- Fruits → Category
- Juices → Category
- Orders → User
- OrderItems → Order
- Payments → Order
- Payments → User

### Self-Referential Relationships:

- Category → Category (parent-child hierarchy)

## Indexes and Performance

### Primary Indexes:

- All primary keys (id fields)
- Unique constraints (email, username, sku, barcode, etc.)

### Secondary Indexes:

- Status fields (isActive, isAvailable, status, paymentStatus)
- Foreign keys (userId, categoryId, orderId, etc.)
- Search fields (name, slug, orderNumber, paymentNumber)
- Date fields (createdAt, updatedAt, delivery times)
- Business logic fields (price, rating, stockQuantity)

## Data Validation

### Built-in Validations:

- Email format validation
- String length constraints
- Numeric range validation
- ENUM value restrictions
- Minimum/maximum value checks

### Custom Validations:

- Password strength requirements
- Phone number format validation
- Currency code validation
- GPS coordinate validation

## Security Features

### Data Protection:

- Password hashing (bcrypt recommended)
- Sensitive data encryption
- Card information masking
- IP address logging
- Device fingerprinting

### Access Control:

- Role-based permissions
- Granular admin permissions
- Audit trail tracking
- Risk assessment scoring

## Business Logic

### Inventory Management:

- Stock quantity tracking
- Reserved stock management
- Minimum/maximum stock levels
- Low stock alerts

### Order Processing:

- Status workflow management
- Staff assignment tracking
- Quality control processes
- Preparation time tracking

### Payment Processing:

- Multi-gateway support
- Currency conversion
- Fee calculation
- Refund handling

### Customer Experience:

- Order tracking
- Delivery time estimation
- Customer feedback
- Review system

## Scalability Considerations

### Performance:

- Comprehensive indexing strategy
- Efficient query optimization
- Connection pooling
- Caching strategies

### Data Integrity:

- Foreign key constraints
- Transaction management
- Data validation
- Audit logging

### Business Growth:

- Multi-currency support
- Multi-location support
- API extensibility
- Third-party integrations

This comprehensive model structure supports a full-featured fruit shop management system with all the necessary components for real-world e-commerce operations.
