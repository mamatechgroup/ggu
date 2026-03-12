// Dashboard Functionality for GGU Website

// ========== Sample Data (replaces import from './data-samples.js') ==========
const SAMPLE_STATS = {
    totalStudents: '1,250',
    totalFaculty: '120',
    totalStaff: '100',
    totalCourses: '45',
    activeUsers: '850',
    pendingRequests: '12'
};

const SAMPLE_ACTIVITIES = [
    { user: 'John Doe', action: 'submitted assignment', time: '5 min ago' },
    { user: 'Jane Smith', action: 'registered for courses', time: '15 min ago' },
    { user: 'Dr. Wilson', action: 'uploaded grades', time: '1 hour ago' },
    { user: 'Admin', action: 'updated system settings', time: '2 hours ago' }
];

const SAMPLE_NOTIFICATIONS = [
    { id: 1, title: 'New Message', message: 'You have a new message from advisor', type: 'info' },
    { id: 2, title: 'Payment Due', message: 'Tuition payment deadline approaching', type: 'warning' }
];

const STUDENT_DASHBOARD_DATA = {
    gpa: '3.8',
    totalCredits: '48',
    courses: [
        { code: 'CSC301', name: 'Database Systems', credits: 3, grade: 'A' },
        { code: 'ITC302', name: 'Network Security', credits: 3, grade: 'B+' }
    ],
    upcomingAssignments: [
        { course: 'CSC301', assignment: 'Project Proposal', dueDate: '2025-04-15' },
        { course: 'ITC302', assignment: 'Lab Report', dueDate: '2025-04-20' }
    ]
};

const ADMIN_DASHBOARD_DATA = {
    totalUsers: '1,520',
    activeSessions: '245',
    systemStatus: 'Operational',
    recentLogs: [
        { time: '10:30 AM', user: 'admin', action: 'User created', details: 'New faculty account' },
        { time: '9:15 AM', user: 'system', action: 'Backup completed', details: 'Daily backup successful' }
    ]
};

const ENROLLMENT_DATA = {
    labels: ['Engineering', 'Business', 'Arts', 'Science'],
    datasets: [{
        data: [450, 380, 220, 500],
        backgroundColor: ['#1E3A8A', '#228B22', '#DC2626', '#7C3AED']
    }]
};

const PERFORMANCE_DATA = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [{
        label: 'Average Grade',
        data: [85, 87, 86, 89, 88, 90],
        borderColor: '#1E3A8A',
        backgroundColor: 'rgba(30, 58, 138, 0.1)',
        fill: true
    }]
};

// ========== DashboardSystem Class (unchanged) ==========
class DashboardSystem {
    constructor() {
        this.currentUser = null;
        this.initialize();
    }

    initialize() {
        this.loadCurrentUser();
        if (!this.currentUser) {
            window.location.href = 'login.html';
            return;
        }
        
        this.setupEventListeners();
        this.loadDashboardData();
        this.updateDashboardUI();
        this.setupSearch();
        this.setupExport();
    }

    loadCurrentUser() {
        try {
            const user = localStorage.getItem('ggu_current_user') || 
                         sessionStorage.getItem('ggu_current_user');
            this.currentUser = user ? JSON.parse(user) : null;
        } catch (error) {
            console.error('Error loading user data:', error);
            this.currentUser = null;
        }
    }

    setupEventListeners() {
        this.setupSidebarToggle();
        this.setupLogoutButton();
        this.setupFormSubmissions();
        this.setupModalControls();
    }

    setupSidebarToggle() {
        const sidebarToggle = document.getElementById('sidebarToggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                document.querySelector('.dashboard-sidebar').classList.toggle('active');
            });
        }
    }

    setupFormSubmissions() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        });
    }

    setupModalControls() {
        const modalTriggers = document.querySelectorAll('[data-modal]');
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => this.openModal(e));
        });

        const closeModalBtns = document.querySelectorAll('.close-modal, .modal-overlay');
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });
    }

    updateDashboardUI() {
        this.updateUserInfo();
        this.setActiveSidebarItem();
        this.loadRoleSpecificContent();
    }

    updateUserInfo() {
        if (!this.currentUser) return;

        const userNameElements = document.querySelectorAll('.user-name, .user-fullname');
        userNameElements.forEach(element => {
            if (element.classList.contains('user-fullname')) {
                element.textContent = this.currentUser.name;
            } else {
                element.textContent = this.currentUser.name.split(' ')[0];
            }
        });

        const userRoleElements = document.querySelectorAll('.user-role');
        userRoleElements.forEach(element => {
            element.textContent = this.formatRole(this.currentUser.role);
        });

        this.updateUserAvatar();
    }

    formatRole(role) {
        return role.charAt(0).toUpperCase() + role.slice(1);
    }

    updateUserAvatar() {
        const userAvatar = document.querySelector('.user-avatar');
        if (userAvatar && this.currentUser?.name) {
            const initials = this.currentUser.name
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase();
            userAvatar.textContent = initials;
        }
    }

    setActiveSidebarItem() {
        const currentPage = window.location.pathname.split('/').pop();
        const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
        sidebarLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref === currentPage) {
                link.classList.add('active');
            }
        });
    }

    loadRoleSpecificContent() {
        if (!this.currentUser) return;

        switch(this.currentUser.role) {
            case 'student':
                this.loadStudentDashboard();
                break;
            case 'admin':
                this.loadAdminDashboard();
                break;
            default:
                console.warn('Unknown role:', this.currentUser.role);
        }
    }

    loadDashboardData() {
        this.loadStatistics();
        this.loadRecentActivity();
        this.loadNotifications();
    }

    loadStatistics() {
        const stats = SAMPLE_STATS;
        
        document.querySelectorAll('.card-stat').forEach(card => {
            const statType = card.dataset.stat;
            if (stats[statType]) {
                card.textContent = stats[statType];
            }
        });
    }

    loadRecentActivity() {
        const activities = SAMPLE_ACTIVITIES;
        const activityList = document.getElementById('activityList');
        
        if (!activityList) return;

        activityList.innerHTML = '';
        activities.forEach(activity => {
            const li = document.createElement('li');
            li.className = 'activity-item';
            li.innerHTML = `
                <div class="activity-content">
                    <strong>${activity.user}</strong> ${activity.action}
                </div>
                <div class="activity-time">${activity.time}</div>
            `;
            activityList.appendChild(li);
        });
    }

    loadNotifications() {
        const notifications = SAMPLE_NOTIFICATIONS;
        const notificationList = document.getElementById('notificationList');
        
        if (!notificationList) return;

        notificationList.innerHTML = '';
        notifications.forEach(notification => {
            const li = document.createElement('li');
            li.className = `notification-item notification-${notification.type}`;
            li.innerHTML = `
                <div class="notification-title">${notification.title}</div>
                <div class="notification-message">${notification.message}</div>
                <button class="btn btn-sm btn-outline-secondary mark-read" data-id="${notification.id}">
                    Mark as read
                </button>
            `;
            notificationList.appendChild(li);
        });

        this.setupNotificationListeners();
    }

    setupNotificationListeners() {
        document.querySelectorAll('.mark-read').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.notification-item').remove();
            });
        });
    }

    loadStudentDashboard() {
        const studentData = STUDENT_DASHBOARD_DATA;
        this.updateStudentInfo();
        this.loadCoursesTable(studentData.courses);
        this.loadStudentMetrics(studentData);
        this.loadUpcomingAssignments(studentData.upcomingAssignments);
    }

    updateStudentInfo() {
        const studentInfo = document.getElementById('studentInfo');
        if (!studentInfo || !this.currentUser) return;

        const infoFields = [
            { label: 'Student ID:', value: this.currentUser.studentId || 'N/A' },
            { label: 'College:', value: this.currentUser.college || 'Not assigned' },
            { label: 'Department:', value: this.currentUser.department || 'Not assigned' },
            { label: 'Year:', value: this.currentUser.year || '1' }
        ];

        studentInfo.innerHTML = infoFields.map(field => `
            <div class="info-row">
                <span class="info-label">${field.label}</span>
                <span class="info-value">${field.value}</span>
            </div>
        `).join('');
    }

    loadCoursesTable(courses) {
        const coursesTable = document.getElementById('coursesTable');
        if (!coursesTable) return;

        const tbody = coursesTable.querySelector('tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        courses.forEach(course => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${course.code}</td>
                <td>${course.name}</td>
                <td>${course.credits}</td>
                <td><span class="grade-badge">${course.grade}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary view-syllabus" data-course="${course.code}">
                        Syllabus
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    loadStudentMetrics(data) {
        const gpaElement = document.getElementById('currentGPA');
        const creditsElement = document.getElementById('totalCredits');
        
        if (gpaElement) gpaElement.textContent = data.gpa;
        if (creditsElement) creditsElement.textContent = data.totalCredits;
    }

    loadUpcomingAssignments(assignments) {
        const assignmentsList = document.getElementById('upcomingAssignments');
        if (!assignmentsList) return;

        assignmentsList.innerHTML = '';
        assignments.forEach(assignment => {
            const li = document.createElement('li');
            li.className = 'assignment-item';
            li.innerHTML = `
                <div class="assignment-course">${assignment.course}</div>
                <div class="assignment-name">${assignment.assignment}</div>
                <div class="assignment-due">Due: ${new Date(assignment.dueDate).toLocaleDateString()}</div>
            `;
            assignmentsList.appendChild(li);
        });
    }

    loadAdminDashboard() {
        const adminData = ADMIN_DASHBOARD_DATA;
        this.updateAdminStats(adminData);
        this.loadRecentLogs(adminData.recentLogs);
        this.initCharts();
    }

    updateAdminStats(data) {
        const totalUsersEl = document.querySelector('[data-stat="totalUsers"]');
        if (totalUsersEl) totalUsersEl.textContent = data.totalUsers;

        const activeSessionsEl = document.querySelector('[data-stat="activeSessions"]');
        if (activeSessionsEl) activeSessionsEl.textContent = data.activeSessions;
        
        const systemStatus = document.getElementById('systemStatus');
        if (systemStatus) {
            systemStatus.textContent = data.systemStatus;
            systemStatus.className = `status-badge ${data.systemStatus === 'Operational' ? 'status-active' : 'status-inactive'}`;
        }
    }

    loadRecentLogs(logs) {
        const logsTable = document.getElementById('logsTable');
        if (!logsTable) return;

        const tbody = logsTable.querySelector('tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        logs.forEach(log => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${log.time}</td>
                <td>${log.user}</td>
                <td>${log.action}</td>
                <td>${log.details}</td>
            `;
            tbody.appendChild(row);
        });
    }

    initCharts() {
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js not loaded, skipping chart initialization');
            return;
        }

        this.createEnrollmentChart();
        this.createPerformanceChart();
    }

    createEnrollmentChart() {
        const enrollmentChart = document.getElementById('enrollmentChart');
        if (!enrollmentChart) return;

        new Chart(enrollmentChart.getContext('2d'), {
            type: 'doughnut',
            data: ENROLLMENT_DATA,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    createPerformanceChart() {
        const performanceChart = document.getElementById('performanceChart');
        if (!performanceChart) return;

        new Chart(performanceChart.getContext('2d'), {
            type: 'line',
            data: PERFORMANCE_DATA,
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    handleFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        
        if (!submitBtn) return;

        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;

        setTimeout(() => {
            alert('Form submitted successfully!');
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;

            const modal = form.closest('.modal');
            if (modal) {
                this.closeModal();
            }
        }, 1500);
    }

    openModal(e) {
        e.preventDefault();
        const modalId = e.target.dataset.modal;
        const modal = document.getElementById(modalId);

        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
    }

    setupSearch() {
        const searchInput = document.getElementById('dashboardSearch');
        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            this.performSearch(searchTerm);
        });
    }

    performSearch(searchTerm) {
        document.querySelectorAll('tbody tr').forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });

        document.querySelectorAll('.dashboard-card').forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    }

    setupExport() {
        const exportBtns = document.querySelectorAll('.export-btn');
        exportBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const dataType = e.target.dataset.export;
                this.exportData(dataType);
            });
        });
    }

    exportData(dataType) {
        alert(`Exporting ${dataType} data...\n\nThis would download a CSV/PDF file in a real implementation.`);
    }
}

// ========== Utility Functions (unchanged) ==========
class DashboardUtils {
    static setupSidebarDropdowns() {
        const dropdownItems = document.querySelectorAll('.sidebar-menu .dropdown > a');
        
        dropdownItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const parent = this.parentElement;
                const wasActive = parent.classList.contains('active');
                
                document.querySelectorAll('.sidebar-menu .dropdown.active').forEach(dropdown => {
                    if (dropdown !== parent) {
                        dropdown.classList.remove('active');
                    }
                });
                
                parent.classList.toggle('active', !wasActive);
            });
        });

        document.querySelectorAll('.submenu a').forEach(subItem => {
            subItem.addEventListener('click', function(e) {
                document.querySelectorAll('.submenu a').forEach(item => {
                    item.classList.remove('active');
                });
                this.classList.add('active');
            });
        });

        document.addEventListener('click', function(e) {
            if (!e.target.closest('.sidebar-menu .dropdown')) {
                document.querySelectorAll('.sidebar-menu .dropdown.active').forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        });
    }

    static loadUserData() {
        try {
            const currentUser = JSON.parse(localStorage.getItem('ggu_current_user') || sessionStorage.getItem('ggu_current_user'));
            if (!currentUser) return null;

            const userNameElements = document.querySelectorAll('.user-name, .user-fullname');
            userNameElements.forEach(element => {
                if (element.classList.contains('user-fullname')) {
                    element.textContent = currentUser.name;
                } else {
                    element.textContent = currentUser.name.split(' ')[0];
                }
            });

            const studentIdDisplay = document.getElementById('studentIdDisplay');
            if (studentIdDisplay && currentUser.studentId) {
                studentIdDisplay.textContent = currentUser.studentId;
            }

            const userAvatar = document.querySelector('.user-avatar');
            if (userAvatar && currentUser.name) {
                const initials = currentUser.name
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase();
                userAvatar.textContent = initials;
            }

            return currentUser;
        } catch (error) {
            console.error('Error loading user data:', error);
            return null;
        }
    }
}

// ========== Page-Specific Modules (unchanged) ==========
class SettingsPage {
    static setup() {
        const currentUser = DashboardUtils.loadUserData();
        if (!currentUser) return;

        const twoFactorToggle = document.getElementById('twoFactorToggle');
        const twoFactorSetup = document.getElementById('twoFactorSetup');
        
        if (twoFactorToggle && twoFactorSetup) {
            twoFactorToggle.addEventListener('change', function() {
                twoFactorSetup.classList.toggle('d-none', !this.checked);
            });
        }

        this.setupForms();
        this.setupDeviceManagement();
        this.setupDataManagement();
    }

    static setupForms() {
        const accountForm = document.getElementById('accountForm');
        const passwordForm = document.getElementById('passwordForm');

        if (accountForm) {
            accountForm.addEventListener('submit', function(e) {
                e.preventDefault();
                alert('Account information updated successfully!');
            });
        }

        if (passwordForm) {
            passwordForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const currentPass = this.querySelector('input[type="password"]').value;
                const newPass = this.querySelectorAll('input[type="password"]')[1].value;
                const confirmPass = this.querySelectorAll('input[type="password"]')[2].value;

                if (!currentPass) {
                    alert('Please enter your current password.');
                    return;
                }

                if (newPass.length < 8) {
                    alert('New password must be at least 8 characters long.');
                    return;
                }

                if (newPass !== confirmPass) {
                    alert('New passwords do not match.');
                    return;
                }

                alert('Password updated successfully!');
            });
        }
    }

    static setupDeviceManagement() {
        const deviceLogoutButtons = document.querySelectorAll('.device-item .btn-outline-danger');
        deviceLogoutButtons.forEach(button => {
            button.addEventListener('click', function() {
                const deviceName = this.closest('.device-item').querySelector('h6').textContent;
                if (confirm(`Are you sure you want to log out from ${deviceName}?`)) {
                    this.closest('.device-item').remove();
                    alert(`Logged out from ${deviceName}`);
                }
            });
        });

        const logoutAllBtn = document.querySelector('.btn-outline-danger.w-100');
        if (logoutAllBtn) {
            logoutAllBtn.addEventListener('click', function() {
                if (confirm('Are you sure you want to log out from all devices? You will need to log in again on this device.')) {
                    const devicesList = document.querySelector('.devices-list');
                    devicesList.innerHTML = '<p class="text-center text-muted">No devices connected</p>';
                    alert('Logged out from all devices.');
                }
            });
        }
    }

    static setupDataManagement() {
        const exportButtons = document.querySelectorAll('.export-options .btn');
        exportButtons.forEach(button => {
            button.addEventListener('click', function() {
                const format = this.textContent.replace('Export as ', '');
                alert(`Exporting data as ${format}... This may take a moment.`);
            });
        });

        const clearActivityBtn = document.querySelector('.btn-outline-warning');
        const deleteDataBtn = document.querySelector('.btn-outline-danger');

        if (clearActivityBtn) {
            clearActivityBtn.addEventListener('click', function() {
                if (confirm('Clear all recent activity? This action cannot be undone.')) {
                    alert('Recent activity cleared.');
                }
            });
        }

        if (deleteDataBtn) {
            deleteDataBtn.addEventListener('click', function() {
                if (confirm('Request deletion of all your data? This will initiate a 30-day process and may limit your access to services.')) {
                    alert('Data deletion request submitted. You will receive confirmation via email.');
                }
            });
        }

        const deactivateBtn = document.querySelector('.btn-outline-danger.mb-2');
        if (deactivateBtn) {
            deactivateBtn.addEventListener('click', function() {
                if (confirm('Are you sure you want to deactivate your account? You can reactivate it within 30 days.')) {
                    alert('Account deactivation requested. Please check your email for confirmation.');
                }
            });
        }
    }
}

class SchedulePage {
    static setup() {
        const currentUser = DashboardUtils.loadUserData();
        if (!currentUser) return;

        this.setupViewSwitcher();
        this.setupWeekNavigation();
    }

    static setupViewSwitcher() {
        const weeklyViewBtn = document.getElementById('weeklyView');
        const dailyViewBtn = document.getElementById('dailyView');
        const listViewBtn = document.getElementById('listView');
        
        const weeklySchedule = document.getElementById('weeklySchedule');
        const dailySchedule = document.getElementById('dailySchedule');
        const listSchedule = document.getElementById('listSchedule');

        const viewButtons = [weeklyViewBtn, dailyViewBtn, listViewBtn];
        const viewPanels = [weeklySchedule, dailySchedule, listSchedule];

        viewButtons.forEach((button, index) => {
            if (button) {
                button.addEventListener('click', () => {
                    viewButtons.forEach(btn => btn?.classList.remove('active'));
                    viewPanels.forEach(panel => panel?.classList.add('d-none'));
                    
                    button.classList.add('active');
                    if (viewPanels[index]) {
                        viewPanels[index].classList.remove('d-none');
                    }
                });
            }
        });
    }

    static setupWeekNavigation() {
        const prevWeekBtn = document.getElementById('prevWeek');
        const nextWeekBtn = document.getElementById('nextWeek');
        const currentWeekSpan = document.getElementById('currentWeek');

        if (!prevWeekBtn || !nextWeekBtn || !currentWeekSpan) return;

        let currentWeek = new Date();

        prevWeekBtn.addEventListener('click', () => {
            currentWeek.setDate(currentWeek.getDate() - 7);
            this.updateWeekDisplay(currentWeekSpan, currentWeek);
        });

        nextWeekBtn.addEventListener('click', () => {
            currentWeek.setDate(currentWeek.getDate() + 7);
            this.updateWeekDisplay(currentWeekSpan, currentWeek);
        });

        this.updateWeekDisplay(currentWeekSpan, currentWeek);
    }

    static updateWeekDisplay(element, date) {
        const startOfWeek = new Date(date);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        element.textContent = `Week of ${startOfWeek.toLocaleDateString('en-US', options)}`;
    }
}

class RegistrationPage {
    static setup() {
        const currentUser = DashboardUtils.loadUserData();
        if (!currentUser) return;

        this.plannedCourses = [];
        this.coursePrices = {
            'CSC302': 450,
            'ITC303': 450,
            'MAT301': 600,
            'ENG301': 450
        };

        this.initializePlan();
        this.setupEventListeners();
    }

    static initializePlan() {
        this.updatePlanDisplay();
    }

    static setupEventListeners() {
        const addToPlanButtons = document.querySelectorAll('.add-to-plan');
        addToPlanButtons.forEach(button => {
            button.addEventListener('click', () => {
                const courseCode = button.getAttribute('data-course');
                this.addCourseToPlan(courseCode);
            });
        });

        const clearPlanBtn = document.getElementById('clearPlan');
        const savePlanBtn = document.getElementById('savePlan');
        const registerAllBtn = document.getElementById('registerAll');
        const submitRegistrationBtn = document.getElementById('submitRegistration');

        if (clearPlanBtn) clearPlanBtn.addEventListener('click', () => this.clearPlan());
        if (savePlanBtn) savePlanBtn.addEventListener('click', () => this.savePlan());
        if (registerAllBtn) registerAllBtn.addEventListener('click', () => this.registerAll());
        if (submitRegistrationBtn) submitRegistrationBtn.addEventListener('click', () => this.submitRegistration());
    }

    static addCourseToPlan(courseCode) {
        if (!this.plannedCourses.includes(courseCode)) {
            this.plannedCourses.push(courseCode);
            this.updatePlanDisplay();
        }
    }

    static updatePlanDisplay() {
        const plannedCoursesList = document.getElementById('plannedCoursesList');
        const totalCreditsSpan = document.getElementById('totalCredits');
        const coursesPlannedSpan = document.getElementById('coursesPlanned');
        const estimatedCostSpan = document.getElementById('estimatedCost');
        const registerAllBtn = document.getElementById('registerAll');

        if (!plannedCoursesList) return;

        if (this.plannedCourses.length === 0) {
            plannedCoursesList.innerHTML = '<p class="text-muted text-center">No courses planned yet</p>';
            if (totalCreditsSpan) totalCreditsSpan.textContent = '0';
            if (coursesPlannedSpan) coursesPlannedSpan.textContent = '0';
            if (estimatedCostSpan) estimatedCostSpan.textContent = '0.00';
            if (registerAllBtn) registerAllBtn.disabled = true;
            return;
        }

        plannedCoursesList.innerHTML = '';
        let totalCredits = 0;
        let totalCost = 0;

        this.plannedCourses.forEach(course => {
            const courseItem = document.createElement('div');
            courseItem.className = 'planned-course-item';
            courseItem.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <span><strong>${course}</strong></span>
                    <button class="btn btn-sm btn-outline-danger remove-course" data-course="${course}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            plannedCoursesList.appendChild(courseItem);

            totalCredits += (course === 'MAT301') ? 4 : 3;
            totalCost += this.coursePrices[course] || 0;
        });

        if (totalCreditsSpan) totalCreditsSpan.textContent = totalCredits;
        if (coursesPlannedSpan) coursesPlannedSpan.textContent = this.plannedCourses.length;
        if (estimatedCostSpan) estimatedCostSpan.textContent = totalCost.toFixed(2);
        if (registerAllBtn) registerAllBtn.disabled = false;

        this.setupRemoveCourseListeners();
    }

    static setupRemoveCourseListeners() {
        const removeButtons = document.querySelectorAll('.remove-course');
        removeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const courseToRemove = button.getAttribute('data-course');
                const index = this.plannedCourses.indexOf(courseToRemove);
                if (index > -1) {
                    this.plannedCourses.splice(index, 1);
                    this.updatePlanDisplay();
                }
            });
        });
    }

    static clearPlan() {
        this.plannedCourses = [];
        this.updatePlanDisplay();
    }

    static savePlan() {
        if (this.plannedCourses.length > 0) {
            alert('Course plan saved successfully!');
        } else {
            alert('Please add courses to your plan first.');
        }
    }

    static registerAll() {
        if (this.plannedCourses.length === 0) return;

        const registerTab = document.getElementById('register-tab');
        const registerPane = document.getElementById('register');

        if (registerTab && registerPane) {
            document.querySelectorAll('.nav-link').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('show', 'active'));
            
            registerTab.classList.add('active');
            registerPane.classList.add('show', 'active');

            this.plannedCourses.forEach(course => {
                const checkbox = document.querySelector(`input[value="${course}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
        }
    }

    static submitRegistration() {
        const selectedCourses = [];
        document.querySelectorAll('.course-selection input:checked').forEach(checkbox => {
            selectedCourses.push(checkbox.value);
        });

        if (selectedCourses.length > 0) {
            alert('Registration submitted for approval! Your advisor will review your course selection.');
        } else {
            alert('Please select at least one course to register.');
        }
    }
}

class ProfilePage {
    static setup() {
        const currentUser = DashboardUtils.loadUserData();
        if (!currentUser) return;

        this.setupEditButtons();
        this.setupPhotoChange();
        this.setupFormSubmissions();
    }

    static setupEditButtons() {
        const editButtons = [
            { btnId: 'editPersonalBtn', viewId: 'personalInfoView', formId: 'personalInfoForm', cancelId: 'cancelPersonalEdit' },
            { btnId: 'editContactBtn', viewId: 'contactInfoView', formId: 'contactInfoForm', cancelId: 'cancelContactEdit' },
            { btnId: 'editEmergencyBtn', viewId: 'emergencyInfoView', formId: 'emergencyInfoForm', cancelId: 'cancelEmergencyEdit' }
        ];

        editButtons.forEach(({ btnId, viewId, formId, cancelId }) => {
            const editBtn = document.getElementById(btnId);
            const cancelBtn = document.getElementById(cancelId);
            const view = document.getElementById(viewId);
            const form = document.getElementById(formId);

            if (editBtn && view && form) {
                editBtn.addEventListener('click', () => {
                    view.classList.add('d-none');
                    form.classList.remove('d-none');
                });
            }

            if (cancelBtn && view && form) {
                cancelBtn.addEventListener('click', () => {
                    view.classList.remove('d-none');
                    form.classList.add('d-none');
                });
            }
        });
    }

    static setupPhotoChange() {
        const changePhotoBtn = document.getElementById('changePhotoBtn');
        const profilePhotoInput = document.getElementById('profilePhotoInput');

        if (changePhotoBtn && profilePhotoInput) {
            changePhotoBtn.addEventListener('click', () => {
                profilePhotoInput.click();
            });

            profilePhotoInput.addEventListener('change', (e) => {
                if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];

                    if (file.size > 2 * 1024 * 1024) {
                        alert('File size must be less than 2MB');
                        return;
                    }

                    if (!file.type.match('image.*')) {
                        alert('Please select an image file');
                        return;
                    }

                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const profilePhoto = document.querySelector('.profile-photo img');
                        if (profilePhoto) {
                            profilePhoto.src = e.target.result;
                        }
                    };
                    reader.readAsDataURL(file);

                    alert('Profile photo updated!');
                }
            });
        }
    }

    static setupFormSubmissions() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                alert('Profile updated successfully!');
            });
        });
    }
}

class MessagesPage {
    static setup() {
        const currentUser = DashboardUtils.loadUserData();
        if (!currentUser) return;

        this.setupComposeModal();
        this.setupFolderNavigation();
        this.setupMessageInteractions();
        this.setupMessageList();
        this.setupContacts();
    }

    static setupComposeModal() {
        const composeBtn = document.getElementById('composeBtn');
        const composeModal = document.getElementById('composeModal');
        
        if (composeBtn && composeModal) {
            const modal = new bootstrap.Modal(composeModal);
            composeBtn.addEventListener('click', () => modal.show());

            const sendMessageBtn = composeModal.querySelector('.btn-primary');
            if (sendMessageBtn) {
                sendMessageBtn.addEventListener('click', () => {
                    const toInput = composeModal.querySelector('input[type="text"]');
                    const subjectInput = composeModal.querySelector('input[type="text"]:nth-child(3)');
                    
                    if (toInput?.value && subjectInput?.value) {
                        alert('Message sent successfully!');
                        modal.hide();
                    } else {
                        alert('Please fill in recipient and subject fields.');
                    }
                });
            }
        }
    }

    static setupFolderNavigation() {
        const folderItems = document.querySelectorAll('.folder-item');
        const tableHeader = document.querySelector('.table-header h3');

        folderItems.forEach(item => {
            item.addEventListener('click', function() {
                folderItems.forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                
                if (tableHeader) {
                    const folderName = this.querySelector('span').textContent;
                    tableHeader.textContent = folderName;
                }
            });
        });
    }

    static setupMessageInteractions() {
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', function() {
                const icon = this.querySelector('i');
                icon?.classList.add('fa-spin');
                setTimeout(() => {
                    icon?.classList.remove('fa-spin');
                    alert('Messages refreshed!');
                }, 1000);
            });
        }

        const newFolderBtn = document.getElementById('newFolderBtn');
        if (newFolderBtn) {
            newFolderBtn.addEventListener('click', () => {
                const folderName = prompt('Enter new folder name:');
                if (folderName) {
                    this.createNewFolder(folderName);
                }
            });
        }
    }

    static createNewFolder(folderName) {
        const foldersList = document.querySelector('.folders-list');
        if (!foldersList) return;

        const newFolder = document.createElement('div');
        newFolder.className = 'folder-item';
        newFolder.innerHTML = `
            <i class="fas fa-folder"></i>
            <span>${folderName}</span>
            <span class="badge bg-secondary">0</span>
        `;
        foldersList.appendChild(newFolder);

        newFolder.addEventListener('click', function() {
            document.querySelectorAll('.folder-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            const tableHeader = document.querySelector('.table-header h3');
            if (tableHeader) {
                tableHeader.textContent = folderName;
            }
        });
    }

    static setupMessageList() {
        const messageItems = document.querySelectorAll('.message-item');
        const messageModal = document.getElementById('messageModal');
        
        if (messageItems.length > 0 && messageModal) {
            const modal = new bootstrap.Modal(messageModal);
            
            messageItems.forEach(item => {
                item.addEventListener('click', function(e) {
                    if (!e.target.closest('.message-check') && !e.target.closest('.message-star')) {
                        this.classList.remove('unread');
                        modal.show();
                    }
                });
            });
        }

        this.setupStarToggle();
    }

    static setupStarToggle() {
        const stars = document.querySelectorAll('.message-star i');
        stars.forEach(star => {
            star.addEventListener('click', function(e) {
                e.stopPropagation();
                if (this.classList.contains('far')) {
                    this.classList.remove('far');
                    this.classList.add('fas', 'text-warning');
                } else {
                    this.classList.remove('fas', 'text-warning');
                    this.classList.add('far');
                }
            });
        });
    }

    static setupContacts() {
        const contactButtons = document.querySelectorAll('.contact-item .btn');
        contactButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const contactName = this.closest('.contact-item').querySelector('h6').textContent;
                const composeModal = document.getElementById('composeModal');
                
                if (composeModal) {
                    const modal = new bootstrap.Modal(composeModal);
                    modal.show();
                    
                    setTimeout(() => {
                        const toInput = composeModal.querySelector('input[type="text"]');
                        if (toInput) {
                            toInput.value = contactName;
                            toInput.focus();
                        }
                    }, 500);
                }
            });
        });
    }
}

class FinancePage {
    static setup() {
        const currentUser = DashboardUtils.loadUserData();
        if (!currentUser) return;

        this.setupPaymentMethods();
        this.setupPaymentAmount();
        this.setupPaymentButton();
    }

    static setupPaymentMethods() {
        const creditCardRadio = document.getElementById('creditCard');
        const bankTransferRadio = document.getElementById('bankTransfer');
        const mobileMoneyRadio = document.getElementById('mobileMoney');
        
        const creditCardForm = document.getElementById('creditCardForm');
        const bankTransferForm = document.getElementById('bankTransferForm');
        const mobileMoneyForm = document.getElementById('mobileMoneyForm');

        const paymentMethods = [
            { radio: creditCardRadio, form: creditCardForm },
            { radio: bankTransferRadio, form: bankTransferForm },
            { radio: mobileMoneyRadio, form: mobileMoneyForm }
        ];

        paymentMethods.forEach(({ radio, form }) => {
            if (radio && form) {
                radio.addEventListener('change', () => {
                    paymentMethods.forEach(({ form: otherForm }) => {
                        otherForm?.classList.add('d-none');
                    });
                    form.classList.remove('d-none');
                });
            }
        });
    }

    static setupPaymentAmount() {
        const fullAmountRadio = document.getElementById('fullAmount');
        const partialAmountRadio = document.getElementById('partialAmount');
        const amountInput = document.querySelector('input[type="number"]');

        if (fullAmountRadio && amountInput) {
            fullAmountRadio.addEventListener('change', () => {
                amountInput.value = '1675.00';
                amountInput.disabled = true;
            });
        }

        if (partialAmountRadio && amountInput) {
            partialAmountRadio.addEventListener('change', () => {
                amountInput.value = '';
                amountInput.disabled = false;
                amountInput.focus();
            });
        }

        if (amountInput) {
            amountInput.disabled = true;
        }
    }

    static setupPaymentButton() {
        const processPaymentBtn = document.querySelector('.btn-primary.btn-lg');
        const amountInput = document.querySelector('input[type="number"]');

        if (processPaymentBtn && amountInput) {
            processPaymentBtn.addEventListener('click', () => {
                const amount = parseFloat(amountInput.value);
                if (amount && amount > 0) {
                    alert(`Payment of $${amount.toFixed(2)} processed successfully!`);
                } else {
                    alert('Please enter a valid payment amount.');
                }
            });
        }
    }
}

class GradesPage {
    static setup() {
        const currentUser = DashboardUtils.loadUserData();
        if (!currentUser) return;

        this.setupProgressCircles();
    }

    static setupProgressCircles() {
        const circles = document.querySelectorAll('.progress-circle');
        circles.forEach(circle => {
            const progress = circle.getAttribute('data-progress');
            circle.style.setProperty('--progress', progress + '%');
        });
    }
}

class AdminPages {
    static setup() {
        const currentUser = DashboardUtils.loadUserData();
        if (!currentUser) return;

        this.setupGradeApproval();
        this.setupTableCheckboxes();
        this.setupForms();
    }

    static setupGradeApproval() {
        document.querySelectorAll('.btn-outline-success, .btn-outline-danger').forEach(btn => {
            btn.addEventListener('click', function() {
                const action = this.querySelector('i').classList.contains('fa-check') ? 'approved' : 'rejected';
                const course = this.closest('tr').querySelector('strong')?.textContent || 'unknown course';
                alert(`Grade change request ${action} for ${course}`);
            });
        });
    }

    static setupTableCheckboxes() {
        const checkAll = document.querySelector('#studentsTable thead input[type="checkbox"]');
        const checkboxes = document.querySelectorAll('#studentsTable tbody input[type="checkbox"]');
        
        if (checkAll) {
            checkAll.addEventListener('change', function() {
                checkboxes.forEach(checkbox => {
                    checkbox.checked = this.checked;
                });
            });
        }
    }

    static setupForms() {
        const forms = [
            'addContentForm',
            'addCourseForm',
            'newTicketForm'
        ];

        forms.forEach(formId => {
            const form = document.getElementById(formId);
            if (form) {
                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    alert(`${formId.replace('add', '').replace('Form', '').replace('new', 'New ')} saved successfully!`);
                    this.reset();
                });
            }
        });
    }
}

class AdminDashboard {
    static setup() {
        const currentUser = DashboardUtils.loadUserData();
        if (!currentUser) return;

        if (currentUser.role === 'admin') {
            this.initCharts();
            this.loadRecentLogs();
            this.loadNotifications();
            this.setupAdminActions();
        }
    }

    static initCharts() {
        if (typeof Chart === 'undefined') return;

        this.createActivityChart();
        this.createDistributionChart();
    }

    static createActivityChart() {
        const activityCtx = document.getElementById('activityChart');
        if (!activityCtx) return;

        new Chart(activityCtx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
                datasets: [{
                    label: 'Logins',
                    data: [120, 190, 150, 250, 220, 300, 280],
                    borderColor: '#1E3A8A',
                    backgroundColor: 'rgba(30, 58, 138, 0.1)',
                    fill: true
                }, {
                    label: 'Active Sessions',
                    data: [35, 45, 40, 55, 50, 60, 45],
                    borderColor: '#228B22',
                    backgroundColor: 'rgba(34, 139, 34, 0.1)',
                    fill: true
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    static createDistributionChart() {
        const distributionCtx = document.getElementById('userDistributionChart');
        if (!distributionCtx) return;

        new Chart(distributionCtx.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Students', 'Faculty', 'Staff', 'Admins'],
                datasets: [{
                    data: [1250, 120, 100, 30],
                    backgroundColor: [
                        '#1E3A8A',
                        '#228B22',
                        '#FF8C00',
                        '#6C757D'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    static loadRecentLogs() {
        const logs = [
            { time: '10:30 AM', user: 'admin', action: 'User created', details: 'New faculty account - Dr. James Wilson', ip: '192.168.1.100' },
            { time: '9:15 AM', user: 'system', action: 'Backup completed', details: 'Daily backup successful', ip: '127.0.0.1' },
            { time: '8:00 AM', user: 'admin', action: 'Course added', details: 'CSC301 - Database Systems', ip: '192.168.1.100' },
            { time: 'Yesterday 5:30 PM', user: 'faculty001', action: 'Grades uploaded', details: 'CSC101 Midterm grades', ip: '192.168.1.150' },
            { time: 'Yesterday 3:45 PM', user: 'student123', action: 'Course registration', details: 'Registered for 5 courses', ip: '192.168.1.200' }
        ];

        const logsTable = document.querySelector('#logsTable tbody');
        if (!logsTable) return;

        logsTable.innerHTML = '';
        logs.forEach(log => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${log.time}</td>
                <td>${log.user}</td>
                <td>${log.action}</td>
                <td>${log.details}</td>
                <td><code>${log.ip}</code></td>
            `;
            logsTable.appendChild(row);
        });
    }

    static loadNotifications() {
        const notifications = [
            { id: 1, title: 'System Update Available', message: 'New system update ready for installation', type: 'info' },
            { id: 2, title: 'Security Alert', message: 'Unusual login activity detected', type: 'warning' },
            { id: 3, title: 'Storage Warning', message: 'Database storage at 85% capacity', type: 'warning' },
            { id: 4, title: 'Backup Complete', message: 'Weekly backup completed successfully', type: 'info' }
        ];

        const notificationList = document.getElementById('notificationList');
        if (!notificationList) return;

        notificationList.innerHTML = '';
        notifications.forEach(notification => {
            const notificationItem = document.createElement('div');
            notificationItem.className = `notification-item notification-${notification.type}`;
            notificationItem.innerHTML = `
                <div class="notification-title">${notification.title}</div>
                <div class="notification-message">${notification.message}</div>
                <button class="btn btn-sm btn-outline-secondary mark-read" data-id="${notification.id}">
                    Mark as read
                </button>
            `;
            notificationList.appendChild(notificationItem);
        });

        document.querySelectorAll('.mark-read').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.notification-item').remove();
            });
        });
    }

    static setupAdminActions() {
        const adminActions = document.querySelectorAll('.admin-action');
        adminActions.forEach(action => {
            action.addEventListener('click', function() {
                const actionType = this.dataset.action;
                AdminDashboard.handleAdminAction(actionType);
            });
        });
    }

    static handleAdminAction(actionType) {
        const actions = {
            'addUser': 'Add User functionality would open here',
            'addCourse': 'Add Course functionality would open here',
            'backup': 'System backup initiated',
            'reports': 'Report generation started',
            'audit': 'System audit launched',
            'settings': 'System settings opened',
            'maintenance': 'Maintenance mode activated',
            'support': 'Support tickets view opened'
        };

        alert(`Admin Action: ${actions[actionType] || 'Action not defined'}`);
    }
}

// ========== Global Helper Functions (copied from main.js for completeness) ==========
function setupGlobalLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        const freshBtn = logoutBtn.cloneNode(true);
        logoutBtn.replaceWith(freshBtn);
        
        freshBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('ggu_current_user');
            sessionStorage.removeItem('ggu_current_user');
            window.location.replace('/login.html');
        });
    }
}

// ========== Main Initialization ==========
document.addEventListener('DOMContentLoaded', function() {
    // Setup global logout first (works on all pages)
    setupGlobalLogout();
    
    // Initialize common utilities
    DashboardUtils.setupSidebarDropdowns();
    
    // Load user data to show/hide appropriate header sections
    const currentUser = DashboardUtils.loadUserData();
    
    // Show/hide appropriate header sections based on login status
    const authButtons = document.querySelector('.auth-buttons');
    const userMenu = document.querySelector('.user-menu');
    
    if (currentUser) {
        if (authButtons) authButtons.style.display = 'none';
        if (userMenu) userMenu.style.display = 'flex';
    } else {
        if (authButtons) authButtons.style.display = 'flex';
        if (userMenu) userMenu.style.display = 'none';
    }
    
    // Initialize dashboard system for main dashboard pages
    if (document.querySelector('.dashboard-content')) {
        try {
            window.dashboardSystem = new DashboardSystem();
        } catch (error) {
            console.error('Failed to initialize dashboard system:', error);
        }
    }
    
    // Initialize page-specific modules based on current page
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'settings.html':
            SettingsPage.setup();
            break;
        case 'schedule.html':
            SchedulePage.setup();
            break;
        case 'registration.html':
            RegistrationPage.setup();
            break;
        case 'profile.html':
            ProfilePage.setup();
            break;
        case 'messages.html':
            MessagesPage.setup();
            break;
        case 'finance.html':
            FinancePage.setup();
            break;
        case 'grades.html':
            GradesPage.setup();
            break;
        case 'admin-grades.html':
        case 'admin-content.html':
        case 'admin-courses.html':
        case 'admin-students.html':
        case 'admin-support.html':
            AdminPages.setup();
            break;
        case 'admin-dashboard.html':
            AdminDashboard.setup();
            break;
        default:
            DashboardUtils.loadUserData();
    }
});