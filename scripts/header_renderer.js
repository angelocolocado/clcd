import { loadHome, cleanupVanta } from "./home_renderer.js";
import { loadServices } from "./services_renderer.js";
import { loadContact } from "./contact_renderer.js";

const headerContainer = document.querySelector('header');

// Store event handlers to prevent memory leaks
let popstateHandler = null;
let beforeunloadHandler = null;

loadHeader(headerContainer);
dynamicTitle();

function dynamicTitle() {
    const urlPath = window.location.pathname;
    const pathParts = urlPath.split('/').filter(part => part !== '');
    const page = pathParts[pathParts.length - 1];
    loadPageContent(page);

    let title = "Angelo Colocado";

    switch (page) {
        case "home":
            title += " | Web Developer & Tech Enthusiast";
            break;
        case "projects":
            title += " | Portfolio Projects & Case Studies";
            break;
        case "contacts":
        case "contact":
            title += " | Contact Me & Get in Touch";
            break;
        default:
            title += " | Web Developer & Tech Enthusiast";
    }

    document.title = title;
}

function loadHeader(headerContainer) {
    headerContainer.innerHTML = `
        <div class="header-con">
            <img src="./assets/logo/logo.svg" alt="logo" class="logo">
            <nav class="glass-nav">
                <ul>
                    <li><a href="#" class="nav-link" data-page="./">Home</a></li>
                    <li><a href="#" class="nav-link" data-page="services">Services</a></li>
                    <li><a href="#" class="nav-link" data-page="contact">Contact</a></li>
                </ul>
            </nav>
            <button class="contact-btn" id="contact-btn-cta">Download CV</button>
            
            <button class="hamburger-btn" aria-label="Menu">
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
            </button>
        </div>
        
        <div class="mobile-menu-overlay"></div>
        
        <div class="mobile-glass-menu">
            <nav>
                <ul>
                    <li><a href="#" class="mobile-link" data-page="">Home</a></li>
                    <li><a href="#" class="mobile-link" data-page="services">Services</a></li>
                    <li><a href="#" class="mobile-link" data-page="contact">Contact</a></li>
                </ul>
            </nav>
        </div>
    `;

    rewriteLinks();
    initHamburgerMenu();
    setActiveNav();
}

function rewriteLinks() {
    const links = document.querySelectorAll('.nav-link, .mobile-link');
    links.forEach(link => {
        const page = link.dataset.page;
        // set href dynamically if needed
        link.href = page ? `./${page}` : './';
        
        // Add click event to use pushState
        link.addEventListener('click', e => {
            e.preventDefault();
            
            const targetPage = page || 'home';
            const targetUrl = page ? `/clcd.com/${page}` : '/clcd.com/';
          
            history.pushState({ page: targetPage }, '', targetUrl);
            
            loadPageContent(targetPage);

            setActiveNav();
            dynamicTitle();
            
            const mobileMenu = document.querySelector('.mobile-glass-menu');
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                closeMenu();
            }
        });
    });
}

// Setup popstate handler only once
if (!popstateHandler) {
    popstateHandler = (event) => {
        const page = event.state?.page || 'home';
        loadPageContent(page);
        setActiveNav();
        dynamicTitle();
    };
    window.addEventListener('popstate', popstateHandler);
}

function loadPageContent(page) {
    const container = document.querySelector('.main-con');

    // Scroll to top smoothly when changing pages
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

    // Clean up Vanta effect before switching pages
    cleanupVanta();

    /*

    let css_to_load = page;
    
    if(page != "projects" || page != "contact") css_to_load = "home";

    const links = document.querySelectorAll('link[rel="stylesheet"]');
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && (href.includes('home.css') || href.includes('projects.css') || href.includes('contact.css'))) {
            link.remove();
        }
    });

    const link = document.createElement('link');
    link.id = 'page-style';
    link.rel = 'stylesheet';
    link.href = `./styles/${css_to_load}.css`;
    document.head.appendChild(link);

    */

    console.log("this: " . page);

    switch(page) {
        case 'services':
            loadServices(container);
            break;
        case 'contact':
            loadContact(container);
            break;
        case 'admin':
            window.location.href = './admin/index.php';
            console.log("admin");
            break;
        case 'home':
        default:
            loadHome(container);
            break;
    }
}



function setActiveNav() {
    const urlPath = window.location.pathname;
    const pathParts = urlPath.split('/').filter(part => part !== '');
    const currentPage = pathParts[pathParts.length - 1] || 'home';
    
    // Get all nav links (both desktop and mobile)
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    
    // Function to check if link matches current page
    function isActive(link) {
        const linkPage = link.getAttribute('data-page') || 'home';
        
        // Handle contacts/contact variation
        if (currentPage === 'contacts' || currentPage === 'contact') {
            return linkPage === 'contact';
        }
        
        return linkPage === currentPage || (currentPage === 'clcd.com' && linkPage === '');
    }
    
    // Set active class for desktop nav
    navLinks.forEach(link => {
        if (isActive(link)) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Set active class for mobile nav
    mobileLinks.forEach(link => {
        if (isActive(link)) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function initHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger-btn');
    const mobileMenu = document.querySelector('.mobile-glass-menu');
    const overlay = document.querySelector('.mobile-menu-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    
    if (!hamburger || !mobileMenu || !overlay) return;
    
    // Use named functions to prevent duplicate listeners
    const toggleMenu = () => {
        const isOpen = hamburger.classList.contains('active');
        
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    };
    
    const overlayClick = () => closeMenu();
    
    const linkClick = () => closeMenu();
    
    // Remove old listeners before adding new ones (if any)
    hamburger.removeEventListener('click', toggleMenu);
    overlay.removeEventListener('click', overlayClick);
    
    // Add listeners
    hamburger.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', overlayClick);
    
    // Close on link click
    mobileLinks.forEach(link => {
        link.removeEventListener('click', linkClick);
        link.addEventListener('click', linkClick);
    });
    
    function openMenu() {
        // Remove closing class if it exists
        mobileMenu.classList.remove('closing');
        
        // Add active classes
        hamburger.classList.add('active');
        mobileMenu.classList.add('active');
        overlay.classList.add('active');
    }
    
    function closeMenu() {
        // Add closing animation
        mobileMenu.classList.add('closing');
        hamburger.classList.remove('active');
        overlay.classList.remove('active');
        
        // Remove active and closing class after animation
        setTimeout(() => {
            mobileMenu.classList.remove('active');
            mobileMenu.classList.remove('closing');
        }, 300);
    }
}

// Cleanup on page unload
if (!beforeunloadHandler) {
    beforeunloadHandler = () => {
        cleanupVanta();
    };
    window.addEventListener('beforeunload', beforeunloadHandler);
}