# Next Store

An open-source e-commerce platform built with Next.js, Tailwind CSS, Supabase, and Stripe.

**[Live Demo](https://next-store-simonsruggis-projects.vercel.app)**

## Features

- **Storefront**: Full-featured e-commerce frontend with product catalog, search, filters
- **Shopping Cart**: Persistent cart with localStorage and sync for logged-in users
- **Checkout**: Multi-step checkout with address management
- **Payments**: Stripe, PayPal, and Cash on Delivery (COD)
- **Digital Products**: Secure download links with expiration and download limits
- **User Accounts**: Registration, login, password reset, order history
- **Admin Dashboard**: Complete CRUD for products, orders, customers, shipping
- **Authentication**: Supabase Auth with role-based access (customer/admin)
- **Security**: Row Level Security (RLS) on all database tables

## Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **UI**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Payments**: Stripe + PayPal
- **State Management**: Zustand
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Supabase account
- Stripe account
- PayPal developer account (optional)

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/next-store.git
cd next-store
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the migration file from `supabase/migrations/001_initial_schema.sql`
3. (Optional) Run `supabase/seed.sql` to add sample products
4. Copy your project URL and keys from Settings > API

### 4. Set up environment variables

Create a `.env.local` file and add the required environment variables.

See `docs/environment-variables.md` for the complete list.

### 5. Create an admin user

1. Register a new user through the app at `/register`
2. In Supabase Dashboard, go to Table Editor > profiles
3. Find your user and change `role` from `customer` to `admin`

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the storefront.
Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard) to access the admin dashboard.

## Deployment

### Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add all environment variables
4. Deploy

## License

MIT License
