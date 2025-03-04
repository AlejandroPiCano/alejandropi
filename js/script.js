document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
  
    // Comprobar si hay una preferencia de tema guardada
    if (localStorage.getItem('theme') === 'light') {
      body.classList.add('light');
      themeToggle.textContent = 'Switch to Dark Mode';
    }
  
    themeToggle.addEventListener('click', function() {
      if (body.classList.contains('light')) {
        body.classList.remove('light');
        themeToggle.textContent = 'Switch to Light Mode';
        localStorage.setItem('theme', 'dark');
      } else {
        body.classList.add('light');
        themeToggle.textContent = 'Switch to Dark Mode';
        localStorage.setItem('theme', 'light');
      }
    });
  });
  