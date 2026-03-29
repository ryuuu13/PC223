
/**
 * GYMNATORIUM BOOKING SYSTEM
 * Main JavaScript functionality
 */

// ============================================
// ADMIN PAGE PROTECTION
// ============================================
if (window.location.pathname.includes("admin.html")) {
    let isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin !== "true") {
        alert("🚫 Access denied! Please login first.");
        window.location.href = "login.html";
    }
}

// ============================================
// BOOKING FORM HANDLER
// ============================================
const bookingForm = document.getElementById("bookingForm");
if (bookingForm) {
    bookingForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        let firstName = document.getElementById("firstName").value.trim();
        let lastName = document.getElementById("lastName").value.trim();
        let email = document.getElementById("email").value.trim();
        let phone = document.getElementById("phone").value.trim();
        let eventType = document.getElementById("eventType").value;
        let checkIn = document.getElementById("checkIn").value;
        let checkOut = document.getElementById("checkOut").value;
        let guests = document.getElementById("guests").value;

        // Validation
        if (!firstName || !lastName || !email || !phone || !eventType || !checkIn || !checkOut || !guests) {
            alert("⚠️ Please fill all fields!");
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("⚠️ Please enter a valid email address!");
            return;
        }

        // Validate phone number format (simple validation)
        const phoneRegex = /^\d{10,15}$/;
        if (!phoneRegex.test(phone)) {
            alert("⚠️ Please enter a valid phone number!");
            return;
        }

        // Calculate days
        let checkInDate = new Date(checkIn);
        let checkOutDate = new Date(checkOut);
        let days = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);

        if (days <= 0) {
            alert("⚠️ Check-out date must be after check-in date!");
            return;
        }

        // Create booking object
        let booking = {
            name: firstName + " " + lastName,
            email: email,
            phone: phone,
            event: eventType,
            checkIn: checkIn,
            checkOut: checkOut,
            guests: guests,
            days: Math.ceil(days),
            date: new Date().toLocaleDateString()
        };

        // Save to localStorage
        let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
        bookings.push(booking);
        localStorage.setItem("bookings", JSON.stringify(bookings));

        alert("✅ Booking submitted successfully!\nAdmin can view details in the dashboard.");
        
        // Clear form
        bookingForm.reset();
    });
}

// ============================================
// ADMIN TABLE INITIALIZATION
// ============================================
// Will be called in DOMContentLoaded event

function displayBookings() {
    const table = document.querySelector("#bookingTable tbody");
    if (!table) return;

    table.innerHTML = "";
    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

    if (bookings.length === 0) {
        document.getElementById("emptyState").style.display = "block";
        return;
    }

    document.getElementById("emptyState").style.display = "none";

    bookings.forEach((booking, index) => {
        const row = `
            <tr>
                <td>${escapeHtml(booking.name)}</td>
                <td>${escapeHtml(booking.email)}</td>
                <td>${escapeHtml(booking.phone)}</td>
                <td>${escapeHtml(booking.event)}</td>
                <td>${booking.checkIn || 'N/A'}</td>
                <td>${booking.checkOut || 'N/A'}</td>
                <td>${booking.guests}</td>
                <td>${booking.days}</td>
                <td><button class="btn btn-danger btn-small" onclick="deleteBooking(${index})">Delete</button></td>
            </tr>
        `;
        table.innerHTML += row;
    });
}

// Delete booking function
window.deleteBooking = function(index) {
    if (confirm("Are you sure you want to delete this booking?")) {
        let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
        bookings.splice(index, 1);
        localStorage.setItem("bookings", JSON.stringify(bookings));
        displayBookings();
        alert("✅ Booking deleted successfully!");
    }
};

// ============================================
// LOGOUT FUNCTION
// ============================================
function logout() {
    if (confirm("Are you sure you want to logout?")) {
        localStorage.removeItem("isAdmin");
        alert("✅ Logged out successfully!");
        window.location.href = "login.html";
    }
}

// ============================================
// LOGIN FUNCTION
// ============================================
function login() {
    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value;

    if (!username || !password) {
        alert("❌ Please enter both username and password!");
        return;
    }

    // Simple authentication (demo)
    if (username === "admin" && password === "1234") {
        localStorage.setItem("isAdmin", "true");
        alert("✅ Login successful!");
        window.location.href = "admin.html";
    } else {
        alert("❌ Invalid credentials!\nTry: username: admin | password: 1234");
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ============================================
// DOCUMENT READY
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Update stats on admin page
    if (document.getElementById("statsBar")) {
        updateStats();
        displayBookings();
    }
});

function updateStats() {
    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    const totalGuests = bookings.reduce((sum, booking) => sum + parseInt(booking.guests), 0);
    const totalDays = bookings.reduce((sum, booking) => sum + parseInt(booking.days), 0);

    document.getElementById("statsBar").innerHTML = `
        <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-label">Total Bookings</div>
            <div class="stat-value">${bookings.length}</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-label">Total Guests</div>
            <div class="stat-value">${totalGuests}</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon">📅</div>
            <div class="stat-label">Total Days</div>
            <div class="stat-value">${totalDays}</div>
        </div>
    `;
}