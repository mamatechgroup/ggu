/**
 * Layout Loader
 * Loads shared headers, footers, and sidebars
 * Safe for admin, student, and public pages
 */

document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([
        loadPartial('site-header', '/includes/header.html'),
        loadPartial('site-footer', '/includes/footer.html'),
        loadPartial('admin-sidebar', '/includes/admin-sidebar.html'),
        loadPartial('admin-header', '/includes/admin-header.html'),
        loadPartial('student-sidebar', '/includes/student-sidebar.html'),
        loadPartial('student-header', '/includes/student-header.html')
    ]);

    initializeNavigation();
});

/**
 * Loads an HTML partial into a container
 */
async function loadPartial(elementId, filePath) {
    const container = document.getElementById(elementId);
    if (!container) return;

    try {
        const response = await fetch(filePath, { cache: 'no-store' });
        if (!response.ok) throw new Error(`Failed to load ${filePath}`);

        container.innerHTML = await response.text();

        // IMPORTANT: Update header visibility after loading header
        if (elementId === 'site-header' || elementId === 'admin-header' || elementId === 'student-header') {
            setTimeout(updateHeaderVisibility, 50);
        }

        document.dispatchEvent(
            new CustomEvent('partialLoaded', {
                detail: { elementId, filePath }
            })
        );
    } catch (error) {
        console.error(error);
        container.innerHTML = '';
    }
}

/**
 * Initializes navigation, auth, and UI logic
 */
function initializeNavigation() {
    // Update header visibility FIRST
    if (typeof updateHeaderVisibility === 'function') {
        updateHeaderVisibility();
    }

    // Auth check
    if (typeof checkAuthStatus === 'function') {
        checkAuthStatus();
    }

    setupLogoutButton();

    if (typeof NavigationManager !== 'undefined') {
        const nav = new NavigationManager();
        nav.setActiveNav?.();
    }

    if (typeof AppInitializer !== 'undefined') {
        new AppInitializer();
    }
}

/**
 * Attaches logout logic safely
 */
function setupLogoutButton() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (!logoutBtn) return;

    const freshBtn = logoutBtn.cloneNode(true);
    logoutBtn.replaceWith(freshBtn);

    freshBtn.addEventListener('click', (e) => {
        e.preventDefault();
        performLogout();
    });
}

/**
 * Global logout function (SAFE from any folder)
 */
function performLogout() {
    localStorage.removeItem('ggu_current_user');
    sessionStorage.removeItem('ggu_current_user');
    
    // Update header immediately before redirect
    if (typeof updateHeaderVisibility === 'function') {
        updateHeaderVisibility();
    }
    
    // 🔥 ABSOLUTE redirect — fixes /admin/login.html bug
    window.location.replace('/login.html');
}

/**
 * Rebind logout when headers load dynamically
 */
document.addEventListener('partialLoaded', () => {
    setupLogoutButton();
    // Also update header visibility
    if (typeof updateHeaderVisibility === 'function') {
        setTimeout(updateHeaderVisibility, 100);
    }
});

// Make updateHeaderVisibility available globally
window.updateHeaderVisibility = updateHeaderVisibility;

/**
 * Update header visibility based on authentication status
 */
function updateHeaderVisibility() {
    try {
        // Check if user is logged in
        const user = localStorage.getItem('ggu_current_user') || 
                     sessionStorage.getItem('ggu_current_user');
        
        const currentUser = user ? JSON.parse(user) : null;
        const authButtons = document.querySelector('.auth-buttons');
        const userMenu = document.querySelector('.user-menu');
        
        if (!authButtons || !userMenu) return;
        
        if (currentUser) {
            // User is logged in - show user menu, hide auth buttons
            authButtons.style.display = 'none';
            userMenu.style.display = 'flex';
            
            // Update user name
            const userNameElement = userMenu.querySelector('.user-name');
            if (userNameElement && currentUser.name) {
                userNameElement.textContent = currentUser.name.split(' ')[0];
            }
            
            // Update dashboard link based on role
            const dashboardLink = userMenu.querySelector('.dashboard-link');
            if (dashboardLink) {
                if (currentUser.role === 'admin') {
                    dashboardLink.href = '/admin/dashboard.html';
                } else if (currentUser.role === 'student') {
                    dashboardLink.href = '/student/dashboard.html';
                }
            }
        } else {
            // User is not logged in - show auth buttons, hide user menu
            authButtons.style.display = 'flex';
            userMenu.style.display = 'none';
        }
    } catch (error) {
        console.error('Error updating header visibility:', error);
    }
}