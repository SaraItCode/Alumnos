document.getElementById('add-alumno-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const newAlumno = {
    name: formData.get('name'),
    age: formData.get('age'),
    email: formData.get('email'),
    photo: "/uploads/" + formData.get('photo').name
  };

  const response = await fetch('/add-alumno', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newAlumno)
  });

  const data = await response.json();
  if (data.success) {
    alert('Alumno añadido correctamente');
    window.location.href = '/';
  } else {
    alert('Error al añadir el alumno');
  }
});
