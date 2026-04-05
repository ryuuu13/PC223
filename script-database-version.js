// API Configuration
const API_URL = 'http://localhost:5000/api'; // Change to your server URL if different

// ========== HELPER FUNCTIONS ==========

// Convert 24-hour time to 12-hour format
function convertTo12Hour(time) {
    if (!time) return "—";
    const [h, m] = time.split(':').map(Number);
    return `${(h % 12 || 12).toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
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

// ========== API CALL FUNCTIONS ==========

// Fetch all bookings from database
async function fetchBookingsFromDatabase() {
    try {
        const response = await fetch(`${API_URL}/bookings`);
        if (!response.ok) throw new Error('Failed to fetch bookings');
        return await response.json();
    } catch (error) {
        console.error('Error fetching bookings:', error);
        alert('⚠️ Error loading bookings from database');
        return [];
    }
}

// Fetch booked dates for display
async function fetchBookedDates() {
    try {
        const response = await fetch(`${API_URL}/booked-dates`);
        if (!response.ok) throw new Error('Failed to fetch booked dates');
        return await response.json();
    } catch (error) {
        console.error('Error fetching booked dates:', error);
        return [];
    }
}

// Post booking to database
async function submitBookingToDatabase(bookingData) {
    try {
        const response = await fetch(`${API_URL}/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });
        if (!response.ok) throw new Error('Failed to submit booking');
        return await response.json();
    } catch (error) {
        console.error('Error submitting booking:', error);
        throw error;
    }
}

// Post inquiry to database
async function submitInquiryToDatabase(inquiryData) {
    try {
        const response = await fetch(`${API_URL}/inquiries`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(inquiryData)
        });
        if (!response.ok) throw new Error('Failed to submit inquiry');
        return await response.json();
    } catch (error) {
        console.error('Error submitting inquiry:', error);
        throw error;
    }
}

// Fetch statistics
async function fetchStatistics() {
    try {
        const response = await fetch(`${API_URL}/stats`);
        if (!response.ok) throw new Error('Failed to fetch statistics');
        return await response.json();
    } catch (error) {
        console.error('Error fetching statistics:', error);
        return null;
    }
}

// ========== BOOKING DISPLAY FUNCTIONS ==========

// Display all bookings in admin table
async function displayBookings() {
    const tbody = document.querySelector("#bookingTable tbody");
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="11" style="text-align: center;">Loading...</td></tr>';
    
    const bookings = await fetchBookingsFromDatabase();

    tbody.innerHTML = "";
    if (bookings.length === 0) {
        document.getElementById("emptyState").style.display = "block";
        return;
    } else {
        document.getElementById("emptyState").style.display = "none";
    }

    bookings.forEach((bk, i) => {
        const checkIn = new Date(bk.check_in).toLocaleDateString();
        const checkOut = new Date(bk.check_out).toLocaleDateString();

        const singleDayEvent = bk.days_duration === 1 && bk.time_in && bk.time_out;
        const timeIn = singleDayEvent ? convertTo12Hour(bk.time_in) : "—";
        const timeOut = singleDayEvent ? convertTo12Hour(bk.time_out) : "—";

        let duration = "—";
        if (singleDayEvent && bk.time_in && bk.time_out) {
            const [ih, im] = bk.time_in.split(':').map(Number);
            const [oh, om] = bk.time_out.split(':').map(Number);
            let minutes = oh * 60 + om - (ih * 60 + im);
            if (minutes < 0) minutes += 24 * 60;
            const hr = Math.floor(minutes / 60);
            const mn = minutes % 60;
            duration = mn > 0 ? `${hr}h ${mn}m` : `${hr}h`;
        }

        const eventName = bk.other_event_type || bk.event_type;

        tbody.innerHTML += `
            <tr>
                <td>${escapeHtml(bk.first_name + ' ' + bk.last_name)}</td>
                <td>${escapeHtml(bk.email)}</td>
                <td>${escapeHtml(bk.phone)}</td>
                <td>${escapeHtml(eventName)}</td>
                <td>${checkIn}</td>
                <td>${checkOut}</td>
                <td>${timeIn}</td>
                <td>${timeOut}</td>
                <td><strong>${duration}</strong></td>
                <td style="font-weight:700;text-align:center;">${bk.number_of_guests}</td>
                <td style="font-weight:700;text-align:center;">${bk.days_duration}</td>
            </tr>
        `;
    });

    displayDeleteTable();
}

// Display delete buttons for bookings
async function displayDeleteTable() {
    const tbody = document.querySelector("#deleteTable tbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    const bookings = await fetchBookingsFromDatabase();
    bookings.forEach((bk) => {
        tbody.innerHTML += `
            <tr>
                <td>${escapeHtml(bk.first_name + ' ' + bk.last_name)}</td>
                <td>
                    <button class="btn btn-small btn-danger" onclick="deleteBooking(${bk.id})">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });
}

// Delete booking from database
window.deleteBooking = async function(bookingId) {
    if (confirm("Are you sure you want to delete this booking?")) {
        try {
            const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete booking');
            alert("✅ Booking deleted successfully!");
            displayBookings();
        } catch (error) {
            console.error('Error deleting booking:', error);
            alert('⚠️ Error deleting booking');
        }
    }
}

// Update stats dashboard
async function updateStats() {
    const statsBar = document.getElementById("statsBar");
    if (!statsBar) return;

    const stats = await fetchStatistics();
    if (!stats) return;

    statsBar.innerHTML = `
        <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-label">Total Bookings</div>
            <div class="stat-value">${stats.total_bookings || 0}</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-label">Total Guests</div>
            <div class="stat-value">${stats.total_guests || 0}</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon">✅</div>
            <div class="stat-label">Confirmed</div>
            <div class="stat-value">${stats.confirmed_bookings || 0}</div>
        </div>
    `;
}

// ========== BOOKING FORM FUNCTIONS ==========

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

// Check if date range conflicts with existing bookings
async function isDateRangeBooked(checkIn, checkOut) {
    const bookedDates = await fetchBookedDates();
    const requestedStart = new Date(checkIn);
    const requestedEnd = new Date(checkOut);

    return bookedDates.some((bk) => {
        const existingStart = new Date(bk.check_in);
        const existingEnd = new Date(bk.check_out);
        return existingStart <= requestedEnd && requestedStart <= existingEnd;
    });
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

    bookingForm.addEventListener('submit', async function(e) {
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

        const isBooked = await isDateRangeBooked(checkIn, checkOut);
        if (isBooked) {
            alert("⚠️ The selected date range is already booked. Please choose different dates.");
            return;
        }

        const daysDiff = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);
        
        const bookingData = {
            first_name: firstName,
            last_name: lastName,
            email,
            phone,
            event_type: eventType,
            other_event_type: eventType === "Other" ? otherEventType : null,
            check_in: checkIn,
            check_out: checkOut,
            time_in: isSameDay ? timeIn : null,
            time_out: isSameDay ? timeOut : null,
            number_of_guests: parseInt(guests),
            days_duration: Math.ceil(daysDiff) || 1
        };

        try {
            const result = await submitBookingToDatabase(bookingData);
            alert("✅ Booking submitted successfully! Your booking ID: " + result.id);
            clearBookingForm();
            renderBookedSchedule();
        } catch (error) {
            alert('⚠️ Error submitting booking. Please try again.');
        }
    });
}

// ========== SCHEDULE DISPLAY ==========

async function renderBookedSchedule() {
    const container = document.getElementById("scheduleContent");
    if (!container) return;

    const bookedDates = await fetchBookedDates();
    if (!bookedDates.length) {
        container.innerHTML = `
            <div class="empty-state" style="padding: 40px 0;">
                <div class="empty-state-icon">📭</div>
                <p>No bookings have been scheduled yet.</p>
            </div>
        `;
        return;
    }

    const rows = bookedDates.map((bk) => {
        const checkIn = new Date(bk.check_in).toLocaleDateString();
        const checkOut = new Date(bk.check_out).toLocaleDateString();
        return `
            <tr>
                <td>Guest</td>
                <td>${escapeHtml(bk.event_type)}</td>
                <td>${checkIn}</td>
                <td>${checkOut}</td>
                <td>${bk.number_of_guests}</td>
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

// ========== CONTACT FORM ==========

function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async function(e) {
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

        const inquiryData = {
            name: contactName,
            email: contactEmail,
            phone: contactPhone,
            inquiry_type: inquiryType,
            message: contactMessage
        };

        try {
            await submitInquiryToDatabase(inquiryData);
            alert("✅ Message sent successfully! We'll get back to you soon.");
            
            ["contactName", "contactEmail", "contactPhone", "inquiryType", "contactMessage"].forEach((id) => {
                const input = document.getElementById(id);
                if (input) input.value = "";
            });
        } catch (error) {
            alert('⚠️ Error sending message. Please try again.');
        }
    });
}

// ========== INITIALIZATION ==========

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
