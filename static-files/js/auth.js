// auth.js - Updated with correct dashboard paths

// Store demo accounts with correct paths
const demoAccounts = {
    'student@ggu.edu.lr': {
        password: 'student123',
        name: 'John Student',
        role: 'student',
        dashboard: '/student/student-dashboard.html',
        studentId: 'GGU2024001'
    },
    'admin@ggu.edu.lr': {
        password: 'admin123',
        name: 'Admin User',
        role: 'admin',
        dashboard: '/admin/admin-dashboard.html'
    },
    'faculty@ggu.edu.lr': {
        password: 'faculty123',
        name: 'Dr. Faculty Member',
        role: 'faculty',
        dashboard: '/admin/admin-dashboard.html'
    },
    'staff@ggu.edu.lr': {
        password: 'staff123',
        name: 'Staff Member',
        role: 'staff',
        dashboard: '/admin/admin-dashboard.html'
    },
    'alumni@ggu.edu.lr': {
        password: 'alumni123',
        name: 'Jane Alumni',
        role: 'alumni',
        dashboard: '/student/student-dashboard.html'
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAuthSystem();
    checkAuthStatus();
});

function initializeAuthSystem() {
    // Setup login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Setup registration form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegistration);
        
        // Show/hide student ID field
        const userRoleSelect = document.getElementById('userRole');
        const studentIdField = document.getElementById('studentIdField');
        
        if (userRoleSelect && studentIdField) {
            userRoleSelect.addEventListener('change', function() {
                if (this.value === 'student' || this.value === 'alumni') {
                    studentIdField.style.display = 'block';
                } else {
                    studentIdField.style.display = 'none';
                }
            });
        }
    }
    
    // Setup password recovery
    const recoveryForm = document.getElementById('recoveryForm');
    if (recoveryForm) {
        recoveryForm.addEventListener('submit', handlePasswordRecovery);
    }
    
   
    // Setup toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe')?.checked || false;
    
    // Validate inputs
    if (!email || !password) {
        showAlert('Please fill in all required fields.', 'danger');
        return;
    }
    
    // Check demo accounts
    if (demoAccounts[email]) {
        if (demoAccounts[email].password === password) {
            const userData = demoAccounts[email];
            loginUser(email, userData, rememberMe);
        } else {
            showAlert('Invalid email or password.', 'danger');
        }
        return;
    }
    
    // For non-demo accounts (simulate)
    simulateLogin(email, password, rememberMe);
}

// Simulate login for non-demo accounts
function simulateLogin(email, password, rememberMe) {
    // Determine role from email pattern
    let role = 'student';
    
    if (email.includes('admin') || email.includes('faculty') || email.includes('staff')) {
        role = email.includes('admin') ? 'admin' : 
               email.includes('faculty') ? 'faculty' : 'staff';
    } else if (email.includes('alumni')) {
        role = 'alumni';
    }
    
    // Generate user data with correct dashboard URL
    const dashboardUrl = getDashboardUrl(role);
    const userData = {
        name: email.split('@')[0],
        role: role,
        dashboard: dashboardUrl,
        email: email
    };
    
    loginUser(email, userData, rememberMe);
}

// Login user and redirect
function loginUser(email, userData, rememberMe) {
    // Get correct dashboard URL
    let dashboardUrl = userData.dashboard || getDashboardUrl(userData.role);
    
    // Create session data
    const sessionData = {
        email: email,
        name: userData.name,
        role: userData.role,
        dashboard: dashboardUrl,
        studentId: userData.studentId || '',
        loggedIn: true,
        loginTime: new Date().toISOString()
    };
    
    // Store in appropriate storage
    if (rememberMe) {
        localStorage.setItem('ggu_user', JSON.stringify(sessionData));
    } else {
        sessionStorage.setItem('ggu_user', JSON.stringify(sessionData));
    }
    
    // Show success message
    showAlert(`Welcome back, ${userData.name}! Redirecting to dashboard...`, 'success');
    
    // Redirect after delay
    setTimeout(() => {
        window.location.href = dashboardUrl;
    }, 1500);
}

// Handle registration
function handleRegistration(event) {
    event.preventDefault();
    
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const role = document.getElementById('userRole').value;
    const studentId = document.getElementById('studentId')?.value.trim() || '';
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const terms = document.getElementById('terms')?.checked || false;
    
    // Validation
    if (!name || !email || !role || !password || !confirmPassword) {
        showAlert('Please fill in all required fields.', 'danger');
        return;
    }
    
    if (password !== confirmPassword) {
        showAlert('Passwords do not match.', 'danger');
        return;
    }
    
    if (!terms) {
        showAlert('You must agree to the Terms of Service.', 'warning');
        return;
    }
    
    if (!validateEmail(email)) {
        showAlert('Please enter a valid email address.', 'danger');
        return;
    }
    
    // Check if email already exists
    if (demoAccounts[email]) {
        showAlert('An account with this email already exists. Please login instead.', 'warning');
        // Switch to login tab
        const loginTab = new bootstrap.Tab(document.getElementById('login-tab'));
        loginTab.show();
        return;
    }
    
    // Get dashboard URL for registered user
    const dashboardUrl = getDashboardUrl(role);
    
    // In a real app, you would send registration data to server here
    showAlert('Registration successful! Please login with your new credentials.', 'success');
    
    // Store temporary registration data (for demo purposes)
    const tempUserData = {
        name: name,
        email: email,
        role: role,
        dashboard: dashboardUrl,
        studentId: studentId,
        isPending: true
    };
    
    localStorage.setItem('ggu_temp_user', JSON.stringify(tempUserData));
    
    // Auto-fill login form and switch to login tab
    document.getElementById('loginEmail').value = email;
    const loginTab = new bootstrap.Tab(document.getElementById('login-tab'));
    loginTab.show();
    
    // Clear form
    event.target.reset();
    if (document.getElementById('studentIdField')) {
        document.getElementById('studentIdField').style.display = 'none';
    }
}

// Handle password recovery
function handlePasswordRecovery(event) {
    event.preventDefault();
    
    const email = document.getElementById('recoveryEmail').value.trim();
    
    if (!email) {
        showAlert('Please enter your email address.', 'danger');
        return;
    }
    
    if (!validateEmail(email)) {
        showAlert('Please enter a valid email address.', 'danger');
        return;
    }
    
    showAlert(`Password reset instructions have been sent to ${email}. Please check your inbox.`, 'success');
    event.target.reset();
}

// Check authentication status on page load
function checkAuthStatus() {
    const userData = JSON.parse(localStorage.getItem('ggu_user') || sessionStorage.getItem('ggu_user') || 'null');
    
    if (userData && userData.loggedIn) {
        updateAuthUI(userData);
    }
}

// Update UI based on auth status
function updateAuthUI(userData) {
    const authButtons = document.querySelector('.auth-buttons');
    const userMenu = document.querySelector('.user-menu');
    
    if (authButtons && userMenu) {
        authButtons.style.display = 'none';
        userMenu.style.display = 'flex';
        
        const userName = userMenu.querySelector('.user-name');
        const dashboardLink = userMenu.querySelector('.dashboard-link');
        
        if (userName) userName.textContent = userData.name || userData.email;
        if (dashboardLink) {
            dashboardLink.href = userData.dashboard || getDashboardUrl(userData.role);
        }
    }
}

// Get dashboard URL based on role - UPDATED WITH CORRECT PATHS
function getDashboardUrl(role) {
    const roleLower = role?.toLowerCase() || 'student';
    
    switch(roleLower) {
        case 'student':
        case 'alumni':
        case 'applicant':
            return '/student/student-dashboard.html';
        case 'admin':
        case 'faculty':
        case 'staff':
            return '/admin/admin-dashboard.html';
        default:
            return '/student/student-dashboard.html'; // Default fallback
    }
}

// Show alert messages
function showAlert(message, type) {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.custom-alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Create alert
    const alert = document.createElement('div');
    alert.className = `custom-alert alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Style alert
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    // Add to page
    document.body.appendChild(alert);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
}

// Validate email format
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Password strength checker
function checkPasswordStrength(password) {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    const mediumRegex = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;
    
    if (strongRegex.test(password)) return 'strong';
    if (mediumRegex.test(password)) return 'medium';
    return 'weak';
}

// Add password strength indicator if on registration page
document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('registerPassword');
    const strengthIndicator = document.getElementById('passwordStrength');
    
    if (passwordInput && strengthIndicator) {
        passwordInput.addEventListener('input', function() {
            const strength = checkPasswordStrength(this.value);
            strengthIndicator.textContent = `Strength: ${strength}`;
            strengthIndicator.className = 'password-strength';
            
            switch(strength) {
                case 'weak':
                    strengthIndicator.style.color = '#dc3545';
                    break;
                case 'medium':
                    strengthIndicator.style.color = '#ffc107';
                    break;
                case 'strong':
                    strengthIndicator.style.color = '#28a745';
                    break;
            }
        });
    }
});


// Add this to your student-dashboard.html and admin-dashboard.html files
function initDashboard() {
    const userData = JSON.parse(localStorage.getItem('ggu_user') || sessionStorage.getItem('ggu_user') || 'null');
    
    if (!userData || !userData.loggedIn) {
        // Redirect to login if not authenticated
        window.location.href = '/login.html';
        return;
    }
    
    // Update welcome message if element exists
    const welcomeElement = document.getElementById('welcomeName') || 
                          document.getElementById('studentName') || 
                          document.getElementById('adminName');
    if (welcomeElement) {
        welcomeElement.textContent = userData.name;
    }
    
    // Update role if element exists
    const roleElement = document.getElementById('userRole');
    if (roleElement) {
        roleElement.textContent = userData.role;
    }
}

// Call this function in your dashboard files
// document.addEventListener('DOMContentLoaded', initDashboard);