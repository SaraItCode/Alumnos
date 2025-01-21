document.getElementById('add-alumno-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newAlumno = {
      id: Date.now(),
      name: formData.get('name'),
      photo: formData.get('photo').name, // Enviar nombre del archivo para simplificar
      details: formData.get('details'),
    };
  
    await fetch('/api/new', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAlumno),
    });
  
    //cargarAlumnos();
    e.target.reset();
  });