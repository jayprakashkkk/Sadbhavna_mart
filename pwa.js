(function () {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('./sw.js', { scope: './' }).catch(function () {});
    });
  }

  let deferredInstallPrompt = null;

  function toggleInstallButtons(show) {
    document.querySelectorAll('[data-pwa-install]').forEach(function (el) {
      el.style.display = show ? (el.dataset.pwaDisplay || 'inline-flex') : 'none';
    });
  }

  window.addEventListener('beforeinstallprompt', function (event) {
    event.preventDefault();
    deferredInstallPrompt = event;
    toggleInstallButtons(true);
  });

  window.addEventListener('appinstalled', function () {
    deferredInstallPrompt = null;
    toggleInstallButtons(false);
  });

  window.triggerPwaInstall = async function () {
    if (!deferredInstallPrompt) return false;
    deferredInstallPrompt.prompt();
    try {
      await deferredInstallPrompt.userChoice;
    } catch (_) {}
    deferredInstallPrompt = null;
    toggleInstallButtons(false);
    return true;
  };

  function getPageSlug(pathname) {
    var clean = (pathname || '').toLowerCase().replace(/\/+$/, '');
    var last = clean.split('/').pop() || '';
    return last.replace(/\.html?$/, '');
  }

  function detectNavIndex() {
    var slug = getPageSlug(window.location.pathname);
    if (slug === 'category') return 1;
    if (
      slug === 'profile' ||
      slug === 'orders' ||
      slug === 'wishlist' ||
      slug === 'about' ||
      slug === 'policy' ||
      slug === 'terms'
    ) {
      return 2;
    }
    return 0;
  }

  function initBottomNav() {
    var nav = document.querySelector('.bottom-nav');
    if (!nav) return;

    var links = Array.prototype.slice.call(nav.querySelectorAll('a'));
    if (!links.length) return;

    var activeIdx = detectNavIndex();
    if (activeIdx >= links.length) activeIdx = 0;

    function setActiveVisual(idx) {
      links.forEach(function (a, i) {
        var item = a.querySelector('.nav-item');
        if (!item) return;
        item.classList.toggle('active', i === idx);
      });
    }

    var slider = nav.querySelector('.nav-slider');
    if (!slider) {
      slider = document.createElement('span');
      slider.className = 'nav-slider';
      slider.setAttribute('aria-hidden', 'true');
      nav.insertBefore(slider, nav.firstChild);
    }

    function positionSlider(idx, animate) {
      var targetLink = links[idx] || links[0];
      var targetItem = targetLink.querySelector('.nav-item') || targetLink;
      var navRect = nav.getBoundingClientRect();
      var itemRect = targetItem.getBoundingClientRect();
      if (!navRect.width || !itemRect.width) return;

      var x = itemRect.left - navRect.left;
      var w = itemRect.width;

      if (!animate) {
        slider.style.transition = 'none';
        slider.style.width = w + 'px';
        slider.style.transform = 'translate3d(' + x + 'px, 0, 0)';
        slider.classList.add('ready');
        void slider.offsetWidth;
        slider.style.transition = '';
      } else {
        slider.classList.add('ready');
        slider.style.width = w + 'px';
        slider.style.transform = 'translate3d(' + x + 'px, 0, 0)';
      }
    }

    var navigating = false;
    var currentSlug = getPageSlug(window.location.pathname) || 'index';

    links.forEach(function (link, idx) {
      link.addEventListener('click', function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

        var href = link.getAttribute('href');
        if (!href) return;

        var targetUrl = new URL(href, window.location.href);
        var targetSlug = getPageSlug(targetUrl.pathname) || 'index';

        if (targetSlug === currentSlug) {
          e.preventDefault();
          var item = link.querySelector('.nav-item');
          if (item) {
            item.classList.remove('active');
            void item.offsetWidth;
            item.classList.add('active');
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }

        if (navigating) {
          e.preventDefault();
          return;
        }

        e.preventDefault();
        navigating = true;
        setActiveVisual(idx);
        positionSlider(idx, true);

        setTimeout(function () {
          window.location.href = href;
        }, 210);
      });
    });

    setActiveVisual(activeIdx);
    positionSlider(activeIdx, false);

    window.addEventListener('load', function () {
      if (!navigating) {
        activeIdx = detectNavIndex();
        setActiveVisual(activeIdx);
        positionSlider(activeIdx, false);
      }
    });

    window.addEventListener('pageshow', function () {
      navigating = false;
      activeIdx = detectNavIndex();
      setActiveVisual(activeIdx);
      positionSlider(activeIdx, false);
    });

    window.addEventListener('resize', function () {
      if (!navigating) {
        positionSlider(activeIdx, false);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBottomNav);
  } else {
    initBottomNav();
  }
})();
