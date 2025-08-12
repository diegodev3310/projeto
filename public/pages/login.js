export function renderLogin(app, navigate) {
  app.innerHTML = `
    <h2>Login</h2>
    <form id="loginForm">
      <input type="text" id="username" placeholder="Usuário" required /><br/>
      <input type="password" id="password" placeholder="Senha" required /><br/>
      <button id="loginButton" type="submit">Entrar</button>
    </form>
  `;
  document.getElementById('loginForm').onsubmit = function(e) {
    e.preventDefault();
  };

  const loginButton = document.getElementById('loginButton');

  loginButton.addEventListener('click', async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        throw new Error('Login falhou');
      } else {
        navigate('qr');
      }
    } catch (error) {
      alert('Erro ao fazer login. Verifique suas credenciais.');
    } 
  });
}