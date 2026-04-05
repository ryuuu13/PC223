# Gymnatorium Booking System - Database Setup

I've created a complete database solution for your booking system! Here's everything you need:

## 📦 What's Included

### 1. **Database Schema** (`database.sql`)
   - **bookings** - Main table for all bookings
   - **inquiries** - Table for contact form submissions
   - **admin_users** - Admin login credentials
   - **event_types** - Reference data
   - **payments** - (Optional) Payment tracking

### 2. **Backend Server** (`server.js`)
   - Express.js API server
   - RESTful endpoints for CRUD operations
   - Statistics and analytics endpoints
   - CORS enabled for frontend communication

### 3. **Updated Frontend** (`script-database-version.js`)
   - Replace current `script.js` with this file
   - Connects to database via API
   - Real-time data synchronization
   - Full error handling

### 4. **Configuration Files**
   - `package.json` - Node.js dependencies
   - `.env.example` - Environment variables template

---

## 🚀 Quick Start (5 Steps)

### Step 1: Create Database
**Using MySQL:**
```bash
mysql -u root -p
CREATE DATABASE gymnatorium;
USE gymnatorium;
source database.sql;
```

**Or using SQLite:**
Just run the SQL file in your SQLite client

### Step 2: Install Node.js Packages
```bash
npm install
```

### Step 3: Configure Environment
1. Copy `.env.example` to `.env`
2. Update database credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=gymnatorium
```

### Step 4: Start the Server
```bash
npm start
```
Server runs at `http://localhost:5000`

### Step 5: Update Frontend
Replace the script reference in your HTML files:
```html
<!-- OLD: -->
<script src="../script.js"></script>

<!-- NEW: -->
<script src="../script-database-version.js"></script>
```

---

## 📊 Booking Table Structure

```
| Field              | Type        | Description                          |
|--------------------|-------------|--------------------------------------|
| id                 | INT         | Primary Key (Auto-increment)         |
| first_name         | VARCHAR     | Customer first name                  |
| last_name          | VARCHAR     | Customer last name                   |
| email              | VARCHAR     | Email address                        |
| phone              | VARCHAR     | Phone number                         |
| event_type         | VARCHAR     | Type of event (Wedding, Birthday...)  |
| other_event_type   | VARCHAR     | Custom event type if "Other"         |
| check_in           | DATE        | Booking start date                   |
| check_out          | DATE        | Booking end date                     |
| time_in            | TIME        | Check-in time (for same-day events) |
| time_out           | TIME        | Check-out time (for same-day events)|
| number_of_guests   | INT         | Number of expected guests            |
| days_duration      | INT         | Total days of booking                |
| booking_status     | VARCHAR     | Pending, Confirmed, Cancelled       |
| created_at         | TIMESTAMP   | Date booking was created             |
| updated_at         | TIMESTAMP   | Last update timestamp                |
| notes              | TEXT        | Admin notes                          |
```

---

## 🔗 API Endpoints Reference

### Bookings
```
POST   /api/bookings              Create new booking
GET    /api/bookings              Get all bookings
GET    /api/bookings/:id          Get specific booking
PUT    /api/bookings/:id          Update booking
DELETE /api/bookings/:id          Cancel booking
```

### Inquiries
```
POST   /api/inquiries             Submit new inquiry
GET    /api/inquiries             Get all inquiries
PUT    /api/inquiries/:id         Update inquiry status
```

### Analytics
```
GET    /api/stats                 Get booking statistics
GET    /api/booked-dates          Get all reserved dates
GET    /api/health                Check server status
```

---

## 💡 Example API Calls

### Create a Booking (JavaScript)
```javascript
const bookingData = {
    first_name: "Juan",
    last_name: "Dela Cruz",
    email: "juan@example.com",
    phone: "+63 917 123 4567",
    event_type: "Marriage",
    check_in: "2026-05-15",
    check_out: "2026-05-16",
    time_in: "09:00",
    time_out: "17:00",
    number_of_guests: 50,
    days_duration: 1
};

const response = await fetch('http://localhost:5000/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData)
});

const result = await response.json();
console.log('Booking ID:', result.id);
```

### Get All Bookings (JavaScript)
```javascript
const response = await fetch('http://localhost:5000/api/bookings');
const bookings = await response.json();
console.log(bookings);
```

### Get Statistics (JavaScript)
```javascript
const response = await fetch('http://localhost:5000/api/stats');
const stats = await response.json();
console.log('Total Bookings:', stats.total_bookings);
console.log('Total Guests:', stats.total_guests);
```

---

## 🔐 Admin Panel Integration

Your existing admin panel will work better with the database:

1. **Admin Login** - Store credentials in `admin_users` table
2. **View All Bookings** - Pull from database with sorting/filtering
3. **Manage Bookings** - Update status, add notes, view statistics
4. **Customer Inquiries** - Track all contact form submissions

---

## 🛠️ Troubleshooting

### Error: "Cannot connect to database"
- Check MySQL/PostgreSQL is running
- Verify `.env` credentials are correct
- Ensure database name is correct

### Error: "CORS error"
- Frontend and API must be on same domain or CORS must be enabled
- Server already has CORS enabled, so just verify the API_URL in script

### Error: "Module not found"
- Run `npm install` to install all dependencies

### Port 5000 already in use
- Change PORT in `.env` file
- Or find and close the process using that port

---

## 📈 Features

✅ **Real-time Database** - All bookings saved permanently
✅ **Conflict Detection** - Prevents double-booking
✅ **Statistics** - View booking trends and metrics
✅ **Inquiry Tracking** - Manage customer messages
✅ **Admin Dashboard** - Full CRUD operations
✅ **Responsive API** - Works with any frontend
✅ **Error Handling** - Comprehensive validation

---

## 🔄 Upgrade from localStorage

The new system maintains all your functionality while adding:
- Persistent data storage
- Multi-user access
- Better analytics
- Scalability
- Admin controls

No more lost data on browser clear!

---

## 📞 Support

For more details, see:
- `DATABASE_SETUP.md` - Detailed setup guide
- `server.js` - Backend implementation
- `script-database-version.js` - Frontend integration

Enjoy your new database-powered booking system! 🎉
