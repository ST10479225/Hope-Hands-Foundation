// script.js - JavaScript functionality for Hope Hands Foundation

document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

function initializeWebsite() {
    initializeAccordion();
    initializeForms();
    initializeGallery();
    initializeMap();
}

function initializeAccordion() {
    const accordionButtons = document.querySelectorAll('.accordion-button');
    
    accordionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const isActive = content.classList.contains('active');
            
            document.querySelectorAll('.accordion-content').forEach(item => {
                item.classList.remove('active');
            });
            
            if (!isActive) {
                content.classList.add('active');
                content.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    });
}

function initializeForms() {
    const enquiryForm = document.getElementById('enquiryForm');
    const contactForm = document.getElementById('contactForm');
    
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', handleEnquirySubmit);
        addRealTimeValidation(enquiryForm);
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
        addRealTimeValidation(contactForm);
    }
}

function addRealTimeValidation(form) {
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateField(field) {
    const errorElement = document.getElementById(`${field.id}Error`);
    
    if (!errorElement) return true;
    
    errorElement.textContent = '';
    
    if (field.hasAttribute('required') && !field.value.trim()) {
        errorElement.textContent = 'This field is required';
        field.style.borderColor = '#e74c3c';
        return false;
    }
    
    if (field.type === 'email' && field.value && !isValidEmail(field.value)) {
        errorElement.textContent = 'Please enter a valid email address';
        field.style.borderColor = '#e74c3c';
        return false;
    }
    
    if (field.type === 'tel' && field.value && !isValidPhone(field.value)) {
        errorElement.textContent = 'Please enter a valid 10-digit phone number';
        field.style.borderColor = '#e74c3c';
        return false;
    }
    
    if (field.hasAttribute('minlength') && field.value.length < parseInt(field.getAttribute('minlength'))) {
        errorElement.textContent = `Must be at least ${field.getAttribute('minlength')} characters`;
        field.style.borderColor = '#e74c3c';
        return false;
    }
    
    field.style.borderColor = '#27ae60';
    return true;
}

function clearFieldError(field) {
    const errorElement = document.getElementById(`${field.id}Error`);
    if (errorElement) {
        errorElement.textContent = '';
    }
    field.style.borderColor = '#ddd';
}

function handleEnquirySubmit(e) {
    e.preventDefault();
    
    if (validateForm(this)) {
        const formData = new FormData(this);
        const enquiryData = {
            type: formData.get('enquiryType'),
            name: formData.get('fullName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            message: formData.get('message'),
            timestamp: new Date().toISOString()
        };
        
        showLoadingState(this.querySelector('button[type="submit"]'));
        
        setTimeout(() => {
            showEnquiryResponse(enquiryData);
            
            this.reset();
            
            
            resetFormStyles(this);
            
            
            hideLoadingState(this.querySelector('button[type="submit"]'));
        }, 1500);
    }
}

function handleContactSubmit(e) {
    e.preventDefault();
    
    if (validateForm(this)) {
        
        const formData = new FormData(this);
        const contactData = {
            name: formData.get('contactName'),
            email: formData.get('contactEmail'),
            subject: formData.get('subject'),
            message: formData.get('contactMessage'),
            timestamp: new Date().toISOString()
        };
        
        
        showLoadingState(this.querySelector('button[type="submit"]'));
        
        
        setTimeout(() => {
            
            document.getElementById('contactResponse').classList.remove('hidden');
            this.classList.add('hidden');
            
            
            document.getElementById('sendAnother').addEventListener('click', function() {
                document.getElementById('contactResponse').classList.add('hidden');
                document.getElementById('contactForm').classList.remove('hidden');
                document.getElementById('contactForm').reset();
                resetFormStyles(document.getElementById('contactForm'));
            });
            
           
            hideLoadingState(document.querySelector('#contactForm button[type="submit"]'));
            
            
            console.log('Contact form submitted:', contactData);
            
            
            showConfirmationAnimation();
        }, 1500);
    }
}


function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input, select, textarea');
    
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}


function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


function isValidPhone(phone) {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
}


function showLoadingState(button) {
    const originalText = button.textContent;
    button.innerHTML = '<span class="loading-spinner"></span> Processing...';
    button.disabled = true;
    button.dataset.originalText = originalText;
}

function hideLoadingState(button) {
    if (button && button.dataset.originalText) {
        button.textContent = button.dataset.originalText;
        button.disabled = false;
    }
}


function resetFormStyles(form) {
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.style.borderColor = '#ddd';
    });
}


function showEnquiryResponse(data) {
    const responseElement = document.getElementById('responseMessage');
    const summaryElement = document.getElementById('enquirySummary');
    
    
    let summaryHTML = `
        <div class="enquiry-details">
            <p><strong>Enquiry Type:</strong> ${getEnquiryTypeLabel(data.type)}</p>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
    `;
    
    if (data.phone) {
        summaryHTML += `<p><strong>Phone:</strong> ${formatPhoneNumber(data.phone)}</p>`;
    }
    
    summaryHTML += `
            <p><strong>Message:</strong></p>
            <div class="message-content">${data.message}</div>
            <p class="timestamp"><small>Submitted on: ${new Date(data.timestamp).toLocaleString()}</small></p>
        </div>
    `;
    
    summaryElement.innerHTML = summaryHTML;
    responseElement.classList.remove('hidden');
    
    
    responseElement.style.animation = 'fadeInUp 0.5s ease-out';
    
    
    responseElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    
    console.log('Enquiry form submitted:', data);
}


function getEnquiryTypeLabel(type) {
    const types = {
        'service': 'Service Information',
        'volunteer': 'Volunteering Opportunity',
        'sponsor': 'Sponsorship Inquiry',
        'other': 'Other Inquiry'
    };
    
    return types[type] || type;
}


function formatPhoneNumber(phone) {
    
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
}


function initializeGallery() {
    const galleryImages = document.querySelectorAll('.gallery img');
    
    if (galleryImages.length > 0) {
        createLightbox();
        setupGalleryEvents();
    }
}

function createLightbox() {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
        <img class="lightbox-content" src="" alt="">
        <button class="lightbox-nav lightbox-prev" aria-label="Previous image">&#10094;</button>
        <button class="lightbox-nav lightbox-next" aria-label="Next image">&#10095;</button>
    `;
    document.body.appendChild(lightbox);
}

function setupGalleryEvents() {
    const galleryImages = document.querySelectorAll('.gallery img');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-content');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    
    let currentImageIndex = 0;
    const imagesArray = Array.from(galleryImages);
    
    
    galleryImages.forEach((img, index) => {
        img.addEventListener('click', function() {
            currentImageIndex = index;
            updateLightboxImage();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; 
        });
    });
    
    
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                navigateLightbox(-1);
                break;
            case 'ArrowRight':
                navigateLightbox(1);
                break;
        }
    });
    
    
    lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    lightboxNext.addEventListener('click', () => navigateLightbox(1));
    
    function updateLightboxImage() {
        const img = imagesArray[currentImageIndex];
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
    }
    
    function navigateLightbox(direction) {
        currentImageIndex += direction;
        
        if (currentImageIndex < 0) {
            currentImageIndex = imagesArray.length - 1;
        } else if (currentImageIndex >= imagesArray.length) {
            currentImageIndex = 0;
        }
        
        updateLightboxImage();
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; 
    }
}


function initializeMap() {
    const mapElement = document.getElementById('map');
    
    if (mapElement) {
        
        mapElement.innerHTML = `
            <div class="map-placeholder">
                <div class="map-marker">
                    <i class="marker-icon"></i>
                </div>
                <div class="map-info">
                    <h3>Our Location</h3>
                    <p>123 Hope Street</p>
                    <p>Johannesburg, 2000</p>
                    <p>South Africa</p>
                </div>
            </div>
        `;
        
        
        const style = document.createElement('style');
        style.textContent = `
            .map-placeholder {
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                background: linear-gradient(135deg, #e3f2fd, #bbdefb);
                border-radius: 8px;
                position: relative;
                color: #2c3e50;
            }
            .marker-icon {
                font-size: 3rem;
                margin-bottom: 1rem;
            }
            .map-info {
                text-align: center;
            }
            .map-info h3 {
                margin-bottom: 0.5rem;
                color: #2c3e50;
            }
        `;
        document.head.appendChild(style);
    }
}


function showConfirmationAnimation() {
    const confirmation = document.createElement('div');
    confirmation.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #27ae60;
        color: white;
        padding: 1rem 2rem;
        border-radius: 50px;
        box-shadow: 0 4px 15px rgba(39, 174, 96, 0.3);
        z-index: 1001;
        font-weight: bold;
        animation: bounceIn 0.5s ease-out;
    `;
    confirmation.textContent = '✓ Message Sent Successfully!';
    
    document.body.appendChild(confirmation);
    
    setTimeout(() => {
        confirmation.style.animation = 'fadeOut 0.5s ease-in';
        setTimeout(() => {
            document.body.removeChild(confirmation);
        }, 500);
    }, 2000);
}


const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes bounceIn {
        0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.3);
        }
        50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.05);
        }
        70% {
            transform: translate(-50%, -50%) scale(0.9);
        }
        100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
    
    .loading-spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid #ffffff;
        border-radius: 50%;
        border-top-color: transparent;
        animation: spin 1s ease-in-out infinite;
        margin-right: 8px;
    }
    
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
    
    .enquiry-details {
        background: white;
        padding: 1.5rem;
        border-radius: 8px;
        border-left: 4px solid #3498db;
    }
    
    .message-content {
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 4px;
        margin: 0.5rem 0;
        font-style: italic;
    }
    
    .timestamp {
        text-align: right;
        color: #6c757d;
        margin-top: 1rem;
    }
    
    .lightbox-nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255,255,255,0.2);
        color: white;
        border: none;
        font-size: 2rem;
        padding: 1rem;
        cursor: pointer;
        transition: background-color 0.3s;
    }
    
    .lightbox-nav:hover {
        background: rgba(255,255,255,0.4);
    }
    
    .lightbox-prev {
        left: 20px;
    }
    
    .lightbox-next {
        right: 20px;
    }
`;
document.head.appendChild(style);


window.HopeHands = {
    initializeWebsite,
    validateForm,
    isValidEmail,
    isValidPhone
};

function initializeSearchFilter() {
    const contentGrid = document.getElementById('contentGrid');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortBy = document.getElementById('sortBy');
    const resetFilters = document.getElementById('resetFilters');
    
    if (!contentGrid) return;

    
    const contentData = [
        {
            id: 1,
            title: "Food Distribution Program",
            description: "Weekly food distribution to homeless individuals and families across Johannesburg communities.",
            category: "programs",
            date: "2023-11-01",
            tags: ["food", "outreach", "community"],
            impact: "Serves 500+ people weekly"
        },
        {
            id: 2,
            title: "Emergency Shelter Services",
            description: "24/7 emergency shelter providing safe accommodation for homeless individuals.",
            category: "services",
            date: "2023-10-15",
            tags: ["shelter", "emergency", "safety"],
            impact: "80 beds available nightly"
        },
        {
            id: 3,
            title: "Job Training Workshops",
            description: "Skills development programs to help individuals gain employment and financial independence.",
            category: "programs",
            date: "2023-11-10",
            tags: ["training", "employment", "skills"],
            impact: "200+ people trained annually"
        },
        {
            id: 4,
            title: "Meet Our Team",
            description: "Dedicated staff and volunteers working tirelessly to support our community.",
            category: "team",
            date: "2023-09-20",
            tags: ["staff", "volunteers", "leadership"],
            impact: "50+ team members"
        },
        {
            id: 5,
            title: "Community Partnerships",
            description: "Collaborating with local businesses and organizations to expand our reach.",
            category: "partners",
            date: "2023-10-05",
            tags: ["partnerships", "collaboration", "network"],
            impact: "15+ partner organizations"
        },
        {
            id: 6,
            title: "Success Stories",
            description: "Inspiring stories of individuals who have transformed their lives through our programs.",
            category: "impact",
            date: "2023-11-05",
            tags: ["stories", "impact", "transformation"],
            impact: "1000+ lives changed"
        },
        {
            id: 7,
            title: "Medical Care Outreach",
            description: "Basic medical services and health checks for homeless individuals.",
            category: "services",
            date: "2023-10-25",
            tags: ["health", "medical", "care"],
            impact: "300+ medical consultations monthly"
        },
        {
            id: 8,
            title: "Youth Development Program",
            description: "Specialized programs for homeless youth including education and mentorship.",
            category: "programs",
            date: "2023-09-30",
            tags: ["youth", "education", "mentorship"],
            impact: "150+ youth served"
        }
    ];

    
    renderContent(contentData);

    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    categoryFilter.addEventListener('change', filterContent);
    sortBy.addEventListener('change', sortContent);
    resetFilters.addEventListener('click', resetAllFilters);

    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        filterContent();
    }

    function filterContent() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const category = categoryFilter.value;
        const sortValue = sortBy.value;

        let filteredData = contentData.filter(item => {
            const matchesSearch = !searchTerm || 
                item.title.toLowerCase().includes(searchTerm) ||
                item.description.toLowerCase().includes(searchTerm) ||
                item.tags.some(tag => tag.toLowerCase().includes(searchTerm));
            
            const matchesCategory = category === 'all' || item.category === category;
            
            return matchesSearch && matchesCategory;
        });

        
        filteredData = sortData(filteredData, sortValue);

        renderContent(filteredData);
        updateResultsCount(filteredData.length, contentData.length);
    }

    function sortContent() {
        filterContent(); 
    }

    function sortData(data, sortValue) {
        return [...data].sort((a, b) => {
            switch (sortValue) {
                case 'name':
                    return a.title.localeCompare(b.title);
                case 'name-desc':
                    return b.title.localeCompare(a.title);
                case 'date':
                    return new Date(b.date) - new Date(a.date);
                case 'date-oldest':
                    return new Date(a.date) - new Date(b.date);
                case 'relevance':
                    // Simple relevance based on search term
                    const searchTerm = searchInput.value.toLowerCase().trim();
                    if (!searchTerm) return 0;
                    
                    const aRelevance = calculateRelevance(a, searchTerm);
                    const bRelevance = calculateRelevance(b, searchTerm);
                    return bRelevance - aRelevance;
                default:
                    return 0;
            }
        });
    }

    function calculateRelevance(item, searchTerm) {
        let relevance = 0;
        
        if (item.title.toLowerCase().includes(searchTerm)) relevance += 3;
        if (item.description.toLowerCase().includes(searchTerm)) relevance += 2;
        if (item.tags.some(tag => tag.toLowerCase().includes(searchTerm))) relevance += 1;
        
        return relevance;
    }

    function renderContent(data) {
        contentGrid.innerHTML = data.map(item => `
            <div class="content-item" data-category="${item.category}">
                <span class="content-category">${formatCategory(item.category)}</span>
                <h3 class="content-title">${item.title}</h3>
                <p class="content-description">${item.description}</p>
                <div class="content-tags">
                    ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="content-meta">
                    <span class="content-date">${formatDate(item.date)}</span>
                    <span class="content-impact">${item.impact}</span>
                </div>
            </div>
        `).join('');
    }

    function formatCategory(category) {
        const categories = {
            programs: 'Program',
            services: 'Service',
            impact: 'Impact Story',
            team: 'Our Team',
            partners: 'Partner'
        };
        return categories[category] || category;
    }

    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    function updateResultsCount(shown, total) {
        const resultsElement = document.getElementById('resultsCount');
        if (resultsElement) {
            if (shown === total) {
                resultsElement.textContent = `Showing all ${total} items`;
            } else {
                resultsElement.textContent = `Showing ${shown} of ${total} items`;
            }
        }
    }

    function resetAllFilters() {
        searchInput.value = '';
        categoryFilter.value = 'all';
        sortBy.value = 'name';
        renderContent(contentData);
        updateResultsCount(contentData.length, contentData.length);
    }

   
    updateResultsCount(contentData.length, contentData.length);
}


document.addEventListener('DOMContentLoaded', function() {
    initializeSearchFilter();
});