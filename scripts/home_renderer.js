let vantaEffect = null;
let animationFrameId = null;
let initTimeoutId = null;
let activeContainer = null;
let isCleaningUp = false;
const cleanupCallbacks = [];
let featuredServicesCache = null;
let featuredServicesRequest = null;
const FEATURED_SERVICES_MAX_ITEMS = 6;
const FEATURED_SERVICES_URL = './project/featured-work.json';
const FEATURED_FETCH_TIMEOUT_MS = 8000;
let featuredServicesMarkup = null;
let featuredServicesItemCount = 0;
let activeRefs = null;
const FEATURED_EMPTY_STATE_MARKUP = '<div class="empty-message"><p>Featured services are being prepared. Please check back soon.</p></div>';
const FEATURED_ERROR_STATE_MARKUP = '<div class="error-message"><p>Unable to load services. Please try again later.</p></div>';
const DEFAULT_PROJECT_NAME = 'Untitled Project';
const DEFAULT_PROJECT_ALT = 'Project preview';

function registerCleanup(fn) {
    if (typeof fn !== 'function') {
        return () => {};
    }

    cleanupCallbacks.push(fn);
    let active = true;

    return () => {
        if (!active) {
            return;
        }

        active = false;
        const index = cleanupCallbacks.indexOf(fn);
        if (index !== -1) {
            cleanupCallbacks.splice(index, 1);
        }
    };
}

export function loadHome(container){

    cleanupVanta();

    if (!container) {
        return;
    }

    activeContainer = container;

    container.innerHTML = `

        <div class="hero" id="hero-vanta">
            <div class="hero-content">
                <h1 class="hero-title">Angelo R. Colocado</h1>
                <p class="hero-subtitle">Full-Stack Developer & Creative Technologist</p>
                <p class="hero-tagline">Crafting digital experiences with code and creativity</p>
            </div>
        </div>


        <section class="intro-section" id="intro-section">
            <div class="intro-container">
                <div class="intro-image-wrapper">
                    <div class="intro-image">
                        <img src="./assets/profile-photo.jpeg" alt="Angelo Colocado" loading="lazy" decoding="async" />
                    </div>
                </div>
                
                <div class="intro-content">
                    <h2 class="intro-heading">Hi, I'm Angelo</h2>
                    <p class="intro-course">BS in Information Technology, 2nd Year</p>
                    <p class="intro-school">Our Lady of Fatima University - Quezon City</p>
                    
                    <div class="intro-bio">
                        <p>
                            A passionate developer with a keen eye for design and a love for building 
                            innovative web applications. I specialize in creating seamless user experiences 
                            through modern web technologies and performance-optimized solutions.
                        </p>
                        <p>
                            Currently exploring the intersection of creativity and technology, focusing on 
                            full-stack development, UI/UX design, and emerging web standards. My goal is to 
                            craft digital experiences that are not only functional but also delightful to use.
                        </p>
                    </div>
                    
                    <div class="intro-skills">
                        <span class="skill-tag">JavaScript</span>
                        <span class="skill-tag">React</span>
                        <span class="skill-tag">PHP</span>
                        <span class="skill-tag">Node.js</span>
                        <span class="skill-tag">UI/UX Design</span>
                        <span class="skill-tag">Java</span>
                    </div>
                </div>
            </div>
        </section>

        <section class="featured-work" id="featured-work">
            <div class="section-header">
                <h2>Featured Services</h2>
                <p>A showcase of my recent projects and experiments</p>
            </div>
            
            <div class="work-grid" id="work-grid">
                <div class="loading-spinner">
                    <div class="spinner"></div>
                    <p>Loading services...</p>
                </div>
            </div>
            
            <div class="view-all-projects">
                <button class="btn-view-projects" id="view-all-projects">
                    View All Services
                    <span class="arrow">→</span>
                </button>
            </div>
        </section>

        <section class="cta-section" id="cta-section">
            <div class="cta-container">
                <h2 class="cta-heading">Ready to Transform Your Ideas into Reality?</h2>
                <p class="cta-subtext">Let's collaborate and build something extraordinary together.</p>
                <p class="cta-subtext">Your vision, my expertise – let's make it happen.</p>
                <button onclick="window.location.href='./contact'" class="btn-cta" id="contact-cta">
                    Get In Touch
                </button>
            </div>
        </section>
    `;

    activeRefs = hydrateHomeRefs(container);
    setupViewAllProjectsRedirect();
    initVantaEffect();
    scheduleFeaturedServicesLoad();
}

function scheduleFeaturedServicesLoad() {
    if (!activeContainer) {
        return;
    }

    if (featuredServicesMarkup && featuredServicesItemCount > 0 && activeRefs?.workGrid) {
        loadFeaturedServicesAsync();
        return;
    }

    let removeCleanup = () => {};

    const executeLoad = () => {
        removeCleanup();
        removeCleanup = () => {};
        loadFeaturedServicesAsync();
    };

    if (typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function') {
        const handle = window.requestIdleCallback(() => executeLoad(), { timeout: 2000 });
        const cancel = () => {
            if (typeof window.cancelIdleCallback === 'function') {
                window.cancelIdleCallback(handle);
            }
        };
        removeCleanup = registerCleanup(cancel);
    } else {
        const handle = setTimeout(() => executeLoad(), 0);
        const cancel = () => clearTimeout(handle);
        removeCleanup = registerCleanup(cancel);
    }
}

function hydrateHomeRefs(container) {
    return {
        root: container,
        hero: container.querySelector('#hero-vanta'),
        workGrid: container.querySelector('#work-grid'),
        viewAllProjectsContainer: container.querySelector('.view-all-projects'),
        viewAllProjectsButton: container.querySelector('#view-all-projects')
    };
}

async function loadFeaturedServicesAsync() {
    const refs = activeRefs;
    if (!refs || refs.root !== activeContainer) {
        return;
    }

    const { workGrid, viewAllProjectsContainer } = refs;
    if (!workGrid) {
        return;
    }

    try {
        let projectsArray = featuredServicesCache;

        if (!projectsArray) {
            if (!featuredServicesRequest) {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), FEATURED_FETCH_TIMEOUT_MS);
                const removeAbortCleanup = registerCleanup(() => controller.abort());

                featuredServicesRequest = fetch(FEATURED_SERVICES_URL, {
                    signal: controller.signal
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => Array.isArray(data) ? data : Object.values(data || {}))
                    .finally(() => {
                        clearTimeout(timeoutId);
                        removeAbortCleanup();
                    })
                    .catch(error => {
                        featuredServicesRequest = null;
                        throw error;
                    });
            }

            projectsArray = await featuredServicesRequest;
            featuredServicesCache = projectsArray;
            featuredServicesRequest = null;
            featuredServicesMarkup = null;
            featuredServicesItemCount = 0;
        }

        if (!activeRefs || activeRefs.root !== refs.root) {
            return;
        }

        const hasProjects = ensureFeaturedServicesMarkup(projectsArray);

        if (!hasProjects) {
            workGrid.innerHTML = FEATURED_EMPTY_STATE_MARKUP;
            if (viewAllProjectsContainer) {
                viewAllProjectsContainer.style.display = 'none';
            }
            return;
        }

        workGrid.innerHTML = featuredServicesMarkup;

        if (viewAllProjectsContainer) {
            viewAllProjectsContainer.style.removeProperty('display');
        }
    } catch (error) {
        console.error("Error loading featured services:", error.message);

        featuredServicesRequest = null;

        if (!activeRefs || activeRefs.root !== refs.root) {
            return;
        }

        if (viewAllProjectsContainer) {
            viewAllProjectsContainer.style.display = 'none';
        }

        workGrid.innerHTML = FEATURED_ERROR_STATE_MARKUP;
    }
}

function ensureFeaturedServicesMarkup(projectsArray) {
    if (featuredServicesMarkup !== null && featuredServicesItemCount > 0) {
        return true;
    }

    if (!Array.isArray(projectsArray) || projectsArray.length === 0) {
        featuredServicesMarkup = '';
        featuredServicesItemCount = 0;
        return false;
    }

    const limit = Math.min(projectsArray.length, FEATURED_SERVICES_MAX_ITEMS);
    let markup = '';
    let count = 0;

    for (let i = 0; i < projectsArray.length && count < limit; i++) {
        const project = projectsArray[i];
        if (!project || typeof project !== 'object') {
            continue;
        }

        const safeName = sanitizeText(project['project-name'], DEFAULT_PROJECT_NAME);
    const safeDescription = sanitizeText(project['project-description']);
    const imageSource = sanitizeUrl(project['project-video']);

        const previewMarkup = imageSource
            ? `<img src="${imageSource}" alt="${safeName || DEFAULT_PROJECT_ALT}" loading="lazy" decoding="async" />`
            : '';

        const descriptionMarkup = safeDescription ? `<p>${safeDescription}</p>` : '';

        markup += `<div class="work-card">`
            + `<div class="work-video">${previewMarkup}</div>`
            + `<h3>${safeName}</h3>`
            + descriptionMarkup
            + `</div>`;
        count++;
    }

    featuredServicesItemCount = count;

    if (!count) {
        featuredServicesMarkup = '';
        return false;
    }

    featuredServicesMarkup = markup;
    return true;
}

function sanitizeText(value, fallback = '') {
    const text = escapeHtml(value).trim();
    if (!text) {
        return fallback;
    }
    return text;
}

function sanitizeUrl(value) {
    if (typeof value !== 'string') {
        return '';
    }

    const url = escapeHtml(value).trim();
    if (!url) {
        return '';
    }

    const lower = url.toLowerCase();
    if (
        lower.startsWith('javascript:')
        || lower.startsWith('data:')
        || lower.startsWith('vbscript:')
    ) {
        return '';
    }

    if (
        lower.startsWith('http://')
        || lower.startsWith('https://')
        || lower.startsWith('/')
        || lower.startsWith('./')
        || lower.startsWith('../')
    ) {
        return url;
    }

    return '';
}

function escapeHtml(value) {
    if (value === undefined || value === null) {
        return '';
    }

    return String(value).replace(/[&<>'"]/g, match => {
        switch (match) {
            case '&':
                return '&amp;';
            case '<':
                return '&lt;';
            case '>':
                return '&gt;';
            case "'":
                return '&#39;';
            case '"':
                return '&quot;';
            default:
                return match;
        }
    });
}

function setupViewAllProjectsRedirect() {
    const refs = activeRefs;
    if (!refs) {
        return;
    }

    const button = refs.viewAllProjectsButton;
    if (!button) {
        return;
    }

    const handleClick = () => {
        window.location.href = './services';
    };

    button.addEventListener('click', handleClick);
    registerCleanup(() => button.removeEventListener('click', handleClick));
}

export function cleanupVanta() {
    if (isCleaningUp) {
        return;
    }

    isCleaningUp = true;

    if (initTimeoutId) {
        clearTimeout(initTimeoutId);
        initTimeoutId = null;
    }

    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    
    if (vantaEffect) {
        if (typeof vantaEffect.destroy === 'function') {
            vantaEffect.destroy();
        }
        vantaEffect = null;
    }

    while (cleanupCallbacks.length) {
        const teardown = cleanupCallbacks.pop();
        try {
            teardown();
        } catch (error) {
        }
    }

    activeContainer = null;
    activeRefs = null;
    isCleaningUp = false;
}

function animateVantaColor(effect, startColor, endColor, duration) {
    if (!effect || typeof effect.setOptions !== 'function') {
        return;
    }

    const startTime = Date.now();
    
    const startR = (startColor >> 16) & 0xFF;
    const startG = (startColor >> 8) & 0xFF;
    const startB = startColor & 0xFF;
    
    const endR = (endColor >> 16) & 0xFF;
    const endG = (endColor >> 8) & 0xFF;
    const endB = endColor & 0xFF;
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const eased = progress < 0.5 
            ? 2 * progress * progress 
            : -1 + (4 - 2 * progress) * progress;
        
        const r = Math.round(startR + (endR - startR) * eased);
        const g = Math.round(startG + (endG - startG) * eased);
        const b = Math.round(startB + (endB - startB) * eased);
        
        const currentColor = (r << 16) | (g << 8) | b;
        
        if (effect && typeof effect.setOptions === 'function') {
            effect.setOptions({ color: currentColor });
        } else {
            animationFrameId = null;
            return;
        }

        if (progress < 1) {
            animationFrameId = requestAnimationFrame(animate);
        } else {
            animationFrameId = null;
        }
    }
    
    animate();
}

function initVantaEffect(attempt = 0) {
    if (!activeContainer) {
        return;
    }

    const heroElement = activeRefs?.hero || activeContainer.querySelector('#hero-vanta');

    if (!heroElement || !heroElement.isConnected) {
        return;
    }

    if (!window.VANTA || typeof window.VANTA.NET !== 'function') {
        if (attempt > 50) {
            return;
        }

        initTimeoutId = setTimeout(() => {
            initVantaEffect(attempt + 1);
        }, 100);

        return;
    }

    vantaEffect = window.VANTA.NET({
        el: heroElement,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x000000,
        backgroundColor: 0x0,
        maxDistance: 21.00
    });

    initTimeoutId = null;

    const beforeUnloadHandler = () => cleanupVanta();
    window.addEventListener('beforeunload', beforeUnloadHandler);
    registerCleanup(() => window.removeEventListener('beforeunload', beforeUnloadHandler));

    const heroParent = heroElement.parentNode;
    if (heroParent) {
        const heroObserver = new MutationObserver(() => {
            if (!heroParent.contains(heroElement)) {
                cleanupVanta();
            }
        });
        heroObserver.observe(heroParent, { childList: true });
        registerCleanup(() => heroObserver.disconnect());
    }

    const containerParent = activeContainer.parentNode;
    if (containerParent) {
        const containerObserver = new MutationObserver(() => {
            if (!activeContainer || !activeContainer.isConnected) {
                cleanupVanta();
            }
        });
        containerObserver.observe(containerParent, { childList: true });
        registerCleanup(() => containerObserver.disconnect());
    }

    animateVantaColor(vantaEffect, 0x000000, 0x843f62, 1000);
}

