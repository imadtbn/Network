document.addEventListener('DOMContentLoaded', () => {
    // Handle Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const sidebar = document.querySelector('.sidebar');

    if (mobileMenuToggle && sidebar) {
        mobileMenuToggle.addEventListener('click', () => {
            if (sidebar.style.display === 'flex') {
                sidebar.style.display = 'none';
            } else {
                sidebar.style.display = 'flex';
                sidebar.style.position = 'fixed';
                sidebar.style.width = '250px';
                sidebar.style.height = '100%';
                sidebar.style.zIndex = '999';
                sidebar.style.boxShadow = '2px 0 10px rgba(0,0,0,0.1)';
            }
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth < 1024 &&
                sidebar.style.display === 'flex' &&
                !sidebar.contains(e.target) &&
                !mobileMenuToggle.contains(e.target)) {
                sidebar.style.display = 'none';
            }
        });
    }

    // Handle Window Resize for Sidebar
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024 && sidebar) {
            sidebar.style.display = 'flex';
            sidebar.style.position = 'fixed';
            sidebar.style.boxShadow = 'none';
        } else if (sidebar) {
            sidebar.style.display = 'none';
        }
    });

    // Handle Offline/Online status
    const updateOnlineStatus = () => {
        const offlineBanner = document.getElementById('offline-banner');
        const offlineBadge = document.getElementById('offline-badge');

        if (navigator.onLine) {
            if(offlineBanner) offlineBanner.classList.add('hidden');
            if(offlineBadge) offlineBadge.classList.add('hidden');
        } else {
            if(offlineBanner) offlineBanner.classList.remove('hidden');
            if(offlineBadge) offlineBadge.classList.remove('hidden');
        }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus(); // Initial check

    // Register Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./service-worker.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                })
                .catch(err => {
                    console.error('ServiceWorker registration failed: ', err);
                });
        });
    }

    // PWA Install Prompt Logic
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;

        // Find a place to show install button if desired, e.g., in sidebar or header
        // For now, we can log it or dispatch an event that settings.js could pick up.
        window.dispatchEvent(new CustomEvent('pwaInstallAvailable'));
    });

    window.installPWA = () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                }
                deferredPrompt = null;
            });
        }
    };
});
