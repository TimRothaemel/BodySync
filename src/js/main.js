// Aktive Navigation verwalten
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('nav a');
    
    // Aktuelle Seite ermitteln
    const currentPath = window.location.pathname;
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        
        // Prüfe ob der Link zur aktuellen Seite passt
        if (currentPath.includes(linkPath) && linkPath !== '' && linkPath !== '#') {
            link.classList.add('active');
        }
        
        // Klick-Event für sofortiges Feedback
        link.addEventListener('click', function() {
            setTimeout(() => {
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }, 100);
        });
    });

    // Footer Scroll Behavior
    const footer = document.querySelector('footer');
    let lastScrollY = window.scrollY;
    
    function handleScroll() {
        const currentScrollY = window.scrollY;
        
        // Zeige Footer wenn nach unten gescrollt wird
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            footer.classList.add('visible');
        } 
        // Verstecke Footer wenn nach oben gescrollt wird
        else if (currentScrollY < lastScrollY) {
            footer.classList.remove('visible');
        }
        
        lastScrollY = currentScrollY;
    }
    
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
});