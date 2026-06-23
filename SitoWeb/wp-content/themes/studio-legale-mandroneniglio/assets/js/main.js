(function () {
    'use strict';

    // Mobile menu toggle
    var menuToggle = document.querySelector('.menu-toggle');
    var primaryMenu = document.getElementById('primary-menu');

    if (menuToggle && primaryMenu) {
        menuToggle.addEventListener('click', function () {
            var expanded = this.getAttribute('aria-expanded') === 'true' ? false : true;
            this.setAttribute('aria-expanded', expanded);
            primaryMenu.classList.toggle('toggled-on');
        });

        document.addEventListener('click', function (e) {
            if (!menuToggle.contains(e.target) && !primaryMenu.contains(e.target)) {
                menuToggle.setAttribute('aria-expanded', 'false');
                primaryMenu.classList.remove('toggled-on');
            }
        });
    }

    // ====== HERO SLIDER ======
    (function () {
        var slider = document.getElementById('hero-slider');
        if (!slider) return;

        var slides = slider.querySelectorAll('.hero-slide');
        var dots = document.querySelectorAll('.hero-dot');
        var prevBtn = document.querySelector('.hero-prev');
        var nextBtn = document.querySelector('.hero-next');
        var progressBar = document.querySelector('.hero-progress-bar');
        if (!slides.length) return;

        var current = 0;
        var total = slides.length;
        var interval = 6000;
        var timer;
        var progressTimer;
        var progress = 0;

        function goTo(index) {
            slides.forEach(function (s) { s.classList.remove('active'); });
            dots.forEach(function (d) { d.classList.remove('active'); });

            current = (index + total) % total;
            slides[current].classList.add('active');
            if (dots[current]) dots[current].classList.add('active');

            progress = 0;
            if (progressBar) progressBar.style.width = '0%';
            clearInterval(progressTimer);
            progressTimer = setInterval(function () {
                progress += 100 / (interval / 100);
                if (progressBar) progressBar.style.width = Math.min(progress, 100) + '%';
            }, 100);
        }

        function next() { goTo(current + 1); resetTimer(); }
        function prev() { goTo(current - 1); resetTimer(); }

        function resetTimer() {
            clearInterval(timer);
            timer = setInterval(next, interval);
        }

        if (prevBtn) prevBtn.addEventListener('click', prev);
        if (nextBtn) nextBtn.addEventListener('click', next);

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                var idx = parseInt(this.getAttribute('data-slide'), 10);
                goTo(idx);
                resetTimer();
            });
        });

        slider.addEventListener('mouseenter', function () { clearInterval(timer); clearInterval(progressTimer); });
        slider.addEventListener('mouseleave', function () { resetTimer(); });

        goTo(0);
        timer = setInterval(next, interval);
    })();

    // ====== COUNTER ANIMATION ======
    var trustNumbers = document.querySelectorAll('.trust-number');
    if (trustNumbers.length) {
        var countersAnimated = false;

        function animateCounters() {
            if (countersAnimated) return;
            var rect = trustNumbers[0].closest('.trust-section').getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                countersAnimated = true;
                trustNumbers.forEach(function (el) {
                    var target = parseInt(el.getAttribute('data-target'), 10);
                    var duration = 2000;
                    var steps = 60;
                    var increment = target / steps;
                    var current = 0;
                    var counter = setInterval(function () {
                        current += increment;
                        if (current >= target) {
                            el.textContent = target;
                            clearInterval(counter);
                        } else {
                            el.textContent = Math.floor(current);
                        }
                    }, duration / steps);
                });
            }
        }

        window.addEventListener('scroll', animateCounters);
        window.addEventListener('load', animateCounters);
    }

    // ====== FADE-IN ON SCROLL ======
    (function () {
        var elements = document.querySelectorAll('.fade-in');
        if (!elements.length) return;

        function checkVisibility() {
            var windowHeight = window.innerHeight;
            elements.forEach(function (el) {
                var rect = el.getBoundingClientRect();
                if (rect.top < windowHeight - 60) {
                    el.classList.add('visible');
                }
            });
        }

        window.addEventListener('scroll', checkVisibility);
        window.addEventListener('load', checkVisibility);
        checkVisibility();
    })();

    // ====== PARALLAX ======
    (function () {
        var parallaxSections = document.querySelectorAll('.parallax-section');
        if (!parallaxSections.length) return;

        window.addEventListener('scroll', function () {
            parallaxSections.forEach(function (section) {
                var rect = section.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    var speed = 0.3;
                    var yPos = rect.top * speed;
                    var bg = section.querySelector('.parallax-bg');
                    if (bg) {
                        bg.style.transform = 'translateY(' + yPos + 'px)';
                    }
                }
            });
        });
    })();

    // ====== TESTIMONIALS CAROUSEL ======
    (function () {
        var carousel = document.getElementById('testimonials-carousel');
        if (!carousel) return;

        var track = carousel.querySelector('.testimonials-track');
        var cards = track.querySelectorAll('.testimonial-card');
        var prevBtn = carousel.querySelector('.testimonial-prev');
        var nextBtn = carousel.querySelector('.testimonial-next');
        var dotsContainer = carousel.querySelector('.testimonial-dots');
        if (!cards.length) return;

        var current = 0;
        var visible = 3;
        var totalSlides = cards.length;

        function updateVisibleCount() {
            if (window.innerWidth <= 768) visible = 1;
            else if (window.innerWidth <= 1024) visible = 2;
            else visible = 3;
        }
        updateVisibleCount();

        function renderDots() {
            if (!dotsContainer) return;
            var count = Math.max(1, totalSlides - visible + 1);
            dotsContainer.innerHTML = '';
            for (var i = 0; i < count; i++) {
                var dot = document.createElement('button');
                dot.className = 'dot' + (i === current ? ' active' : '');
                dot.setAttribute('aria-label', 'Testimonianza ' + (i + 1));
                dot.addEventListener('click', function () { goTo(parseInt(this.getAttribute('data-index'), 10)); });
                dot.setAttribute('data-index', i);
                dotsContainer.appendChild(dot);
            }
        }
        renderDots();

        function goTo(index) {
            updateVisibleCount();
            var maxIndex = Math.max(0, totalSlides - visible);
            current = Math.max(0, Math.min(index, maxIndex));
            var offset = -(current * (100 / visible));
            track.style.transform = 'translateX(' + offset + '%)';
            var dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach(function (d, i) { d.classList.toggle('active', i === current); });
        }

        function next() { goTo(current + 1); }
        function prev() { goTo(current - 1); }

        if (prevBtn) prevBtn.addEventListener('click', prev);
        if (nextBtn) nextBtn.addEventListener('click', next);

        var autoTimer = setInterval(next, 5000);
        carousel.addEventListener('mouseenter', function () { clearInterval(autoTimer); });
        carousel.addEventListener('mouseleave', function () { autoTimer = setInterval(next, 5000); });

        window.addEventListener('resize', function () {
            goTo(current);
            renderDots();
        });
    })();

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                var headerOffset = 140;
                var elementPosition = targetEl.getBoundingClientRect().top;
                var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });

    // Forum topic form validation
    var newTopicForm = document.querySelector('.new-topic-form form');
    if (newTopicForm) {
        newTopicForm.addEventListener('submit', function (e) {
            var title = document.getElementById('topic_title');
            var content = document.getElementById('topic_content');
            if (title && !title.value.trim()) {
                e.preventDefault();
                title.focus();
                title.style.borderColor = '#C62828';
                return;
            }
            if (content && !content.value.trim()) {
                e.preventDefault();
                if (typeof tinyMCE !== 'undefined' && tinyMCE.get('topic_content')) {
                    var editor = tinyMCE.get('topic_content');
                    if (!editor.getContent().trim()) {
                        editor.focus();
                        return;
                    }
                } else {
                    content.focus();
                    content.style.borderColor = '#C62828';
                }
            }
        });
    }
})();
