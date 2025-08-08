export function renderLogin(app, navigate) {
  app.innerHTML = `
    <h2>Login</h2>
    <form id="loginForm">
      <input type="text" placeholder="Usuário" required /><br/>
      <input type="password" placeholder="Senha" required /><br/>
      <button id="loginButton" type="submit">Entrar</button>
    </form>
  `;
  document.getElementById('loginForm').onsubmit = function(e) {
    e.preventDefault();
    navigate('qr');
  };
}