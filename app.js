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
    const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-word, .filo-step, .filo-step-final');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-active');
                    // Once animated, we can unobserve if we want it static, or keep observing for replay
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
        // Fallback for older browsers
        revealElements.forEach(element => {
            element.classList.add('reveal-active');
        });
    }

    /* ==========================================================================
       3. INTERACTIVE BEFORE/AFTER SLIDER
       ========================================================================== */
    const slider = document.getElementById('comparison-slider');
    const afterImg = document.getElementById('after-slider-img');
    const handle = document.getElementById('slider-handle');
    
    if (slider && afterImg && handle) {
        let isDragging = false;

        const updateSlider = (clientX) => {
            const rect = slider.getBoundingClientRect();
            // Calculate horizontal offset position percentage (0 to 100)
            let position = ((clientX - rect.left) / rect.width) * 100;
            
            // Constrain between 0% and 100%
            if (position < 0) position = 0;
            if (position > 100) position = 100;

            // Apply position to crop width of the "after" image container and position the handle
            afterImg.style.width = `${100 - position}%`;
            handle.style.left = `${position}%`;
        };

        // Desktop Events
        handle.addEventListener('mousedown', (e) => {
            isDragging = true;
            e.preventDefault();
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            updateSlider(e.clientX);
        });

        // Touch Mobile Events
        handle.addEventListener('touchstart', (e) => {
            isDragging = true;
        });

        window.addEventListener('touchend', () => {
            isDragging = false;
        });

        window.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            if (e.touches.length > 0) {
                updateSlider(e.touches[0].clientX);
            }
        });

        // Click directly on slider container to shift position
        slider.addEventListener('click', (e) => {
            if (e.target !== handle && !handle.contains(e.target)) {
                updateSlider(e.clientX);
            }
        });
    }



    /* ==========================================================================
       5. COUNTDOWN TIMER (Scarcity & Urgency)
       ========================================================================== */
    const hoursEl = document.getElementById('timer-hours');
    const minutesEl = document.getElementById('timer-minutes');
    const secondsEl = document.getElementById('timer-seconds');
    
    if (hoursEl && minutesEl && secondsEl) {
        // High converting mechanism: Start counting down from a set duration
        // Store the target expiry in local storage or cookie, so it persists
        // for each user session, making the timer highly convincing!
        let durationSeconds = parseInt(localStorage.getItem('promo_timer_duration'));
        
        if (isNaN(durationSeconds) || durationSeconds <= 0) {
            // Default promo: 2 hours, 59 minutes, 45 seconds
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

        const timerInterval = setInterval(() => {
            durationSeconds--;
            
            if (durationSeconds <= 0) {
                // If countdown finishes, reset to another 3 hours to keep pages selling
                durationSeconds = (3 * 3600) + (0 * 60) + 0;
            }
            
            localStorage.setItem('promo_timer_duration', durationSeconds.toString());
            updateTimerDisplay();
        }, 1000);

        updateTimerDisplay();
    }

    /* ==========================================================================
       6. VACANCIES INDICATOR (Urgência e Escassez)
       ========================================================================== */
    const vagasCountEl = document.getElementById('vagas-count');
    const vagasBarEl = document.getElementById('vagas-bar');

    if (vagasCountEl && vagasBarEl) {
        // Read or set initial seats count
        let seatsRemaining = parseInt(localStorage.getItem('seats_remaining'));
        if (isNaN(seatsRemaining) || seatsRemaining <= 0) {
            seatsRemaining = 12; // Start with 12 seats
        }

        const maxSeats = 80; // total capacity reference
        
        const updateSeatsDisplay = () => {
            vagasCountEl.textContent = seatsRemaining.toString();
            
            // Calculate percentage filled. E.g., if 8 seats left, bar should be thin (like 10% filled visual representation of urgency)
            // Or let's make it show the filled percentage (e.g. 12 seats remaining out of 80 means 68 seats filled, which is 85% filled, showing scarcity)
            const filledPercent = ((maxSeats - seatsRemaining) / maxSeats) * 100;
            vagasBarEl.style.width = `${filledPercent}%`;
        };

        // Every 45 seconds, simulate one purchase if seats are above 3
        const purchaseInterval = setInterval(() => {
            if (seatsRemaining > 3) {
                seatsRemaining--;
                localStorage.setItem('seats_remaining', seatsRemaining.toString());
                updateSeatsDisplay();
            } else {
                clearInterval(purchaseInterval);
            }
        }, 45000); // 45 seconds

        updateSeatsDisplay();
    }

    /* ==========================================================================
       7. EXCLUSIVE FAQ ACCORDION BEHAVIOR (Optional optimization)
       ========================================================================== */
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Close other accordion tabs when opening one
            if (item.hasAttribute('open')) return; // let default close happen
            
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.hasAttribute('open')) {
                    otherItem.removeAttribute('open');
                }
            });
        });
    });
});
