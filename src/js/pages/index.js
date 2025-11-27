// Importiere Supabase Client
import supabase from '/src/js/supabase/supabaseClient.js';

// Karussell Funktionalität
let currentSlide = 0;
let autoRotateInterval;
let isSwiping = false;
let startX = 0;
let currentX = 0;
const track = document.querySelector('.carousel-track');
const dots = document.querySelectorAll('.dot');
const totalSlides = 4;
const AUTO_ROTATE_INTERVAL = 4000;

function moveToNextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
}

function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    updateCarousel();
    resetAutoRotate();
}

function updateCarousel() {
    const container = document.querySelector('.carousel-container');
    const slideWidth = container.offsetWidth;
    const gap = 20;
    const totalMove = (slideWidth + gap) * currentSlide;
    
    track.style.transform = `translateX(-${totalMove}px)`;
    
    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

// Auto-Rotate Funktionen
function startAutoRotate() {
    autoRotateInterval = setInterval(() => {
        moveToNextSlide();
    }, AUTO_ROTATE_INTERVAL);
}

function stopAutoRotate() {
    clearInterval(autoRotateInterval);
}

function resetAutoRotate() {
    stopAutoRotate();
    startAutoRotate();
}

// Touch-Swipe Funktionen
function handleTouchStart(e) {
    isSwiping = true;
    startX = e.touches[0].clientX;
    currentX = startX;
    track.style.transition = 'none';
    stopAutoRotate();
}

function handleTouchMove(e) {
    if (!isSwiping) return;
    
    currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    const container = document.querySelector('.carousel-container');
    const slideWidth = container.offsetWidth;
    const gap = 20;
    const totalSlideWidth = slideWidth + gap;
    
    const newPosition = -currentSlide * totalSlideWidth + (diff * 0.8);
    track.style.transform = `translateX(${newPosition}px)`;
}

function handleTouchEnd(e) {
    if (!isSwiping) return;
    isSwiping = false;
    
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    const container = document.querySelector('.carousel-container');
    const slideWidth = container.offsetWidth;
    const gap = 20;
    const totalSlideWidth = slideWidth + gap;
    const swipeThreshold = totalSlideWidth * 0.15;
    
    track.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            moveToNextSlide();
        } else {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateCarousel();
        }
    } else {
        updateCarousel();
    }
    
    setTimeout(startAutoRotate, 1000);
}

// Mouse Events für Desktop
function handleMouseDown(e) {
    isSwiping = true;
    startX = e.clientX;
    currentX = startX;
    track.style.transition = 'none';
    stopAutoRotate();
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
}

function handleMouseMove(e) {
    if (!isSwiping) return;
    
    currentX = e.clientX;
    const diff = currentX - startX;
    const container = document.querySelector('.carousel-container');
    const slideWidth = container.offsetWidth;
    const gap = 20;
    const totalSlideWidth = slideWidth + gap;
    
    const newPosition = -currentSlide * totalSlideWidth + (diff * 0.8);
    track.style.transform = `translateX(${newPosition}px)`;
}

function handleMouseUp(e) {
    if (!isSwiping) return;
    
    isSwiping = false;
    const endX = e.clientX;
    const diff = startX - endX;
    const container = document.querySelector('.carousel-container');
    const slideWidth = container.offsetWidth;
    const gap = 20;
    const totalSlideWidth = slideWidth + gap;
    const swipeThreshold = totalSlideWidth * 0.15;
    
    track.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            moveToNextSlide();
        } else {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateCarousel();
        }
    } else {
        updateCarousel();
    }
    
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    setTimeout(startAutoRotate, 1000);
}

// Pause bei Interaktion
function setupHoverPause() {
    const container = document.querySelector('.carousel-container');
    
    container.addEventListener('mouseenter', stopAutoRotate);
    container.addEventListener('mouseleave', startAutoRotate);
    
    container.addEventListener('touchstart', stopAutoRotate);
    container.addEventListener('touchend', () => setTimeout(startAutoRotate, 2000));
}

// User Status Management
async function updateUserStatus() {
    const userStatusDiv = document.getElementById('user-status');
    
    try {
        // Verwende Supabase Client
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
            throw error;
        }
        
        if (user) {
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
            showLoginPrompt(userStatusDiv);
        }
    } catch (error) {
        console.log('Supabase Fehler:', error);
        showLoginPrompt(userStatusDiv);
    }
}

function showLoginPrompt(userStatusDiv) {
    userStatusDiv.innerHTML = `
        <div class="login-prompt">
            <h3>Noch nicht angemeldet?</h3>
            <p>Melden Sie sich an, um Ihren Fortschritt zu verfolgen und personalisierte Empfehlungen zu erhalten.</p>
            <button class="login-btn" onclick="redirectToLogin()">Jetzt anmelden</button>
        </div>
    `;
}

// Platzhalter-Funktionen
function redirectToLogin() {
    window.location.href = '/src/pages/auth/login.html';
}

function showStats() {
    alert('Statistiken werden angezeigt');
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

// Initialisierung
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM geladen, initialisiere Karussell...');
    updateUserStatus();
    
    // Starte Auto-Rotation
    startAutoRotate();
    
    // Event Listener
    track.addEventListener('touchstart', handleTouchStart);
    track.addEventListener('touchmove', handleTouchMove);
    track.addEventListener('touchend', handleTouchEnd);
    
    track.addEventListener('mousedown', handleMouseDown);
    
    setupHoverPause();
    
    // Resize Observer
    const resizeObserver = new ResizeObserver(() => {
        updateCarousel();
    });
    
    resizeObserver.observe(document.querySelector('.carousel-container'));
});

// Cleanup
window.addEventListener('beforeunload', stopAutoRotate);

// Mache Funktionen global verfügbar
window.goToSlide = goToSlide;
window.redirectToLogin = redirectToLogin;
window.showStats = showStats;
window.startWorkout = startWorkout;
window.addMeasurement = addMeasurement;
window.setGoal = setGoal;
window.continueWorkout = continueWorkout;