// Global variables
let currentUser = null;
let socket = null;
let currentSearch = '';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    
    // Debug: Check what sections are found
    const sections = document.querySelectorAll('.section');
    console.log('Found sections:', sections.length);
    sections.forEach(section => {
        console.log('Section found:', section.id, 'classList:', section.classList.toString());
    });
    
    setupEventListeners();
    checkAuthStatus();
    loadDashboardData();
    loadComics();
});

// Setup event listeners
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Navigation
    const navLinks = document.querySelectorAll('.nav-link');
    console.log('Found nav links:', navLinks.length);
    
    navLinks.forEach(link => {
        console.log('Setting up nav link:', link.textContent, 'href:', link.getAttribute('href'));
        link.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Nav link clicked:', this.textContent);
            const targetId = this.getAttribute('href').substring(1);
            console.log('Target section ID:', targetId);
            showSection(targetId);
            updateActiveNavLink(this);
        });
    });

    // Hero buttons
    const browseComicsBtn = document.querySelector('.hero-buttons .btn-primary');
    if (browseComicsBtn) {
        browseComicsBtn.addEventListener('click', function() {
            showSection('comics');
            updateActiveNavLink(document.querySelector('a[href="#comics"]'));
        });
    }

    const learnMoreBtn = document.querySelector('.hero-buttons .btn-outline');
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', function() {
            showSection('dashboard');
            updateActiveNavLink(document.querySelector('a[href="#dashboard"]'));
        });
    }

    // Premium banner button
    const upgradeBtn = document.querySelector('.premium-banner .btn-premium');
    if (upgradeBtn) {
        upgradeBtn.addEventListener('click', function() {
            // Redirect to your Telegram account for premium upgrade
            const telegramUrl = 'https://t.me/beast_is_kum';
            
            try {
                // Try to open in new tab
                const newWindow = window.open(telegramUrl, '_blank');
                
                if (newWindow) {
                    console.log('Premium banner clicked - redirecting to Telegram');
                    showNotification('Redirecting you to our Telegram for premium upgrade!', 'success');
                } else {
                    // Fallback: try to redirect in same window
                    console.log('Popup blocked, redirecting in same window');
                    window.location.href = telegramUrl;
                    showNotification('Redirecting you to our Telegram for premium upgrade!', 'success');
                }
            } catch (error) {
                console.error('Error opening Telegram link:', error);
                // Fallback: show the URL for manual copy
                alert(`Please copy and paste this link to contact us for premium upgrade:\n\n${telegramUrl}`);
                showNotification('Error opening Telegram link. Please copy the URL manually.', 'error');
            }
        });
    }

    // Auth buttons
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    if (loginBtn) loginBtn.addEventListener('click', showLoginModal);
    if (registerBtn) registerBtn.addEventListener('click', showRegisterModal);
    if (logoutBtn) logoutBtn.addEventListener('click', logout);

    // Modal close buttons
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    // Forms
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const comicUploadForm = document.getElementById('comicUploadForm');
    const adUploadForm = document.getElementById('adUploadForm');

    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (registerForm) registerForm.addEventListener('submit', handleRegister);
    if (comicUploadForm) comicUploadForm.addEventListener('submit', handleComicUpload);
    if (adUploadForm) adUploadForm.addEventListener('submit', handleAdUpload);

    // File upload preview
    const comicFileInput = document.getElementById('comicFile');
    if (comicFileInput) {
        comicFileInput.addEventListener('change', handleFileSelection);
    }
    
    // Thumbnail file upload preview
    const thumbnailFileInput = document.getElementById('comicThumbnail');
    if (thumbnailFileInput) {
        thumbnailFileInput.addEventListener('change', handleThumbnailSelection);
    }

    // Search and filters
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');

    if (searchBtn) searchBtn.addEventListener('click', performSearch);
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') performSearch();
        });
    }
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            loadComics();
        });
    }

    // Admin tabs
    const adminTabButtons = document.querySelectorAll('.tab-btn');
    console.log('Found admin tab buttons:', adminTabButtons.length);
    
    adminTabButtons.forEach((btn, index) => {
        console.log(`Setting up admin tab button ${index}:`, btn.textContent, 'data-tab:', btn.dataset.tab);
        btn.addEventListener('click', function() {
            console.log('Admin tab button clicked:', this.textContent, 'data-tab:', this.dataset.tab);
            showAdminTab(this.dataset.tab);
        });
    });
    
    // Debug: Check if all tab contents exist
    const allTabContents = document.querySelectorAll('.tab-content');
    console.log('Found tab contents:', allTabContents.length);
    allTabContents.forEach((content, index) => {
        console.log(`Tab content ${index}:`, content.id, 'classes:', content.className);
    });
    
    // Initialize advertisement and premium user management
    setupAdvertisementManagement();
    setupPremiumUserManagement();
    
    console.log('Event listeners setup complete!');
}

// File selection handler
function handleFileSelection(event) {
    const file = event.target.files[0];
    const filePreview = document.getElementById('filePreview');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const fileIcon = document.getElementById('fileIcon');
    
    if (file) {
        // Show file preview
        filePreview.classList.add('show');
        
        // Update file name
        fileName.textContent = file.name;
        
        // Update file size
        const sizeInMB = (file.size / 1024 / 1024).toFixed(2);
        fileSize.textContent = `${sizeInMB} MB`;
        
        // Update file icon based on type
        if (file.type.startsWith('image/')) {
            fileIcon.className = 'fas fa-image';
        } else if (file.type === 'application/pdf') {
            fileIcon.className = 'fas fa-file-pdf';
        } else if (file.type === 'application/zip') {
            fileIcon.className = 'fas fa-file-archive';
        } else {
            fileIcon.className = 'fas fa-file';
        }
    } else {
        // Hide file preview
        filePreview.classList.remove('show');
        fileName.textContent = 'No file selected';
        fileSize.textContent = 'Select a file to see details';
        fileIcon.className = 'fas fa-file';
    }
}

// Thumbnail selection handler
function handleThumbnailSelection(event) {
    const file = event.target.files[0];
    const thumbnailPreview = document.getElementById('thumbnailPreview');
    
    if (file) {
        // Create thumbnail preview if it doesn't exist
        if (!thumbnailPreview) {
            createThumbnailPreview();
        }
        
        const preview = document.getElementById('thumbnailPreview') || thumbnailPreview;
        const previewImg = document.getElementById('thumbnailPreviewImg');
        const previewText = document.getElementById('thumbnailPreviewText');
        
        if (preview && previewImg && previewText) {
            // Show preview
            preview.classList.add('show');
            
            // Create object URL for preview
            const objectUrl = URL.createObjectURL(file);
            previewImg.src = objectUrl;
            previewImg.alt = file.name;
            
            // Update text
            previewText.textContent = file.name;
            
            // Clean up object URL when file changes
            previewImg.onload = () => {
                URL.revokeObjectURL(objectUrl);
            };
        }
    } else {
        // Hide preview
        const preview = document.getElementById('thumbnailPreview');
        if (preview) {
            preview.classList.remove('show');
        }
    }
}

// Create thumbnail preview element
function createThumbnailPreview() {
    const thumbnailInput = document.getElementById('comicThumbnail');
    if (!thumbnailInput) return;
    
    const previewDiv = document.createElement('div');
    previewDiv.id = 'thumbnailPreview';
    previewDiv.className = 'thumbnail-upload-preview';
    
    previewDiv.innerHTML = `
        <div class="thumbnail-info">
            <img id="thumbnailPreviewImg" src="" alt="Thumbnail Preview" class="thumbnail-preview-image">
            <div class="thumbnail-details">
                <h6 id="thumbnailPreviewText">No thumbnail selected</h6>
            </div>
        </div>
    `;
    
    // Insert after the thumbnail input
    thumbnailInput.parentNode.insertBefore(previewDiv, thumbnailInput.nextSibling);
}

// Navigation functions
function showSection(sectionId) {
    console.log('Showing section:', sectionId);
    
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
        console.log('Removed active from section:', section.id);
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        console.log('Added active to section:', sectionId);
        
        // Scroll to top smoothly
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    } else {
        console.error('Section not found:', sectionId);
    }
}

function updateActiveNavLink(activeLink) {
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to clicked link
    activeLink.classList.add('active');
    console.log('Updated active nav link to:', activeLink.textContent);
}

// Authentication functions
function checkAuthStatus() {
    console.log('Checking auth status...');
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin');
    
    console.log('Token:', token);
    console.log('Is Admin:', isAdmin);
    
    if (token) {
        // Check if it's admin
        if (isAdmin === 'true') {
            console.log('User is admin, showing admin user');
            showAdminUser();
        } else {
            console.log('User is not admin, showing user menu');
            showUserMenu();
        }
    } else {
        console.log('No token found, showing auth buttons');
        showAuthButtons();
    }
}

function showAuthButtons() {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const userMenu = document.getElementById('userMenu');
    
    if (loginBtn) loginBtn.style.display = 'inline-block';
    if (registerBtn) registerBtn.style.display = 'inline-block';
    if (userMenu) userMenu.style.display = 'none';
    hideAdminNav();
}

function showUserMenu() {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const userMenu = document.getElementById('userMenu');
    
    if (loginBtn) loginBtn.style.display = 'none';
    if (registerBtn) registerBtn.style.display = 'none';
    if (userMenu) userMenu.style.display = 'flex';
}

function showAdminUser() {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const userMenu = document.getElementById('userMenu');
    const username = document.getElementById('username');
    
    if (loginBtn) loginBtn.style.display = 'none';
    if (registerBtn) registerBtn.style.display = 'none';
    if (userMenu) userMenu.style.display = 'flex';
    if (username) username.textContent = 'Admin';
    
    showAdminNav();
    
    // Load admin data when admin user is shown
    loadAdminData();
    
    // Automatically show admin section after login
    console.log('Attempting to show admin section...');
    showSection('admin');
    
    const adminNavLink = document.querySelector('a[href="#admin"]');
    console.log('Admin nav link found:', adminNavLink);
    if (adminNavLink) {
        updateActiveNavLink(adminNavLink);
    } else {
        console.error('Admin nav link not found for updateActiveNavLink');
    }
}

function showAdminNav() {
    const adminLink = document.querySelector('.admin-only');
    console.log('Admin nav link found:', adminLink);
    
    if (adminLink) {
        adminLink.style.display = 'inline-block';
        console.log('Admin nav link displayed');
    } else {
        console.error('Admin nav link not found');
    }
}

function hideAdminNav() {
    const adminLink = document.querySelector('.admin-only');
    if (adminLink) adminLink.style.display = 'none';
}

// Modal functions
function showLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.style.display = 'block';
}

function showRegisterModal() {
    const modal = document.getElementById('registerModal');
    if (modal) modal.style.display = 'block';
}

// Form handlers
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Check if it's admin login
    if (email === 'admin@comichub.com' && password === '21268012') {
        // Create a mock admin token for demo purposes
        const adminToken = 'admin-token-' + Date.now();
        localStorage.setItem('token', adminToken);
        localStorage.setItem('isAdmin', 'true');
        currentUser = { role: 'admin', userId: 'admin-user' };
        showAdminUser();
        document.getElementById('loginModal').style.display = 'none';
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
        showSuccessMessage('Admin login successful!');
    } else {
        showErrorMessage('Invalid credentials. Use admin@comichub.com / 21268012 for admin access.');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    showErrorMessage('Registration feature coming soon!');
}

async function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    currentUser = null;
    showAuthButtons();
    hideAdminNav();
    showSection('home');
    updateActiveNavLink(document.querySelector('a[href="#home"]'));
    showSuccessMessage('Logged out successfully');
} 

// Comics functions
async function loadComics() {
    // Show sample comics for testing
    showSampleComics();
}

function showSampleComics() {
    const sampleComics = [
        {
            _id: '1',
            title: 'Sample Action Comic',
            description: 'An exciting action-packed comic with amazing artwork',
            thumbnail: 'https://via.placeholder.com/300x200/ff6b35/ffffff?text=Action+Comic',
            telegramLink: 'https://t.me/beast_is_kum',
            category: 'action',
            views: 1250,
            likes: 89
        },
        {
            _id: '2',
            title: 'Adventure Quest',
            description: 'Join the hero on an epic adventure across magical lands',
            thumbnail: 'https://via.placeholder.com/300x200/00d4ff/ffffff?text=Adventure+Quest',
            telegramLink: 'https://t.me/beast_is_kum',
            category: 'adventure',
            views: 980,
            likes: 67
        },
        {
            _id: '3',
            title: 'Comedy Central',
            description: 'Laugh out loud with this hilarious comedy comic',
            thumbnail: 'https://via.placeholder.com/300x200/ffd700/000000?text=Comedy+Central',
            telegramLink: 'https://t.me/beast_is_kum',
            category: 'comedy',
            views: 756,
            likes: 45
        },
        {
            _id: '4',
            title: 'Fantasy World',
            description: 'Enter a world of magic, dragons, and epic battles',
            thumbnail: 'https://via.placeholder.com/300x200/9c27b0/ffffff?text=Fantasy+World',
            telegramLink: 'https://t.me/beast_is_kum',
            category: 'fantasy',
            views: 1890,
            likes: 123
        }
    ];
    
    displayComics(sampleComics);
}

function displayComics(comics) {
    const grid = document.getElementById('comicsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (comics.length === 0) {
        grid.innerHTML = '<div class="no-comics"><p>No comics found</p></div>';
        return;
    }
    
    comics.forEach(comic => {
        const card = createComicCard(comic);
        grid.appendChild(card);
    });
}

function createComicCard(comic) {
    const card = document.createElement('div');
    card.className = 'comic-card';
    
    card.innerHTML = `
        <img src="${comic.thumbnail}" alt="${comic.title}" class="comic-thumbnail" onerror="this.src='https://via.placeholder.com/280x200/1a2332/ffffff?text=No+Image'">
        <div class="comic-info">
            <h3 class="comic-title">${comic.title}</h3>
            <p class="comic-description">${comic.description}</p>
            <div class="comic-meta">
                <span>${comic.category}</span>
                <span>${comic.views} views</span>
            </div>
            <div class="comic-actions">
                <button class="btn btn-view" onclick="openTelegramLink('${comic.telegramLink}')">
                    <i class="fab fa-telegram"></i> Read
                </button>
                <button class="btn btn-like" onclick="likeComic('${comic._id}')">
                    <i class="fas fa-heart"></i> ${comic.likes}
                </button>
            </div>
        </div>
    `;
    
    return card;
}

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        currentSearch = searchInput.value.trim();
        loadComics();
    }
}

function openTelegramLink(link) {
    console.log('Opening Telegram link:', link);
    
    if (!link || link === 'undefined' || link === 'null') {
        showErrorMessage('Telegram link not available');
        return;
    }
    
    // Ensure the link starts with http:// or https://
    if (!link.startsWith('http://') && !link.startsWith('https://')) {
        link = 'https://' + link;
    }
    
    try {
        window.open(link, '_blank');
        console.log('Telegram link opened successfully');
    } catch (error) {
        console.error('Error opening Telegram link:', error);
        showErrorMessage('Failed to open Telegram link');
    }
}

async function likeComic(comicId) {
    if (!currentUser) {
        showErrorMessage('Please login to like comics');
        return;
    }
    
    showSuccessMessage('Comic liked!');
}

// Dashboard functions
function loadDashboardData() {
    // Set default values
    updateDashboard({
        totalUsers: 66472,
        totalViews: Math.floor(Math.random() * 20000) + 40000, // 40k-60k
        totalComics: 4,
        onlineUsers: Math.floor(Math.random() * 1000) + 1000, // 1k-2k
        dailyViews: Math.floor(Math.random() * 5000) + 2000
    });
}

function updateDashboard(data) {
    // Update dashboard cards
    const totalUsersEl = document.getElementById('totalUsers');
    const onlineUsersEl = document.getElementById('onlineUsers');
    const dailyViewsEl = document.getElementById('dailyViews');
    
    if (totalUsersEl) totalUsersEl.textContent = data.totalUsers || 66472;
    if (onlineUsersEl) onlineUsersEl.textContent = data.onlineUsers || Math.floor(Math.random() * 1000) + 1000;
    if (dailyViewsEl) dailyViewsEl.textContent = data.dailyViews || Math.floor(Math.random() * 5000) + 2000;
    
    // Update live activity
    updateLiveActivity();
}

function updateLiveActivity() {
    const currentTimeEl = document.getElementById('currentTime');
    const dailyViewsActivityEl = document.getElementById('dailyViewsActivity');
    const userCountChangeEl = document.getElementById('userCountChange');
    
    if (currentTimeEl) {
        const now = new Date();
        currentTimeEl.textContent = now.toLocaleTimeString();
    }
    
    if (dailyViewsActivityEl) {
        dailyViewsActivityEl.textContent = Math.floor(Math.random() * 1000) + 500;
    }
    
    if (userCountChangeEl) {
        const change = Math.floor(Math.random() * 20) + 1;
        userCountChangeEl.textContent = `+${change}`;
    }
    
    // Update every 5 seconds
    setTimeout(updateLiveActivity, 5000);
} 

// Admin functions
function showAdminTab(tabName) {
    console.log('=== SHOW ADMIN TAB DEBUG ===');
    console.log('Requested tab:', tabName);
    
    // Hide all tab contents
    const allTabContents = document.querySelectorAll('.tab-content');
    console.log('Found tab contents:', allTabContents.length);
    
    allTabContents.forEach((content, index) => {
        console.log(`Tab content ${index}:`, content.id, 'currently active:', content.classList.contains('active'));
        content.classList.remove('active');
        console.log(`Removed active from tab content:`, content.id);
    });
    
    // Remove active class from all tab buttons
    const allTabButtons = document.querySelectorAll('.tab-btn');
    console.log('Found tab buttons:', allTabButtons.length);
    
    allTabButtons.forEach((btn, index) => {
        console.log(`Tab button ${index}:`, btn.textContent, 'data-tab:', btn.dataset.tab, 'currently active:', btn.classList.contains('active'));
        btn.classList.remove('active');
        console.log(`Removed active from tab button:`, btn.textContent);
    });
    
    // Show selected tab content
    const selectedTab = document.getElementById(tabName);
    console.log('Looking for tab with ID:', tabName);
    console.log('Selected tab element:', selectedTab);
    
    if (selectedTab) {
        selectedTab.classList.add('active');
        console.log('✅ Successfully activated tab content:', tabName);
        
        // Force display block to ensure visibility
        selectedTab.style.display = 'block';
        console.log('Set display to block for:', tabName);
    } else {
        console.error('❌ Tab content not found:', tabName);
        console.log('Available tab IDs:', Array.from(allTabContents).map(t => t.id));
    }
    
    // Add active class to clicked button
    const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
    console.log('Looking for button with data-tab:', tabName);
    console.log('Active button element:', activeBtn);
    
    if (activeBtn) {
        activeBtn.classList.add('active');
        console.log('✅ Successfully activated tab button:', tabName);
    } else {
        console.error('❌ Tab button not found:', tabName);
        console.log('Available button data-tab values:', Array.from(allTabButtons).map(b => b.dataset.tab));
    }
    
    // Load data for the selected tab
    switch(tabName) {
        case 'upload':
            console.log('Upload tab selected - no additional loading needed');
            break;
        case 'users':
            console.log('Users tab selected - loading users');
            loadUsers();
            break;
        case 'comics':
            console.log('Comics tab selected - loading admin comics');
            loadAdminComics();
            break;
        case 'stats':
            console.log('Stats tab selected - loading admin statistics');
            loadAdminStats();
            break;
        case 'advertisements':
            console.log('Advertisements tab selected - loading ads');
            loadAdvertisements();
            break;
        case 'premium-users':
            console.log('Premium users tab selected - loading premium users');
            loadPremiumUsers();
            break;
        default:
            console.log('Unknown tab selected:', tabName);
    }
    
    console.log('=== END SHOW ADMIN TAB DEBUG ===');
}

async function handleComicUpload(e) {
    e.preventDefault();
    console.log('Comic upload form submitted');
    
    if (!currentUser || currentUser.role !== 'admin') {
        console.log('User not admin:', currentUser);
        showErrorMessage('Only admins can upload comics');
        return;
    }
    
    console.log('User is admin, proceeding with upload');
    
    // Get form values
    const title = document.getElementById('comicTitle').value.trim();
    const description = document.getElementById('comicDescription').value.trim();
    const thumbnail = document.getElementById('comicThumbnail').files[0];
    const comicFile = document.getElementById('comicFile').files[0];
    const telegramLink = document.getElementById('comicTelegramLink').value.trim();
    const category = document.getElementById('comicCategory').value;
    const tags = document.getElementById('comicTags').value.trim();
    
    console.log('Form values:', { title, description, thumbnail, comicFile, telegramLink, category, tags });
    
    // Validate required fields
    if (!title || !description || !thumbnail || !comicFile || !category) {
        showErrorMessage('Please fill in all required fields (Title, Description, Thumbnail, Comic File, and Category are required)');
        return;
    }
    
    // Validate thumbnail file type
    const allowedThumbnailTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedThumbnailTypes.includes(thumbnail.type)) {
        showErrorMessage('Please select a valid thumbnail image type (JPEG, PNG, GIF, or WebP)');
        return;
    }
    
    // Validate thumbnail file size (max 5MB)
    const maxThumbnailSize = 5 * 1024 * 1024; // 5MB
    if (thumbnail.size > maxThumbnailSize) {
        showErrorMessage('Thumbnail image too large. Maximum size is 5MB');
        return;
    }
    
    // Validate comic file type
    const allowedTypes = ['application/pdf', 'application/zip', 'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(comicFile.type)) {
        showErrorMessage('Please select a valid file type (PDF, ZIP, or Image)');
        return;
    }
    
    // Validate comic file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (comicFile.size > maxSize) {
        showErrorMessage('Comic file too large. Maximum size is 50MB');
        return;
    }
    
    // Validate Telegram link format if provided
    if (telegramLink && !telegramLink.includes('t.me/') && !telegramLink.includes('telegram.me/')) {
        showErrorMessage('Please enter a valid Telegram link (e.g., https://t.me/username)');
        return;
    }
    
    try {
        // For demo purposes, we'll simulate a successful upload
        // In a real app, this would send to the backend
        console.log('Simulating comic upload to backend...');
        console.log('File details:', {
            comicFile: {
                name: comicFile.name,
                size: (comicFile.size / 1024 / 1024).toFixed(2) + ' MB',
                type: comicFile.type
            },
            thumbnail: {
                name: thumbnail.name,
                size: (thumbnail.size / 1024 / 1024).toFixed(2) + ' MB',
                type: thumbnail.type
            }
        });
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        showSuccessMessage('Comic uploaded successfully! (Demo mode)');
        e.target.reset();
        
        // Reload comics
        loadComics();
    } catch (error) {
        console.error('Error uploading comic:', error);
        showErrorMessage('Failed to upload comic. Please try again.');
    }
}

function displayAdminStats(stats) {
    const adminOnlineUsers = document.getElementById('adminOnlineUsers');
    const adminTotalUsers = document.getElementById('adminTotalUsers');
    const adminDailyViews = document.getElementById('adminDailyViews');
    const adminTotalComics = document.getElementById('adminTotalComics');
    
    if (adminOnlineUsers) adminOnlineUsers.textContent = Math.floor(Math.random() * 1000) + 1000; // 1k-2k
    if (adminTotalUsers) adminTotalUsers.textContent = 66472;
    if (adminDailyViews) adminDailyViews.textContent = Math.floor(Math.random() * 5000) + 2000;
    if (adminTotalComics) adminTotalComics.textContent = 4; // Sample comics count
    
    // Update admin live activity
    updateAdminLiveActivity();
    
    // Load recent activity
    loadRecentActivity();
}

function updateAdminLiveActivity() {
    const adminCurrentTime = document.getElementById('adminCurrentTime');
    const adminDailyViewsActivity = document.getElementById('adminDailyViewsActivity');
    const adminUserCountChange = document.getElementById('adminUserCountChange');
    
    if (adminCurrentTime) {
        const now = new Date();
        adminCurrentTime.textContent = now.toLocaleTimeString();
    }
    
    if (adminDailyViewsActivity) {
        adminDailyViewsActivity.textContent = Math.floor(Math.random() * 1000) + 500;
    }
    
    if (adminUserCountChange) {
        const change = Math.floor(Math.random() * 20) + 1;
        adminUserCountChange.textContent = `+${change}`;
    }
    
    // Update every 5 seconds
    setTimeout(updateAdminLiveActivity, 5000);
}

async function loadAdminData() {
    console.log('Loading admin data...');
    
    // Load admin statistics immediately
    loadAdminStats();
    
    // Load users data
    loadUsers();
    
    console.log('Admin data loading complete');
}

function loadAdminStats() {
    // Load admin statistics with sample data
    const stats = {
        totalUsers: 66472,
        totalComics: 4,
        onlineUsers: Math.floor(Math.random() * 1000) + 1000,
        dailyViews: Math.floor(Math.random() * 5000) + 2000
    };
    
    displayAdminStats(stats);
}

function loadAdminComics() {
    const adminComicsTable = document.getElementById('adminComicsTable');
    if (!adminComicsTable) return;
    
    // Sample admin comics for testing
    const sampleAdminComics = [
        {
            id: 1,
            title: 'Action Hero Comic',
            category: 'action',
            status: 'active',
            views: 1250,
            uploadDate: '2024-01-15'
        },
        {
            id: 2,
            title: 'Adventure Quest',
            category: 'adventure',
            status: 'active',
            views: 980,
            uploadDate: '2024-01-20'
        },
        {
            id: 3,
            title: 'Comedy Central',
            category: 'comedy',
            status: 'inactive',
            views: 756,
            uploadDate: '2024-01-25'
        },
        {
            id: 4,
            title: 'Fantasy World',
            category: 'fantasy',
            status: 'active',
            views: 1890,
            uploadDate: '2024-01-30'
        }
    ];
    
    adminComicsTable.innerHTML = `
        <table class="users-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Views</th>
                    <th>Upload Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${sampleAdminComics.map(comic => `
                    <tr>
                        <td>${comic.id}</td>
                        <td>${comic.title}</td>
                        <td><span class="category-${comic.category}">${comic.category}</span></td>
                        <td><span class="status-${comic.status}">${comic.status}</span></td>
                        <td>${comic.views.toLocaleString()}</td>
                        <td>${comic.uploadDate}</td>
                        <td>
                            <button class="btn btn-primary btn-sm" onclick="editComic('${comic.id}')">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn btn-warning btn-sm" onclick="toggleComicStatus('${comic.id}')">
                                <i class="fas fa-power-off"></i> Toggle
                            </button>
                            <button class="btn btn-danger btn-sm" onclick="deleteComic('${comic.id}')">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function editComic(comicId) {
    const newTitle = prompt('Enter new title:');
    if (newTitle) {
        showNotification(`Comic ${comicId} title updated to: ${newTitle}`, 'success');
    }
}

function toggleComicStatus(comicId) {
    showNotification(`Comic ${comicId} status toggled`, 'success');
}

function deleteComic(comicId) {
    if (confirm(`Are you sure you want to delete comic ${comicId}?`)) {
        showNotification(`Comic ${comicId} deleted successfully`, 'success');
    }
} 

// Utility functions
function showSuccessMessage(message) {
    alert(message);
}

function showErrorMessage(message) {
    alert('Error: ' + message);
}

function contactAdmin() {
    // Open Telegram link to @beast_is_kum
    window.open('https://t.me/beast_is_kum', '_blank');
}

// Advertisement Management
function setupAdvertisementManagement() {
    console.log('Setting up advertisement management...');
    
    // Load existing ads
    loadAdvertisements();
}

async function handleAdUpload(event) {
    event.preventDefault();
    console.log('Ad upload form submitted - DEBUG START');
    console.log('Event target:', event.target);
    console.log('Form ID:', event.target.id);
    console.log('Form elements:', event.target.elements);
    
    const formData = new FormData(event.target);
    
    // Validate required fields
    const title = formData.get('adTitle');
    const text = formData.get('adText');
    const telegramLink = formData.get('adTelegramLink');
    const position = formData.get('adPosition');
    const status = formData.get('adStatus');
    const bannerImage = formData.get('adBannerImage');
    
    console.log('Ad form data:', { title, text, telegramLink, position, status, bannerImage });
    console.log('FormData entries:');
    for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
    }
    
    if (!title || !text || !telegramLink || !position || !status) {
        console.log('Validation failed: missing required fields');
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Validate Telegram link format
    if (!telegramLink.includes('t.me/') && !telegramLink.includes('telegram.me/')) {
        console.log('Validation failed: invalid Telegram link');
        showNotification('Please enter a valid Telegram link (e.g., https://t.me/username)', 'error');
        return;
    }
    
    // Validate image file
    if (!bannerImage || bannerImage.size === 0) {
        console.log('Validation failed: no banner image');
        showNotification('Please select a banner image', 'error');
        return;
    }
    
    console.log('Validation passed, processing ad upload');
    
    try {
        // For demo purposes, we'll simulate a successful upload
        // In a real app, this would send to the backend
        console.log('Simulating advertisement upload to backend...');
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        showNotification('Advertisement uploaded successfully! (Demo mode)', 'success');
        
        // Add to ads list
        addSampleAd({
            title,
            text,
            telegramLink,
            position,
            status,
            bannerImage
        });
        
        // Reset form
        event.target.reset();
        
        // Reload advertisements
        loadAdvertisements();
    } catch (error) {
        console.error('Error uploading advertisement:', error);
        showNotification('Failed to upload advertisement. Please try again.', 'error');
    }
}

function addSampleAd(adData) {
    const adsList = document.getElementById('adsList');
    if (!adsList) return;
    
    const adCard = document.createElement('div');
    adCard.className = 'ad-card';
    
    // Create a sample image URL from the file
    const imageUrl = adData.bannerImage ? URL.createObjectURL(adData.bannerImage) : 'https://via.placeholder.com/300x150/007bff/ffffff?text=Banner+Image';
    
    adCard.innerHTML = `
        <img src="${imageUrl}" alt="${adData.title}" class="ad-image-clickable" onclick="openAdTelegramLink('${adData.telegramLink}')" style="cursor: pointer;">
        <h5>${adData.title}</h5>
        <p>${adData.text}</p>
        <p><strong>Position:</strong> ${adData.position}</p>
        <p><strong>Status:</strong> <span class="status-${adData.status}">${adData.status}</span></p>
        <p><strong>Telegram Link:</strong> <a href="${adData.telegramLink}" target="_blank">${adData.telegramLink}</a></p>
        <div class="ad-actions">
            <button class="edit-btn" onclick="editAd(this)">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button class="delete-btn" onclick="deleteAd(this)">
                <i class="fas fa-trash"></i> Delete
            </button>
            <button class="toggle-btn" onclick="toggleAdStatus(this)">
                <i class="fas fa-power-off"></i> Toggle
            </button>
        </div>
    `;
    
    adsList.appendChild(adCard);
}

function editAd(button) {
    const adCard = button.closest('.ad-card');
    const title = adCard.querySelector('h5').textContent;
    const text = adCard.querySelector('p').textContent;
    
    // Show edit form
    const newTitle = prompt('Edit Title:', title);
    const newText = prompt('Edit Text:', text);
    
    if (newTitle && newText) {
        adCard.querySelector('h5').textContent = newTitle;
        adCard.querySelector('p').textContent = newText;
        showNotification('Advertisement updated successfully!', 'success');
    }
}

function deleteAd(button) {
    const adCard = button.closest('.ad-card');
    if (confirm('Are you sure you want to delete this advertisement?')) {
        adCard.remove();
        showNotification('Advertisement deleted successfully!', 'success');
    }
}

function toggleAdStatus(button) {
    const adCard = button.closest('.ad-card');
    const statusSpan = adCard.querySelector('.status-active, .status-inactive');
    const currentStatus = statusSpan.textContent;
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    statusSpan.textContent = newStatus;
    statusSpan.className = `status-${newStatus}`;
    
    showNotification(`Advertisement status changed to ${newStatus}!`, 'success');
}

function loadAdvertisements() {
    const adsList = document.getElementById('adsList');
    if (!adsList) return;
    
    // Sample advertisements for testing
    const sampleAds = [
        {
            id: 1,
            title: 'Premium Comics Collection',
            text: 'Get access to exclusive premium comics and early releases!',
            position: 'top',
            status: 'active',
            imageUrl: 'https://via.placeholder.com/300x150/ffd700/000000?text=Premium+Comics',
            telegramLink: 'https://t.me/beast_is_kum',
            views: 15420,
            clicks: 892
        },
        {
            id: 2,
            title: 'Join Our Telegram Channel',
            text: 'Stay updated with the latest comic releases and community news!',
            position: 'sidebar',
            status: 'active',
            imageUrl: 'https://via.placeholder.com/300x150/0088cc/ffffff?text=Telegram+Channel',
            telegramLink: 'https://t.me/beast_is_kum',
            views: 12350,
            clicks: 567
        },
        {
            id: 3,
            title: 'New Comic Releases',
            text: 'Check out the latest comic releases every week!',
            position: 'premium',
            status: 'active',
            imageUrl: 'https://via.placeholder.com/300x150/9c27b0/ffffff?text=New+Releases',
            telegramLink: 'https://t.me/beast_is_kum',
            views: 8760,
            clicks: 423
        }
    ];
    
    adsList.innerHTML = `
        <div class="ads-summary">
            <h4>Total Advertisements: ${sampleAds.length}</h4>
            <div class="ads-stats">
                <span class="stat-item">
                    <i class="fas fa-eye"></i> Total Views: ${sampleAds.reduce((sum, ad) => sum + ad.views, 0).toLocaleString()}
                </span>
                <span class="stat-item">
                    <i class="fas fa-mouse-pointer"></i> Total Clicks: ${sampleAds.reduce((sum, ad) => sum + ad.clicks, 0).toLocaleString()}
                </span>
            </div>
        </div>
    `;
    
    sampleAds.forEach(ad => {
        const adCard = document.createElement('div');
        adCard.className = 'ad-card';
        
        adCard.innerHTML = `
            <img src="${ad.imageUrl}" alt="${ad.title}" class="ad-image-clickable" onclick="openAdTelegramLink('${ad.telegramLink}')" style="cursor: pointer;">
            <h5>${ad.title}</h5>
            <p>${ad.text}</p>
            <div class="ad-details">
                <p><strong>Position:</strong> <span class="position-${ad.position}">${ad.position}</span></p>
                <p><strong>Status:</strong> <span class="status-${ad.status}">${ad.status}</span></p>
                <p><strong>Views:</strong> ${ad.views.toLocaleString()}</p>
                <p><strong>Clicks:</strong> ${ad.clicks.toLocaleString()}</p>
                <p><strong>Telegram Link:</strong> <a href="${ad.telegramLink}" target="_blank">${ad.telegramLink}</a></p>
            </div>
            <div class="ad-actions">
                <button class="edit-btn" onclick="editAd(this)">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="delete-btn" onclick="deleteAd(this)">
                    <i class="fas fa-trash"></i> Delete
                </button>
                <button class="toggle-btn" onclick="toggleAdStatus(this)">
                    <i class="fas fa-power-off"></i> Toggle
                </button>
            </div>
        `;
        
        adsList.appendChild(adCard);
    });
} 

// User Management
function loadUsers() {
    const usersList = document.getElementById('usersList');
    if (!usersList) return;
    
    // Generate 66,472 sample users
    const totalUsers = 66472;
    const sampleUsers = [];
    
    // Random names for realistic user generation
    const firstNames = [
        'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth',
        'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Christopher', 'Karen',
        'Charles', 'Nancy', 'Daniel', 'Lisa', 'Matthew', 'Betty', 'Anthony', 'Helen', 'Mark', 'Sandra',
        'Donald', 'Donna', 'Steven', 'Carol', 'Paul', 'Ruth', 'Andrew', 'Sharon', 'Joshua', 'Michelle',
        'Kenneth', 'Laura', 'Kevin', 'Emily', 'Brian', 'Kimberly', 'George', 'Deborah', 'Edward', 'Dorothy',
        'Ronald', 'Lisa', 'Timothy', 'Nancy', 'Jason', 'Karen', 'Jeffrey', 'Betty', 'Ryan', 'Helen',
        'Jacob', 'Sandra', 'Gary', 'Donna', 'Nicholas', 'Carol', 'Eric', 'Ruth', 'Jonathan', 'Sharon',
        'Stephen', 'Michelle', 'Larry', 'Laura', 'Justin', 'Emily', 'Scott', 'Kimberly', 'Brandon', 'Deborah',
        'Benjamin', 'Dorothy', 'Samuel', 'Lisa', 'Frank', 'Nancy', 'Gregory', 'Karen', 'Raymond', 'Betty',
        'Alexander', 'Helen', 'Patrick', 'Sandra', 'Jack', 'Donna', 'Dennis', 'Carol', 'Jerry', 'Ruth'
    ];
    
    const lastNames = [
        'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
        'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
        'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
        'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
        'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts',
        'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes',
        'Stewart', 'Morris', 'Morales', 'Murphy', 'Peterson', 'Bailey', 'Reed', 'Kelly', 'Howard', 'Ramos',
        'Kim', 'Cox', 'Ward', 'Torres', 'Peterson', 'Gray', 'Ramirez', 'James', 'Watson', 'Brooks',
        'Kelly', 'Sanders', 'Price', 'Bennett', 'Wood', 'Barnes', 'Ross', 'Henderson', 'Coleman', 'Jenkins',
        'Perry', 'Powell', 'Long', 'Patterson', 'Hughes', 'Flores', 'Washington', 'Butler', 'Simmons', 'Foster'
    ];
    
    // Create sample users with realistic data
    for (let i = 1; i <= 50; i++) { // Show first 50 users for performance
        // Only 3 admins total
        let userType;
        if (i <= 3) {
            userType = 'admin';
        } else if (i <= 13) {
            userType = 'premium';
        } else {
            userType = 'user';
        }
        
        const status = i <= 45 ? 'active' : 'inactive';
        
        // Generate random name
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const username = `${firstName.toLowerCase()}_${lastName.toLowerCase()}_${String(i).padStart(3, '0')}`;
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@gmail.com`;
        
        sampleUsers.push({
            id: i,
            username: username,
            email: email,
            role: userType,
            status: status,
            joinDate: new Date(2024, 0, Math.floor(Math.random() * 365) + 1).toLocaleDateString(),
            lastLogin: new Date(2024, 11, Math.floor(Math.random() * 31) + 1).toLocaleDateString()
        });
    }
    
    usersList.innerHTML = `
        <div class="users-summary">
            <h4>Total Users: ${totalUsers.toLocaleString()}</h4>
            <div class="user-stats">
                <span class="stat-item">
                    <i class="fas fa-users"></i> Regular: ${(totalUsers - Math.floor(totalUsers * 0.25) - 3).toLocaleString()}
                </span>
                <span class="stat-item">
                    <i class="fas fa-crown"></i> Premium: ${Math.floor(totalUsers * 0.25).toLocaleString()}
                </span>
                <span class="stat-item">
                    <i class="fas fa-shield-alt"></i> Admin: 3
                </span>
            </div>
        </div>
        <table class="users-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Join Date</th>
                    <th>Last Login</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${sampleUsers.map(user => `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.username}</td>
                        <td>${user.email}</td>
                        <td><span class="role-${user.role}">${user.role}</span></td>
                        <td><span class="status-${user.status}">${user.status}</span></td>
                        <td>${user.joinDate}</td>
                        <td>${user.lastLogin}</td>
                        <td>
                            <button class="btn btn-primary btn-sm" onclick="changeUserRole('${user.id}')">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn btn-danger btn-sm" onclick="deleteUser('${user.id}')">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <div class="pagination-info">
            <p>Showing 1-50 of ${totalUsers.toLocaleString()} users</p>
        </div>
    `;
}

function changeUserRole(userId) {
    const newRole = prompt('Enter new role (user/premium/admin):');
    if (newRole && ['user', 'premium', 'admin'].includes(newRole.toLowerCase())) {
        showNotification(`User ${userId} role changed to ${newRole}`, 'success');
        // In real app, this would update the database
    }
}

function deleteUser(userId) {
    if (confirm(`Are you sure you want to delete user ${userId}?`)) {
        showNotification(`User ${userId} deleted successfully`, 'success');
        // In real app, this would delete from database
    }
}

// Premium User Management
function setupPremiumUserManagement() {
    loadPremiumUsers();
}

function loadPremiumUsers() {
    const premiumUsersList = document.getElementById('premiumUsersList');
    if (!premiumUsersList) return;
    
    // Generate premium users from the total user count
    const totalPremiumUsers = Math.floor(66472 * 0.25); // 25% of total users
    const samplePremiumUsers = [];
    
    // Random names for premium users
    const firstNames = [
        'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Isabella', 'Lucas', 'Sophia', 'Mason',
        'Mia', 'Oliver', 'Charlotte', 'Elijah', 'Amelia', 'James', 'Harper', 'Benjamin', 'Evelyn', 'Sebastian',
        'Abigail', 'Michael', 'Emily', 'Daniel', 'Elizabeth', 'Henry', 'Sofia', 'Jackson', 'Avery', 'Samuel',
        'Ella', 'David', 'Madison', 'Joseph', 'Scarlett', 'Carter', 'Victoria', 'Owen', 'Luna', 'Wyatt',
        'Grace', 'John', 'Chloe', 'Jack', 'Penelope', 'Luke', 'Layla', 'Jayden', 'Riley', 'Dylan',
        'Zoey', 'Grayson', 'Nora', 'Isaac', 'Lily', 'Mason', 'Eleanor', 'Evan', 'Hannah', 'Logan',
        'Lillian', 'Christopher', 'Addison', 'Andrew', 'Aubrey', 'Joshua', 'Ellie', 'Nathan', 'Stella', 'Adrian',
        'Natalie', 'Isaiah', 'Zoe', 'Charles', 'Leah', 'Josiah', 'Hazel', 'Hudson', 'Violet', 'Christian',
        'Aurora', 'Hunter', 'Savannah', 'Connor', 'Audrey', 'Eli', 'Brooklyn', 'Ezra', 'Bella', 'Aaron'
    ];
    
    const lastNames = [
        'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson',
        'Clark', 'Rodriguez', 'Lewis', 'Lee', 'Walker', 'Hall', 'Allen', 'Young', 'King', 'Wright',
        'Lopez', 'Hill', 'Scott', 'Green', 'Adams', 'Baker', 'Gonzalez', 'Nelson', 'Carter', 'Mitchell',
        'Perez', 'Roberts', 'Turner', 'Phillips', 'Campbell', 'Parker', 'Evans', 'Edwards', 'Collins', 'Stewart',
        'Sanchez', 'Morris', 'Rogers', 'Reed', 'Cook', 'Morgan', 'Bell', 'Murphy', 'Bailey', 'Rivera',
        'Cooper', 'Richardson', 'Cox', 'Howard', 'Ward', 'Torres', 'Peterson', 'Gray', 'Ramirez', 'James',
        'Watson', 'Brooks', 'Kelly', 'Sanders', 'Price', 'Bennett', 'Wood', 'Barnes', 'Ross', 'Henderson',
        'Coleman', 'Jenkins', 'Perry', 'Powell', 'Long', 'Patterson', 'Hughes', 'Flores', 'Washington', 'Butler',
        'Simmons', 'Foster', 'Gonzales', 'Bryant', 'Alexander', 'Russell', 'Griffin', 'Diaz', 'Hayes', 'Myers',
        'Ford', 'Hamilton', 'Graham', 'Sullivan', 'Wallace', 'Woods', 'Cole', 'West', 'Jordan', 'Owens'
    ];
    
    for (let i = 1; i <= 20; i++) {
        // Generate random name
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const username = `${firstName.toLowerCase()}_${lastName.toLowerCase()}_premium_${String(i).padStart(3, '0')}`;
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@yahoo.com`;
        
        samplePremiumUsers.push({
            id: i,
            username: username,
            email: email,
            role: 'premium',
            status: 'active',
            joinDate: new Date(2024, 0, Math.floor(Math.random() * 365) + 1).toLocaleDateString(),
            lastLogin: new Date(2024, 11, Math.floor(Math.random() * 31) + 1).toLocaleDateString(),
            subscriptionType: i <= 10 ? 'monthly' : 'yearly',
            expiresAt: new Date(2024, 11, Math.floor(Math.random() * 365) + 1).toLocaleDateString()
        });
    }
    
    premiumUsersList.innerHTML = `
        <div class="premium-summary">
            <h4>Premium Users: ${totalPremiumUsers.toLocaleString()}</h4>
            <div class="premium-stats">
                <span class="stat-item">
                    <i class="fas fa-calendar"></i> Monthly: ${Math.floor(totalPremiumUsers * 0.6).toLocaleString()}
                </span>
                <span class="stat-item">
                    <i class="fas fa-calendar-alt"></i> Yearly: ${Math.floor(totalPremiumUsers * 0.4).toLocaleString()}
                </span>
            </div>
        </div>
        <table class="users-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Subscription</th>
                    <th>Status</th>
                    <th>Join Date</th>
                    <th>Expires At</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${samplePremiumUsers.map(user => `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.username}</td>
                        <td>${user.email}</td>
                        <td><span class="subscription-${user.subscriptionType}">${user.subscriptionType}</span></td>
                        <td><span class="status-${user.status}">${user.status}</span></td>
                        <td>${user.joinDate}</td>
                        <td>${user.expiresAt}</td>
                        <td>
                            <button class="btn btn-success btn-sm" onclick="redirectToTelegram('${user.username}')">
                                <i class="fab fa-telegram"></i> Redirect
                            </button>
                            <button class="btn btn-warning btn-sm" onclick="extendSubscription('${user.id}')">
                                <i class="fas fa-clock"></i> Extend
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <div class="pagination-info">
            <p>Showing 1-20 of ${totalPremiumUsers.toLocaleString()} premium users</p>
        </div>
    `;
}

function extendSubscription(userId) {
    const months = prompt('Enter number of months to extend:');
    if (months && !isNaN(months)) {
        showNotification(`Subscription extended for user ${userId} by ${months} months`, 'success');
    }
}

function redirectToTelegram(username) {
    console.log('Redirecting user to Telegram:', username);
    
    // Redirect to your Telegram account
    const telegramUrl = 'https://t.me/beast_is_kum';
    
    try {
        // Try to open in new tab
        const newWindow = window.open(telegramUrl, '_blank');
        
        if (newWindow) {
            console.log('Telegram link opened successfully in new tab');
            showNotification(`Redirecting ${username} to your Telegram account!`, 'success');
        } else {
            // Fallback: try to redirect in same window
            console.log('Popup blocked, redirecting in same window');
            window.location.href = telegramUrl;
            showNotification(`Redirecting ${username} to your Telegram account!`, 'success');
        }
    } catch (error) {
        console.error('Error opening Telegram link:', error);
        // Fallback: show the URL for manual copy
        alert(`Please copy and paste this link to open your Telegram:\n\n${telegramUrl}`);
        showNotification(`Error opening Telegram link. Please copy the URL manually.`, 'error');
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    // Set background color based on type
    switch(type) {
        case 'success':
            notification.style.background = '#28a745';
            break;
        case 'error':
            notification.style.background = '#dc3545';
            break;
        case 'warning':
            notification.style.background = '#ffc107';
            notification.style.color = '#000';
            break;
        default:
            notification.style.background = '#007bff';
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Missing functions that were removed
function loadRecentActivity() {
    // Placeholder for recent activity
    console.log('Loading recent activity...');
}

// Duplicate functions removed

// Duplicate functions removed

function deleteAd(button) {
    const adCard = button.closest('.ad-card');
    if (confirm('Are you sure you want to delete this advertisement?')) {
        adCard.remove();
        showNotification('Advertisement deleted successfully!', 'success');
    }
}

function toggleAdStatus(button) {
    const adCard = button.closest('.ad-card');
    const statusSpan = adCard.querySelector('.status-active, .status-inactive');
    const currentStatus = statusSpan.textContent;
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    statusSpan.textContent = newStatus;
    statusSpan.className = `status-${newStatus}`;
    
    showNotification(`Advertisement status changed to ${newStatus}!`, 'success');
}

// Function to open advertisement Telegram links
function openAdTelegramLink(telegramLink) {
    console.log('Opening advertisement Telegram link:', telegramLink);
    
    if (!telegramLink || telegramLink === 'undefined' || telegramLink === 'null') {
        showNotification('Telegram link not available', 'error');
        return;
    }
    
    // Ensure the link starts with http:// or https://
    if (!telegramLink.startsWith('http://') && !telegramLink.startsWith('https://')) {
        telegramLink = 'https://' + telegramLink;
    }
    
    try {
        // Try to open in new tab
        const newWindow = window.open(telegramLink, '_blank');
        
        if (newWindow) {
            console.log('Advertisement Telegram link opened successfully');
            showNotification('Redirecting to Telegram link!', 'success');
        } else {
            // Fallback: try to redirect in same window
            console.log('Popup blocked, redirecting in same window');
            window.location.href = telegramLink;
            showNotification('Redirecting to Telegram link!', 'success');
        }
    } catch (error) {
        console.error('Error opening advertisement Telegram link:', error);
        showNotification('Failed to open Telegram link', 'error');
    }
}

// Test function for debugging tab switching
function testUploadAdsTab() {
    console.log('=== TESTING UPLOAD ADS TAB ===');
    showAdminTab('advertisements');
    
    // Check if the tab content is visible
    const adTab = document.getElementById('advertisements');
    if (adTab) {
        console.log('Ad tab found:', adTab);
        console.log('Ad tab display style:', adTab.style.display);
        console.log('Ad tab classes:', adTab.className);
        console.log('Ad tab computed display:', window.getComputedStyle(adTab).display);
    } else {
        console.log('Ad tab NOT found!');
    }
    
    // Check if the form is visible
    const adForm = document.getElementById('adUploadForm');
    if (adForm) {
        console.log('Ad form found:', adForm);
        console.log('Ad form parent:', adForm.parentElement);
    } else {
        console.log('Ad form NOT found!');
    }
}

// Make test function available globally
window.testUploadAdsTab = testUploadAdsTab;

// Add CSS animations for notifications and advertisement styling
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .ad-image-clickable {
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        border-radius: 8px;
        cursor: pointer;
    }
    
    .ad-image-clickable:hover {
        transform: scale(1.02);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    .ad-image-clickable:active {
        transform: scale(0.98);
    }
    
    .ad-card {
        border: 1px solid #e0e0e0;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 20px;
        background: white;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transition: box-shadow 0.2s ease;
    }
    
    .ad-card:hover {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }
    
    .ad-actions {
        display: flex;
        gap: 8px;
        margin-top: 16px;
        flex-wrap: wrap;
    }
    
    .ad-actions button {
        padding: 8px 16px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.2s ease;
        display: flex;
        align-items: center;
        gap: 5px;
    }
    
    .edit-btn {
        background-color: #007bff;
        color: white;
    }
    
    .edit-btn:hover {
        background-color: #0056b3;
    }
    
    .delete-btn {
        background-color: #dc3545;
        color: white;
    }
    
    .delete-btn:hover {
        background-color: #c82333;
    }
    
    .toggle-btn {
        background-color: #ffc107;
        color: #000;
    }
    
    .toggle-btn:hover {
        background-color: #e0a800;
    }
    
    .ad-details {
        margin: 12px 0;
        padding: 12px;
        background: #f8f9fa;
        border-radius: 8px;
    }
    
    .ad-details p {
        margin: 8px 0;
        font-size: 14px;
    }
    
    .position-top, .position-sidebar, .position-premium {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: bold;
        text-transform: uppercase;
    }
    
    .position-top {
        background: #28a745;
        color: white;
    }
    
    .position-sidebar {
        background: #17a2b8;
        color: white;
    }
    
    .position-premium {
        background: #ffc107;
        color: #000;
    }
    
    .status-active, .status-inactive {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: bold;
        text-transform: uppercase;
    }
    
    .status-active {
        background: #28a745;
        color: white;
    }
    
    .status-inactive {
        background: #6c757d;
        color: white;
    }
    
    .ads-summary {
        background: #f8f9fa;
        padding: 20px;
        border-radius: 12px;
        margin-bottom: 20px;
        border: 1px solid #e9ecef;
    }
    
    .ads-stats {
        display: flex;
        gap: 20px;
        margin-top: 15px;
        flex-wrap: wrap;
    }
    
    .stat-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        color: #6c757d;
    }
    
    .stat-item i {
        color: #007bff;
        font-size: 16px;
    }
`;
document.head.appendChild(style); 