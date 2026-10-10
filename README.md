# Sukoon by Pallavi — Women's Fashion E-Commerce Website

An elegant, minimal, mobile-friendly e-commerce website for **Sukoon by Pallavi**, founded by **Pallavi Gupta** (Contact: **+91 7006181540**). Designed with a warm cream, beige, and black palette reflecting Indian fashion boutique aesthetics.

---

## 🌟 Features

- **Storefront & Categories:**
  - Dedicated pages and filters for:
    - **Kurtas & Kurtis**
    - **Suits**
    - **Sarees**
    - **Western Dresses**
  - Instant live search by product name and description.
  - Sort by price (low to high, high to low) and newest arrivals.
- **Product Detail Experience:**
  - Multi-image gallery with clickable thumbnail selector.
  - Interactive Size and Colour selection chips.
  - Stock level indicators (In Stock, Low Stock, Out of Stock).
  - Quantity counter with stock limit validation.
  - Single-product direct WhatsApp order button.
  - Add to Shopping Bag button with instant feedback.
- **Shopping Bag (Cart):**
  - Fully persistent cart stored in browser `localStorage`.
  - Item listing with size, colour, line item price, and quantity controls.
  - Real-time subtotal and total calculations.
  - Item removal with toast notifications.
  - One-click **Order via WhatsApp** button that creates a pre-filled, formatted order summary for WhatsApp chat with the business owner.
- **Owner & Brand Story:**
  - Founder section featuring Pallavi Gupta's uploaded photograph and boutique story.
  - Direct contact links via phone and WhatsApp.
- **Secure Admin Dashboard (`/admin.html`):**
  - Server-side session authentication with `bcrypt` password hashing.
  - Dashboard statistics: Total products, In stock, Out of stock, Featured count.
  - Product management table with quick status badges and action buttons.
  - Modal for adding and editing products:
    - Multiple image upload with client-side drag-and-drop preview.
    - Tag input for available sizes and colours (press Enter or comma).
    - Stock quantity and pricing/discount fields with validation.
    - Featured, New Arrival, and Availability toggles.
  - Deletion confirmation dialog with automatic image cleanup.
  - Secure session logout.

---

## 📁 Project Structure

```text
website/
├── admin.html               # Admin login & product management dashboard
├── cart.html                # Shopping bag & WhatsApp checkout page
├── index.html               # Boutique homepage with hero, categories, about & contact
├── product.html             # Dedicated product detail page with gallery & options
├── shop.html                # Product catalog with category filters, search & sorting
├── package.json             # Backend dependencies and run scripts
├── .env.example             # Example environment configuration
├── .env                     # Local environment secrets & settings
├── backend/
│   ├── database.js          # SQLite connection and table initialization
│   ├── seed.js              # Script to seed database with sample boutique catalog
│   ├── server.js            # Express server (REST API, sessions, file uploads)
│   └── data/
│       └── sukoon.db        # SQLite database file (created automatically)
├── css/
│   ├── style.css            # Storefront design system (typography, layouts, responsive)
│   └── admin.css            # Admin dashboard styling
├── js/
│   ├── config.js            # Business details, WhatsApp number, and default catalog
│   ├── main.js              # Shared utilities (cart, toast, menu, product cards, API fetch)
│   ├── shop.js              # Shop page filtering, search, and sorting logic
│   ├── product.js           # Product detail page logic (gallery, sizes, add-to-bag)
│   ├── cart.js              # Cart management and WhatsApp checkout builder
│   └── admin.js             # Admin dashboard operations and authentication
└── images/
    ├── owner.jpg            # Pallavi Gupta founder portrait
    └── products/
        └── uploads/         # Uploaded product photographs
```

---

## 🚀 Running the Website Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (bundled with Node.js)

### 1. Configure Environment Variables
Copy `.env.example` to `.env` (already created):
```bash
cp .env.example .env
```

Review or modify `.env`:
```env
PORT=3000
ADMIN_USERNAME=admin
ADMIN_PASSWORD=Sukoon@Pallavi2026
SESSION_SECRET=your_random_secure_session_secret
MAX_UPLOAD_SIZE=5
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Seed the Database
Populate the SQLite database with the curated boutique sample products:
```bash
npm run seed
```

### 4. Start the Server
```bash
npm start
```

Open your browser and navigate to:
- **Storefront:** [http://localhost:3000](http://localhost:3000)
- **Admin Dashboard:** [http://localhost:3000/admin.html](http://localhost:3000/admin.html)

---

## 🔐 Admin Authentication Credentials

By default:
- **Username:** `admin`
- **Password:** `Sukoon@Pallavi2026`

To change the admin password:
1. Update `ADMIN_PASSWORD` in your `.env` file.
2. If the user already exists in `backend/data/sukoon.db`, update it or remove `backend/data/sukoon.db` and restart the server to recreate the admin user with the new hash.

---

## 📷 Changing the Owner Photograph

The founder photograph is located at:
```text
images/owner.jpg
```
To replace it:
1. Save your photograph as a JPG image.
2. Replace `images/owner.jpg` with your file.
3. Refresh the homepage; the image in the **About** section will update automatically.

---

## 📱 WhatsApp Order Flow

1. The customer selects sizes, colours, and quantities and adds items to the shopping bag.
2. On the **Bag (`cart.html`)** page, clicking **"Order via WhatsApp"** opens WhatsApp Web or the WhatsApp app.
3. A pre-composed, structured message is generated addressed to **+91 7006181540** containing:
   - All product names and IDs.
   - Selected sizes and colours.
   - Individual quantities and prices.
   - Order subtotal and total.
4. The customer simply presses **Send** in WhatsApp to communicate directly with Pallavi.

---

## 🌐 Online Deployment Guide

### Deploying to Platforms (Render, Railway, DigitalOcean, VPS)

1. **Push your code to GitHub / Git repository.**
2. **Environment Variables:**
   Set the following environment variables in your hosting provider's dashboard:
   - `PORT=3000` (or leave default if provided by the host)
   - `ADMIN_USERNAME=your_chosen_admin_username`
   - `ADMIN_PASSWORD=your_secure_password`
   - `SESSION_SECRET=generate_a_long_random_string`
   - `MAX_UPLOAD_SIZE=5`
3. **Build & Start Command:**
   - **Build Command:** `npm install`
   - **Start Command:** `npm run seed && npm start` (or `npm start` after initial seed)
4. **Persistent Disk (Optional but Recommended):**
   If deploying on container platforms (like Render or Railway), attach a persistent volume to:
   - `backend/data/` (for the SQLite database)
   - `images/products/uploads/` (for uploaded product images)

---

## 📞 Business Contact

- **Brand:** Sukoon by Pallavi
- **Founder:** Pallavi Gupta
- **Phone / WhatsApp:** +91 7006181540
- **Location:** India
