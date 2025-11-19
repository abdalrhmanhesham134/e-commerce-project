# E-Commerce Project

A full-stack e-commerce website built with React 19, Express 4, tRPC 11, Tailwind CSS 4, and MySQL database. Features user authentication with role-based access control, admin dashboard with XLSX product import, and a complete product management system.

## Features

### Core Features
- **User Authentication**: Manus OAuth integration with three user roles (customer, shop_manager, administrator)
- **Product Management**: Full CRUD operations for products with barcode as primary key
- **Admin Dashboard**: XLSX file upload for bulk product import with template download
- **Product Filtering**: Filter by color, price range, and search by name
- **Order Management**: Customers can place orders and view order history
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

### Database Schema
- **users**: User accounts with role-based access control
- **products**: Product catalog with name, price, color, description, barcode, and image URL
- **orders**: Customer orders with status tracking
- **order_items**: Individual items within orders

### User Roles
- **Customer**: Browse products, place orders, view order history
- **Shop Manager**: View sales and inventory (extensible)
- **Administrator**: Full system access, product management, XLSX import/export

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | React 19, TypeScript, Tailwind CSS 4 |
| Backend | Express 4, tRPC 11, Node.js |
| Database | MySQL with Drizzle ORM |
| Authentication | Manus OAuth |
| Testing | Vitest |
| Build Tool | Vite |

## Project Structure

```
e-commerce-project/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── pages/            # Page components (Home, Products, Admin, etc.)
│   │   ├── components/       # Reusable UI components
│   │   ├── contexts/         # React contexts (Theme, etc.)
│   │   ├── lib/              # tRPC client setup
│   │   ├── App.tsx           # Main app with routing
│   │   └── index.css         # Global styles
│   └── public/               # Static assets
├── server/                    # Backend Express application
│   ├── routers.ts            # tRPC procedure definitions
│   ├── db.ts                 # Database query helpers
│   ├── xlsx-handler.ts       # XLSX file parsing utility
│   ├── *.test.ts             # Vitest test files
│   └── _core/                # Framework core (OAuth, context, etc.)
├── drizzle/                   # Database schema and migrations
│   └── schema.ts             # Table definitions
├── storage/                   # S3 file storage helpers
└── shared/                    # Shared constants and types
```

## Getting Started

### Prerequisites
- Node.js 22.13.0 or higher
- pnpm package manager
- MySQL database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/abdalrhmanhesham134/e-commerce-project.git
cd e-commerce-project
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
# Create .env.local file with required variables
# (Automatically provided in Manus platform)
```

4. Push database schema:
```bash
pnpm db:push
```

5. Start development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Usage

### For Customers
1. Visit the home page and browse products
2. Use the Products page to search and filter items
3. Create an account or login
4. View your profile and order history on the Account page

### For Administrators
1. Login with administrator account
2. Navigate to the Admin Dashboard
3. Download the XLSX template
4. Fill in product data (barcode, name, price, color, description, image URL)
5. Upload the XLSX file to import products
6. Manage products directly in the dashboard

### XLSX Template Format

| Column | Type | Required | Example |
|--------|------|----------|---------|
| Product Name | Text | Yes | "Wireless Headphones" |
| Price | Number | Yes | 99.99 |
| Color | Text | No | "Black" |
| Description | Text | No | "High-quality audio" |
| Barcode | Text | Yes | "PROD-001" |
| Product Image | URL | No | "https://example.com/image.jpg" |

## API Endpoints

All API endpoints use tRPC and are available at `/api/trpc/`

### Products
- `products.list` - Get all products
- `products.search` - Search products with filters
- `products.create` - Create new product (admin only)
- `products.update` - Update product (admin only)
- `products.delete` - Delete product (admin only)

### Orders
- `orders.getUserOrders` - Get user's orders (authenticated)
- `orders.getOrderItems` - Get items in an order (authenticated)
- `orders.create` - Create new order (authenticated)

### Admin
- `admin.getXLSXTemplate` - Download XLSX template (admin only)
- `admin.uploadProducts` - Upload XLSX file (admin only)

### Authentication
- `auth.me` - Get current user info
- `auth.logout` - Logout current user

## Testing

Run the test suite:
```bash
pnpm test
```

Test files include:
- `server/auth.logout.test.ts` - Authentication tests
- `server/products.test.ts` - Product management tests
- `server/admin.test.ts` - Admin operations tests
- `server/orders.test.ts` - Order management tests

All 23 tests pass successfully.

## Pages

### Public Pages
- **Home** (`/`) - Landing page with featured products and company information
- **Products** (`/products`) - Product catalog with search and filtering
- **About** (`/about`) - Company information and mission
- **Contact** (`/contact`) - Contact form and information

### Authenticated Pages
- **Account** (`/account`) - User profile and order history
- **Admin** (`/admin`) - Admin dashboard (administrator only)

## Database Migrations

To update the database schema:

1. Edit `drizzle/schema.ts`
2. Run migration:
```bash
pnpm db:push
```

## Deployment

The project is ready for deployment on the Manus platform. Click the "Publish" button in the Management UI after creating a checkpoint.

## Environment Variables

The following environment variables are automatically provided:
- `DATABASE_URL` - MySQL connection string
- `JWT_SECRET` - Session signing secret
- `VITE_APP_ID` - OAuth application ID
- `OAUTH_SERVER_URL` - OAuth server URL
- `VITE_OAUTH_PORTAL_URL` - OAuth portal URL
- `BUILT_IN_FORGE_API_URL` - Built-in APIs URL
- `BUILT_IN_FORGE_API_KEY` - Built-in APIs key
- `VITE_APP_TITLE` - Application title
- `VITE_APP_LOGO` - Application logo URL

## File Storage

Product images and files are stored in S3. The storage helpers are pre-configured in `server/storage.ts`:
- `storagePut()` - Upload files to S3
- `storageGet()` - Get presigned URLs for downloads

## Contributing

To contribute to this project:

1. Create a feature branch
2. Make your changes
3. Write tests for new features
4. Run `pnpm test` to verify
5. Commit and push to GitHub
6. Create a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the development team.

## Roadmap

### Planned Features
- Shopping cart functionality
- Checkout and payment processing
- Product reviews and ratings
- Inventory management for shop managers
- Sales analytics dashboard
- Email notifications
- Product recommendations
- Wishlist functionality

### Future Enhancements
- Mobile app (React Native)
- Advanced search with AI
- Multi-language support
- Multi-currency support
- Subscription products
- Digital product downloads

---

**Created with ❤️ for seamless e-commerce experiences**
