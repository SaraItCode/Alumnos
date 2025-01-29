document.getElementById('add-alumno-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  // Crea el FormData a partir del formulario
  const formData = new FormData(e.target);
  try {
    const response = await fetch('/upload', {
      method: 'POST',
      body: formData // Envía el FormData directamente
    });
    if (response.ok) {
      document.getElementById('mensaje').textContent = 'Alumno añadido correctamente.';
      setTimeout(() => {
        window.location.href = 'index.html'; // Redirige al listado de alumnos.
      }, 2000);
    } else {
      const error = await response.text();
      document.getElementById('mensaje').textContent = `Error al añadir el alumno: ${error}`;
    }
  } catch (err) {
    document.getElementById('mensaje').textContent = `Error de conexión: ${err.message}`;
  }
});

document.getElementById("photo").addEventListener("change", function(event) {
  var photoFile = event.target.files[0];

  if (photoFile) {
      var reader = new FileReader();
      reader.onload = function(event) {
          var photoDataUrl = event.target.result;
          var preview = document.getElementById("preview");

          preview.src = photoDataUrl; // Asigna la foto a la vista previa
          preview.style.display = "block"; // Muestra la vista previa
      };
      reader.readAsDataURL(photoFile); // Convierte la foto a Base64 para previsualización
  } else {
      document.getElementById("preview").style.display = "none"; // Oculta la vista previa si no hay foto
  }
});