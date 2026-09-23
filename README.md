# NexusEvents — Event Discovery & Management Platform

A modern, full-stack **Event Discovery and Management Platform** built for discovering exhibitions, trade shows, conferences, and business events. 

The application provides a public discovery experience with real-time search and filtering, alongside a full Admin Portal for managing event listings via complete CRUD operations.

---

## 🛠️ Technology Stack

- **Frontend:** React.js (Vite), Tailwind CSS, Lucide Icons, Axios, React Router DOM
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **ORM:** Sequelize
- **Architecture:** Monorepo (`/backend` + `/frontend`)

---

## ✨ Key Features & UX Polish

### 🌐 Public Event Discovery
- **Hero & Live Search:** Search events in real-time by event name, venue, or city.
- **Dynamic Filtering:** Filter events instantly by **Category** and **City**.
- **Visual Event Cards:** Cards featuring event image banners, date badges, venue metadata, and color-coded status badges (`UPCOMING`, `ONGOING`, `COMPLETED`).
- **Event Details Page:** Comprehensive page displaying high-res banners, venue maps, organizer information, date breakdowns, and external contact links.
- **UI/UX Polish:** Visual skeleton loading states during API fetching, custom empty states when searches yield 0 results, and responsive grid layouts for desktop and mobile.

### 🛡️ Admin Management (CRUD)
- **Dashboard Overview:** Metric cards displaying total event counts and active listings.
- **Data Table (Read):** Responsive table showcasing event banners, titles, dates, locations, categories, and status tags.
- **Unified Form Modal (Create & Update):** Single modal handling both new event creation (`POST`) and editing existing event details (`PUT`) with inline form validation.
- **Delete Safety Prompt (Delete):** Alert confirmation modal asking *"Are you sure you want to delete this event?"* before sending a `DELETE` request.
- **Toast Alerts:** Real-time feedback alerts when an event is added, updated, or removed.

---

## 📁 Project Structure

```text
event-discovery-platform/
├── backend/
│   ├── config/
│   │   └── database.js       # Sequelize PostgreSQL connection
│   ├── models/
│   │   └── Event.js          # Sequelize Event Model schema
│   ├── routes/
│   │   └── eventRoutes.js    # Express REST API endpoints
│   ├── seeders/
│   │   └── seedData.js       # Auto-seeding script for initial events
│   ├── .env                  # Backend environment variables
│   ├── server.js             # Express application entry point
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx    # Top navigation header with brand logo
    │   │   ├── EventCard.jsx # Grid card component
    │   │   └── EventModal.jsx# Reusable Create/Edit form modal
    │   ├── pages/
    │   │   ├── Home.jsx       # Event discovery page with search & filters
    │   │   ├── EventDetail.jsx# Full details page
    │   │   └── Admin.jsx      # Admin CRUD dashboard & delete modal
    │   ├── App.jsx            # React Router setup & Toast container
    │   ├── main.jsx           # Entry point
    │   └── index.css          # Tailwind CSS directives
    ├── index.html
    ├── tailwind.config.js
    └── package.json
