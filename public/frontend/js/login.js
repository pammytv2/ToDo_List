
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.login__form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-pass').value;

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const text = await response.text();
        alert(`Login failed: ${text}`);
        return;
      }

      const data = await response.json();

      
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_name', data.user.name);

     
      window.location.href = '/Home';
    } catch (err) {
      console.error(err);
      alert('An error occurred while logging in.');
    }
  });
});
