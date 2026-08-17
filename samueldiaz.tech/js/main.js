const MOBILE_BREAKPOINT = 768;
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = [...document.querySelectorAll('.nav-links a')];
const supportsIntersectionObserver = 'IntersectionObserver' in window;

const setMenuState = (isOpen) => {
    if (!navToggle || !siteNav) return;

    siteNav.classList.toggle('is-open', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', `${isOpen ? 'Close' : 'Open'} navigation menu`);
};

const closeMenu = () => setMenuState(false);

if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
        const isOpen = !siteNav.classList.contains('is-open');
        setMenuState(isOpen);

        if (isOpen) navLinks[0]?.focus();
    });

    navLinks.forEach((link) => link.addEventListener('click', closeMenu));

    document.addEventListener('keydown', (event) => {
        if (!siteNav.classList.contains('is-open')) return;

        if (event.key === 'Escape') {
            closeMenu();
            navToggle.focus();
            return;
        }

        if (event.key !== 'Tab' || navLinks.length === 0) return;

        const lastLink = navLinks[navLinks.length - 1];
        const movingBeforeMenu = event.shiftKey && document.activeElement === navToggle;
        const movingAfterMenu = !event.shiftKey && document.activeElement === lastLink;

        if (movingBeforeMenu || movingAfterMenu) {
            event.preventDefault();
            (movingBeforeMenu ? lastLink : navToggle).focus();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > MOBILE_BREAKPOINT && siteNav.classList.contains('is-open')) {
            closeMenu();
        }
    });
}

const revealCards = [...document.querySelectorAll('.reveal-card')];

if (supportsIntersectionObserver) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.2 });

    revealCards.forEach((card) => revealObserver.observe(card));
} else {
    revealCards.forEach((card) => card.classList.add('is-visible'));
}

const observedSections = navLinks
    .map((link) => document.getElementById(link.hash.slice(1)))
    .filter(Boolean);

const setActiveSection = (sectionId) => {
    navLinks.forEach((link) => {
        const isCurrent = link.hash === `#${sectionId}`;
        link.classList.toggle('is-active', isCurrent);

        if (isCurrent) {
            link.setAttribute('aria-current', 'location');
        } else {
            link.removeAttribute('aria-current');
        }
    });
};

if (supportsIntersectionObserver) {
    const sectionObserver = new IntersectionObserver((entries) => {
        const visibleSection = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleSection) setActiveSection(visibleSection.target.id);
    }, { rootMargin: '-35% 0px -55% 0px' });

    observedSections.forEach((section) => sectionObserver.observe(section));
}
