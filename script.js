// Variable declarations
let modal, impressumModal, faqModal, code, termsToggle, termsText;

// Performance optimization
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');
    
    // Get DOM elements after DOM is loaded
    modal = document.getElementById('terms-modal');
    impressumModal = document.getElementById('impressum-modal');
    faqModal = document.getElementById('faq-modal');
    code = document.getElementById('code');
    termsToggle = document.getElementById('terms-toggle');
    termsText = document.querySelector('.terms-text');
    
    console.log('FAQ Modal element:', faqModal);
    
    // Add direct event listener to FAQ button
    const faqBtn = document.querySelector('.faq-link-section .link-btn');
    if (faqBtn) {
        console.log('Found FAQ button, adding additional listener');
        faqBtn.addEventListener('click', function(event) {
            console.log('FAQ button clicked via event listener');
            showFaq();
        });
    } else {
        console.error('FAQ button not found in DOM');
    }
    
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
    if (copyBtn) {
        copyBtn.classList.add('disabled');
        copyBtn.setAttribute('aria-disabled', 'true');
    }

    // Add structured data for mobile app (if needed)
    addMobileAppStructuredData();
});

// Toggle code blur based on checkbox state
function toggleCode() {
    if (!termsToggle || !code) return;
    
    const isBlurred = !termsToggle.checked;
    code.classList.toggle('blurred', isBlurred);
    
    // Toggle copy button state
    const copyBtn = document.querySelector('.copy-btn');
    if (!copyBtn) return;
    
    if (isBlurred) {
        copyBtn.classList.add('disabled');
        copyBtn.setAttribute('aria-disabled', 'true');
    } else {
        copyBtn.classList.remove('disabled');
        copyBtn.setAttribute('aria-disabled', 'false');
    }
}

// Add mobile app structured data
function addMobileAppStructuredData() {
    const appData = {
        "@context": "https://schema.org",
        "@type": "MobileApplication",
        "name": "fraenk App",
        "operatingSystem": "Android, iOS",
        "applicationCategory": "UtilitiesApplication",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "EUR"
        },
        "description": "Die fraenk App - der einfache Mobilfunktarif der Telekom mit +3GB extra Datenvolumen."
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(appData);
    document.head.appendChild(script);
}

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
    if (!modal) return;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    trackUserInteraction('terms_viewed');
}

// Hide terms modal
function hideTerms() {
    if (!modal) return;
    
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

// Show FAQ modal
function showFaq() {
    console.log('showFaq called, faqModal:', faqModal);
    
    if (!faqModal) {
        console.error('FAQ modal element not found!');
        // Try to get it again in case it was loaded after initial DOM ready
        faqModal = document.getElementById('faq-modal');
        console.log('Re-trying to get faqModal:', faqModal);
    }
    
    if (faqModal) {
        faqModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        trackUserInteraction('faq_viewed');
    }
}

// Hide FAQ modal
function hideFaq() {
    if (!faqModal) return;
    
    faqModal.style.display = 'none';
    document.body.style.overflow = '';
}

// Copy code to clipboard
function copyCode() {
    if (!code) return;
    
    if (!code.classList.contains('blurred')) {
        navigator.clipboard.writeText(code.textContent)
            .then(() => {
                const copyBtn = document.querySelector('.copy-btn');
                if (!copyBtn) return;
                
                copyBtn.classList.add('copied');
                trackUserInteraction('code_copied');
                
                // Announce for screen readers
                const announcement = document.createElement('div');
                announcement.setAttribute('aria-live', 'polite');
                announcement.className = 'sr-only';
                document.body.appendChild(announcement);
                
                // Remove the class after animation
                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    document.body.removeChild(announcement);
                }, 1500);
            })
            .catch(err => {
                console.error('Failed to copy code:', err);
            });
    }
}

// Show impressum modal
function showImpressum() {
    if (!impressumModal) return;
    
    impressumModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    trackUserInteraction('impressum_viewed');
}

// Hide impressum modal
function hideImpressum() {
    if (!impressumModal) return;
    
    impressumModal.style.display = 'none';
    document.body.style.overflow = '';
}

// Update window click handler for all modals
window.onclick = function(event) {
    if (!modal || !impressumModal || !faqModal) return;
    
    if (event.target === modal) {
        hideTerms();
    } else if (event.target === impressumModal) {
        hideImpressum();
    } else if (event.target === faqModal) {
        hideFaq();
    }
}

// Update escape key handler for all modals
document.addEventListener('keydown', function(event) {
    if (!modal || !impressumModal || !faqModal) return;
    
    if (event.key === 'Escape') {
        if (modal.style.display === 'block') {
            hideTerms();
        } else if (impressumModal.style.display === 'block') {
            hideImpressum();
        } else if (faqModal.style.display === 'block') {
            hideFaq();
        }
    }
}); 