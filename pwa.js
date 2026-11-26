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
})();
