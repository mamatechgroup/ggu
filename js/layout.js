/**
 * Layout Loader
 * Loads shared header and footer into the page
 * Real-world safe, reusable, and maintainable
 */

document.addEventListener('DOMContentLoaded', async () => {
    // Load all partials
    await Promise.all([
        loadPartial('site-header', 'includes/header.html'),
        loadPartial('site-footer', 'includes/footer.html'),
        loadPartial('admin-sidebar', '/includes/admin-sidebar.html'),
        loadPartial('admin-header', '/includes/admin-header.html'),
        loadPartial('student-sidebar', '/includes/student-sidebar.html'),
        loadPartial('student-header', '/includes/student-header.html')
    ]);
    
    // Initialize navigation after headers are loaded
    initializeNavigation();
});

/**
 * Load an HTML partial into a target container
 * @param {string} elementId - Target container ID
 * @param {string} filePath - Path to HTML partial
 */
async function loadPartial(elementId, filePath) {
    const container = document.getElementById(elementId);
    if (!container) return;

    try {
        const response = await fetch(filePath, { cache: 'no-store' });

        if (!response.ok) {
            throw new Error(`Failed to load ${filePath}`);
        }

        const html = await response.text();
        container.innerHTML = html;

        // Dispatch custom event when header is loaded
        if (elementId === 'site-header') {
            document.dispatchEvent(new CustomEvent('headerLoaded', {
                detail: { elementId, filePath }
            }));
        }

    } catch (error) {
        console.error(error);
        container.innerHTML = '';
    }
}

/**
 * Initialize navigation after all content is loaded
 */
function initializeNavigation() {
    // Wait a tiny bit to ensure DOM is ready
    setTimeout(() => {
        // Check auth status FIRST before initializing navigation
        if (typeof checkAuthStatus === 'function') {
            checkAuthStatus();
        }
        
        // Initialize NavigationManager with proper timing
        if (typeof NavigationManager !== 'undefined') {
            // Use event-driven approach
            const navManager = new NavigationManager();
            
            // Re-trigger navigation setup after auth check
            if (typeof navManager.setActiveNav === 'function') {
                setTimeout(() => navManager.setActiveNav(), 100);
            }
        }
        
        // Reinitialize any other managers that depend on the header
        if (typeof AppInitializer !== 'undefined') {
            new AppInitializer();
        }
    }, 50);
}