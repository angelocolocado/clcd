// Helper function to prevent XSS attacks
function escapeHtml(unsafe) {
    if (unsafe === null || unsafe === undefined) return '';
    return String(unsafe)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

let isLoading = false;

export async function loadServices(container){
    // Prevent multiple simultaneous loads
    if (isLoading) {
        console.log('Already loading projects, skipping...');
        return;
    }
    
    isLoading = true;
    
    // Clear existing content completely - remove all children
    container.innerHTML = '';
    
    // Create hero section
    const heroSection = document.createElement('section');
    heroSection.className = 'projects-hero';
    heroSection.innerHTML = `
        <div class="projects-hero-content">
            <h1 class="projects-hero-title">Services</h1>
            <p class="projects-hero-subtitle">Showcasing Innovation & Excellence</p>
            <p class="projects-hero-tagline">Explore our range of services</p>
        </div>
    `;
    container.appendChild(heroSection);

    try {
        const [webappData, testimonialsData, creativesData] = await Promise.all([
            fetch('./project/webapp-projects.json').then(res => res.json()),
            fetch('./project/testimonials.json').then(res => res.json()),
            fetch('./project/creatives.json').then(res => res.json())
        ]);

        // Combine all generated HTML and append once
        const sectionsHTML = [
            renderWebAppSection(webappData),
            renderTestimonialsSection(testimonialsData),
            renderCreativesSection(creativesData)
        ].join('');

        container.insertAdjacentHTML('beforeend', sectionsHTML);
        
        // Add scroll listener for hero animation
        const hero = container.querySelector('.projects-hero');
        if (hero) {
            const handleScroll = () => {
                if (window.scrollY > 35) {
                    hero.classList.add('scrolled');
                } else {
                    hero.classList.remove('scrolled');
                }
            };
            
            window.addEventListener('scroll', handleScroll, { passive: true });
        }
        
        isLoading = false;
        
    } catch (error) {
        console.error('Error loading project data:', error);
        const errorSection = document.createElement('section');
        errorSection.className = 'error-section';
        errorSection.innerHTML = `
            <div class="error-message">
                <p>Failed to load projects. Please try again later.</p>
            </div>
        `;
        container.appendChild(errorSection);
        isLoading = false;
    }
}

function renderWebAppSection(data) {
    if (!data?.projects?.length) return '<div></div>';
    
    const projectsHTML = data.projects.map(project => {
        const imageHTML = project.image ? 
            `<img src="${project.image}" alt="${escapeHtml(project.title)}" loading="lazy" decoding="async" />` :
            `<div class="project-placeholder">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 18L22 12L16 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8 6L2 12L8 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>`;
        
        const linkHTML = project.link ? `<a href="${escapeHtml(project.link)}" class="project-link" target="_blank" rel="noopener noreferrer">View Project</a>` : '';
        
        return `
            <div class="project-card">
                <div class="project-thumbnail">${imageHTML}</div>
                <div class="project-info">
                    <h3 class="project-title">${escapeHtml(project.title)}</h3>
                    <p class="project-desc">${escapeHtml(project.description)}</p>
                    ${linkHTML}
                </div>
            </div>
        `;
    }).join('');

    return `
        <section class="projects-category webapp-section">
            <div class="category-container">
                <div class="category-header">
                    <div class="category-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 3H4C3.44772 3 3 3.44772 3 4V9C3 9.55228 3.44772 10 4 10H9C9.55228 10 10 9.55228 10 9V4C10 3.44772 9.55228 3 9 3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M20 3H15C14.4477 3 14 3.44772 14 4V9C14 9.55228 14.4477 10 15 10H20C20.5523 10 21 9.55228 21 9V4C21 3.44772 20.5523 3 20 3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M9 14H4C3.44772 14 3 14.4477 3 15V20C3 20.5523 3.44772 21 4 21H9C9.55228 21 10 20.5523 10 20V15C10 14.4477 9.55228 14 9 14Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M20 14H15C14.4477 14 14 14.4477 14 15V20C14 20.5523 14.4477 21 15 21H20C20.5523 21 21 20.5523 21 20V15C21 14.4477 20.5523 14 20 14Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <h2 class="category-title">${escapeHtml(data.category.title)}</h2>
                    <p class="category-description">${escapeHtml(data.category.description)}</p>
                </div>
                <div class="projects-grid">${projectsHTML}</div>
            </div>
        </section>
    `;
}

function renderTestimonialsSection(data) {
    if (!data?.testimonials?.length) return '<div></div>';
    
    const testimonialsHTML = data.testimonials.map(testimonial => {
        const imageHTML = testimonial.image ? 
            `<img src="${escapeHtml(testimonial.image)}" alt="${escapeHtml(testimonial.name)}" loading="lazy" />` :
            `<div class="testimonial-avatar-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2"/>
                    <path d="M20 21C20 17.134 16.418 14 12 14C7.582 14 4 17.134 4 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </div>`;
        
        const starsHTML = Array(testimonial.rating).fill(0).map(() => 
            `<svg class="star-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>`
        ).join('');
        
        return `
            <div class="testimonial-card">
                <div class="testimonial-header">
                    <div class="testimonial-avatar">${imageHTML}</div>
                    <div class="testimonial-info">
                        <h4 class="testimonial-name">${escapeHtml(testimonial.name)}</h4>
                        <p class="testimonial-position">${escapeHtml(testimonial.position)}</p>
                        <p class="testimonial-company">${escapeHtml(testimonial.company)}</p>
                    </div>
                </div>
                <div class="testimonial-rating">${starsHTML}</div>
                <p class="testimonial-text">"${escapeHtml(testimonial.testimonial)}"</p>
                <div class="testimonial-project">
                    <span class="project-label">Project:</span>
                    <span class="project-name">${escapeHtml(testimonial.project)}</span>
                </div>
            </div>
        `;
    }).join('');

    return `
        <section class="projects-category testimonials-section">
            <div class="category-container">
                <div class="category-header">
                    <div class="category-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0034 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92176 4.44061 8.37485 5.27072 7.03255C6.10083 5.69025 7.28825 4.60557 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <h2 class="category-title">${escapeHtml(data.category.title)}</h2>
                    <p class="category-description">${escapeHtml(data.category.description)}</p>
                </div>
                <div class="testimonials-grid">${testimonialsHTML}</div>
            </div>
        </section>
    `;
}

function renderCreativesSection(data) {
    if (!data) return '<div></div>';
    
    // Photography section
    const galleryHTML = data.photography?.gallery?.map(item => {
        const imageHTML = item.image ?
            `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.alt || 'Gallery image')}" loading="lazy" />` :
            `<div class="gallery-placeholder">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                    <path d="M21 15L16 10L5 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>`;
        
        return `
            <div class="gallery-item">
                ${imageHTML}
                <div class="gallery-overlay">
                    <span class="gallery-category">${escapeHtml(item.category || '')}</span>
                </div>
            </div>
        `;
    }).join('') || '';

    // Filmmaking section
    const filmsHTML = data.filmmaking?.films?.map(film => {
        const thumbnailHTML = film.thumbnail ?
            `<img src="${escapeHtml(film.thumbnail)}" alt="${escapeHtml(film.title)}" loading="lazy" />` :
            `<div class="film-placeholder">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <path d="M10 8L16 12L10 16V8Z" fill="currentColor"/>
                </svg>
            </div>`;
        
        const videoLinkHTML = film.videoUrl ? 
            `<a href="${escapeHtml(film.videoUrl)}" class="film-link" target="_blank" rel="noopener noreferrer">Watch Video</a>` : '';
        
        return `
            <div class="film-card">
                <div class="film-thumbnail">
                    ${thumbnailHTML}
                    <div class="film-duration">${escapeHtml(film.duration || '')}</div>
                </div>
                <div class="film-info">
                    <h4 class="film-title">${escapeHtml(film.title)}</h4>
                    <p class="film-desc">${escapeHtml(film.description)}</p>
                    <div class="film-meta">
                        <span class="film-type">${escapeHtml(film.type || '')}</span>
                        <span class="film-year">${escapeHtml(film.year || '')}</span>
                    </div>
                    ${videoLinkHTML}
                </div>
            </div>
        `;
    }).join('') || '';

    const photographySection = data.photography?.visible === 1 ? `
        <div class="creative-subsection">
            <div class="subsection-header">
                <div class="subsection-icon">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h3 class="subsection-title">${escapeHtml(data.photography.title)}</h3>
                <p class="subsection-description">${escapeHtml(data.photography.description)}</p>
            </div>
            <div class="gallery-grid">${galleryHTML}</div>
        </div>
    ` : '';

    const filmmakingSection = data.filmmaking?.visible === 1 ? `
        <div class="creative-subsection">
            <div class="subsection-header">
                <div class="subsection-icon">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M23 7L16 12L23 17V7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <rect x="1" y="5" width="15" height="14" rx="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h3 class="subsection-title">${escapeHtml(data.filmmaking.title)}</h3>
                <p class="subsection-description">${escapeHtml(data.filmmaking.description)}</p>
            </div>
            <div class="films-grid">${filmsHTML}</div>
        </div>
    ` : '';

    return `
        <section class="projects-category creatives-section ${data.category?.availability === "0" ? 'discontinued' : ''}">
            <div class="category-container">
                <div class="category-header">
                    <div class="category-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <h2 class="category-title">${escapeHtml(data.category.title)}</h2>
                    <p class="category-description">${escapeHtml(data.category.description)}</p>
                    ${data.category?.availability === "0" ? `
                        <div class="availability-badge discontinued-badge">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                                <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                            <span>Service Discontinued</span>
                        </div>
                    ` : ''}
                </div>
                ${photographySection}
                ${filmmakingSection}
                ${data.category?.availability === "0" ? '<div class="discontinued-overlay"></div>' : ''}
            </div>
        </section>
    `;
}
