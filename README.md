<div align="center">

# 🛒 SADBHAVNA MART (सद्भावना मार्ट)
### *Mobile-First Hostel Quick-Commerce & Late-Night Essentials Web Platform*

[![Platform](https://img.shields.io/badge/Platform-Mobile%20Web%20%7C%20PWA%20Ready-blue.svg?style=for-the-badge&logo=googlechrome&logoColor=white)](https://github.com/jayprakashkkk/Sadbhavna_files)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://github.com/jayprakashkkk/Sadbhavna_files)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://github.com/jayprakashkkk/Sadbhavna_files)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://github.com/jayprakashkkk/Sadbhavna_files)
[![Font Awesome](https://img.shields.io/badge/Font_Awesome-6.5.1-528DD7?style=for-the-badge&logo=fontawesome&logoColor=white)](https://fontawesome.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

<br/>

**Sadbhavna Mart** is a lightweight, mobile-first quick commerce web application specifically designed for hostel campuses and student residences. It solves late-night food cravings and emergency stationery/grocery needs by enabling students to browse daily essentials, manage a shopping cart, and place door-to-door room delivery orders directly via WhatsApp with zero setup latency.

[Key Features](#-key-features) • [Catalog & Products](#-store-catalog--product-categories) • [App Architecture](#-application-architecture--pages) • [Tech Stack](#-technology-stack) • [Quick Start](#-quick-start) • [UI/UX Showcase](#-uiux-design-highlights)

---

</div>

## 📑 Table of Contents

- [About The Project](#-about-the-project)
- [✨ Key Features](#-key-features)
- [🏪 Store Catalog & Product Categories](#-store-catalog--product-categories)
- [📱 Application Architecture & Pages](#-application-architecture--pages)
  - [1. Storefront & Product Feed (`index.html`)](#1-storefront--product-feed-indexhtml)
  - [2. Category Browser (`category.html`)](#2-category-browser-categoryhtml)
  - [3. Order History & Tracking (`orders.html`)](#3-order-history--tracking-ordershtml)
  - [4. Student Profile & Address Hub (`profile.html`)](#4-student-profile--address-hub-profilehtml)
  - [5. Wishlist & Bookmarked Cravings (`wishlist.html`)](#5-wishlist--bookmarked-cravings-wishlisthtml)
  - [6. Authentication & Access (`login.html`)](#6-authentication--access-loginhtml)
  - [7. Store Information & Policies (`about.html`, `policy.html`, `terms.html`)](#7-store-information--policies)
- [🛍️ Order & Delivery Workflow](#-order--delivery-workflow)
- [🛠️ Technology Stack](#-technology-stack)
- [🚀 Quick Start (Local Setup)](#-quick-start)
- [📂 Project Directory Structure](#-project-directory-structure)
- [📄 License & Credits](#-license--author)

---

## 🌟 About The Project

Late-night study sessions, exam preparation, and hostel living often bring sudden hunger pangs when campus cafeterias are closed and commercial delivery apps are either unavailable, charge exorbitant delivery fees, or are barred from entering hostel corridors.

**Sadbhavna Mart** was created to address this exact micro-market challenge:
- Provides a fast, frictionless digital catalog of popular hostel staples (Maggi, biscuits, snacks, tea, coffee, milk, chips).
- Direct WhatsApp checkout workflow that transmits the user's selected items, total cost, payment method, and exact hostel room number.
- Runs 100% on client-side technology with zero backend server dependencies or complicated database setups.

---

## ✨ Key Features

- **⚡ Instant WhatsApp Checkout**: Converts the shopping cart into a structured, pre-formatted WhatsApp order message sent directly to the hostel inventory coordinator.
- **📍 Room-Level Delivery Routing**: Native fields for hostel block and room numbers (`📍 Room 204`) ensure accurate delivery directly to the student's door.
- **💳 Multi-Payment Method Support**: Accommodates student payment preferences including UPI (Google Pay, PhonePe, Paytm) and Cash on Delivery (COD).
- **🛒 Dynamic Cart & State Persistence**: Local storage powered cart keeps items intact even if the browser is closed or refreshed.
- **📦 Order History Log**: Dedicated order tracking screen displays past orders, timestamp, items ordered, and total bills.
- **📦 Live Inventory & Low-Stock Alerts**: Tracks product quantities via `/api/stock` (Cloudflare Pages + Neon PostgreSQL) with `stock.json` fallback, automatically displays red **`Only X left`** warnings when `<= 5` remain, marks products **`Out of Stock`** at `0`, and deducts stock on WhatsApp checkout.
- **🖥️ Terminal Stock CLI (`stock.py`)**: Add or set product stock directly from the terminal (`python3 stock.py add "Chini" 50`), optionally pushing to `stock.json` (`--push`) or updating the live API (`--api`).
- **🌙 Cyberpunk Dark Mode Palette**: Ultra-sleek `#000` to `#0f172a` slate gradient aesthetic with high-contrast `#00ff99` neon emerald accents designed for night browsing.
- **📱 Bottom Navigation Bar**: Native app-like bottom navigation with smooth transitions between Home, Categories, Wishlist, and Profile.

---

## 🏪 Store Catalog & Product Categories

| Category | Available Inventory Items |
| :--- | :--- |
| **Instant Foods** | Classic 2-Minute Maggi, Cup Maggi, Instant Noodles |
| **Biscuits & Cookies** | Parle-G, Britannia Bourbon Chocolate Biscuits |
| **Crisps & Namkeen** | Kurkure Masala Munch, Tedhe Medhe, Potato Chips |
| **Beverages & Tea** | Premium Tea Leaves (Chaipatti), Instant Coffee Powder, Dairy Milk Packets |
| **Daily Pantry** | Refined White Sugar (Chini), Daily Hostel Essentials |

---

## 📱 Application Architecture & Pages

```
                       ┌───────────────────────────────┐
                       │     SADBHAVNA STOREFRONT      │
                       │         (index.html)          │
                       └──────────────┬────────────────┘
                                      │
         ┌──────────────┬─────────────┼──────────────┬──────────────┐
         ▼              ▼             ▼              ▼              ▼
   ┌───────────┐  ┌───────────┐ ┌───────────┐  ┌───────────┐  ┌───────────┐
   │Categories │  │  Orders   │ │ Wishlist  │  │  Profile  │  │ WhatsApp  │
   │category.  │  │orders.html│ │wishlist.  │  │profile.   │  │ Checkout  │
   │   html    │  │           │ │   html    │  │   html    │  │  Gateway  │
   └───────────┘  └───────────┘ └───────────┘  └───────────┘  └───────────┘
```

### 1. Storefront & Product Feed (`index.html`)
- Fullscreen animated **"Welcome to Sadbhavna Mart"** splash screen with instant zero-login storefront access.
- Prominent promotional banners and category filter pills.
- Interactive product cards displaying product image, title, pricing, and 1-tap "Add to Cart" CTA.
- Sticky slide-over cart drawer with increment/decrement counters and live price recalculations.

### 2. Category Browser (`category.html`)
- Interactive category filter tabs (*All*, *Biscuits & Snacks*, *Instant Meals*, *Beverages & Dairy*, *Daily Pantry*) with real-time search and `localStorage` cart/wishlist synchronization.

### 3. Order History & Tracking (`orders.html`)
- Automatically logs every WhatsApp checkout to `localStorage` (`orders`).
- Displays order IDs, timestamps, items ordered, payment mode, delivery room/hostel, and 1-tap **Reorder via WhatsApp** support.

### 4. Student Profile & Delivery Hub (`profile.html`)
- Interactive **Saved Delivery Details** modal (Name, Room Number, Hostel, Phone) that auto-fills the WhatsApp checkout form.
- Persistent **English / Hindi** language toggle, direct **WhatsApp Support** link, and quick navigation to Orders, Wishlist, and Store Policies.

### 5. Wishlist & Bookmarked Cravings (`wishlist.html`)
- Synced with `localStorage` (`sadbhavna_favs`) so students can view saved items, move them straight to cart, or remove them across pages.

### 6. Authentication & Access (`login.html`)
- Student sign-in and registration screen with clean responsive inputs.

### 7. Store Information & Policies
- **`about.html`**: The story, mission, and operating hours of Sadbhavna Mart.
- **`policy.html`**: Store policies covering returns, damaged goods, and delivery rules.
- **`terms.html`**: Terms and conditions of service.

---

## 🛍️ Order & Delivery Workflow

1. **Browse & Add**: Student explores items and adds desired quantities to cart.
2. **Review Cart**: Cart drawer calculates subtotal and order summary.
3. **Room Details**: Student enters room number and selects payment method (UPI / COD).
4. **WhatsApp Dispatch**: Tapping "Order via WhatsApp" launches WhatsApp with a pre-filled message:
   ```
   *New Order from Sadbhavna Mart!*
   👤 Student: Alex
   📍 Room: B-312
   📦 Items:
      - 2x Cup Maggi (₹80)
      - 1x Bourbon Biscuit (₹30)
      - 1x Cold Coffee (₹40)
   💰 Total: ₹150
   💳 Payment: UPI
   ```
5. **Fulfillment**: The store coordinator confirms the order and delivers it directly to the student's room.

---

## 🛠️ Technology Stack

- **Frontend**: Semantic HTML5 markup, modern CSS3 styling (Flexbox, CSS Grid, linear gradients, backdrop-filters).
- **Icons & Typography**: Font Awesome 6.5.1 vector iconography, system-native sans-serif fonts.
- **Client Logic & State**: Pure Vanilla JavaScript (ES6+), Web Storage API (`localStorage`) for cart, orders, and user profile persistence.
- **Communication Gateway**: WhatsApp Click-to-Chat API URI scheme integration.

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/jayprakashkkk/Sadbhavna_files.git
cd Sadbhavna_files
```

### 2. Launch in Browser
No Node.js, Python, or build steps required! Simply double-click `index.html` or run:
```bash
# macOS
open index.html

# Windows
start index.html

# Linux
xdg-open index.html
```

Or run with any local static HTTP server:
```bash
npx serve .
# or
python3 -m http.server 3000
```

### 3. Manage Product Stock from Terminal (`stock.py`)
```bash
# View current stock levels
python3 stock.py list

# Add 50 units to Chini and push to GitHub/Cloudflare Pages
python3 stock.py add "Chini" 50 --push

# Set exact stock (e.g., 5 left triggers red "Only 5 left" warning)
python3 stock.py set "Chini" 5

# Optional: Update live Cloudflare + Neon DB immediately without redeploy
python3 stock.py add "Chini" 50 --api https://sadbhavnamart.pages.dev/api/stock --key YOUR_ADMIN_KEY
```

*(To enable shared real-time stock across all visitors, set `NEON_SQL_URL`, `NEON_CONN_STR`, and `ADMIN_KEY` in Cloudflare Pages → Settings → Environment variables.)*

---

## 📂 Project Directory Structure

```
Sadbhavna_files/
├── index.html             # Main storefront, animated welcome splash, stock alerts & cart drawer
├── category.html          # Interactive category filter browser synced with stock & cart
├── orders.html            # Order history and WhatsApp reorder view
├── profile.html           # User profile, saved delivery details & settings
├── wishlist.html          # Synced favourite items
├── about.html             # About Sadbhavna Mart
├── policy.html            # Store delivery & privacy policies
├── terms.html             # Terms and conditions
├── stock.json             # Default product inventory manifest
├── stock.py               # Terminal CLI tool to add/set/list product stock
├── functions/api/stock.js # Cloudflare Pages Function for real-time shared stock
├── *.jpg / *.png          # Product imagery
└── README.md              # Project documentation
```

---

## 🎨 UI/UX Design Highlights

- **100% Fullscreen Fluid Responsive Layout**: Tailored for thumb-friendly navigation on iOS Safari and Android Chrome.
- **Glassmorphic Accents**: Subtle glassmorphism (`backdrop-filter: blur(6px)`) on top navigation and action buttons.
- **Zero Overhead**: Blazing-fast initial paint times with no external JavaScript bundles.

---

## 📄 License & Author

Created by **[Jay Prakash](https://github.com/jayprakashkkk)**.

Released under the **MIT License**. Feel free to adapt this for your own campus, dorm, or community grocery service!
