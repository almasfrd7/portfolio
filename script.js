(function () {
    "use strict";

    /* ─── Theme toggle ─── */
    const THEME_KEY = "portfolio-theme";
    const root = document.documentElement;
    const themeToggle = document.getElementById("themeToggle");

    function setTheme(theme) {
        root.setAttribute("data-theme", theme);
        localStorage.setItem(THEME_KEY, theme);
    }

    function initTheme() {
        const saved = localStorage.getItem(THEME_KEY);
        setTheme(saved === "dark" ? "dark" : "light");
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const current = root.getAttribute("data-theme") || "light";
            setTheme(current === "light" ? "dark" : "light");
        });
    }

    initTheme();

    /* ─── Typewriter ─── */
    const phrases = [
        "Mobile Developer",
        "Game Developer",
        "UI/UX Designer",
        "Creative Technologist",
        "Flutter Developer",
        "Application Tester"
    ];

    const typeEl = document.getElementById("typewriter");
    if (typeEl) {
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let pauseEnd = false;

        function typeTick() {
            const current = phrases[phraseIndex];

            if (pauseEnd) {
                pauseEnd = false;
                setTimeout(typeTick, 1800);
                return;
            }

            if (!isDeleting) {
                typeEl.textContent = current.substring(0, charIndex + 1);
                charIndex++;

                if (charIndex === current.length) {
                    isDeleting = true;
                    pauseEnd = true;
                }
            } else {
                typeEl.textContent = current.substring(0, charIndex - 1);
                charIndex--;

                if (charIndex === 0) {
                    isDeleting = false;
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                }
            }

            const speed = isDeleting ? 45 : 85;
            setTimeout(typeTick, speed);
        }

        setTimeout(typeTick, 600);
    }

    /* ─── Scroll reveal ─── */
    const revealEls = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
        );

        revealEls.forEach((el) => observer.observe(el));
    } else {
        revealEls.forEach((el) => el.classList.add("visible"));
    }

    /* ─── Active nav link on scroll ─── */
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link[href^='#']");

    function updateActiveNav() {
        const scrollY = window.scrollY + 100;

        sections.forEach((section) => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute("id");

            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach((link) => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === "#" + id) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }

    window.addEventListener("scroll", updateActiveNav, { passive: true });
    updateActiveNav();

    /* ─── Counter animation for stats ─── */
    const statNumbers = document.querySelectorAll("[data-count]");

    function animateCount(el) {
        const target = parseFloat(el.getAttribute("data-count"));
        const suffix = el.getAttribute("data-suffix") || "";
        const isFloat = String(target).includes(".") || target % 1 !== 0;
        const duration = 1400;
        const start = performance.now();

        function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = eased * target;

            el.textContent = isFloat
                ? value.toFixed(2) + suffix
                : Math.floor(value) + suffix;

            if (progress < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
    }

    if ("IntersectionObserver" in window && statNumbers.length) {
        const statObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animateCount(entry.target);
                        statObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        statNumbers.forEach((el) => statObserver.observe(el));
    }
})();
