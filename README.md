<<<<<<< HEAD
# HCI Coils Backend API

This repository contains the backend API for the HCI Coils e-commerce platform, built with Node.js, Express, and MongoDB.

## Features

- User authentication and authorization
- Product management with multiple categories support
- Shopping cart functionality
- Order processing
- Employee management
- Enquiry handling
- Image upload to AWS S3
- API documentation with Swagger

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB database (local or Atlas)
- AWS S3 bucket for image storage

### Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd hci-coils-backend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:

   ```
   PORT=8080
   MONGODB_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
   AWS_REGION=<your-aws-region>
   AWS_ACCESS_KEY_ID=<your-aws-access-key>
   AWS_SECRET_ACCESS_KEY=<your-aws-secret-key>
   S3_BUCKET_NAME=<your-s3-bucket-name>
   ```

4. Start the development server:
   ```
   npm run dev
   ```

## Database Migration

If you need to migrate your products from the old schema (single category) to the new schema (multiple categories), you can use one of the provided migration scripts:

### Option 1: Run Migration Script Only

```
node utils/migrateCategoryToCategories.js
```

This script will:

- Find all products with the old `category` field
- Convert them to use the new `categories` array
- Remove the old `category` field
- Provide a detailed report of the migration

### Option 2: Run Migration and Restart Server

```
node scripts/migrate-categories-and-restart.js
```

This script will:

- Run the same migration as Option 1
- Then automatically restart your development server using `npm run dev`
- Show logs from both processes

**Important Notes:**

- The migration script only needs to be run once, not on every server restart
- Option 2 is a convenience that runs the migration and then starts your server in a single command
- After migration, you should return to using the regular `npm run dev` command for development

## API Endpoints

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:productId` - Get a product by ID
- `GET /api/products/category/:categoryName` - Get products by a single category
- `GET /api/products/categories?categories=cat1,cat2&matchAll=true` - Get products by multiple categories
- `POST /api/products` - Create a new product (with image upload)
- `PUT /api/products/:productId` - Update a product
- `DELETE /api/products/:productId` - Delete a product

### Users

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Cart

- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update cart item
- `DELETE /api/cart/:itemId` - Remove item from cart

### Orders

- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create a new order
- `GET /api/orders/:orderId` - Get order details
- `PUT /api/orders/:orderId/status` - Update order status

### Enquiries

- `POST /api/enquiry` - Create a new enquiry
- `GET /api/enquiry` - Get all enquiries
- `GET /api/enquiry/:enquiryId` - Get enquiry details

## Multiple Categories for Products

Products now support multiple categories. When creating or updating a product:

- You can specify multiple categories for a product
- Search and filter products by one or multiple categories
- Use match all (AND) or match any (OR) logic when filtering by multiple categories

### Example for Creating a Product with Multiple Categories (form-data):

```
name: Gaming Laptop
categories: Electronics
categories: Computers
categories: Gaming
description: High-performance gaming laptop
price: 1299.99
sku: LAP-GAM-2023
file: [laptop-image.jpg]
```

## Documentation

API documentation is available at `/api-docs` when the server is running.

### Updating Swagger Documentation

If you make changes to the API endpoints or models, you need to regenerate the Swagger documentation:

```
node swagger.js
```

This will update the `swagger-output.json` file with the latest API definitions. The updated documentation will be available at `/api-docs` when the server is running.

## Development

- This project uses Nodemon for hot-reloading during development
- Code structure follows the MVC pattern
- Mongoose is used as the MongoDB ODM
- Authentication is implemented using JWT
- File uploads are handled with Multer and stored in AWS S3

## License

[ISC License](LICENSE)
=======
# hci-backend
main
>>>>>>> e5f221c7cf9aa63d05d044ba15f77919a9139d05
