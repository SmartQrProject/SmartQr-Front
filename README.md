# 🍽️ SmartQr Frontend

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-008CDD?style=for-the-badge&logo=stripe&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![Auth0](https://img.shields.io/badge/Auth0-EB5424?style=for-the-badge&logo=auth0&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![MapBox](https://img.shields.io/badge/MapBox-000000?style=for-the-badge&logo=mapbox&logoColor=white)

</div>

## 📋 Description

SmartQr Frontend is a modern, responsive web application built with Next.js 15 that provides a seamless interface for restaurant management and digital menu ordering. The platform offers real-time order tracking, secure payments, and an intuitive management dashboard for restaurant owners.

## ⚡ Key Features

- 🔐 **Authentication & User Management**
  - Auth0 integration for secure authentication
  - Role-based access control
  - Protected routes and API endpoints
  - User profile management

- 🏪 **Restaurant Dashboard**
  - Comprehensive analytics and insights
  - Real-time order monitoring
  - Menu and category management
  - Table QR code generation
  - Staff management interface

- 📱 **Digital Menu System**
  - Dynamic QR code generation
  - Interactive menu interface
  - Category and product organization
  - Real-time menu updates
  - Image optimization and management

- 💳 **Payment Processing**
  - Secure Stripe integration
  - Multiple payment method support
  - Order tracking and history
  - Receipt generation
  - Reward code system

- 🗺️ **Location Services**
  - MapBox integration
  - Restaurant location management
  - Delivery zone configuration
  - Interactive maps interface

- 🔄 **Real-time Features**
  - Socket.io integration
  - Live order updates
  - Real-time notifications
  - Kitchen display system
  - Staff activity monitoring

## 🛠️ Technology Stack

### Core Framework & Language
- **Framework:** Next.js 15.3.1
- **UI Library:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4.1.6

### State Management & Forms
- **Form Management:** React Hook Form
- **Validation:** Zod
- **API Client:** Axios

### UI/UX Components
- **Components:** Headless UI
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Charts:** Recharts
- **Tooltips:** React Tooltip
- **Loading:** React Spinners

### Authentication & Security
- **Auth Provider:** Auth0
- **Token Management:** js-cookie
- **API Security:** NextAuth.js

### Media & Assets
- **Image Storage:** Cloudinary
- **Image Optimization:** browser-image-compression
- **QR Code:** next-qrcode

### Maps & Location
- **Maps Provider:** MapBox GL
- **Geocoding:** MapBox Services

### Payment Processing
- **Payment Gateway:** Stripe
- **PDF Generation:** html2pdf.js

### Real-time Communication
- **WebSocket:** Socket.io Client
- **Event Handling:** Custom hooks

## 📝 Component Structure

```typescript
src/
├── app/                 # Next.js app directory
├── components/          # Reusable UI components
├── config/             # Configuration files
├── helper/             # Helper functions
├── lib/                # Library code
├── libs/               # External library integrations
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## 🚀 Getting Started

### Prerequisites

- Node.js v20 or higher
- npm or yarn
- Auth0 account
- Stripe account
- Cloudinary account
- MapBox account

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/SmartQr-Front.git
cd SmartQr-Front
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
# Create a .env file with the following:
AUTH0_SECRET='your-auth0-secret'
AUTH0_BASE_URL='your-auth0-base-url'
AUTH0_ISSUER_BASE_URL='your-auth0-issuer-url'
AUTH0_CLIENT_ID='your-auth0-client-id'
AUTH0_CLIENT_SECRET='your-auth0-client-secret'
STRIPE_SECRET_KEY='your-stripe-secret'
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY='your-stripe-publishable-key'
CLOUDINARY_URL='your-cloudinary-url'
MAPBOX_TOKEN='your-mapbox-token'
```

4. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🔒 Security Features

- Secure authentication with Auth0
- Protected API routes
- Secure payment processing
- Input validation and sanitization
- XSS protection
- CSRF protection
- Secure HTTP headers
- Environment variable protection

## 📱 Responsive Design

The application is fully responsive and optimized for:
- 📱 Mobile devices
- 💻 Tablets
- 🖥️ Desktop computers
- 📺 Large screens

## 🚀 Deployment

This project is optimized for deployment on Vercel:
- Automatic deployments
- Edge functions support
- Image optimization
- API routes
- Environment variable management
  
---

<div align="center">
Made by Smart-Qr
</div>

