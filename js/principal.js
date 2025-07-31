document.addEventListener('DOMContentLoaded', function() {
    const formularioPrincipal = document.getElementById('formularioPrincipal');
    const cuerpoTabla = document.getElementById('cuerpoTabla');
    const API_URL = 'http://localhost:3000/api';

    // Función para cargar y mostrar las personas
    async function cargarPersonas() {
        try {
            const respuesta = await fetch(`${API_URL}/personas`);
            const personas = await respuesta.json();
            cuerpoTabla.innerHTML = ''; // Limpiar la tabla
            personas.forEach(persona => {
                agregarFilaATabla(persona);
            });
        } catch (error) {
            console.error('Error al cargar personas:', error);
        }
    }

    // Función para agregar una fila a la tabla
    function agregarFilaATabla(persona) {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${persona.nombre}</td>
            <td>${persona.numero}</td>
            <td>${persona.estado}</td>
        `;
        cuerpoTabla.appendChild(fila);
    }

    // Manejar el envío del formulario
    async function manejarEnvioFormulario(evento) {
        evento.preventDefault();
        
        const nombre = document.getElementById('nombre').value;
        const numero = document.getElementById('numero').value;
        const estado = document.getElementById('estado').value;

        if (!nombre || !numero || !estado) {
            alert('Por favor, completa todos los campos');
            return;
        }

        try {
            // Enviar datos al servidor
            const respuesta = await fetch(`${API_URL}/personas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nombre, numero, estado })
            });

            if (respuesta.ok) {
                // Si la respuesta es exitosa, actualizar la tabla
                await cargarPersonas();
                // Limpiar el formulario
                formularioPrincipal.reset();
            } else {
                throw new Error('Error al guardar');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al guardar la persona');
        }
    }

    // Cargar las personas al iniciar
    cargarPersonas();

    // Agregar el manejador de eventos al formulario
    formularioPrincipal.addEventListener('submit', manejarEnvioFormulario);
});