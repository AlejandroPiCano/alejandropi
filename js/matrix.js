// Matrix rain animation for the hero canvas.
// Kept in an external file so the site CSP can disallow inline scripts.
(function () {
  var canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
  var fontSize = 16;
  var drops = [];

  // Colors come from css/tokens.css so the rain always matches the brand.
  var styles = getComputedStyle(canvas);
  var glyphColor = styles.getPropertyValue('--color-matrix-glyph').trim() || '#e6a54c';
  var fadeColor = styles.getPropertyValue('--color-matrix-fade').trim() || 'rgba(20, 15, 9, 0.09)';

  function resize() {
    var parent = canvas.parentElement;
    canvas.width = parent.clientWidth || window.innerWidth;
    canvas.height = parent.clientHeight || window.innerHeight;
    var columns = Math.ceil(canvas.width / fontSize);
    drops = [];
    for (var i = 0; i < columns; i++) {
      drops[i] = Math.random() * -40;
    }
  }

  function draw() {
    ctx.fillStyle = fadeColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = glyphColor;
    ctx.font = fontSize + "px 'JetBrains Mono', monospace";
    for (var i = 0; i < drops.length; i++) {
      var char = chars.charAt(Math.floor(Math.random() * chars.length));
      ctx.fillText(char, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  resize();
  setInterval(draw, 50);
  window.addEventListener('resize', resize);
  window.addEventListener('load', resize);
})();
