// Footer Scroll Behavior - Optimiert für kurze Seiten
document.addEventListener('DOMContentLoaded', function() {
    const footer = document.querySelector('footer');
    console.log("Footer gefunden:", footer);
    
    // Prüfe ob die Seite scrollbar ist
    const isPageScrollable = document.body.scrollHeight > window.innerHeight;
    console.log("Seite ist scrollbar:", isPageScrollable);
    
    if (!isPageScrollable) {
        // Wenn Seite nicht scrollbar, zeige Footer nach kurzer Verzögerung
        console.log("Seite ist nicht scrollbar - zeige Footer nach Verzögerung");
        setTimeout(() => {
            footer.classList.add('visible');
        }, 1000);
    } else {
        // Normales Scroll-Verhalten für lange Seiten
        console.log("Seite ist scrollbar - aktiviere Scroll-Verhalten");
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                footer.classList.add('visible');
            } else {
                footer.classList.remove('visible');
            }
        });
        
        // Initial prüfen
        if (window.scrollY > 100) {
            footer.classList.add('visible');
        }
    }
    
    // Debug: Footer immer nach 3 Sekunden anzeigen (entfernen für Produktion)
    setTimeout(() => {
        console.log("Debug: Footer sollte jetzt sichtbar sein");
        console.log("Footer classList:", footer.classList);
    }, 3000);
});