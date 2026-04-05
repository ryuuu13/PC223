-- Gymnatorium Booking System - Useful SQL Queries
-- Use these queries to test your database and get useful reports

-- ========== TESTING & VERIFICATION ==========

-- 1. Check all tables were created
SHOW TABLES;

-- 2. View bookings table structure
DESCRIBE bookings;

-- 3. View inquiries table structure
DESCRIBE inquiries;

-- ========== DATA VIEWING ==========

-- 4. View all bookings
SELECT * FROM bookings ORDER BY created_at DESC;

-- 5. View all inquiries
SELECT * FROM inquiries ORDER BY created_at DESC;

-- 6. View full bookings with calculated information
SELECT 
    id,
    CONCAT(first_name, ' ', last_name) as customer_name,
    email,
    phone,
    event_type,
    check_in,
    check_out,
    number_of_guests,
    booking_status,
    created_at
FROM bookings
ORDER BY check_in DESC;

-- ========== STATISTICS & REPORTING ==========

-- 7. Total bookings summary
SELECT 
    COUNT(*) as total_bookings,
    SUM(number_of_guests) as total_guests,
    COUNT(CASE WHEN booking_status = 'Confirmed' THEN 1 END) as confirmed,
    COUNT(CASE WHEN booking_status = 'Pending' THEN 1 END) as pending,
    COUNT(CASE WHEN booking_status = 'Cancelled' THEN 1 END) as cancelled,
    AVG(number_of_guests) as avg_guests_per_booking
FROM bookings;

-- 8. Bookings by event type
SELECT 
    event_type,
    COUNT(*) as bookings_count,
    SUM(number_of_guests) as total_guests,
    AVG(number_of_guests) as avg_guests
FROM bookings
GROUP BY event_type
ORDER BY bookings_count DESC;

-- 9. Bookings by date (shows availability)
SELECT 
    DATE(check_in) as booking_date,
    COUNT(*) as bookings_count,
    SUM(number_of_guests) as total_guests
FROM bookings
WHERE booking_status IN ('Confirmed', 'Pending')
GROUP BY DATE(check_in)
ORDER BY booking_date DESC;

-- 10. Popular event dates
SELECT 
    check_in,
    check_out,
    COUNT(*) as booking_count,
    SUM(number_of_guests) as total_guests
FROM bookings
WHERE booking_status != 'Cancelled'
GROUP BY check_in, check_out
HAVING booking_count > 0
ORDER BY booking_count DESC;

-- 11. Customer inquiry summary
SELECT 
    inquiry_type,
    COUNT(*) as inquiry_count,
    COUNT(CASE WHEN status = 'Unread' THEN 1 END) as unread_count,
    COUNT(CASE WHEN status = 'Read' THEN 1 END) as read_count
FROM inquiries
GROUP BY inquiry_type;

-- 12. Monthly booking report
SELECT 
    DATE_TRUNC('month', check_in) as month,
    COUNT(*) as bookings,
    SUM(number_of_guests) as guests
FROM bookings
WHERE booking_status != 'Cancelled'
GROUP BY DATE_TRUNC('month', check_in)
ORDER BY month DESC;
-- (Note: Use DATE_FORMAT for MySQL: DATE_FORMAT(check_in, '%Y-%m'))

-- ========== DATE RANGE QUERIES ==========

-- 13. Bookings for next 30 days
SELECT *
FROM bookings
WHERE check_in BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
AND booking_status IN ('Confirmed', 'Pending')
ORDER BY check_in ASC;

-- 14. Past bookings (completed)
SELECT *
FROM bookings
WHERE check_out < CURDATE()
ORDER BY check_out DESC;

-- 15. Upcoming confirmed bookings
SELECT 
    CONCAT(first_name, ' ', last_name) as customer,
    email,
    phone,
    event_type,
    check_in,
    check_out,
    number_of_guests
FROM bookings
WHERE booking_status = 'Confirmed'
AND check_in >= CURDATE()
ORDER BY check_in ASC;

-- ========== CUSTOMER QUERIES ==========

-- 16. Customer booking history
-- Replace 'juan@example.com' with actual email
SELECT *
FROM bookings
WHERE email = 'juan@example.com'
ORDER BY created_at DESC;

-- 17. Find bookings by phone number
-- Replace '+63 917 123 4567' with actual phone
SELECT *
FROM bookings
WHERE phone = '+63 917 123 4567'
ORDER BY created_at DESC;

-- 18. Repeat customers (booked more than once)
SELECT 
    email,
    CONCAT(first_name, ' ', last_name) as customer_name,
    COUNT(*) as booking_count,
    MIN(created_at) as first_booking,
    MAX(created_at) as last_booking
FROM bookings
WHERE booking_status != 'Cancelled'
GROUP BY email, customer_name
HAVING COUNT(*) > 1
ORDER BY booking_count DESC;

-- ========== AVAILABILITY QUERIES ==========

-- 19. Check specific date availability
-- Replace '2026-05-15' with date you want to check
SELECT *
FROM bookings
WHERE booking_status IN ('Confirmed', 'Pending')
AND check_in <= '2026-05-15'
AND check_out >= '2026-05-15';

-- 20. Booked vs Available dates in date range
SELECT 
    check_in,
    check_out,
    number_of_guests,
    booking_status
FROM bookings
WHERE check_in BETWEEN '2026-05-01' AND '2026-05-31'
ORDER BY check_in ASC;

-- ========== MAINTENANCE QUERIES ==========

-- 21. Update booking status
-- UPDATE bookings SET booking_status = 'Confirmed' WHERE id = 1;

-- 22. Add notes to booking
-- UPDATE bookings SET notes = 'VIP guest, needs special arrangements' WHERE id = 1;

-- 23. Cancel a booking
-- UPDATE bookings SET booking_status = 'Cancelled' WHERE id = 1;

-- 24. Mark inquiry as read
-- UPDATE inquiries SET status = 'Read' WHERE id = 1;

-- 25. Delete old cancelled bookings (older than 1 year)
-- DELETE FROM bookings WHERE booking_status = 'Cancelled' AND created_at < DATE_SUB(NOW(), INTERVAL 1 YEAR);

-- ========== BACKUP & EXPORT ==========

-- 26. Export bookings to CSV format (MySQLDump)
-- Command line: mysqldump -u root -p gymnarium bookings > bookings_backup.sql

-- 27. Count total storage size
SELECT 
    TABLE_NAME,
    ROUND(((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024), 2) as "Size in MB"
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'gymnarium';

-- ========== SAMPLE INSERT DATA (for testing) ==========

-- 28. Insert sample booking
INSERT INTO bookings (
    first_name, last_name, email, phone, 
    event_type, check_in, check_out, 
    time_in, time_out, number_of_guests, days_duration, booking_status
) VALUES (
    'Sample', 'Customer', 
    'sample@example.com', '+63 900 123 4567',
    'Wedding', '2026-05-20', '2026-05-21',
    '09:00', '17:00', 100, 1, 'Pending'
);

-- 29. Insert sample inquiry
INSERT INTO inquiries (
    name, email, phone, inquiry_type, message, status
) VALUES (
    'John Doe', 'john@example.com', '+63 917 987 6543',
    'Pricing', 'Can you provide pricing details for 150 guests?', 'Unread'
);

-- ========== USEFUL INFORMATION ==========

-- Check MySQL version
SELECT VERSION();

-- Check current database
SELECT DATABASE();

-- Show current time
SELECT NOW();

-- Count rows in each table
SELECT 'bookings' as table_name, COUNT(*) as row_count FROM bookings
UNION ALL
SELECT 'inquiries' as table_name, COUNT(*) as row_count FROM inquiries
UNION ALL
SELECT 'admin_users' as table_name, COUNT(*) as row_count FROM admin_users
UNION ALL
SELECT 'event_types' as table_name, COUNT(*) as row_count FROM event_types;
