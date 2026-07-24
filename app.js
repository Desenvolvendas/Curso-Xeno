document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. HEADER SCROLL & MOBILE MENU
       ========================================================================== */
    const header = document.getElementById('main-header');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    // Sticky Header on Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('open');
            
            // Hamburger icon animation
            const bars = mobileToggle.querySelectorAll('.bar');
            if (navMenu.classList.contains('active')) {
                bars[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });

        // Close menu on nav item click
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const bars = mobileToggle.querySelectorAll('.bar');
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            });
        });
    }

    /* ==========================================================================
       2. SCROLL REVEAL ANIMATIONS (Intersection Observer)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-word');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach(element => {
            element.classList.add('reveal-active');
        });
    }

    /* ==========================================================================
       3. VIDEO OVERLAY & PLAYER CONTROLS
       ========================================================================== */
    const mainVideo = document.getElementById('main-video-player');
    const mainOverlay = document.getElementById('main-video-overlay');

    if (mainVideo && mainOverlay) {
        mainOverlay.addEventListener('click', () => {
            mainOverlay.classList.add('hidden');
            mainVideo.play();
        });

        mainVideo.addEventListener('pause', () => {
            if (mainVideo.currentTime < mainVideo.duration && !mainVideo.seeking) {
                mainOverlay.classList.remove('hidden');
            }
        });

        mainVideo.addEventListener('play', () => {
            mainOverlay.classList.add('hidden');
        });
    }

    /* ==========================================================================
       4. COUNTDOWN TIMER (Scarcity & Urgency)
       ========================================================================== */
    const hoursEl = document.getElementById('timer-hours');
    const minutesEl = document.getElementById('timer-minutes');
    const secondsEl = document.getElementById('timer-seconds');
    
    if (hoursEl && minutesEl && secondsEl) {
        let durationSeconds = parseInt(localStorage.getItem('promo_timer_duration'));
        
        if (isNaN(durationSeconds) || durationSeconds <= 0) {
            durationSeconds = (2 * 3600) + (59 * 60) + 45;
        }

        const updateTimerDisplay = () => {
            const h = Math.floor(durationSeconds / 3600);
            const m = Math.floor((durationSeconds % 3600) / 60);
            const s = durationSeconds % 60;

            hoursEl.textContent = h.toString().padStart(2, '0');
            minutesEl.textContent = m.toString().padStart(2, '0');
            secondsEl.textContent = s.toString().padStart(2, '0');
        };

        setInterval(() => {
            durationSeconds--;
            
            if (durationSeconds <= 0) {
                durationSeconds = (3 * 3600) + (0 * 60) + 0;
            }
            
            localStorage.setItem('promo_timer_duration', durationSeconds.toString());
            updateTimerDisplay();
        }, 1000);

        updateTimerDisplay();
    }

    /* ==========================================================================
       5. VACANCIES INDICATOR (Urgência e Escassez)
       ========================================================================== */
    const vagasCountEl = document.getElementById('vagas-count');
    const vagasBarEl = document.getElementById('vagas-bar');

    if (vagasCountEl && vagasBarEl) {
        let seatsRemaining = parseInt(localStorage.getItem('seats_remaining'));
        if (isNaN(seatsRemaining) || seatsRemaining <= 0) {
            seatsRemaining = 7;
        }

        const maxSeats = 50;
        
        const updateSeatsDisplay = () => {
            vagasCountEl.textContent = seatsRemaining.toString();
            const filledPercent = ((maxSeats - seatsRemaining) / maxSeats) * 100;
            vagasBarEl.style.width = `${filledPercent}%`;
        };

        const purchaseInterval = setInterval(() => {
            if (seatsRemaining > 2) {
                seatsRemaining--;
                localStorage.setItem('seats_remaining', seatsRemaining.toString());
                updateSeatsDisplay();
            } else {
                clearInterval(purchaseInterval);
            }
        }, 45000);

        updateSeatsDisplay();
    }

    /* ==========================================================================
       6. FAQ ACCORDION BEHAVIOR
       ========================================================================== */
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            if (item.hasAttribute('open')) return;
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.hasAttribute('open')) {
                    otherItem.removeAttribute('open');
                }
            });
        });
    });
});
