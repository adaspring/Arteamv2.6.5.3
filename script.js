// script.js - Complete v25 Version with All Updates

// ======================
// Menu Functionality
// ======================
function toggleMenu() {
    const menu = document.getElementById('flyout-menu');
    menu.classList.toggle('open');
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
}

// Close menu when clicking outside
document.addEventListener('click', (event) => {
    const menu = document.getElementById('flyout-menu');
    const hamburger = document.querySelector('.hamburger-menu');
    
    if (menu.classList.contains('open') && 
        !menu.contains(event.target) && 
        !hamburger.contains(event.target)) {
        toggleMenu();
    }
});

// ======================
// Submenu System
// ======================
function initSubmenus() {
    document.querySelectorAll('#flyout-menu > ul > li').forEach(menuItem => {
        const submenu = menuItem.querySelector('.submenu');
        const link = menuItem.querySelector('a');
        
        if (submenu) {
            // Add arrow if missing
            if (!menuItem.querySelector('.submenu-arrow')) {
                const arrow = document.createElement('span');
                arrow.className = 'submenu-arrow';
                arrow.innerHTML = '▼';
                link.appendChild(arrow);
            }
            
            // Toggle submenu on click
            link.addEventListener('click', (e) => {
                e.preventDefault();
                submenu.classList.toggle('active');
                menuItem.querySelector('.submenu-arrow').classList.toggle('rotated');
            });
        } else {
            // Remove arrows from non-submenu items
            const existingArrow = menuItem.querySelector('.submenu-arrow');
            if (existingArrow) existingArrow.remove();
        }
    });
}

// ======================
// Active Page Highlighting
// ======================
function setActivePage() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('#flyout-menu a').forEach(link => {
        const linkPath = link.getAttribute('href');
        link.classList.remove('active');
        
        // Special handling for homepage
        if ((currentPath === 'index.html' && linkPath === '#') ||
            (linkPath === 'index.html' && currentPath === '')) {
            link.classList.add('active');
        }
        // Regular page matching
        else if (linkPath === currentPath) {
            link.classList.add('active');
        }
    });
}

// ======================
// Carousel System
// ======================
function initCarousels() {
    document.querySelectorAll('.carousel-images').forEach(container => {
        const id = container.id.split('-')[1];
        const images = container.querySelectorAll('img');
        
        // Reset active states
        images.forEach(img => img.classList.remove('active'));
        if (images.length > 0) images[0].classList.add('active');

        // Create indicators
        const carouselContainer = container.closest('.carousel-container');
        let indicatorsContainer = carouselContainer.querySelector('.carousel-indicators');
        
        if (!indicatorsContainer) {
            indicatorsContainer = document.createElement('div');
            indicatorsContainer.className = 'carousel-indicators';
            carouselContainer.appendChild(indicatorsContainer);
        }
        
        indicatorsContainer.innerHTML = '';
        
        images.forEach((img, index) => {
            const indicator = document.createElement('div');
            indicator.className = 'indicator';
            if (index === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => goToSlide(id, index));
            indicatorsContainer.appendChild(indicator);
        });
        
        container.dataset.index = 0;
    });
}

function updateCarousel(id, direction) {
    const container = document.getElementById(`items-${id}`);
    const images = Array.from(container.querySelectorAll('img'));
    if (images.length === 0) return;
    
    let currentIndex = parseInt(container.dataset.index || 0);
    images[currentIndex].classList.remove('active');

    const carouselContainer = container.closest('.carousel-container');
    const indicatorsContainer = carouselContainer.querySelector('.carousel-indicators');
    
    // Update indicators
    if (indicatorsContainer) {
        const indicators = Array.from(indicatorsContainer.querySelectorAll('.indicator'));
        if (indicators[currentIndex]) indicators[currentIndex].classList.remove('active');
    }
    
    // Calculate new index
    currentIndex = direction === 'next' 
        ? (currentIndex + 1) % images.length 
        : (currentIndex - 1 + images.length) % images.length;
    
    // Apply changes
    container.dataset.index = currentIndex;
    images[currentIndex].classList.add('active');
    
    if (indicatorsContainer) {
        const indicators = Array.from(indicatorsContainer.querySelectorAll('.indicator'));
        if (indicators[currentIndex]) indicators[currentIndex].classList.add('active');
    }
}

function goToSlide(id, index) {
    const container = document.getElementById(`items-${id}`);
    const images = Array.from(container.querySelectorAll('img'));
    const currentIndex = parseInt(container.dataset.index || 0);
    
    images[currentIndex].classList.remove('active');

    const carouselContainer = container.closest('.carousel-container');
    const indicatorsContainer = carouselContainer.querySelector('.carousel-indicators');
    
    if (indicatorsContainer) {
        const indicators = Array.from(indicatorsContainer.querySelectorAll('.indicator'));
        if (indicators[currentIndex]) indicators[currentIndex].classList.remove('active');
    }
    
    container.dataset.index = index;
    images[index].classList.add('active');
    
    if (indicatorsContainer) {
        const indicators = Array.from(indicatorsContainer.querySelectorAll('.indicator'));
        if (indicators[index]) indicators[index].classList.add('active');
    }
}

// ======================
// Lightbox System
// ======================
let currentLightboxIndex = 0;
let currentLightboxImages = [];

function initLightbox() {
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="close-lightbox">&times;</span>
            <img src="" alt="" class="lightbox-image">
            <div class="lightbox-nav">
                <button class="lightbox-prev" aria-label="Previous image">←</button>
                <button class="lightbox-next" aria-label="Next image">→</button>
            </div>
            <p class="lightbox-caption"></p>
        </div>
    `;
    document.body.appendChild(lightbox);

    // Event listeners
    document.querySelector('.close-lightbox').addEventListener('click', closeLightbox);
    document.querySelector('.lightbox-prev').addEventListener('click', showPrevImage);
    document.querySelector('.lightbox-next').addEventListener('click', showNextImage);
    document.getElementById('lightbox').addEventListener('click', (e) => {
        if (e.target === document.getElementById('lightbox')) {
            closeLightbox();
        }
    });

    // Initialize lightbox triggers
    document.querySelectorAll('.carousel-images img, .grid-item img').forEach(img => {
        img.addEventListener('click', () => openLightbox(img));
    });
}

function openLightbox(imgElement) {
    const lightbox = document.getElementById('lightbox');
    const container = imgElement.closest('.carousel-images, .grid-container');
    currentLightboxImages = Array.from(container.querySelectorAll('img'));
    currentLightboxIndex = currentLightboxImages.indexOf(imgElement);
    
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = '';
}

function updateLightboxImage() {
    const lightboxImg = document.querySelector('.lightbox-image');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const currentImg = currentLightboxImages[currentLightboxIndex];
    
    lightboxImg.src = currentImg.src;
    lightboxImg.alt = currentImg.alt;
    lightboxCaption.textContent = currentImg.alt;
}

function showNextImage() {
    currentLightboxIndex = (currentLightboxIndex + 1) % currentLightboxImages.length;
    updateLightboxImage();
}

function showPrevImage() {
    currentLightboxIndex = (currentLightboxIndex - 1 + currentLightboxImages.length) % currentLightboxImages.length;
    updateLightboxImage();
}

// ======================
// Touch Support
// ======================
function addTouchSupport() {
    document.querySelectorAll('.carousel-images').forEach(carousel => {
        let touchStartX = 0;
        let touchEndX = 0;
        
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe(carousel);
        }, { passive: true });
    });
}

function handleSwipe(carousel) {
    const id = carousel.id.split('-')[1];
    const threshold = 50;
    
    if (touchStartX - touchEndX > threshold) {
        updateCarousel(id, 'next');
    } else if (touchEndX - touchStartX > threshold) {
        updateCarousel(id, 'prev');
    }
}

// ======================
// Utility Functions
// ======================
function initBackToTop() {
    const backToTopButton = document.createElement('a');
    backToTopButton.className = 'back-to-top';
    backToTopButton.innerHTML = '↑';
    backToTopButton.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTopButton);

    window.addEventListener('scroll', () => {
        backToTopButton.classList.toggle('visible', window.pageYOffset > 300);
    });

    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function initLoadingStates() {
    document.querySelectorAll('.carousel-images img, .grid-item img').forEach(img => {
        if (!img.complete) img.style.opacity = '0';
        img.addEventListener('load', () => img.style.opacity = '1');
        if (img.complete) img.style.opacity = '1';
    });
}

// ======================
// Initialization
// ======================
document.addEventListener('DOMContentLoaded', () => {
    initSubmenus();
    setActivePage();
    initCarousels();
    initBackToTop();
    initLightbox();
    addTouchSupport();
    initLoadingStates();
});