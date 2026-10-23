/**
 * Google Analytics 4 for the portfolio.
 *
 * The measurement ID is injected at deploy time from the GitHub Actions
 * secret GA_MEASUREMENT_ID. The placeholder below must never be committed
 * with a real G-XXXXXXXX value — the public repo would expose it in git history.
 *
 * Note: once the site is live, the ID is visible in the browser (all client-side
 * analytics work that way). Keeping it out of the repository still prevents
 * casual scraping from source and accidental commits.
 */
(function () {
  var MEASUREMENT_ID = '__GA_MEASUREMENT_ID__';

  if (!MEASUREMENT_ID || MEASUREMENT_ID.indexOf('__GA_') === 0 || MEASUREMENT_ID.indexOf('G-') !== 0) {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', MEASUREMENT_ID, {
    anonymize_ip: true,
    send_page_view: true
  });

  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(MEASUREMENT_ID);
  document.head.appendChild(script);

  function track(eventName, params) {
    if (typeof window.gtag !== 'function') return;
    var payload = params || {};
    payload.send_to = MEASUREMENT_ID;
    window.gtag('event', eventName, payload);
  }

  /** Public helper for other scripts (e.g. successful contact form). */
  window.trackPortfolioEvent = function (eventName, params) {
    track(eventName, params);
  };

  function projectLabel(anchor) {
    var project = anchor.closest('[data-project]');
    return project ? project.getAttribute('data-project') : '';
  }

  function projectCategory(anchor) {
    var category = anchor.closest('[data-category]');
    return category ? category.getAttribute('data-category') : 'project';
  }

  function classifyLink(anchor) {
    var href = anchor.getAttribute('href') || '';

    if (anchor.closest('[data-project]')) {
      return {
        event: 'project_click',
        params: {
          link_url: href,
          project_name: projectLabel(anchor),
          project_category: projectCategory(anchor),
          transport_type: 'beacon'
        }
      };
    }

    if (anchor.closest('.social-links') || /linkedin\.com|github\.com/i.test(href)) {
      var network = /linkedin/i.test(href) ? 'linkedin' : (/github/i.test(href) ? 'github' : 'social');
      return {
        event: 'social_click',
        params: {
          link_url: href,
          social_network: network,
          transport_type: 'beacon'
        }
      };
    }

    if (href.indexOf('mailto:') === 0) {
      return {
        event: 'contact_click',
        params: { method: 'email', transport_type: 'beacon' }
      };
    }

    if (href.indexOf('tel:') === 0) {
      return {
        event: 'contact_click',
        params: { method: 'phone', transport_type: 'beacon' }
      };
    }

    if (anchor.classList.contains('nav-link') || (href.charAt(0) === '#' && href.length > 1)) {
      return {
        event: 'nav_click',
        params: {
          link_text: (anchor.textContent || '').trim().replace(/\s+/g, ' '),
          section_id: href.slice(1)
        }
      };
    }

    if (href.indexOf('http') === 0) {
      return {
        event: 'outbound_click',
        params: {
          link_url: href,
          link_text: (anchor.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 100),
          transport_type: 'beacon'
        }
      };
    }

    return null;
  }

  document.addEventListener('click', function (event) {
    var anchor = event.target.closest && event.target.closest('a[href]');
    if (!anchor) return;

    var classified = classifyLink(anchor);
    if (!classified) return;
    track(classified.event, classified.params);
  }, true);

  document.addEventListener('submit', function (event) {
    if (!event.target || !event.target.classList || !event.target.classList.contains('contact-form')) {
      return;
    }
    track('generate_lead', { method: 'contact_form' });
  }, true);
})();
