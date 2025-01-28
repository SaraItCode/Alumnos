document.getElementById('add-alumno-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newAlumno = {
      id: Date.now(), // Genera el id en funcion de la hora actual
      name: formData.get('name'),
      age: formData.get('age'),
      email: formData.get('email'),
      photo: "/uploads/"+formData.get('photo').name, // Enviar nombre del archivo para simplificar
      description: formData.get('description'),
    };
  console.log(newAlumno)
    await fetch('/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAlumno),
    });
  
    //cargarAlumnos();
    e.target.reset();
  });