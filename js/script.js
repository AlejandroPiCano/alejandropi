// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const themeIcon = themeToggle.querySelector('i');
const themeText = themeToggle.querySelector('span');

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme') || 'dark';
body.classList.add(savedTheme);
updateThemeButton(savedTheme);

themeToggle.addEventListener('click', () => {
  const isDark = body.classList.contains('dark');
  const newTheme = isDark ? 'light' : 'dark';
  
  body.classList.remove(isDark ? 'dark' : 'light');
  body.classList.add(newTheme);
  
  localStorage.setItem('theme', newTheme);
  updateThemeButton(newTheme);
});

function updateThemeButton(theme) {
  if (theme === 'dark') {
    themeIcon.className = 'fas fa-moon';
    themeText.textContent = 'Dark Mode';
  } else {
    themeIcon.className = 'fas fa-sun';
    themeText.textContent = 'Light Mode';
  }
}

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

// Form Submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = {
      from_name: formData.get('name'),
      from_email: formData.get('email'),
      message: formData.get('message')
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
      alert('Thank you for your message! I will get back to you soon.');
      contactForm.reset();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Sorry, there was an error sending the message. Please try again.');
    } finally {
      // Reset button state
      const submitButton = contactForm.querySelector('button[type="submit"]');
      submitButton.textContent = 'Send Message';
      submitButton.disabled = false;
    }
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
  