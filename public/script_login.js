// Manejar registro
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    if (result.success) {
      alert('Registro exitoso!');
      window.location.href = '/login.html';
    } else {
      alert(result.error || 'Error en el registro');
    }
    
  } catch (error) {
    alert('Error de conexión');
  }
});

// Manejar login
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    if (result.success) {
      alert('Login exitoso!');
      window.location.href = '/';
    } else {
      alert(result.error || 'Credenciales inválidas');
    }
    
  } catch (error) {
    alert('Error de conexión');
  }
});