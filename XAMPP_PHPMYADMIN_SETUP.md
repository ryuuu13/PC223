# XAMPP & phpMyAdmin Setup Guide

## What is XAMPP?

**XAMPP** is a free, easy-to-use package that includes:
- **X** - Cross-Platform (Windows, Mac, Linux)
- **A** - Apache (Web Server)
- **M** - MySQL (Database Server) 
- **P** - PHP (Server-side scripting)
- **P** - Perl (Programming language)

**Plus: phpMyAdmin** - Easy web interface to manage your database

---

## Step 1: Download XAMPP

### For Windows:
1. Go to: https://www.apachefriends.org/download.html
2. Download **XAMPP for Windows** (latest version)
3. File size: ~150 MB
4. Current recommendation: **XAMPP 8.2** or **8.1**

### For Mac or Linux:
- Follow same link, select your OS

---

## Step 2: Install XAMPP

### Windows Installation:
1. **Run the installer** (`xampp-windows-x64-8.x.x-installer.exe`)
2. Click **Next** through the installation
3. Choose installation folder (default: `C:\xampp`)
4. Keep all components selected (Apache, MySQL, phpMyAdmin, etc.)
5. Click **Install**
6. When done, click **Finish**

### Post-Installation:
- XAMPP Control Panel will open
- You'll see buttons for: Apache, MySQL, phpMyAdmin, etc.

---

## Step 3: Start XAMPP Services

### Using XAMPP Control Panel:

1. **Open XAMPP Control Panel** (look in Start Menu or `C:\xampp\xampp-control.exe`)

2. **Start Apache:**
   - Click **Start** button next to Apache
   - Should turn **green** with "Running" status
   
3. **Start MySQL:**
   - Click **Start** button next to MySQL
   - Should turn **green** with "Running" status

4. **Verify it's working:**
   - Open browser and go to: `http://localhost`
   - You should see XAMPP welcome page ✓

---

## Step 4: Access phpMyAdmin

### Method 1: From XAMPP Control Panel
1. Click **Admin** button next to MySQL
2. phpMyAdmin opens automatically

### Method 2: Direct URL
1. Open browser
2. Go to: `http://localhost/phpmyadmin`
3. Login (default - no password needed)

### Method 3: From XAMPP Dashboard
1. Go to: `http://localhost`
2. Click **phpMyAdmin** in the menu

---

## Step 5: Create Your Database

### Using phpMyAdmin:

1. **Login to phpMyAdmin:**
   - URL: `http://localhost/phpmyadmin`
   - Username: `root`
   - Password: (leave empty)
   - Click **Go**

2. **Create New Database:**
   - Click **New** button (left sidebar)
   - Database name: `gymnarium`
   - Collation: `utf8mb4_unicode_ci`
   - Click **Create**

3. **Import Your Schema:**
   - Click on `gymnarium` database
   - Click **Import** tab
   - Click **Choose File**
   - Select `database.sql` from your PC223 folder
   - Click **Go**
   - Tables created! ✓

---

## Step 6: Update Your Configuration

### Edit `.env` file:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=gymnarium
PORT=5000
NODE_ENV=development
```

Note: `DB_PASSWORD` is empty (default XAMPP setup)

---

## Step 7: Run Your Server

```bash
cd C:\Users\Arnel Jr\PC223
npm install
npm start
```

Your server runs on: `http://localhost:5000`

---

## Using phpMyAdmin

### View Your Data:
1. Open `http://localhost/phpmyadmin`
2. Click `gymnarium` database in left sidebar
3. Click `bookings` table
4. You'll see all your bookings!

### Add Test Booking:
1. Click **Insert** tab
2. Fill in test data:
   - first_name: Juan
   - last_name: Dela Cruz
   - email: juan@example.com
   - etc.
3. Click **Go**

### View All Tables:
1. Click `gymnarium` in sidebar
2. See all 5 tables:
   - bookings
   - inquiries
   - admin_users
   - event_types
   - payments

### Run SQL Queries:
1. Click **SQL** tab
2. Paste queries from `USEFUL_QUERIES.sql`
3. Click **Go**
4. See results!

### View Booking Statistics:
Example query in phpMyAdmin:
```sql
SELECT 
    COUNT(*) as total_bookings,
    SUM(number_of_guests) as total_guests,
    COUNT(CASE WHEN booking_status = 'Confirmed' THEN 1 END) as confirmed
FROM bookings;
```

---

## Common phpMyAdmin Tasks

### 1. Export Database
- Right-click table or database
- Click **Export**
- Choose SQL format
- Click **Go**
- File downloads with all data

### 2. Delete a Booking
- Click `bookings` table
- Find the row
- Click the trash icon
- Confirm deletion

### 3. Update Booking Status
- Click `bookings` table
- Click the pencil icon on a row
- Change `booking_status` to "Confirmed"
- Click **Go**

### 4. View Database Structure
- Click table name
- Click **Structure** tab
- See all fields and their types

### 5. Create Backup
- Select database
- Click **Export**
- Choose SQL
- Save file
- Backup complete! ✓

---

## XAMPP Control Panel Reference

| Service | What It Does | Port |
|---------|-------------|------|
| Apache | Web server (for phpMyAdmin) | 80 |
| MySQL | Database server | 3306 |
| phpMyAdmin | Built-in (accessible via Apache) | - |
| Shell | Terminal access | - |

---

## Troubleshooting

### "Cannot start Apache"
- Close other programs using port 80 (Skype, email, etc.)
- Run XAMPP as Administrator
- Check firewall settings

### "Cannot start MySQL"
- Port 3306 might be in use by another MySQL installation
- Stop other instances first
- Or change MySQL port in XAMPP settings

### "phpMyAdmin shows blank page"
- Make sure Apache is running (green)
- Check `http://localhost` loads first
- Clear browser cache
- Restart Apache

### "Cannot connect to database from Node.js"
- Make sure MySQL is running (green in XAMPP)
- Check `.env` has correct credentials
- Use `localhost` or `127.0.0.1` for host
- Password should be empty for default setup

### "Error: Access denied for user 'root'"
- Check MySQL is actually running
- Verify username is `root`
- Leave password BLANK (not 'password')
- Restart MySQL service

---

## Next Steps

1. ✅ Download and install XAMPP
2. ✅ Start Apache and MySQL
3. ✅ Create `gymnarium` database
4. ✅ Import `database.sql`
5. ✅ Start Node.js server: `npm start`
6. ✅ Test booking form on website
7. ✅ View bookings in phpMyAdmin

---

## Access Your System

| What | URL | Purpose |
|------|-----|---------|
| XAMPP Home | `http://localhost` | Main dashboard |
| phpMyAdmin | `http://localhost/phpmyadmin` | Database management |
| Your Website | `http://localhost:3000` | Booking page (if using different port) |
| API Server | `http://localhost:5000` | Backend services |

---

## Quick Command Reference

### Start XAMPP Services:
```bash
# Windows - Open XAMPP Control Panel and click Start

# Or via Command Line:
cd C:\xampp
mysql -u root
```

### Stop Services:
- Click **Stop** in XAMPP Control Panel
- Or use task manager to end Apache/MySQL processes

### Access MySQL Command Line:
```bash
cd C:\xampp\mysql\bin
mysql -u root
```

### Import Database:
```bash
cd C:\xampp\mysql\bin
mysql -u root gymnarium < C:\Users\Arnel Jr\PC223\database.sql
```

---

## Pro Tips

1. **Auto-Start on Boot:**
   - XAMPP Control Panel → Service → Check "Svc" box
   - Services will auto-start when computer starts

2. **Use Strong MySQL Password:**
   - In phpMyAdmin, change root password
   - Update `.env` file with new password
   - Better security!

3. **Regular Backups:**
   - Use phpMyAdmin Export regularly
   - Save backups to separate folder
   - Protects against data loss

4. **Monitor Performance:**
   - Check MySQL status in phpMyAdmin
   - Watch concurrent connections
   - Optimize for many bookings

5. **Development vs Production:**
   - Use XAMPP for local development
   - Deploy to real server for production
   - Different host/password for production

---

## Security Note for Production

⚠️ **Important:** XAMPP is great for learning/development, but:
- Default root user with no password
- Not secure for production
- Only use locally or behind firewall

For production:
- Use professional hosting
- Set strong database passwords
- Use HTTPS/SSL
- Regular security updates
- Professional backups

---

## Useful Resources

- XAMPP Docs: https://www.apachefriends.org/faq.html
- phpMyAdmin Docs: https://www.phpmyadmin.net/
- MySQL Docs: https://dev.mysql.com/doc/
- Apache Docs: https://httpd.apache.org/docs/

---

## Video Tutorials

Search YouTube for:
- "XAMPP installation Windows"
- "phpMyAdmin tutorial"
- "MySQL with XAMPP"

---

Enjoy your local development environment! 🚀
