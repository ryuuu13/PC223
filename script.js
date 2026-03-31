// Admin page access control
if (window.location.pathname.includes("admin.html")) {
    if (localStorage.getItem("isAdmin") !== "true") {
        alert("🚫 Access denied! Please login first.");
        window.location.href = "login.html";
    }
}

// Convert 24-hour time to 12-hour format
function convertTo12Hour(time) {
    if (!time) return "—";
    const [h, m] = time.split(':').map(Number);
    return `${(h % 12 || 12).toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

// Display all bookings in table
function displayBookings() {
    const tbody = document.querySelector("#bookingTable tbody");
    if (!tbody) return;

    tbody.innerHTML = "";
    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

    if (bookings.length === 0) {
        document.getElementById("emptyState").style.display = "block";
        return;
    } else {
        document.getElementById("emptyState").style.display = "none";
    }

    bookings.forEach((bk, i) => {
        const checkIn = new Date(bk.checkIn).toLocaleDateString();
        const checkOut = new Date(bk.checkOut).toLocaleDateString();

        const singleDayEvent = bk.days === 1 && bk.timeIn && bk.timeOut;
        const timeIn = singleDayEvent ? convertTo12Hour(bk.timeIn) : "—";
        const timeOut = singleDayEvent ? convertTo12Hour(bk.timeOut) : "—";

        let duration = "—";
        if (singleDayEvent && bk.timeIn && bk.timeOut) {
            const [ih, im] = bk.timeIn.split(':').map(Number);
            const [oh, om] = bk.timeOut.split(':').map(Number);
            let minutes = oh * 60 + om - (ih * 60 + im);
            if (minutes < 0) minutes += 24 * 60;
            const hr = Math.floor(minutes / 60);
            const mn = minutes % 60;
            duration = mn > 0 ? `${hr}h ${mn}m` : `${hr}h`;
        }

        tbody.innerHTML += `
            <tr>
                <td>${escapeHtml(bk.name)}</td>
                <td>${escapeHtml(bk.email)}</td>
                <td>${escapeHtml(bk.phone)}</td>
                <td>${escapeHtml(bk.event)}</td>
                <td>${checkIn}</td>
                <td>${checkOut}</td>
                <td>${timeIn}</td>
                <td>${timeOut}</td>
                <td><strong>${duration}</strong></td>
                <td style="font-weight:700;text-align:center;">${bk.guests}</td>
                <td style="font-weight:700;text-align:center;">${bk.days}</td>
            </tr>
        `;
    });

    displayDeleteTable();
}


// Display delete buttons for bookings
function displayDeleteTable() {
    const tbody = document.querySelector("#deleteTable tbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    bookings.forEach((bk, i) => {
        tbody.innerHTML += `
            <tr>
                <td>${escapeHtml(bk.name)}</td>
                <td>
                    <button class="btn btn-small btn-danger" onclick="deleteBooking(${i})">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });
}

// Delete a booking
window.deleteBooking = function(i) {
    if (confirm("Are you sure you want to delete this booking?")) {
        let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
        bookings.splice(i, 1);
        localStorage.setItem("bookings", JSON.stringify(bookings));
        displayBookings();
        alert("✅ Booking deleted successfully!");
    }
}

// Logout function
function logout() {
    if (confirm("Are you sure you want to logout?")) {
        localStorage.removeItem("isAdmin");
        alert("✅ Logged out successfully!");
        window.location.href = "login.html";
    }
}

// Login function
function login() {
    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value;

    if (!username || !password) {
        alert("❌ Please enter both username and password!");
        return;
    }

    if (username === "admin" && password === "1234") {
        localStorage.setItem("isAdmin", "true");
        alert("✅ Login successful!");
        window.location.href = "admin.html";
    } else {
        alert("❌ Invalid credentials!\nTry: username: admin | password: 1234");
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, c => map[c]);
}

// Update stats dashboard
function updateStats() {
    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    const totalGuests = bookings.reduce((sum, bk) => sum + parseInt(bk.guests), 0);
    const totalDays = bookings.reduce((sum, bk) => sum + parseInt(bk.days), 0);

    const statsBar = document.getElementById("statsBar");
    if (!statsBar) return;

    statsBar.innerHTML = `
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

function updateBookingSummary() {
    const checkIn = document.getElementById("checkIn")?.value;
    const checkOut = document.getElementById("checkOut")?.value;
    const guests = document.getElementById("guests")?.value;
    const timeIn = document.getElementById("timeIn")?.value;
    const timeOut = document.getElementById("timeOut")?.value;
    const summarySection = document.getElementById("bookingSummary");

    if (!summarySection) return;
    if (!checkIn || !checkOut || !guests) {
        summarySection.style.display = "none";
        return;
    }

    summarySection.style.display = "block";

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    let days = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);
    days = Math.ceil(days) || 1;

    let durationText = `${days} day${days > 1 ? 's' : ''}`;
    if (days === 1 && timeIn && timeOut) {
        const [inHours, inMinutes] = timeIn.split(':').map(Number);
        const [outHours, outMinutes] = timeOut.split(':').map(Number);
        let diffMinutes = (outHours * 60 + outMinutes) - (inHours * 60 + inMinutes);
        if (diffMinutes < 0) diffMinutes += 24 * 60;
        const hours = Math.floor(diffMinutes / 60);
        const minutes = diffMinutes % 60;
        durationText = minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }

    document.getElementById("summaryDuration").textContent = durationText;
    document.getElementById("summaryGuests").textContent = `${guests} Guest${Number(guests) === 1 ? '' : 's'}`;
    document.getElementById("summaryDays").textContent = `${days} Day${days > 1 ? 's' : ''}`;
}

function toggleTimeFields() {
    const checkInValue = document.getElementById("checkIn")?.value;
    const checkOutValue = document.getElementById("checkOut")?.value;
    const timeFields = document.getElementById("timeFields");
    const timeInInput = document.getElementById("timeIn");
    const timeOutInput = document.getElementById("timeOut");

    if (!timeFields || !timeInInput || !timeOutInput) return;

    const checkIn = checkInValue ? new Date(checkInValue) : null;
    const checkOut = checkOutValue ? new Date(checkOutValue) : null;

    if (checkIn && checkOut && checkIn.toDateString() === checkOut.toDateString()) {
        timeFields.style.display = "block";
        timeInInput.required = true;
        timeOutInput.required = true;
    } else {
        timeFields.style.display = "none";
        timeInInput.required = false;
        timeOutInput.required = false;
        timeInInput.value = "";
        timeOutInput.value = "";
    }

    updateBookingSummary();
}

function toggleOtherEventField() {
    const eventType = document.getElementById("eventType")?.value;
    const otherField = document.getElementById("otherEventField");
    const otherInput = document.getElementById("otherEventType");
    if (!otherField || !otherInput) return;

    if (eventType === "Other") {
        otherField.style.display = "block";
        otherInput.required = true;
    } else {
        otherField.style.display = "none";
        otherInput.required = false;
        otherInput.value = "";
    }
}

function isDateRangeBooked(checkIn, checkOut) {
    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    const requestedStart = new Date(checkIn);
    const requestedEnd = new Date(checkOut);

    return bookings.some((bk) => {
        const existingStart = new Date(bk.checkIn);
        const existingEnd = new Date(bk.checkOut);
        return existingStart <= requestedEnd && requestedStart <= existingEnd;
    });
}

function renderBookedSchedule() {
    const container = document.getElementById("scheduleContent");
    if (!container) return;

    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    if (!bookings.length) {
        container.innerHTML = `
            <div class="empty-state" style="padding: 40px 0;">
                <div class="empty-state-icon">📭</div>
                <p>No bookings have been scheduled yet.</p>
            </div>
        `;
        return;
    }

    const rows = bookings.map((bk) => {
        const checkIn = new Date(bk.checkIn).toLocaleDateString();
        const checkOut = new Date(bk.checkOut).toLocaleDateString();
        return `
            <tr>
                <td>${escapeHtml(bk.name)}</td>
                <td>${escapeHtml(bk.event)}</td>
                <td>${checkIn}</td>
                <td>${checkOut}</td>
                <td>${bk.guests}</td>
            </tr>
        `;
    }).join("");

    container.innerHTML = `
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Event</th>
                        <th>Check-In</th>
                        <th>Check-Out</th>
                        <th>Guests</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        </div>
    `;
}

function clearBookingForm() {
    ["firstName", "lastName", "email", "phone", "eventType", "checkIn", "checkOut", "guests", "timeIn", "timeOut", "otherEventType"].forEach((id) => {
        const input = document.getElementById(id);
        if (input) input.value = "";
    });
    const timeFields = document.getElementById("timeFields");
    const otherField = document.getElementById("otherEventField");
    const otherInput = document.getElementById("otherEventType");
    if (otherField) otherField.style.display = "none";
    if (otherInput) otherInput.required = false;
    if (timeFields) timeFields.style.display = "none";
    const bookingSummary = document.getElementById("bookingSummary");
    if (bookingSummary) bookingSummary.style.display = "none";
}

function setupBookingPage() {
    const bookingForm = document.getElementById('bookingForm');
    if (!bookingForm) return;

    document.getElementById("checkIn")?.addEventListener("change", toggleTimeFields);
    document.getElementById("checkOut")?.addEventListener("change", toggleTimeFields);
    document.getElementById("eventType")?.addEventListener("change", toggleOtherEventField);
    document.getElementById("guests")?.addEventListener("change", updateBookingSummary);
    document.getElementById("timeIn")?.addEventListener("change", updateBookingSummary);
    document.getElementById("timeOut")?.addEventListener("change", updateBookingSummary);

    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const firstName = document.getElementById("firstName")?.value.trim();
        const lastName = document.getElementById("lastName")?.value.trim();
        const email = document.getElementById("email")?.value.trim();
        const phone = document.getElementById("phone")?.value.trim();
        const eventType = document.getElementById("eventType")?.value;
        const otherEventType = document.getElementById("otherEventType")?.value.trim();
        const checkIn = document.getElementById("checkIn")?.value;
        const checkOut = document.getElementById("checkOut")?.value;
        const guests = document.getElementById("guests")?.value;
        const timeIn = document.getElementById("timeIn")?.value;
        const timeOut = document.getElementById("timeOut")?.value;

        if (!firstName || !lastName || !email || !phone || !eventType || !checkIn || !checkOut || !guests) {
            alert("⚠️ Please fill all fields!");
            return;
        }

        const isSameDay = checkIn === checkOut;
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        if (checkOutDate < checkInDate) {
            alert("⚠️ Check-out date must be on or after check-in date!");
            return;
        }

        if (eventType === "Other" && !otherEventType) {
            alert("⚠️ Please describe your event when you choose Other Event.");
            return;
        }

        if (isSameDay && (!timeIn || !timeOut)) {
            alert("⚠️ Please fill in both Time In and Time Out for same-day bookings!");
            return;
        }

        if (isDateRangeBooked(checkIn, checkOut)) {
            alert("⚠️ The selected date range is already booked. Please choose different dates.");
            return;
        }

        const daysDiff = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);
        const booking = {
            name: `${firstName} ${lastName}`,
            email,
            phone,
            event: eventType === "Other" ? otherEventType : eventType,
            guests,
            days: Math.ceil(daysDiff) || 1,
            checkIn,
            checkOut
        };

        if (isSameDay) {
            booking.timeIn = timeIn;
            booking.timeOut = timeOut;
        }

        const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
        bookings.push(booking);
        localStorage.setItem("bookings", JSON.stringify(bookings));

        alert("✅ Booking submitted successfully! Check admin panel for details.");
        clearBookingForm();
        renderBookedSchedule();
    });
}

function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const contactName = document.getElementById("contactName")?.value.trim();
        const contactEmail = document.getElementById("contactEmail")?.value.trim();
        const contactPhone = document.getElementById("contactPhone")?.value.trim();
        const inquiryType = document.getElementById("inquiryType")?.value;
        const contactMessage = document.getElementById("contactMessage")?.value.trim();

        if (!contactName || !contactEmail || !contactPhone || !inquiryType || !contactMessage) {
            alert("⚠️ Please fill all fields!");
            return;
        }

        const inquiry = {
            name: contactName,
            email: contactEmail,
            phone: contactPhone,
            type: inquiryType,
            message: contactMessage,
            date: new Date().toLocaleDateString()
        };

        const inquiries = JSON.parse(localStorage.getItem("inquiries")) || [];
        inquiries.push(inquiry);
        localStorage.setItem("inquiries", JSON.stringify(inquiries));

        alert("✅ Message sent successfully! We'll get back to you soon.");

        ["contactName", "contactEmail", "contactPhone", "inquiryType", "contactMessage"].forEach((id) => {
            const input = document.getElementById(id);
            if (input) input.value = "";
        });
    });
}

// Initialize on DOM load
const initializeApp = function() {
    if (document.getElementById("statsBar")) {
        updateStats();
        displayBookings();
    }

    setupBookingPage();
    renderBookedSchedule();
    setupContactForm();
};

document.addEventListener('DOMContentLoaded', initializeApp);