export function loadInfo(container) {
    // Hide header on info page
    const header = document.querySelector('header');
    if (header) {
        header.style.display = 'none';
    }
    
    container.innerHTML = `
        <div class="info-page">
            <div class="info-notice">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 16V12M12 8H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <p>This is not the main website. This page contains project documentation and resources.</p>
            </div>

            <div class="info-hero">
                <div class="info-hero-content">
                    <h1 class="info-title">Project Information</h1>
                    <p class="info-subtitle">Source code, documentation, and admin access</p>
                </div>
            </div>

            <div class="info-content">
                <div class="info-grid">
                    <!-- GitHub Source Code Card -->
                    <a href="https://github.com/angelocolocado/clcd/tree/main" target="_blank" rel="noopener noreferrer" class="info-card github-card">
                        <div class="info-card-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C6.477 2 2 6.477 2 12C2 16.418 4.865 20.166 8.839 21.489C9.339 21.579 9.521 21.269 9.521 21.004C9.521 20.769 9.513 20.146 9.508 19.312C6.726 19.91 6.139 17.806 6.139 17.806C5.685 16.639 5.029 16.329 5.029 16.329C4.121 15.714 5.098 15.727 5.098 15.727C6.101 15.799 6.629 16.754 6.629 16.754C7.521 18.282 8.97 17.842 9.539 17.586C9.631 16.94 9.889 16.501 10.175 16.251C7.955 16.001 5.619 15.144 5.619 11.183C5.619 10.073 6.008 9.165 6.649 8.453C6.546 8.198 6.203 7.198 6.747 5.818C6.747 5.818 7.586 5.548 9.496 6.866C10.294 6.644 11.144 6.533 11.994 6.529C12.844 6.533 13.694 6.644 14.494 6.866C16.404 5.548 17.242 5.818 17.242 5.818C17.787 7.198 17.444 8.198 17.341 8.453C17.984 9.165 18.371 10.073 18.371 11.183C18.371 15.154 16.031 15.999 13.801 16.246C14.161 16.562 14.486 17.182 14.486 18.126C14.486 19.521 14.474 20.645 14.474 21.004C14.474 21.271 14.654 21.584 15.161 21.488C19.138 20.163 22 16.416 22 12C22 6.477 17.523 2 12 2Z" fill="currentColor"/>
                            </svg>
                        </div>
                        <div class="info-card-content">
                            <h2 class="info-card-title">Source Code</h2>
                            <p class="info-card-description">View the complete source code on GitHub</p>
                            <div class="info-card-link">
                                <span>github.com/angelocolocado/clcd</span>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
                        </div>
                    </a>

                    <!-- Main Website Card -->
                    <a href="https://clcd.infinityfreeapp.com" target="_blank" rel="noopener noreferrer" class="info-card website-card">
                        <div class="info-card-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M2 12H22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M12 2C14.5 4.5 16 8.5 16 12C16 15.5 14.5 19.5 12 22C9.5 19.5 8 15.5 8 12C8 8.5 9.5 4.5 12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <div class="info-card-content">
                            <h2 class="info-card-title">Main Website</h2>
                            <p class="info-card-description">Visit the live production website</p>
                            <div class="info-card-link">
                                <span>clcd.infinityfreeapp.com</span>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
                        </div>
                    </a>
                </div>

                <!-- Admin Access Section -->
                <div class="admin-section">
                    <div class="admin-header">
                        <div class="admin-icon">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <h2 class="admin-title">Admin Panel Access</h2>
                        <p class="admin-subtitle">Two ways to access the administration panel</p>
                    </div>

                    <!-- Login Credentials -->
                    <div class="admin-credentials">
                        <div class="credentials-header">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <h3>Login Credentials</h3>
                        </div>
                        <div class="credentials-grid">
                            <div class="credential-item">
                                <label>Username</label>
                                <div class="credential-value">02220000632</div>
                            </div>
                            <div class="credential-item">
                                <label>Password</label>
                                <div class="credential-value">ilovejanelleandmymom</div>
                            </div>
                        </div>
                    </div>

                    <div class="admin-methods">
                        <div class="admin-method">
                            <div class="method-number">1</div>
                            <div class="method-content">
                                <h3 class="method-title">Via Footer Link</h3>
                                <p class="method-description">Scroll to the bottom of any page and click the "Admin Access" link in the footer</p>
                                <div class="method-visual">
                                    <svg width="100%" height="60" viewBox="0 0 300 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="10" y="15" width="280" height="30" rx="15" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
                                        <circle cx="30" cy="30" r="8" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
                                        <text x="50" y="35" fill="rgba(255,255,255,0.6)" font-size="12" font-family="system-ui">Admin Access</text>
                                        <path d="M260 25L265 30L260 35" stroke="rgba(255,255,255,0.4)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div class="admin-method">
                            <div class="method-number">2</div>
                            <div class="method-content">
                                <h3 class="method-title">Via Direct URL</h3>
                                <p class="method-description">Navigate directly to the admin panel using the URL below</p>
                                <a href="https://clcd.infinityfreeapp.com/admin" target="_blank" rel="noopener noreferrer" class="method-link">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10 13C10.4295 13.5741 10.9774 14.0491 11.6066 14.3929C12.2357 14.7367 12.9315 14.9411 13.6467 14.9923C14.3618 15.0435 15.0796 14.9403 15.7513 14.6897C16.4231 14.4392 17.0331 14.047 17.54 13.54L20.54 10.54C21.4508 9.59695 21.9548 8.33394 21.9434 7.02296C21.932 5.71198 21.4061 4.45791 20.4791 3.53087C19.5521 2.60383 18.298 2.07799 16.987 2.0666C15.676 2.0552 14.413 2.55918 13.47 3.46997L11.75 5.17997" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M14 11C13.5705 10.4259 13.0226 9.95083 12.3934 9.60707C11.7642 9.26331 11.0685 9.05889 10.3533 9.00768C9.63816 8.95646 8.92037 9.05965 8.24861 9.31023C7.57685 9.5608 6.96684 9.95303 6.45996 10.46L3.45996 13.46C2.54917 14.403 2.04519 15.666 2.05659 16.977C2.06798 18.288 2.59382 19.5421 3.52086 20.4691C4.4479 21.3961 5.70197 21.922 7.01295 21.9334C8.32393 21.9448 9.58694 21.4408 10.53 20.53L12.24 18.82" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    <span>clcd.infinityfreeapp.com/admin</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}
