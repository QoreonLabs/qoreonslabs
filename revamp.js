(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealSelectors = [
    '.hero-content',
    '.hero-ios-content',
    '.hero-blog-content',
    '.section-header',
    '.feature-card',
    '.service-card',
    '.pricing-card',
    '.partner-card',
    '.blog-card',
    '.featured-post',
    '.blog-post-content',
    '.newsletter-box',
    '.contact-form',
    '.contact-info',
    '.footer-block',
    '.waitlist-form',
    '.quote-form-container',
    '.cta .container > *',
    '.contact-item',
    '.product-highlight',
    '.product-media',
    '.product-content',
    '.intel-card',
    '.demo-copy',
    '.video-shell',
    '.proof-card'
  ];

  document.addEventListener('DOMContentLoaded', function () {
    document.body.classList.add('revamp-ready');
    injectAmbientOrbs();
    tagRevealTargets();
    initRevealObserver();
    initHeaderState();
    initBackToTop();
    initRippleButtons();
    initCardTilt();
  });

  function injectAmbientOrbs() {
    if (document.querySelector('.revamp-orb')) {
      return;
    }

    var orbA = document.createElement('div');
    orbA.className = 'revamp-orb revamp-orb-1';

    var orbB = document.createElement('div');
    orbB.className = 'revamp-orb revamp-orb-2';

    document.body.appendChild(orbA);
    document.body.appendChild(orbB);
  }

  function tagRevealTargets() {
    var seen = new Set();
    var nodes = [];

    revealSelectors.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (node) {
        if (!seen.has(node)) {
          seen.add(node);
          nodes.push(node);
        }
      });
    });

    nodes.forEach(function (node, index) {
      if (node.hasAttribute('data-aos')) {
        return;
      }

      node.setAttribute('data-reveal', '');
      node.style.setProperty('--revamp-delay', Math.min(index * 35, 280) + 'ms');
    });
  }

  function initRevealObserver() {
    var revealNodes = document.querySelectorAll('[data-reveal]');

    if (!revealNodes.length) {
      return;
    }

    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealNodes.forEach(function (node) {
        node.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.14,
      rootMargin: '0px 0px -8% 0px'
    });

    revealNodes.forEach(function (node) {
      observer.observe(node);
    });
  }

  function initHeaderState() {
    var header = document.getElementById('header') || document.querySelector('header');
    if (!header) {
      return;
    }

    var updateHeader = function () {
      if (window.scrollY > 14) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    };

    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }

  function initBackToTop() {
    if (document.querySelector('.revamp-top-btn')) {
      return;
    }

    var button = document.createElement('button');
    button.className = 'revamp-top-btn';
    button.type = 'button';
    button.setAttribute('aria-label', 'Back to top');
    button.innerHTML = '<i class="fas fa-arrow-up" aria-hidden="true"></i>';

    var updateVisibility = function () {
      if (window.scrollY > 560) {
        button.classList.add('is-visible');
      } else {
        button.classList.remove('is-visible');
      }
    };

    button.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: reduceMotion ? 'auto' : 'smooth'
      });
    });

    document.body.appendChild(button);
    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
  }

  function initRippleButtons() {
    var buttons = document.querySelectorAll('.btn, .form-submit, .newsletter-btn');

    buttons.forEach(function (button) {
      button.addEventListener('click', function (event) {
        var rect = button.getBoundingClientRect();
        var ripple = document.createElement('span');
        var diameter = Math.max(rect.width, rect.height);

        ripple.className = 'revamp-ripple';
        ripple.style.width = diameter + 'px';
        ripple.style.height = diameter + 'px';
        ripple.style.left = event.clientX - rect.left - diameter / 2 + 'px';
        ripple.style.top = event.clientY - rect.top - diameter / 2 + 'px';

        button.appendChild(ripple);

        ripple.addEventListener('animationend', function () {
          ripple.remove();
        });
      });
    });
  }

  function initCardTilt() {
    if (reduceMotion || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    var cards = document.querySelectorAll('.feature-card, .service-card, .pricing-card, .blog-card, .partner-card, .card, .featured-post, .waitlist-form, .quote-form-container');

    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (event) {
        var rect = card.getBoundingClientRect();
        var x = (event.clientX - rect.left) / rect.width;
        var y = (event.clientY - rect.top) / rect.height;
        var rotateY = (x - 0.5) * 7;
        var rotateX = (0.5 - y) * 7;

        card.style.transform = 'perspective(900px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg) translateY(-7px)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }
})();
