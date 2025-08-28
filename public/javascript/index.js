function navigate(page) {
  window.history.pushState({}, '', '/' + page);
  renderPage(page);
}

function renderPage(page) {
  const app = document.getElementById('app');
  if (page === 'login') {
    import('../pages/login.js').then(mod => mod.renderLogin(app, navigate));
  } else if (page === 'qr') {
    import('../pages/qrScan.js').then(mod => mod.renderQR(app, navigate));
  } else {
    app.innerHTML = '<h2>Página não encontrada</h2>';
  }
}

window.addEventListener('popstate', () => {
  const page = window.location.pathname.replace('/', '') || 'login';
  renderPage(page);
});

window.addEventListener('DOMContentLoaded', () => {
  const page = window.location.pathname.replace('/', '') || 'login';
  renderPage(page);
});