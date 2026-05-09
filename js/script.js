// ============================================
// THEME TOGGLE WITH ACCESSIBILITY
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  const themeToggles = [
    document.getElementById('theme-toggle-desktop'),
    document.getElementById('theme-toggle')
  ].filter(Boolean);
  
  const themeIconClass = {
    dark: 'fas fa-sun',
    light: 'fas fa-moon'
  };
  
  const themeTextValue = {
    dark: 'Light Mode',
    light: 'Dark Mode'
  };
  
  // Get saved theme or default to dark
  let savedTheme = localStorage.getItem('theme') || 'dark';
  document.body.className = savedTheme;
  updateThemeUI(savedTheme);
  
  // Add event listeners to all theme toggles
  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      let currentTheme = document.body.className;
      let newTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.body.className = newTheme;
      localStorage.setItem('theme', newTheme);
      updateThemeUI(newTheme);
      
      // Announce theme change to screen readers
      announceToScreenReader(`${newTheme === 'dark' ? 'Dark' : 'Light'} mode activated`);
    });
    
    // Keyboard support
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle.click();
      }
    });
  });
  
  function updateThemeUI(theme) {
    themeToggles.forEach(toggle => {
      const icon = toggle.querySelector('i');
      const text = toggle.querySelector('span');
      if (icon) icon.className = themeIconClass[theme];
      if (text) text.textContent = themeTextValue[theme];
      toggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    });
  }
});

// ============================================
// ACCESSIBILITY UTILITIES
// ============================================

// Announce messages to screen readers
function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.className = 'visually-hidden';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// Move dark mode toggle into nav menu in mobile
function moveThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const mobileLi = document.getElementById('theme-toggle-mobile-li');
  if (window.innerWidth <= 768) {
    if (themeToggle && mobileLi && !mobileLi.contains(themeToggle)) {
      mobileLi.appendChild(themeToggle);
    }
  } else {
    // Move back outside nav-links if needed
    const nav = document.querySelector('nav');
    if (themeToggle && nav && !nav.contains(themeToggle)) {
      nav.appendChild(themeToggle);
    }
  }
}
window.addEventListener('resize', moveThemeToggle);
document.addEventListener('DOMContentLoaded', moveThemeToggle);

// ============================================
// SMOOTH SCROLL WITH FOCUS MANAGEMENT
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const target = document.querySelector(targetId);
    
    if (target) {
      // Smooth scroll
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      
      // Set focus to target for keyboard users
      setTimeout(() => {
        // Make target focusable if it isn't already
        if (!target.hasAttribute('tabindex')) {
          target.setAttribute('tabindex', '-1');
        }
        target.focus();
        
        // Update URL without jumping
        if (targetId !== '#') {
          history.pushState(null, null, targetId);
        }
      }, 600);
    }
  });
});

// ============================================
// HEADER SCROLL EFFECT
// ============================================
let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  // Add scrolled class for styling
  if (currentScroll > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  
  lastScroll = currentScroll;
});

// ============================================
// SCROLL ANIMATIONS
// ============================================
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
      
      // Announce section to screen readers
      const heading = entry.target.querySelector('h2');
      if (heading) {
        announceToScreenReader(`Entering ${heading.textContent} section`);
      }
    }
  });
}, observerOptions);

// Observe sections
document.querySelectorAll('.section').forEach(section => {
  observer.observe(section);
});

// Initialize EmailJS
emailjs.init("Ix1CdmtwL6WK8WfAF"); // Reemplaza con tu public key de EmailJS


// --- CAPTCHA Initialization ---
function loadCaptcha() {
  if (window.grecaptcha) {
    grecaptcha.render('captcha-container', {
      'sitekey': '6Lel-CErAAAAAA41QSfwuAB2pjHCusfi5nq126qm' // Demo key, replace with your own for production
    });
  }
}

if (document.getElementById('captcha-container')) {
  const script = document.createElement('script');
  script.src = 'https://www.google.com/recaptcha/api.js?onload=loadCaptcha&render=explicit';
  script.async = true;
  script.defer = true;
  document.body.appendChild(script);
}

// --- Toast Notification Utility ---
function showToast(message, type = 'success') {
  const toastContainer = document.getElementById('toast-container');
  if (!toastContainer) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-20px)';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// ============================================
// FORM VALIDATION & SUBMISSION
// ============================================
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  // Real-time validation
  const inputs = contactForm.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', function() {
      validateField(this);
    });
    
    input.addEventListener('input', function() {
      if (this.classList.contains('error')) {
        validateField(this);
      }
    });
  });
  
  function validateField(field) {
    const isValid = field.checkValidity();
    
    if (!isValid) {
      field.classList.add('error');
      field.setAttribute('aria-invalid', 'true');
    } else {
      field.classList.remove('error');
      field.setAttribute('aria-invalid', 'false');
    }
    
    return isValid;
  }
  
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all fields
    let isFormValid = true;
    inputs.forEach(input => {
      if (!validateField(input)) {
        isFormValid = false;
      }
    });
    
    if (!isFormValid) {
      showToast('Please fill in all required fields correctly.', 'error');
      const firstError = contactForm.querySelector('[aria-invalid="true"]');
      if (firstError) firstError.focus();
      return;
    }

    // CAPTCHA validation
    const captchaResponse = window.grecaptcha ? grecaptcha.getResponse() : '';
    if (!captchaResponse) {
      showToast('Please complete the CAPTCHA verification.', 'error');
      return;
    }

    // Consent validation
    const consentChecked = document.getElementById('consent').checked;
    if (!consentChecked) {
      showToast('You must consent to data processing to continue.', 'error');
      document.getElementById('consent').focus();
      return;
    }

    // Get form data and sanitize
    const formData = new FormData(contactForm);
    const sanitize = str => (str || '').replace(/[<>"'%;()&+]/g, '');
    const data = {
      from_name: sanitize(formData.get('name')),
      from_email: sanitize(formData.get('email')),
      from_phone: sanitize(formData.get('phone')),
      message: sanitize(formData.get('message'))
    };

    try {
      // Show loading state
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      submitButton.textContent = 'Sending...';
      submitButton.disabled = true;
      submitButton.setAttribute('aria-busy', 'true');

      // Send email using EmailJS
      await emailjs.send('AlejandroPiPortfolio', 'template_vnt432a', data);
      
      // Show success message
      showToast('Thank you for your message! I will get back to you soon.', 'success');
      contactForm.reset();
      if (window.grecaptcha) grecaptcha.reset();
      
      // Clear validation states
      inputs.forEach(input => {
        input.classList.remove('error');
        input.removeAttribute('aria-invalid');
      });
    } catch (error) {
      console.error('Error sending message:', error);
      showToast('Sorry, there was an error sending the message. Please try again.', 'error');
    } finally {
      // Reset button state
      const submitButton = contactForm.querySelector('button[type="submit"]');
      submitButton.textContent = 'Send Message';
      submitButton.disabled = false;
      submitButton.removeAttribute('aria-busy');
    }
  });
}

// ============================================
// HAMBURGER MENU WITH ACCESSIBILITY
// ============================================
const hamburger = document.getElementById('hamburger-menu');
const navLinks = document.getElementById('main-nav');

if (hamburger && navLinks) {
  // Toggle menu
  hamburger.addEventListener('click', function() {
    const isOpen = navLinks.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isOpen);
    
    // Trap focus in menu when open
    if (isOpen) {
      const firstLink = navLinks.querySelector('a, button');
      if (firstLink) {
        setTimeout(() => firstLink.focus(), 100);
      }
    }
  });
  
  // Keyboard support for hamburger
  hamburger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      hamburger.click();
    }
  });

  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (window.innerWidth <= 1490 && navLinks.classList.contains('active')) {
      const isClickInsideMenu = navLinks.contains(e.target);
      const isClickInsideHamburger = hamburger.contains(e.target);
      
      if (!isClickInsideMenu && !isClickInsideHamburger) {
        navLinks.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    }
  });
  
  // Close menu with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.focus();
    }
  });

  // Close menu when clicking on links
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function() {
      if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

// Add animation classes to elements
document.addEventListener('DOMContentLoaded', () => {
  // Add animation classes to project cards
  document.querySelectorAll('.project-card').forEach((card, index) => {
    card.style.animationDelay = `${index * 0.2}s`;
    card.classList.add('fade-in');
  });
  
  // Add animation classes to skill categories
  document.querySelectorAll('.skill-category').forEach((category, index) => {
    category.style.animationDelay = `${index * 0.2}s`;
    category.classList.add('fade-in');
  });
  
  // Add animation classes to contact items
  document.querySelectorAll('.contact-item').forEach((item, index) => {
    item.style.animationDelay = `${index * 0.2}s`;
    item.classList.add('fade-in');
  });
});

// Matrix Effect
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Initial resize
resizeCanvas();

// ============================================
// ACCESSIBLE CAROUSEL WITH DOT INDICATORS
// ============================================
function setupCarousel(carousel) {
  const track = carousel.querySelector('.carousel-track');
  const slides = carousel.querySelectorAll('.carousel-slide');
  const prevBtn = carousel.querySelector('.prev-btn');
  const nextBtn = carousel.querySelector('.next-btn');
  if (!track || slides.length === 0) return;

  let currentSlide = 0;
  let slideWidth = slides[0].offsetWidth;
  let autoScrollInterval;

  function updateCarousel(announce = false) {
    track.style.transform = `translateX(-${currentSlide * slideWidth}px)`;

    // Update ARIA attributes
    slides.forEach((slide, index) => {
      slide.setAttribute('aria-hidden', index !== currentSlide);
    });

    // Announce to screen readers
    if (announce) {
      const projectName = slides[currentSlide].querySelector('h3')?.textContent || '';
      announceToScreenReader(`Showing project ${currentSlide + 1} of ${slides.length}: ${projectName}`);
    }

    // Update button states
    if (prevBtn) {
      prevBtn.setAttribute('aria-label', `Previous project (${currentSlide + 1} of ${slides.length})`);
    }
    if (nextBtn) {
      nextBtn.setAttribute('aria-label', `Next project (${currentSlide + 1} of ${slides.length})`);
    }
  }

  function nextSlide(announce = true) {
    currentSlide = (currentSlide + 1) % slides.length;
    updateCarousel(announce);
  }

  function prevSlide(announce = true) {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateCarousel(announce);
  }

  // Button event listeners
  if (prevBtn) {
    prevBtn.addEventListener('click', () => prevSlide(true));

    // Keyboard support
    prevBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        prevSlide(true);
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => nextSlide(true));

    // Keyboard support
    nextBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        nextSlide(true);
      }
    });
  }

  // Auto-scroll every 5 seconds
  function startAutoScroll() {
    autoScrollInterval = setInterval(() => nextSlide(false), 5000);
  }

  function stopAutoScroll() {
    clearInterval(autoScrollInterval);
  }

  startAutoScroll();

  // Pause auto-scroll on hover or focus
  carousel.addEventListener('mouseenter', stopAutoScroll);
  carousel.addEventListener('mouseleave', startAutoScroll);
  carousel.addEventListener('focusin', stopAutoScroll);
  carousel.addEventListener('focusout', startAutoScroll);

  // Keyboard navigation (left/right arrows)
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide(true);
      stopAutoScroll();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextSlide(true);
      stopAutoScroll();
    }
  });

  // Update slide width on window resize
  function updateSlideWidth() {
    slideWidth = slides[0].offsetWidth;
    updateCarousel(false);
  }

  window.addEventListener('resize', updateSlideWidth);

  // Initialize
  updateCarousel(false);
}

// ============================================
// DYNAMIC YEAR IN FOOTER
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});

// Initialize all carousels
document.addEventListener('DOMContentLoaded', () => {
  const carousels = document.querySelectorAll('.carousel');
  carousels.forEach(setupCarousel);
});

// Handle window resize
window.addEventListener('resize', resizeCanvas);

// Matrix characters
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
const charArray = chars.split('');

// Font size and columns
const fontSize = 16;
const columns = canvas.width / fontSize;

// Array to store the y position of each column
const drops = [];
for (let i = 0; i < columns; i++) {
  drops[i] = 1;
}

// Draw the Matrix effect
function draw() {
  // Set semi-transparent black background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Set text color and font
  ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
  ctx.font = fontSize + 'px monospace';

  // Draw characters
  for (let i = 0; i < drops.length; i++) {
    // Random character
    const char = charArray[Math.floor(Math.random() * charArray.length)];
    
    // Draw the character
    ctx.fillText(char, i * fontSize, drops[i] * fontSize);

    // Move the drop down
    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

// Animation loop
setInterval(draw, 50);

// Scale h2 on scroll, similar to Apple's effect
function scaleH2OnScroll() {
  const h2s = document.querySelectorAll('h2');
  const windowHeight = window.innerHeight;

  h2s.forEach(h2 => {
    const rect = h2.getBoundingClientRect();
    const visible = Math.max(0, Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0));
    // Max scale 1.8
    const scale = 1 + 0.5 * (visible / rect.height); 
    h2.style.transform = `scale(${Math.min(scale, 1.8)})`; 
  });
}

window.addEventListener('scroll', scaleH2OnScroll);
window.addEventListener('resize', scaleH2OnScroll);
document.addEventListener('DOMContentLoaded', scaleH2OnScroll);