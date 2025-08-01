// URL base de la API
const API_URL = 'http://localhost:3000/api';

// Esperamos a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Obtenemos referencias a los elementos del DOM
    const formulario = document.getElementById('formularioCorreo');
    const cuerpoTabla = document.getElementById('cuerpoTabla');
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading';
    loadingIndicator.textContent = 'Cargando...';

    // Cargar correos al iniciar
    cargarCorreos();

    // Función para mostrar mensajes de error
    function mostrarError(mensaje) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = mensaje;
        document.body.insertBefore(errorDiv, document.body.firstChild);

        // Eliminar el mensaje después de 5 segundos
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    // Función para cargar los correos desde el servidor
    async function cargarCorreos() {
        try {
            // Mostrar indicador de carga
            cuerpoTabla.innerHTML = '';
            cuerpoTabla.appendChild(loadingIndicator);

            const respuesta = await fetch(`${API_URL}/correos`);

            if (!respuesta.ok) {
                throw new Error('Error al cargar los correos');
            }

            const correos = await respuesta.json();

            // Limpiar la tabla
            cuerpoTabla.innerHTML = '';

            if (correos.length === 0) {
                const fila = document.createElement('tr');
                fila.innerHTML = '<td colspan="4" class="no-data">No hay correos para mostrar</td>';
                cuerpoTabla.appendChild(fila);
                return;
            }

            // Agregar cada correo a la tabla
            correos.forEach(correo => {
                agregarCorreoATabla(correo);
            });

        } catch (error) {
            console.error('Error al cargar correos:', error);
            mostrarError('No se pudieron cargar los correos. Intenta recargar la página.');

            // Mostrar mensaje de error en la tabla
            cuerpoTabla.innerHTML = '';
            const filaError = document.createElement('tr');
            filaError.innerHTML = `
                <td colspan="4" class="error">
                    Error al cargar los correos. 
                    <button onclick="window.location.reload()">Reintentar</button>
                </td>
            `;
            cuerpoTabla.appendChild(filaError);
        }
    }

    // Función para formatear la fecha
    function formatearFecha(fechaString) {
        const opciones = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(fechaString).toLocaleDateString('es-ES', opciones);
    }

    // Función para agregar un nuevo correo a la tabla
    function agregarCorreoATabla(correo) {
        const fila = document.createElement('tr');

        // Limitar la longitud del mensaje para la vista previa
        const mensajePreview = correo.mensaje.length > 50 
            ? correo.mensaje.substring(0, 50) + '...' 
            : correo.mensaje;

        fila.innerHTML = `
            <td>${correo.correo}</td>
            <td>${correo.asunto}</td>
            <td title="${correo.mensaje}">${mensajePreview}</td>
            <td>${formatearFecha(correo.fecha_envio)}</td>
        `;

        // Agregar la nueva fila al principio de la tabla
        if (cuerpoTabla.firstChild) {
            cuerpoTabla.insertBefore(fila, cuerpoTabla.firstChild);
        } else {
            cuerpoTabla.appendChild(fila);
        }
    }

    // Función para manejar el envío del formulario
    async function manejarEnvioFormulario(evento) {
        evento.preventDefault();

        // Obtener los valores del formulario
        const correo = document.getElementById('correo').value.trim();
        const asunto = document.getElementById('asunto').value.trim();
        const mensaje = document.getElementById('mensaje').value.trim();

        // Validación
        if (!correo || !asunto || !mensaje) {
            mostrarError('Por favor, completa todos los campos');
            return;
        }

        // Validar formato de correo electrónico
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
            mostrarError('Por favor, ingresa un correo electrónico válido');
            return;
        }

        try {
            // Deshabilitar el botón de envío
            const botonEnviar = formulario.querySelector('button[type="submit"]');
            const textoOriginal = botonEnviar.textContent;
            botonEnviar.disabled = true;
            botonEnviar.textContent = 'Enviando...';

            // Enviar el correo al servidor
            const respuesta = await fetch(`${API_URL}/correos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ correo, asunto, mensaje })
            });

            if (!respuesta.ok) {
                const errorData = await respuesta.json().catch(() => ({}));
                throw new Error(errorData.error || 'Error al enviar el correo');
            }

            // Recargar la lista de correos
            await cargarCorreos();

            // Mostrar mensaje de éxito
            mostrarError('¡Correo enviado correctamente!');

            // Limpiar el formulario
            formulario.reset();

        } catch (error) {
            console.error('Error al enviar correo:', error);
            mostrarError(error.message || 'Error al enviar el correo. Por favor, inténtalo de nuevo.');
        } finally {
            // Restaurar el botón de envío
            const botonEnviar = formulario.querySelector('button[type="submit"]');
            if (botonEnviar) {
                botonEnviar.disabled = false;
                botonEnviar.textContent = textoOriginal;
            }
        }
    }

    // Agregar el event listener al formulario
    formulario.addEventListener('submit', manejarEnvioFormulario);
});