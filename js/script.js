// Theme Toggle (support for both desktop and mobile)
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
  // Get saved theme or default to light
  let savedTheme = localStorage.getItem('theme') || 'light';
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
    });
  });
  function updateThemeUI(theme) {
    themeToggles.forEach(toggle => {
      const icon = toggle.querySelector('i');
      const text = toggle.querySelector('span');
      if (icon) icon.className = themeIconClass[theme];
      if (text) text.textContent = themeTextValue[theme];
    });
  }
});

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

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Scroll Animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
      observer.unobserve(entry.target);
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
  if (type === 'success') {
    toast.style.background = '#19ff19';
    toast.style.color = '#222';
  }
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-20px)';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// Form Submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // CAPTCHA validation
    const captchaResponse = window.grecaptcha ? grecaptcha.getResponse() : '';
    if (!captchaResponse) {
      showToast('Please complete the CAPTCHA.', 'error');
      return;
    }

    // Consent validation
    const consentChecked = document.getElementById('consent').checked;
    if (!consentChecked) {
      showToast('You must consent to data processing.', 'error');
      return;
    }

    // Get form data and sanitize
    const formData = new FormData(contactForm);
    const sanitize = str => (str || '').replace(/[<>"'%;()&+]/g, '');
    const data = {
      from_name: sanitize(formData.get('name')),
      from_email: sanitize(formData.get('email')),
      message: sanitize(formData.get('message'))
    };

    try {
      // Show loading state
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      submitButton.textContent = 'Sending...';
      submitButton.disabled = true;

      // Send email using EmailJS
      await emailjs.send('AlejandroPiPortfolio', 'template_vnt432a', data);
      
      // Show success message
      showToast('Thank you for your message! I will get back to you soon.', 'success');
      contactForm.reset();
      if (window.grecaptcha) grecaptcha.reset();
    } catch (error) {
      console.error('Error sending message:', error);
      showToast('Sorry, there was an error sending the message. Please try again.', 'error');
    } finally {
      // Reset button state
      const submitButton = contactForm.querySelector('button[type="submit"]');
      submitButton.textContent = 'Send Message';
      submitButton.disabled = false;
    }
  });
}

// Hamburger menu toggle
const hamburger = document.getElementById('hamburger-menu');
const navLinks = document.getElementById('main-nav');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', function() {
    const isOpen = navLinks.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isOpen);
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