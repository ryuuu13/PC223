# Database Setup Guide

## Database Schema Overview

Your Gymnatorium Booking System uses 5 main tables:

### 1. **bookings** - Store customer bookings
- Customer info (name, email, phone)
- Event details (type, dates, times, guests)
- Booking status and timestamps

### 2. **inquiries** - Store contact form submissions
- Customer contact info
- Inquiry type and message
- Status tracking (Unread, Read, etc.)

### 3. **admin_users** - Store admin credentials
- Username, password hash, email
- Login tracking and access control

### 4. **event_types** - Reference data
- List of event type options (Wedding, Birthday, etc.)

### 5. **payments** - (Optional) Track payments
- Link to booking_id
- Amount, date, payment method
- Payment status

---

## Setup Instructions

### Option 1: MySQL/MariaDB Setup

1. **Create Database**
   ```sql
   CREATE DATABASE gymnatorium;
   USE gymnatorium;
   ```

2. **Run SQL Schema**
   ```bash
   mysql -u root -p gymnatorium < database.sql
   ```

3. **Verify Tables**
   ```sql
   SHOW TABLES;
   ```

### Option 2: SQLite Setup

SQLite is great for development/testing. Use this query in your SQLite client:
```sql
-- Run database.sql but use SQLite syntax (already compatible)
```

### Option 3: PostgreSQL Setup

Replace `AUTO_INCREMENT` with `SERIAL` and create the database:
```sql
CREATE DATABASE gymnatorium;
```

---

## Backend Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and update:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=gymnatorium
PORT=5000
```

### 3. Run Server
```bash
npm start           # Production
npm run dev        # Development (auto-reload)
```

Server will run on `http://localhost:5000`

---

## API Endpoints

### Bookings
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:id` - Get specific booking
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking status/notes
- `DELETE /api/bookings/:id` - Cancel booking

### Inquiries
- `GET /api/inquiries` - Get all inquiries
- `POST /api/inquiries` - Submit new inquiry
- `PUT /api/inquiries/:id` - Update inquiry status

### Analytics
- `GET /api/stats` - Get booking statistics
- `GET /api/booked-dates` - Get all booked dates
- `GET /api/health` - Server health check

---

## Frontend Integration

Update your `script.js` to use the API instead of localStorage:

### Example: Submit Booking
```javascript
async function submitBooking(bookingData) {
    const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
    });
    return response.json();
}
```

### Example: Load Bookings
```javascript
async function loadBookings() {
    const response = await fetch('http://localhost:5000/api/bookings');
    const bookings = await response.json();
    displayBookings(bookings);
}
```

---

## Database Design Features

✅ **Relationships**: Foreign keys link payments to bookings
✅ **Indexes**: Faster queries on frequently searched fields (email, status, dates)
✅ **Timestamps**: Auto track creation/update times
✅ **Status Tracking**: Monitor booking status through pipeline
✅ **Scalability**: Designed to handle thousands of bookings

---

## Sample Booking Record

```json
{
    "id": 1,
    "first_name": "Juan",
    "last_name": "Dela Cruz",
    "email": "juan@example.com",
    "phone": "+63 917 123 4567",
    "event_type": "Marriage",
    "other_event_type": null,
    "check_in": "2026-05-15",
    "check_out": "2026-05-16",
    "time_in": "09:00",
    "time_out": "17:00",
    "number_of_guests": 50,
    "days_duration": 1,
    "booking_status": "Pending",
    "created_at": "2026-04-05T10:30:00Z",
    "updated_at": "2026-04-05T10:30:00Z",
    "notes": null
}
```

---

## Next Steps

1. Set up MySQL/PostgreSQL on your machine (or use SQLite for testing)
2. Import the database.sql schema
3. Install Node.js dependencies
4. Configure .env file with your database credentials
5. Run the server: `npm start`
6. Update frontend to call API endpoints
7. Test with Postman or curl

Good luck with your booking system! 🚀
