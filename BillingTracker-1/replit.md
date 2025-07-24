# Billing Software - Replit Application

## Overview

This is a modern billing software application built with React and Express.js, designed to manage customer billing and invoicing. The application features a clean, responsive UI for creating bills, managing products across different categories, and generating professional invoices.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: React hooks with local component state
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: Express sessions with PostgreSQL store
- **API Design**: RESTful endpoints for bill management
- **Development**: Hot reload with Vite middleware integration

## Key Components

### Data Models
- **Bills**: Core entity storing customer information, itemized purchases, tax calculations, and totals
- **Products**: Predefined catalog organized by categories (Snacks, Grocery, Hygiene)
- **Categories**: Three main product categories with different tax rates

### Frontend Components
- **CustomerDetails**: Form for capturing customer information
- **ProductCategory**: Interactive product selection with quantity inputs
- **BillArea**: Real-time bill preview with professional formatting
- **BillingSummary**: Tax calculations and bill finalization controls

### API Endpoints
- `GET /api/bills` - Retrieve all bills
- `GET /api/bills/:id` - Get specific bill by ID
- `GET /api/bills/number/:billNumber` - Get bill by bill number
- `POST /api/bills` - Create new bill
- `PUT /api/bills/:id` - Update existing bill
- `DELETE /api/bills/:id` - Delete bill
- `POST /api/create-payment-intent` - Create Stripe payment intent for bill processing

## Data Flow

1. **Product Selection**: Users select quantities for products across three categories
2. **Real-time Calculation**: Bill totals update automatically as quantities change
3. **Customer Input**: Customer details are captured via form inputs
4. **Bill Generation**: Complete bill with itemized breakdown, taxes, and totals
5. **Payment Processing**: Users can proceed to secure Stripe checkout for payment
6. **Data Persistence**: Bills are saved to PostgreSQL database via Drizzle ORM
7. **Bill Retrieval**: Historical bills can be searched and retrieved by number or ID

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **@hookform/resolvers**: Form validation integration
- **wouter**: Lightweight React router
- **zod**: Schema validation
- **date-fns**: Date formatting utilities

### UI Dependencies
- **@radix-ui/***: Accessible component primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **class-variance-authority**: Component variant management
- **clsx**: Conditional class names

### Payment Integration
- **@stripe/stripe-js**: Payment processing with Stripe
- **@stripe/react-stripe-js**: React Stripe components for checkout flow
- **stripe**: Server-side Stripe integration for payment intents

## Deployment Strategy

### Development
- Uses Vite development server with hot module replacement
- Express server runs in development mode with tsx
- Database migrations handled via Drizzle Kit
- Replit-specific optimizations for development environment

### Production
- Vite builds optimized client bundle
- ESBuild compiles server code for Node.js
- Static assets served from Express
- Database connection via environment variables
- Single process deployment suitable for Replit hosting

### Environment Configuration
- `DATABASE_URL`: PostgreSQL connection string
- `NODE_ENV`: Environment setting (development/production)
- `STRIPE_SECRET_KEY`: Stripe secret key for payment processing
- `VITE_STRIPE_PUBLIC_KEY`: Stripe publishable key for client-side integration
- Automatic database provisioning check on startup

## Changelog

```
Changelog:
- July 04, 2025. Initial setup
- July 04, 2025. Added Stripe payment processing integration
  - Created checkout page with secure payment form
  - Added payment success page with receipt printing
  - Integrated "Pay Now" button in billing summary
  - Added payment intent API endpoint
  - Configured Stripe with INR currency support
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```