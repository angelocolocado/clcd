
export function loadHeader() {
    const headerContainer = document.querySelector('header');

    // Check if already initialized (has event listeners)
    if (headerContainer.dataset.initialized === 'true') {
        return;
    }

    headerContainer.innerHTML = `
        <div class="header-con">
            <img src="../assets/logo/logo-admin.svg" alt="logo" class="logo">
            <nav class="glass-nav">
                <ul>
                    <li><a href="?activity=" class="nav-link" data-page="">Dashboard</a></li>
                    <li><a href="?activity=manage-portfolio" class="nav-link" data-page="manage-portfolio">Manage Portfolio</a></li>
                </ul>
            </nav>
            <button class="contact-btn" id="contact-btn-cta">Log Out</button>
            
            <!-- Hamburger Menu Button -->
            <button class="hamburger-btn" aria-label="Menu">
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
            </button>
        </div>
        
        <!-- Mobile Menu Overlay -->
        <div class="mobile-menu-overlay"></div>
        
        <!-- Mobile Glass Menu -->
        <div class="mobile-glass-menu">
            <nav>
                <ul>
                    <li><a href="?activity=" class="nav-link" data-page="">Dashboard</a></li>
                    <li><a href="?activity=manage-portfolio" class="nav-link" data-page="manage-portfolio">Manage Portfolio</a></li>
                </ul>
            </nav>
        </div>
    `;

    // Initialize hamburger menu functionality
    initHamburgerMenu();

    // Initialize navigation
    initNavigation();

    // Initialize contact button
    initContactButton();

    // Mark as initialized
    headerContainer.dataset.initialized = 'true';
}

// Export function to update active nav without re-rendering
export function updateActiveNav() {
    setActiveNav();
}

function initContactButton() {
    const contactBtn = document.getElementById('contact-btn-cta');
    if (contactBtn) {
        contactBtn.addEventListener('click', () => {
            // Logout functionality
            if (confirm('Are you sure you want to log out?')) {
                window.location.href = '../backend/logout.php';
            }
        });
    }
}

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    // Desktop and mobile navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            navigateToPage(page);
        });
    });
}

function navigateToPage(page) {
    // Update URL
    const newUrl = page ? `?activity=${page}` : '?activity=';
    window.history.pushState({}, '', newUrl);

    // Close mobile menu if open
    const hamburger = document.querySelector('.hamburger-btn');
    const mobileMenu = document.querySelector('.mobile-glass-menu');
    const overlay = document.querySelector('.mobile-menu-overlay');

    if (hamburger && hamburger.classList.contains('active')) {
        hamburger.classList.remove('active');
        overlay.classList.remove('active');
        mobileMenu.classList.add('closing');
        setTimeout(() => {
            mobileMenu.classList.remove('active', 'closing');
        }, 300);
    }

    // Reload the page to trigger the admin.js page manager
    window.location.reload();
}

function setActiveNav() {
    // Get current page from URL
    const urlParams = new URLSearchParams(window.location.search);
    const currentPage = urlParams.get('activity') || '';

    // Remove all active classes
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Add active class to current page links
    document.querySelectorAll(`[data-page="${currentPage}"]`).forEach(link => {
        link.classList.add('active');
    });
}

function initHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger-btn');
    const mobileMenu = document.querySelector('.mobile-glass-menu');
    const overlay = document.querySelector('.mobile-menu-overlay');
    const navLinks = document.querySelectorAll('.mobile-glass-menu .nav-link');

    if (!hamburger || !mobileMenu || !overlay) return;

    // Toggle menu
    hamburger.addEventListener('click', () => {
        const isOpen = hamburger.classList.contains('active');

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close on overlay click
    overlay.addEventListener('click', closeMenu);

    // Close on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
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