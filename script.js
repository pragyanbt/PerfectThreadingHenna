// Mobile Navigation
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    });

    // Close menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu.classList.contains('active') && 
            !hamburger.contains(e.target) && 
            !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Reset menu on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});

// Image Slider
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    let currentSlide = 0;
    const totalSlides = slides.length;

    // Function to show slide
    function showSlide(index) {
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current slide and dot
        if (slides[index]) {
            slides[index].classList.add('active');
        }
        if (dots[index]) {
            dots[index].classList.add('active');
        }
    }

    // Function to go to next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }

    // Function to go to previous slide
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    }

    // Event listeners for buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            prevSlide();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            nextSlide();
        });
    }

    // Event listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function(e) {
            e.preventDefault();
            currentSlide = index;
            showSlide(currentSlide);
        });
    });

    // Auto-slide every 4 seconds
    const autoSlideInterval = setInterval(nextSlide, 4000);

    // Initialize slider
    showSlide(0);
});

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// EmailJS Configuration
(function() {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
})();

// Appointment Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const appointmentForm = document.getElementById('appointmentForm');
    const successModal = document.getElementById('successModal');
    const errorModal = document.getElementById('errorModal');
    const loadingModal = document.getElementById('loadingModal');
    const closeModalBtn = document.querySelector('.close');
    const closeErrorModalBtn = document.querySelector('#errorModal .close');

    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const appointmentData = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                service: formData.get('service'),
                date: formData.get('date'),
                time: formData.get('time'),
                message: formData.get('message')
            };
            
            // Show loading modal
            if (loadingModal) {
                loadingModal.style.display = 'block';
            }
            
            // Send appointment emails
            sendAppointmentEmail(appointmentData);
        });
    }

    // Function to send appointment email
    function sendAppointmentEmail(appointmentData) {
        // EmailJS template parameters for auto-reply to customer
        const templateParams = {
            to_email: EMAILJS_CONFIG.RECIPIENT_EMAIL,
            to: EMAILJS_CONFIG.RECIPIENT_EMAIL,
            recipient: EMAILJS_CONFIG.RECIPIENT_EMAIL,
            email: EMAILJS_CONFIG.RECIPIENT_EMAIL,
            
            // Customer information
            from_name: appointmentData.name,
            name: appointmentData.name,
            from_email: appointmentData.email || 'No email provided',
            email: appointmentData.email || 'No email provided',
            from_phone: appointmentData.phone,
            phone: appointmentData.phone,
            
            // Appointment details
            service: appointmentData.service,
            preferred_date: appointmentData.date,
            date: appointmentData.date,
            preferred_time: appointmentData.time,
            time: appointmentData.time,
            special_requests: appointmentData.message || 'No special requests',
            message: appointmentData.message || 'No special requests',
            
            // Salon information
            salon_name: 'Perfect Threading & Henna',
            salon_address: '1132 Francis St, Longmont, CO',
            salon_phone: '(303) 555-0123'
        };

        // Send auto-reply to customer (using existing template)
        emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, templateParams)
            .then(function(response) {
                console.log('Auto-reply sent successfully!', response.status, response.text);
                
                // Now send appointment notification to salon owner
                sendAppointmentNotification(appointmentData);
            }, function(error) {
                console.log('Auto-reply failed...', error);
                handleAppointmentError(error);
            });
    }

    // Function to send appointment notification to salon owner
    function sendAppointmentNotification(appointmentData) {
        // Template parameters for appointment notification to salon owner
        const notificationParams = {
            name: appointmentData.name,
            email: appointmentData.email || 'No email provided',
            phone: appointmentData.phone,
            service: appointmentData.service,
            date: appointmentData.date,
            time: appointmentData.time,
            message: appointmentData.message || 'No special requests'
        };

        emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.APPOINTMENT_TEMPLATE_ID, notificationParams)
            .then(function(response) {
                console.log('Appointment notification sent successfully!', response.status, response.text);
                completeAppointmentProcess();
            }, function(error) {
                console.log('Appointment notification failed...', error);
                // Even if notification fails, still complete the process since auto-reply worked
                completeAppointmentProcess();
            });
    }

    // Function to complete the appointment process
    function completeAppointmentProcess() {
        // Hide loading modal
        if (loadingModal) {
            loadingModal.style.display = 'none';
        }
        
        // Show success modal
        if (successModal) {
            successModal.style.display = 'block';
        }
        
        // Reset form
        appointmentForm.reset();
        
        // Set minimum date for future appointments
        const dateInput = document.getElementById('date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
            
            // Set default date to tomorrow
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            dateInput.value = tomorrow.toISOString().split('T')[0];
        }
    }

    // Function to handle appointment errors
    function handleAppointmentError(error) {
        // Hide loading modal
        if (loadingModal) {
            loadingModal.style.display = 'none';
        }
        
        // Show error modal
        if (errorModal) {
            document.getElementById('errorMessage').textContent = 
                'There was an error sending your appointment request. Please try again or contact us directly.';
            errorModal.style.display = 'block';
        }
    }

    // Close modal functions
    function closeModal() {
        if (successModal) {
            successModal.style.display = 'none';
        }
    }

    function closeErrorModal() {
        if (errorModal) {
            errorModal.style.display = 'none';
        }
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    if (closeErrorModalBtn) {
        closeErrorModalBtn.addEventListener('click', closeErrorModal);
    }

    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === successModal) {
            closeModal();
        }
        if (e.target === errorModal) {
            closeErrorModal();
        }
    });

    // Make functions global
    window.closeModal = closeModal;
    window.closeErrorModal = closeErrorModal;
    
    // Initialize date input with minimum date and default value
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
        
        // Set default date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.value = tomorrow.toISOString().split('T')[0];
    }
});

// Get Directions Function
function openDirections() {
    const address = '1132 Francis St, Longmont, CO';
    const encodedAddress = encodeURIComponent(address);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(googleMapsUrl, '_blank');
}

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    }
});

// Form validation and enhancement
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const serviceSelect = document.getElementById('service');

    // Phone number formatting
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length >= 6) {
                value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
            } else if (value.length >= 3) {
                value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
            }
            
            e.target.value = value;
        });
    }

    // Email validation
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const email = this.value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (email && !emailRegex.test(email)) {
                this.style.borderColor = '#ff6b6b';
                this.setCustomValidity('Please enter a valid email address');
            } else {
                this.style.borderColor = '#e0e0e0';
                this.setCustomValidity('');
            }
        });
    }

    // Service selection enhancement
    if (serviceSelect) {
        serviceSelect.addEventListener('change', function() {
            if (this.value) {
                this.style.borderColor = '#e91e63';
            } else {
                this.style.borderColor = '#e0e0e0';
            }
        });
    }
});

// Animate elements on scroll
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .about-content, .contact-content');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});
