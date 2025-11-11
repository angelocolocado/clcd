import { loadHeader, updateActiveNav } from './header_admin.js';

loadHeader();

const urlParams = new URLSearchParams(window.location.search);
let activity = urlParams.get('activity') || '';

switch (activity) {
    case '':
        loadDashboard();
        break;
    case 'manage-portfolio':
        loadManagePortfolio();
        break;
    default:
        console.warn("Page not found.")
        break;
}

updateActiveNav();

async function loadDashboard() {
    const main = document.querySelector('main');
    
    // Show loading state
    main.innerHTML = `
        <div class="loading-container">
            <div class="loading-spinner"></div>
            <p>Loading dashboard...</p>
        </div>
    `;
    
    try {
        // Fetch messages from backend
        const response = await fetch('../backend/get_messages.php');
        const data = await response.json();
        
        if (data.status === 'success') {
            renderDashboard(data.data, data.total);
        } else {
            main.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">⚠️</div>
                    <h3>Error Loading Messages</h3>
                    <p>${data.message}</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error fetching messages:', error);
        main.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">⚠️</div>
                <h3>Connection Error</h3>
                <p>Unable to load messages. Please check your database connection.</p>
            </div>
        `;
    }
}

function renderDashboard(messages, total) {
    const main = document.querySelector('main');
    
    // Calculate stats
    const totalMessages = total;
    const todayMessages = messages.filter(msg => {
        const msgDate = new Date(msg.date_sent);
        const today = new Date();
        return msgDate.toDateString() === today.toDateString();
    }).length;
    
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekMessages = messages.filter(msg => {
        const msgDate = new Date(msg.date_sent);
        return msgDate >= weekAgo;
    }).length;
    
    main.innerHTML = `
        <!-- SVG Decorations -->
        <svg class="svg-decoration top-right" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#00d9ff;stop-opacity:0.5" />
                    <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:0.5" />
                </linearGradient>
            </defs>
            <path fill="url(#grad1)" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.2,73.1,42.8C64.8,56.4,53.8,69,40.1,76.1C26.4,83.2,10,84.8,-5.9,84.3C-21.8,83.8,-37.2,81.2,-50.8,74.1C-64.4,67,-76.2,55.4,-82.6,41.2C-89,27,-90,10.2,-87.8,-5.9C-85.6,-22,-80.2,-37.4,-71.3,-50.3C-62.4,-63.2,-50,-73.6,-36.2,-81.1C-22.4,-88.6,-7.2,-93.2,6.2,-93.4C19.6,-93.6,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
        </svg>
        
        <svg class="svg-decoration bottom-left" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#00ff88;stop-opacity:0.5" />
                    <stop offset="100%" style="stop-color:#00d9ff;stop-opacity:0.5" />
                </linearGradient>
            </defs>
            <path fill="url(#grad2)" d="M39.5,-65.6C51.4,-58.3,61.5,-48.3,68.4,-36.2C75.3,-24.1,79,-10,78.8,4.2C78.6,18.4,74.5,32.7,66.8,44.3C59.1,55.9,47.8,64.8,35.2,69.9C22.6,75,8.7,76.3,-4.6,74.8C-17.9,73.3,-30.6,68.9,-42.2,62.8C-53.8,56.7,-64.3,48.9,-70.7,38.2C-77.1,27.5,-79.4,13.8,-78.3,0.5C-77.2,-12.8,-72.7,-25.6,-65.5,-36.8C-58.3,-48,-48.4,-57.6,-36.8,-65.2C-25.2,-72.8,-12.6,-78.4,0.3,-78.9C13.2,-79.4,27.6,-72.9,39.5,-65.6Z" transform="translate(100 100)" />
        </svg>
        
        <div class="dashboard-header">
            <p class="dashboard-subtitle">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon messages">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                </div>
                <div class="stat-content">
                    <p class="stat-label">Total Messages</p>
                    <p class="stat-value">${totalMessages}</p>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon unread">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                </div>
                <div class="stat-content">
                    <p class="stat-label">Today's Messages</p>
                    <p class="stat-value">${todayMessages}</p>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon total">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                </div>
                <div class="stat-content">
                    <p class="stat-label">This Week</p>
                    <p class="stat-value">${weekMessages}</p>
                </div>
            </div>
        </div>
        
        <div class="messages-section">
            <div class="section-header">
                <h2 class="section-title">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    Recent Messages
                </h2>
                <div class="filter-buttons">
                    <button class="filter-btn active" data-filter="all">All</button>
                    <button class="filter-btn" data-filter="today">Today</button>
                    <button class="filter-btn" data-filter="week">This Week</button>
                    <button class="filter-btn" data-filter="grouped">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        Grouped
                    </button>
                </div>
            </div>
            
            <div class="messages-container" id="messages-container">
                ${messages.length > 0 ? renderMessages(messages) : `
                    <div class="empty-state">
                        <div class="empty-state-icon">📭</div>
                        <h3>No Messages Yet</h3>
                        <p>When visitors contact you, their messages will appear here.</p>
                    </div>
                `}
            </div>
        </div>
    `;
    
    // Add filter functionality
    initFilters(messages);
}

function renderMessages(messages) {
    return messages.map(msg => {
        const initials = msg.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        const date = new Date(msg.date_sent);
        const timeAgo = getTimeAgo(date);
        
        return `
            <div class="message-card" data-date="${msg.date_sent}">
                <div class="message-header">
                    <div class="message-from">
                        <div class="sender-avatar">${initials}</div>
                        <div class="sender-info">
                            <h3>${msg.name}</h3>
                            <p>${msg.email}</p>
                        </div>
                    </div>
                    <div class="message-meta">
                        <div class="message-time">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            ${timeAgo}
                        </div>
                        <div class="message-id">#${msg.id}</div>
                    </div>
                </div>
                <div class="message-content">
                    ${msg.message}
                </div>
                <div class="message-actions">
                    <a href="mailto:${msg.email}?subject=Re: Your message&body=Hi ${msg.name},%0D%0A%0D%0AThank you for reaching out!%0D%0A%0D%0A" class="reply-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 7l9 6 9-6M3 7v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7M3 7l2-2h14l2 2"></path>
                        </svg>
                        Reply via Email
                    </a>
                </div>
            </div>
        `;
    }).join('');
}

function getTimeAgo(date) {
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
        }
    }
    
    return 'Just now';
}

function renderGroupedMessages(messages) {
    // Group messages by email
    const groupedByEmail = {};
    
    messages.forEach(msg => {
        if (!groupedByEmail[msg.email]) {
            groupedByEmail[msg.email] = [];
        }
        groupedByEmail[msg.email].push(msg);
    });
    
    // Sort groups by most recent message
    const sortedGroups = Object.entries(groupedByEmail).sort((a, b) => {
        const aLatest = new Date(Math.max(...a[1].map(m => new Date(m.date_sent))));
        const bLatest = new Date(Math.max(...b[1].map(m => new Date(m.date_sent))));
        return bLatest - aLatest;
    });
    
    return sortedGroups.map(([email, msgs]) => {
        const initials = msgs[0].name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        const latestMsg = msgs.reduce((latest, msg) => 
            new Date(msg.date_sent) > new Date(latest.date_sent) ? msg : latest
        );
        const messageCount = msgs.length;
        const emailId = email.replace(/[^a-zA-Z0-9]/g, '_');
        
        return `
            <div class="message-group">
                <div class="group-header" onclick="window.toggleGroup('${emailId}')">
                    <div class="group-info">
                        <div class="sender-avatar">${initials}</div>
                        <div class="group-details">
                            <h3>${msgs[0].name}</h3>
                            <p>${email}</p>
                        </div>
                    </div>
                    <div class="group-meta">
                        <span class="message-count">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                            ${messageCount} message${messageCount > 1 ? 's' : ''}
                        </span>
                        <svg class="expand-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </div>
                </div>
                <div class="group-messages" id="group-${emailId}" style="display: none;">
                    ${msgs.map((msg, index) => {
                        const date = new Date(msg.date_sent);
                        const timeAgo = getTimeAgo(date);
                        return `
                            <div class="grouped-message ${index === 0 ? 'first' : ''}">
                                <div class="grouped-message-header">
                                    <div class="message-time">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <polyline points="12 6 12 12 16 14"></polyline>
                                        </svg>
                                        ${timeAgo}
                                    </div>
                                    <div class="message-id">#${msg.id}</div>
                                </div>
                                <div class="grouped-message-content">
                                    ${msg.message}
                                </div>
                            </div>
                        `;
                    }).join('')}
                    <div class="group-actions">
                        <a href="mailto:${email}?subject=Re: Your messages&body=Hi ${msgs[0].name},%0D%0A%0D%0AThank you for reaching out!%0D%0A%0D%0A" class="reply-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M3 7l9 6 9-6M3 7v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7M3 7l2-2h14l2 2"></path>
                            </svg>
                            Reply to All Messages
                        </a>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Make toggleGroup available globally
window.toggleGroup = function(emailId) {
    const groupMessages = document.getElementById(`group-${emailId}`);
    const groupHeader = groupMessages.previousElementSibling;
    const expandIcon = groupHeader.querySelector('.expand-icon');
    
    if (groupMessages.style.display === 'none') {
        groupMessages.style.display = 'block';
        expandIcon.style.transform = 'rotate(180deg)';
    } else {
        groupMessages.style.display = 'none';
        expandIcon.style.transform = 'rotate(0deg)';
    }
}

function initFilters(messages) {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const container = document.getElementById('messages-container');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            let filteredMessages = messages;
            
            if (filter === 'today') {
                filteredMessages = messages.filter(msg => {
                    const msgDate = new Date(msg.date_sent);
                    const today = new Date();
                    return msgDate.toDateString() === today.toDateString();
                });
                container.innerHTML = filteredMessages.length > 0 ? renderMessages(filteredMessages) : `
                    <div class="empty-state">
                        <div class="empty-state-icon">📭</div>
                        <h3>No Messages Found</h3>
                        <p>No messages match the selected filter.</p>
                    </div>
                `;
            } else if (filter === 'week') {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                filteredMessages = messages.filter(msg => {
                    const msgDate = new Date(msg.date_sent);
                    return msgDate >= weekAgo;
                });
                container.innerHTML = filteredMessages.length > 0 ? renderMessages(filteredMessages) : `
                    <div class="empty-state">
                        <div class="empty-state-icon">📭</div>
                        <h3>No Messages Found</h3>
                        <p>No messages match the selected filter.</p>
                    </div>
                `;
            } else if (filter === 'grouped') {
                // Group messages by email
                container.innerHTML = renderGroupedMessages(messages);
            } else {
                // Show all messages
                container.innerHTML = filteredMessages.length > 0 ? renderMessages(filteredMessages) : `
                    <div class="empty-state">
                        <div class="empty-state-icon">📭</div>
                        <h3>No Messages Found</h3>
                        <p>No messages match the selected filter.</p>
                    </div>
                `;
            }
        });
    });
}

function loadManagePortfolio() {
    const main = document.querySelector('main');
    main.innerHTML = `
        <div class="dashboard-header">
            <p class="dashboard-subtitle">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                Add, edit, or remove portfolio projects
            </p>
        </div>
        
        <div class="empty-state">
            <div class="empty-state-icon">🚧</div>
            <h3>Coming Soon</h3>
            <p>Portfolio management features are under development.</p>
        </div>
    `;
}