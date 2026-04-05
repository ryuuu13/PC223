# XAMPP & phpMyAdmin Visual Step-by-Step Guide

## COMPLETE VISUAL WALKTHROUGH

---

## PART 1: DOWNLOAD & INSTALL

### Step 1.1: Download XAMPP

**Go to:** https://www.apachefriends.org/download.html

You'll see options:
```
┌─────────────────────────────────────────┐
│  Choose Your Platform:                  │
│                                         │
│  ☐ 7.4.33 (PHP 7)  [Older]             │
│  ☑ 8.1.x (PHP 8)   [Recommended]       │
│  ☐ 8.2.x (PHP 8)   [Latest]            │
│                                         │
│  [Download for Windows - 64-bit]        │
│  (File size: ~150 MB)                   │
└─────────────────────────────────────────┘
```

**Click:** "XAMPP for Windows (64 Bit)" → Downloads to your Downloads folder

### Step 1.2: Run Installer

File: `xampp-windows-x64-8.x.x-installer.exe`

**Double-click** → Installer opens

```
Window shows:
   XAMPP Installation Wizard

Components:
   [✓] Apache
   [✓] MySQL
   [✓] FileZilla FTP Server
   [✓] Mercury Mail Server
   [✓] Tomcat
   [✓] PHP
   [✓] phpMyAdmin
   [✓] OpenSSL
```

Keep all **checked** (✓)

### Step 1.3: Choose Installation Folder

Default location is fine:
```
C:\xampp  ← Leave as is
```

Click **Next**

### Step 1.4: Ready to Install

Window shows:
```
Ready to install at:
C:\xampp

Click [Next] to continue
```

Click **Next** → Installation starts → Wait ~2 minutes

### Step 1.5: Installation Complete

```
Installation Complete!

[✓] Do you want to start the XAMPP Control Panel now?
[✓] Do you want to start Apache and MySQL?

Click [Finish]
```

Check both boxes → Click **Finish**

### Result:
XAMPP Control Panel opens with Apache and MySQL **already running** ✓

---

## PART 2: VERIFY XAMPP IS WORKING

### Step 2.1: Check Control Panel

**XAMPP Control Panel should show:**

```
┌──────────────────────────────────────┐
│ XAMPP Control Panel v3.3.0           │
├──────────────────────────────────────┤
│                                      │
│ Service      Port  PID   [Stop]      │
│ ─────────────────────────────────────│
│ Apache       80    1234  [green •]   │
│ MySQL        3306  5678  [green •]   │
│ FileZilla    21    ⊘     [Start]     │
│ Mercury      25    ⊘     [Start]     │
│ Tomcat       8080  ⊘     [Start]     │
│                                      │
└──────────────────────────────────────┘
```

**Both Apache and MySQL should be GREEN** ✓

If not green → Click **Start** button

### Step 2.2: Test in Browser

**Open browser → Type:** `http://localhost`

You should see:
```
    XAMPP
    
Splash Page Links:
✓ phpMyAdmin
✓ XAMPP Website
✓ FileZilla FTP
✓ Apache Status
✓ Configuration Files
✓ MySQL Console
✓ PHP Version Information
```

Success! ✓

---

## PART 3: CREATE YOUR DATABASE

### Step 3.1: Open phpMyAdmin

**Click the [Admin] button next to MySQL** (in XAMPP Control Panel)

OR

**Browser → Type:** `http://localhost/phpmyadmin`

You'll see:

```
┌─────────────────────────────────────┐
│ phpMyAdmin 5.1                      │
├─────────────────────────────────────┤
│                                     │
│ Login:                              │
│ Username: root              [✓]     │
│ Password: (empty)           [    ]  │
│ Server Choice: localhost    [✓]     │
│                                     │
│                        [Go]  [Reset]│
└─────────────────────────────────────┘
```

- Username: `root`
- Password: Leave empty
- Click **Go**

### Step 3.2: Welcome to phpMyAdmin

```
phpMyAdmin Dashboard shows:

Left Sidebar:
  + Information
  + Database
  + Search
  ...

Main Area:
  Databases:
  □ information_schema
  □ mysql
  □ performance_schema
  □ test
  
  [+ New]  [+ Create]  [Privileges]
```

### Step 3.3: Create New Database

**Click:** `[+ New]` button or `[+ Create]` at the bottom

Dialog appears:
```
┌─────────────────────────────────────┐
│ Create new database                 │
│                                     │
│ Database name:                      │
│ [gymnarium        ]                 │
│                                     │
│ Collation:                          │
│ utf8mb4_unicode_ci [dropdown]       │
│                                     │
│              [Create]  [Cancel]    │
└─────────────────────────────────────┘
```

- Type: `gymnarium`
- Collation: `utf8mb4_unicode_ci`
- Click **Create**

### Result:
```
✓ Database gymnarium has been created successfully
```

Success! ✓

---

## PART 4: IMPORT YOUR DATABASE SCHEMA

### Step 4.1: Open Navigator

**Click:** `gymnarium` in the left sidebar menu

```
Sidebar now shows:
  + gymnarium
    └ (empty - no tables yet)
```

### Step 4.2: Go to Import Tab

**Click:** `[Import]` tab at the top

```
┌────────────────────────────────────┐
│  SQL  |  Search  |  Import| Export  │
├────────────────────────────────────┤
│ Import data into                    │
│ database: gymnarium                 │
│                                     │
│ File to import:                     │
│ [Choose File]  [Browse]             │
│                                     │
│ Format: [SQL dropdown]              │
│                                     │
│ Character set: [utf8mb4]            │
│                                     │
│              [Go]   [Clear]         │
└────────────────────────────────────┘
```

### Step 4.3: Choose Your SQL File

**Click:** `[Choose File]`

File browser opens:
```
Navigate to: C:\Users\Arnel Jr\PC223

Select: database.sql
```

**Click:** database.sql → **Open**

Back in phpMyAdmin:
```
File to import: 
database.sql  [Browse]
```

### Step 4.4: Import

**Click:** `[Go]` button

```
Importing...
```

Wait a few seconds...

### Result:
```
✓ Import has been successfully finished

5 tables created:
  ✓ bookings
  ✓ inquiries
  ✓ admin_users
  ✓ event_types
  ✓ payments
```

Great! ✓ Your database is ready!

---

## PART 5: VIEW YOUR DATABASE

### Step 5.1: See All Tables

Left sidebar now shows:
```
+ gymnarium
  └ bookings (0 rows)
  └ inquiries (0 rows)
  └ admin_users (0 rows)
  └ event_types (5 rows)
  └ payments (0 rows)
```

### Step 5.2: View Bookings Table

**Click:** `bookings` under gymnarium

```
┌──────────────────────────────────────┐
│ Browse | Import | Structure | Export  │
├──────────────────────────────────────┤
│ Table gymnarium.bookings             │
│ 0 rows                               │
│                                      │
│ Showing rows 0 - 0                   │
│                                      │
│ (empty table - no bookings yet)      │
│                                      │
│ Column names display:                │
│ □ id | first_name | last_name | ... │
└──────────────────────────────────────┘
```

Perfect! Empty and ready for bookings ✓

### Step 5.3: View Event Types

**Click:** `event_types` table

```
┌────────────────────────────────┐
│ id | name          | created_at│
├────────────────────────────────┤
│ 1  | Marriage       | 2026-... │
│ 2  | Birthday       | 2026-... │
│ 3  | Graduation     | 2026-... │
│ 4  | Corporate      | 2026-... │
│ 5  | Other          | 2026-... │
└────────────────────────────────┘
```

Perfect! Reference data already loaded ✓

---

## PART 6: START YOUR NODE SERVER

### Step 6.1: Open Terminal

**Press:** `Ctrl + Shift + Esc` or open Windows Search

Type: `cmd` or `PowerShell`

Press **Enter**

### Step 6.2: Navigate to Your Folder

```bash
cd C:\Users\Arnel Jr\PC223
```

Then:
```bash
npm install
```

Wait for all packages to install... (~1-2 minutes)

### Step 6.3: Start Server

```bash
npm start
```

You should see:
```
listening on port 5000
Server running on http://localhost:5000
```

Success! ✓ Server is running!

---

## PART 7: TEST YOUR SYSTEM

### Step 7.1: Open Your Website

**Browser → Type:** `http://localhost:5000`

Your booking system homepage loads ✓

### Step 7.2: Make a Test Booking

1. **Fill booking form:**
   - Name: Juan Dela Cruz
   - Email: juan@test.com
   - Phone: 09171234567
   - Event: Wedding
   - Dates: Pick future dates
   - Guests: 50

2. **Click:** `Book Now`

```
✅ Booking submitted successfully! Your booking ID: 1
```

### Step 7.3: Check phpMyAdmin

Without closing anything:

1. **Go to:** `http://localhost/phpmyadmin`
2. **Click:** `gymnarium` → `bookings`

```
You now see:

┌──────────────────────────────────────┐
│ ID | First Name | Last Name | Email │
├──────────────────────────────────────┤
│ 1  | Juan       | Dela Cruz | juan@ │
└──────────────────────────────────────┘
```

**Your booking is in the database!** 🎉

---

## PART 8: MANAGE YOUR DATA IN phpMyAdmin

### Common Task 1: View All Booking Details

1. **Click:** `bookings` table
2. **Click:** row ID (e.g., `1`)
3. Edit dialog opens showing:
   - first_name
   - last_name
   - email
   - phone
   - event_type
   - check_in
   - check_out
   - number_of_guests
   - booking_status
   - created_at
   - etc.

### Common Task 2: Change Booking Status

1. **Click:** booking row
2. Find `booking_status` field
3. Change from `Pending` → `Confirmed`
4. Click **Go**
5. Status updated! ✓

### Common Task 3: View Statistics

1. **Click:** `gymnarium` database
2. **Click:** `SQL` tab
3. **Paste:**
```sql
SELECT COUNT(*) as bookings, SUM(number_of_guests) as guests FROM bookings;
```
4. Click **Go**

```
Results:
bookings | guests
---------|--------
1        | 50
```

### Common Task 4: Export Database (Backup)

1. **Click:** `gymnarium` database
2. **Click:** `Export` tab
3. Format: `SQL`
4. Click **Go**
5. File downloads to computer
6. Backup complete! ✓

### Common Task 5: Delete Old Bookings

1. **Click:** `bookings` table
2. Check checkbox on rows to delete
3. **Delete** button appears below
4. Confirm deletion
5. Gone! ✓

---

## PART 9: YOUR COMPLETE SETUP

### What's Running Now?

```
┌─────────────────────────────────────┐
│ SERVICES RUNNING                    │
├─────────────────────────────────────┤
│ ✓ Apache (Port 80)                  │
│ ✓ MySQL (Port 3306)                 │
│ ✓ Node.js Server (Port 5000)        │
│ ✓ phpMyAdmin (Port 80/phpmyadmin)   │
└─────────────────────────────────────┘
```

### Where to Access Everything

| What | URL | Purpose |
|------|-----|---------|
| Booking Website | http://localhost:5000 | Make bookings |
| Admin Login | http://localhost:5000/admin | Admin dashboard |
| phpMyAdmin | http://localhost/phpmyadmin | Manage database |
| XAMPP Dashboard | http://localhost | XAMPP home |

### Database Structure

```
gymnarium/
├── bookings (stores customer bookings)
├── inquiries (customer messages)
├── admin_users (admin login)
├── event_types (reference data)
└── payments (payment records)
```

---

## PART 10: QUICK REFERENCE

### Control Panel

**To Start/Stop Services:**
1. Open XAMPP Control Panel
2. Click **Start/Stop** next to Apache
3. Click **Start/Stop** next to MySQL

### phpMyAdmin

**To Manage Database:**
1. Open `http://localhost/phpmyadmin`
2. Login (root, no password)
3. Use left sidebar to browse tables

### Your Server

**To Start Your App:**
1. Open Terminal
2. cd C:\Users\Arnel Jr\PC223
3. npm start

### File System

**Database files located at:**
- C:\xampp\data\mysql\gymnarium\

**Your app files located at:**
- C:\Users\Arnel Jr\PC223\

---

## 🎉 SETUP COMPLETE!

You now have:
- ✅ XAMPP installed and running
- ✅ phpMyAdmin for database management
- ✅ Database created with 5 tables
- ✅ Node.js server running
- ✅ Booking system functional
- ✅ Data persisting to database

**Congratulations!** Your production-ready booking system is live locally! 🚀

---

## What's Next?

1. **Add more test bookings** to see system work
2. **Explore phpMyAdmin** - run SQL queries
3. **Create admin user** - add credentials
4. **Test features** - date conflicts, status updates
5. **Cloud deployment** - when ready for production

Enjoy your system! 💪
