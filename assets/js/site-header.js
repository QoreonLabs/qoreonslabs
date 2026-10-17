(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var header = document.querySelector('#header.ql-site-header');
    if (!header) return;

    var nav = header.querySelector('.ql-primary-nav');
    var navToggle = header.querySelector('.ql-nav-toggle');
    var navClose = header.querySelector('.ql-nav-close');
    var services = header.querySelector('.ql-services');
    var servicesTrigger = header.querySelector('.ql-services-trigger');
    var currentPage = location.pathname.split('/').pop() || 'index.html';
    var servicePages = [
      'services.html',
      'custom-software-development.html',
      'business-web-app-development.html',
      'business-dashboard-development.html',
      'internal-tools-development.html',
      'customer-portal-development.html',
      'saas-development.html',
      'mvp-development.html',
      'ai-development.html',
      'workflow-automation.html',
      'ai-automation.html'
    ];

    function isMobile() {
      return window.matchMedia('(max-width: 980px)').matches;
    }

    function setNav(open) {
      nav.classList.toggle('is-open', open);
      navToggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
      if (!open) setServices(false);
    }

    function setServices(open) {
      services.classList.toggle('is-open', open);
      servicesTrigger.setAttribute('aria-expanded', String(open));
    }

    function updateHeader() {
      header.classList.toggle('is-scrolled', window.scrollY > 14);
    }

    function setTopNavigationState() {
      header.querySelectorAll('[data-nav]').forEach(function (link) {
        link.classList.remove('is-active');
        link.removeAttribute('aria-current');
      });

      var activeLink = null;
      if (currentPage === 'index.html') {
        activeLink = header.querySelector(location.hash === '#contact' ? '[data-nav="contact"]' : '[data-nav="home"]');
      } else if (currentPage === 'about-us.html') {
        activeLink = header.querySelector('[data-nav="about"]');
      } else if (servicePages.indexOf(currentPage) !== -1) {
        activeLink = servicesTrigger;
      }

      if (activeLink) {
        activeLink.classList.add('is-active');
        activeLink.setAttribute('aria-current', 'page');
      }
    }

    header.querySelectorAll('.ql-menu-link').forEach(function (link) {
      var url = new URL(link.href, location.href);
      var page = url.pathname.split('/').pop() || 'index.html';
      if (page === currentPage && (!url.hash || url.hash === location.hash)) {
        link.setAttribute('aria-current', 'page');
      }
    });

    navToggle.addEventListener('click', function () {
      setNav(!nav.classList.contains('is-open'));
    });

    navClose.addEventListener('click', function () {
      setNav(false);
      navToggle.focus();
    });

    servicesTrigger.addEventListener('click', function (event) {
      if (!services.classList.contains('is-open')) {
        event.preventDefault();
        setServices(true);
      }
    });

    servicesTrigger.addEventListener('keydown', function (event) {
      if (isMobile() && (event.key === ' ' || event.key === 'ArrowDown')) {
        event.preventDefault();
        setServices(true);
        var firstLink = services.querySelector('.ql-menu-link');
        if (firstLink) firstLink.focus();
      }
    });

    document.addEventListener('click', function (event) {
      if (!services.contains(event.target)) setServices(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        var wasOpen = nav.classList.contains('is-open');
        setNav(false);
        if (wasOpen) navToggle.focus();
      }
    });

    nav.querySelectorAll('a:not(.ql-services-trigger)').forEach(function (link) {
      link.addEventListener('click', function () {
        setNav(false);
      });
    });

    window.addEventListener('resize', function () {
      if (!isMobile()) setNav(false);
    });
    window.addEventListener('hashchange', setTopNavigationState);
    window.addEventListener('scroll', updateHeader, { passive: true });
    setTopNavigationState();
    updateHeader();
  });
})();
