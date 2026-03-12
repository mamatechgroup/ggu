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
    initDashboardSidebarToggle();   // ✅ called once after all partials are loaded
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

// ==================== MOBILE MENU & DROPDOWN ENHANCEMENTS ====================
(function() {
    'use strict';

    // Toggle mobile menu (hamburger <-> close icon)
    function initMobileMenuToggle() {
        const menuBtn = document.querySelector('.mobile-menu-btn');
        const navMenu = document.querySelector('.nav-menu');
        if (!menuBtn || !navMenu) return;

        // Remove any previous listeners to avoid duplicates
        const newBtn = menuBtn.cloneNode(true);
        menuBtn.parentNode.replaceChild(newBtn, menuBtn);

        newBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            // Toggle icon between bars and times
            const icon = this.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.classList.contains('active')) return;
            if (!navMenu.contains(e.target) && !newBtn.contains(e.target)) {
                navMenu.classList.remove('active');
                const icon = newBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Handle dropdown toggles in main navigation (chevron down/up)
    function initNavDropdowns() {
        document.querySelectorAll('.nav-menu .dropdown > a').forEach(link => {
            if (link.dataset.dropdownEnhanced) return;
            link.dataset.dropdownEnhanced = 'true';

            link.addEventListener('click', function(e) {
                e.preventDefault();
                const submenu = this.nextElementSibling; // .dropdown-menu
                if (!submenu) return;

                submenu.classList.toggle('show');
                this.classList.toggle('open');
            });
        });
    }

    // Handle dropdown toggles in sidebars (chevron right/90deg)
    function initSidebarDropdowns() {
        document.querySelectorAll('.dashboard-sidebar .dropdown > a').forEach(link => {
            if (link.dataset.sidebarDropdownEnhanced) return;
            link.dataset.sidebarDropdownEnhanced = 'true';

            // Remove Bootstrap data attribute to avoid double toggling
            link.removeAttribute('data-bs-toggle');

            link.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation(); // Prevent event from bubbling to overlay or other listeners

                const targetId = this.getAttribute('data-bs-target') || this.getAttribute('href');
                if (!targetId) return;
                const submenu = document.querySelector(targetId);
                if (!submenu) return;

                // Manually toggle the Bootstrap 'show' class
                submenu.classList.toggle('show');
                // Toggle chevron rotation class
                this.classList.toggle('open');
            });

            // Ensure link is visibly clickable
            link.style.cursor = 'pointer';
        });
    }

    // Close any open panel when pressing Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeMenu = document.querySelector('.nav-menu.active');
            if (activeMenu) {
                activeMenu.classList.remove('active');
                const btn = document.querySelector('.mobile-menu-btn i');
                if (btn) {
                    btn.classList.remove('fa-times');
                    btn.classList.add('fa-bars');
                }
            }
            const activeSidebar = document.querySelector('.dashboard-sidebar.active');
            if (activeSidebar) {
                activeSidebar.classList.remove('active');
            }
        }
    });

    // Initialise everything
    function initMobileFeatures() {
        initMobileMenuToggle();
        initNavDropdowns();
        initSidebarDropdowns();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileFeatures);
    } else {
        initMobileFeatures();
    }

    // Re-run when partials are loaded (headers/sidebars)
    document.addEventListener('partialLoaded', function() {
        setTimeout(() => {
            initMobileMenuToggle();
            initNavDropdowns();
            initSidebarDropdowns();
        }, 50);
    });

})();

// ==================== DASHBOARD SIDEBAR TOGGLE (MOBILE) ====================
function initDashboardSidebarToggle() {
    const toggleBtn = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.dashboard-sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    if (!toggleBtn || !sidebar || !overlay) return;

    // Open/close when toggle button is clicked
    toggleBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.classList.toggle('sidebar-open'); // prevents background scroll
    });

    // Close when overlay is clicked
    overlay.addEventListener('click', function() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('sidebar-open');
    });

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('sidebar-open');
        }
    });
}