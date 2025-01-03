// Get DOM elements
const modal = document.getElementById('terms-modal');
const impressumModal = document.getElementById('impressum-modal');
const code = document.getElementById('code');
const termsToggle = document.getElementById('terms-toggle');
const termsText = document.querySelector('.terms-text');

// Load terms content
fetch('Teilnahmebedingungen.txt')
    .then(response => response.text())
    .then(text => {
        termsText.textContent = text;
    })
    .catch(error => {
        console.error('Error loading terms:', error);
        termsText.textContent = 'Error loading terms. Please try again later.';
    });

// Toggle code blur based on checkbox state
function toggleCode() {
    const isBlurred = !termsToggle.checked;
    code.classList.toggle('blurred', isBlurred);
    
    // Toggle copy button state
    const copyBtn = document.querySelector('.copy-btn');
    if (isBlurred) {
        copyBtn.classList.add('disabled');
    } else {
        copyBtn.classList.remove('disabled');
    }
}

// Performance optimization
document.addEventListener('DOMContentLoaded', function() {
    // Preload terms content
    const termsLink = document.querySelector('a[href*="Teilnahmebedingungen"]');
    if (termsLink) {
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'fetch';
        preloadLink.href = 'Teilnahmebedingungen.txt';
        document.head.appendChild(preloadLink);
    }

    // Initialize copy button state
    const copyBtn = document.querySelector('.copy-btn');
    copyBtn.classList.add('disabled');
});

// Track important user interactions
function trackUserInteraction(action) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': 'User Interaction',
            'event_label': 'fraenk code'
        });
    }
}

// Show terms modal
function showTerms() {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    trackUserInteraction('terms_viewed');
}

// Hide terms modal
function hideTerms() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

// Copy code to clipboard
function copyCode() {
    if (!code.classList.contains('blurred')) {
        navigator.clipboard.writeText(code.textContent)
            .then(() => {
                const copyBtn = document.querySelector('.copy-btn');
                copyBtn.classList.add('copied');
                trackUserInteraction('code_copied');
                
                // Remove the class after animation
                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                }, 1500);
            })
            .catch(err => {
                console.error('Failed to copy code:', err);
            });
    }
}

// Show impressum modal
function showImpressum() {
    impressumModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    trackUserInteraction('impressum_viewed');
}

// Hide impressum modal
function hideImpressum() {
    impressumModal.style.display = 'none';
    document.body.style.overflow = '';
}

// Update window click handler for both modals
window.onclick = function(event) {
    if (event.target === modal) {
        hideTerms();
    } else if (event.target === impressumModal) {
        hideImpressum();
    }
}

// Update escape key handler for both modals
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        if (modal.style.display === 'block') {
            hideTerms();
        } else if (impressumModal.style.display === 'block') {
            hideImpressum();
        }
    }
}); 