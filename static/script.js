document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('applyModal');
    const applyBtns = document.querySelectorAll('.open-modal-btn');
    const closeBtn = document.querySelector('.close-modal');

    applyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'flex';
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // --- Mobile Hamburger Menu ---
    const hamburger = document.getElementById('hamburger-menu');
    const mobileMenu = document.getElementById('mobile-menu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.remove('active');
            }
        });
    }

    // --- AJAX Form Submission with Animation ---
    const forms = document.querySelectorAll('form[action="/submit"]');
    const successAnimModal = document.getElementById('successAnimModal');
    const closeSuccessAnimBtn = document.getElementById('closeSuccessAnim');

    if (closeSuccessAnimBtn && successAnimModal) {
        closeSuccessAnimBtn.addEventListener('click', () => {
             successAnimModal.style.display = 'none';
        });

        // Close when clicking outside of success modal
        window.addEventListener('click', (e) => {
            if (e.target === successAnimModal) {
                successAnimModal.style.display = 'none';
            }
        });
    }

    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // Stop standard redirect
            const formData = new FormData(form);
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            try {
                // Submit to our own Python backend silently
                const response = await fetch('/submit', {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    form.reset();
                    // Close standard modal if we were in one
                    if (modal && modal.style.display !== 'none') {
                        modal.style.display = 'none';
                    }
                    // Show success checkmark animation
                    if (successAnimModal) {
                        successAnimModal.style.display = 'flex';
                    }
                } else {
                    alert('There was a problem sending the application. Please try again later.');
                }
            } catch (error) {
                console.error('Submission error:', error);
                alert('Connection error. Please check your internet connection and try again.');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    });
});
