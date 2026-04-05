# Quick Start: XAMPP + phpMyAdmin + Booking System

## 🚀 5-Minute Setup

### Step 1: Download & Install XAMPP (2 min)
1. Go to: https://www.apachefriends.org
2. Download XAMPP for Windows
3. Run installer → Click Next → Install
4. Click Finish

### Step 2: Start Services (1 min)
1. Open XAMPP Control Panel
2. Click **Start** for Apache ✓
3. Click **Start** for MySQL ✓
4. Both should show **green** and "Running"

### Step 3: Create Database (1 min)
1. Click **Admin** button next to MySQL
2. phpMyAdmin opens
3. Click **New** → Name: `gymnarium` → **Create**
4. Then click **Import** → Choose `database.sql` → **Go**

### Step 4: Start Your App (1 min)
```bash
cd C:\Users\Arnel Jr\PC223
npm start
```

**Done!** Your system is ready 🎉

---

## 📍 Where to Find Everything

| What You Need | Where to Access | URL |
|---|---|---|
| **phpMyAdmin** (View database) | XAMPP Control Panel → Admin | `http://localhost/phpmyadmin` |
| **Your Website** | Browser | `http://localhost:5000` |
| **XAMPP Dashboard** | Browser | `http://localhost` |
| **Database Files** | Explorer | `C:\xampp\data\` |
| **Apache Config** | Text Editor | `C:\xampp\apache\conf\httpd.conf` |
| **MySQL Data** | Explorer | `C:\xampp\data\mysql\` |

---

## 🔍 How to View Your Bookings

### Method 1: phpMyAdmin (Visual)
1. Open: `http://localhost/phpmyadmin`
2. Click `gymnarium` database
3. Click `bookings` table
4. See all bookings displayed!

### Method 2: Your Admin Page
1. Go to: `http://localhost:5000`
2. Login to Admin panel
3. View bookings in table format

### Method 3: Command Line
```bash
cd C:\xampp\mysql\bin
mysql -u root gymnarium
SELECT * FROM bookings;
```

---

## ✏️ Common Tasks in phpMyAdmin

### View Total Bookings
1. Click `gymnarium` database
2. Click **SQL** tab
3. Paste:
```sql
SELECT COUNT(*) as total, SUM(number_of_guests) as guests 
FROM bookings;
```
4. Click **Go**

### Add a Test Booking
1. Click `bookings` table
2. Click **Insert** tab
3. Fill in fields and click **Go**

### Delete Old Bookings
1. Click `bookings` table
2. Check rows you want to delete
3. Delete button → Confirm

### Backup Your Database
1. Click `gymnarium` database
2. Click **Export**
3. Click **Go**
4. File downloads to your computer

### Restore from Backup
1. Click `gymnarium` database
2. Click **Import**
3. Choose backed-up SQL file
4. Click **Go**

---

## 🛠️ Control Panel Guide

### XAMPP Control Panel Buttons

```
┌─────────────────────────────────────────┐
│ Service  │ Port  │ PID  │ Start │ Admin │
├─────────────────────────────────────────┤
│ Apache   │ 80    │ ✓    │ Stop  │ -     │
│ MySQL    │ 3306  │ ✓    │ Stop  │ Admin │
│ FileZilla│       │ ⊘    │ Start │ -     │
│ Tomcat   │       │ ⊘    │ Start │ -     │
└─────────────────────────────────────────┘
```

- **Green** = Running ✓
- **Red** = Stopped ✗
- **Start/Stop** = Toggle service
- **Admin** = Open management interface

---

## 📊 Database Structure View

In phpMyAdmin, click each table to see structure:

### bookings
```
id (Primary Key)
first_name
last_name
email
phone
event_type
check_in
check_out
time_in
time_out
number_of_guests
days_duration
booking_status
created_at
updated_at
notes
```

### inquiries
```
id
name
email
phone
inquiry_type
message
status
created_at
updated_at
```

### Other Tables
- event_types
- admin_users
- payments (optional)

---

## 🐛 Troubleshooting Quick Fixes

### Apache won't start?
```
→ Close Skype (uses port 80)
→ Right-click XAMPP → Run as Administrator
→ Click Start again
```

### MySQL won't start?
```
→ Make sure only one XAMPP instance open
→ Restart MySQL service
→ Check Task Manager for mysql.exe
```

### Can't access phpMyAdmin?
```
→ Make sure Apache is running (green)
→ Try: http://localhost first
→ Clear browser cache (Ctrl+Shift+Del)
```

### Database connection fails from Node?
```
→ Check MySQL is running
→ Verify .env file has:
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=gymnarium
→ Restart Node server
```

### "Port 3306 already in use"?
```
→ Another MySQL is running
→ Kill process: taskkill /F /IM mysqld.exe
→ Restart XAMPP
```

---

## 📚 File Locations

```
C:\xampp\
├── apache\          (Web server files)
├── mysql\           (Database files)
├── php\             (PHP interpreter)
├── data\            (All databases stored here)
│   └── mysql\
│       └── gymnarium\  (Your database)
└── xampp-control.exe (Control panel)
```

Your bookings data is in: `C:\xampp\data\mysql\gymnarium\`

---

## 🚨 Important Ports

Make sure these ports are free:

- **Port 80** - Apache (web server)
- **Port 3306** - MySQL (database)
- **Port 5000** - Your Node.js server

Check what's using a port:
```bash
netstat -ano | findstr :3306
```

---

## 💾 Backup & Restore

### Backup Your Database
```bash
# Method 1: phpMyAdmin
# Click Export → Choose SQL → Go

# Method 2: Command Line
cd C:\xampp\mysql\bin
mysqldump -u root gymnarium > C:\Users\Arnel Jr\backup.sql
```

### Restore from Backup
```bash
# Method 1: phpMyAdmin
# Click Import → Choose file → Go

# Method 2: Command Line
cd C:\xampp\mysql\bin
mysql -u root gymnarium < C:\Users\Arnel Jr\backup.sql
```

---

## 📈 Monitoring Performance

### View Active Connections
1. phpMyAdmin → `gymnarium` database
2. Check server info at bottom

### View Table Sizes
1. Click `gymnarium` database
2. Scroll down to see table sizes

### Check Server Status
1. Click **Status** tab at top of phpMyAdmin
2. See connections, traffic, processes

---

## 🔐 Security Checklist

- [ ] Used XAMPP for local development only
- [ ] Plan to use real hosting for production
- [ ] Set strong MySQL password
- [ ] Regular database backups
- [ ] Updated .env file with real credentials
- [ ] Never commit password to Git
- [ ] Use HTTPS in production (#soon)

---

## ✅ Verification Checklist

- [ ] XAMPP installed
- [ ] Apache running (green)
- [ ] MySQL running (green)
- [ ] phpMyAdmin accessible at `http://localhost/phpmyadmin`
- [ ] Database `gymnarium` created
- [ ] Tables imported from `database.sql`
- [ ] `.env` file configured
- [ ] Node server starts: `npm start`
- [ ] Can create bookings on website
- [ ] Can view bookings in phpMyAdmin

---

## 📞 Need Help?

1. **Check status:** phpMyAdmin → Status tab
2. **View logs:** XAMPP → Apache → Logs
3. **Test query:** phpMyAdmin → SQL tab
4. **Command line:** `mysql -u root` → `SHOW DATABASES;`

---

## 🎯 Next Steps

1. ✅ Install XAMPP
2. ✅ Start services
3. ✅ Create database
4. ✅ Start Node server
5. ✅ Test booking form
6. ✅ View in phpMyAdmin
7. ✅ Create backups
8. ✅ Share with team
9. ✅ Deploy to production!

You're all set! 🚀
