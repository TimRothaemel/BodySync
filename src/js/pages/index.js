// Karussell Funktionalität
let currentSlide = 0;
const track = document.querySelector('.carousel-track');
const dots = document.querySelectorAll('.dot');
const totalSlides = 4;

function moveCarousel(direction) {
    currentSlide += direction;
    
    // Boundary checks
    if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    } else if (currentSlide >= totalSlides) {
        currentSlide = 0;
    }
    
    updateCarousel();
}

function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    updateCarousel();
}

function updateCarousel() {
    const slideWidth = document.querySelector('.carousel-card').offsetWidth + 20; // + gap
    track.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
    
    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

// User Status Management
async function updateUserStatus() {
    const userStatusDiv = document.getElementById('user-status');
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
        // Benutzer ist angemeldet
        userStatusDiv.innerHTML = `
            <div class="user-welcome">
                <h3>Willkommen zurück, ${user.email}!</h3>
                <p>Ihr aktueller Fortschritt:</p>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 65%"></div>
                </div>
                <p>65% Ihres Wochenziels erreicht</p>
                <button class="card-button" onclick="continueWorkout()">Training fortsetzen</button>
            </div>
        `;
    } else {
        // Benutzer ist nicht angemeldet
        userStatusDiv.innerHTML = `
            <div class="login-prompt">
                <h3>Noch nicht angemeldet?</h3>
                <p>Melden Sie sich an, um Ihren Fortschritt zu verfolgen und personalisierte Empfehlungen zu erhalten.</p>
                <button class="login-btn" onclick="redirectToLogin()">Jetzt anmelden</button>
            </div>
        `;
    }
}

// Platzhalter-Funktionen für die Buttons
function redirectToLogin() {
    window.location.href = '/src/pages/auth/login.html';
}

function showStats() {
    alert('Statistiken werden angezeigt');
    // Hier könnte man zur Statistik-Seite navigieren
}

function startWorkout() {
    alert('Training wird gestartet');
}

function addMeasurement() {
    alert('Messung hinzufügen');
}

function setGoal() {
    alert('Ziel setzen');
}

function continueWorkout() {
    alert('Training wird fortgesetzt');
}

// Initialisierung wenn DOM geladen
document.addEventListener('DOMContentLoaded', function() {
    updateUserStatus();
    
    // Auto-rotate Karussell (optional)
    // setInterval(() => moveCarousel(1), 5000);
    
    // Touch-Swipe für Mobile (optional)
    let startX = 0;
    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });
    
    track.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        
        if (Math.abs(diff) > 50) { // Mindest-Swipe-Distance
            if (diff > 0) {
                moveCarousel(1); // Swipe nach links
            } else {
                moveCarousel(-1); // Swipe nach rechts
            }
        }
    });
});