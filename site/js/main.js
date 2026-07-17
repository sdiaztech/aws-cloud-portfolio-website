const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.nav-links a');

const closeMenu = () => {
    siteNav.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation menu');
};

navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    document.body.classList.toggle('menu-open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
    navToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');

    if (isOpen) {
        navLinks[0].focus();
    }
});

navLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', (event) => {
    if (!siteNav.classList.contains('is-open')) {
        return;
    }

    if (event.key === 'Escape') {
        closeMenu();
        navToggle.focus();
    }

    if (event.key === 'Tab') {
        const lastLink = navLinks[navLinks.length - 1];

        if (event.shiftKey && document.activeElement === navToggle) {
            event.preventDefault();
            lastLink.focus();
        } else if (!event.shiftKey && document.activeElement === lastLink) {
            event.preventDefault();
            navToggle.focus();
        }
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && siteNav.classList.contains('is-open')) {
        closeMenu();
    }
});

const revealCards = document.querySelectorAll('.reveal-card');
const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

revealCards.forEach((card) => revealObserver.observe(card));

const observedSections = Array.from(navLinks)
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) {
            return;
        }

        navLinks.forEach((link) => {
            const isCurrent = link.getAttribute('href') === `#${entry.target.id}`;
            link.classList.toggle('is-active', isCurrent);

            if (isCurrent) {
                link.setAttribute('aria-current', 'location');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    });
}, { rootMargin: '-35% 0px -55% 0px' });

observedSections.forEach((section) => sectionObserver.observe(section));
