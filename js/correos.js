// Esperamos a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Obtenemos referencias a los elementos del DOM
    const formulario = document.getElementById('formularioCorreo');
    const cuerpoTabla = document.getElementById('cuerpoTabla');
    
    // Función para agregar un nuevo correo a la tabla
    function agregarCorreoATabla(correo, asunto, mensaje) {
        const fecha = new Date().toLocaleString();
        const fila = document.createElement('tr');
        
        fila.innerHTML = `
            <td>${correo}</td>
            <td>${asunto}</td>
            <td>${mensaje}</td>
            <td>${fecha}</td>
        `;
        
        // Agregamos la nueva fila al principio de la tabla
        cuerpoTabla.insertBefore(fila, cuerpoTabla.firstChild);
    }
    
    // Función para manejar el envío del formulario
    function manejarEnvioFormulario(evento) {
        evento.preventDefault();
        
        // Obtenemos los valores del formulario
        const correo = document.getElementById('correo').value;
        const asunto = document.getElementById('asunto').value;
        const mensaje = document.getElementById('mensaje').value;
        
        // Validación básica
        if (!correo || !asunto || !mensaje) {
            alert('Por favor, completa todos los campos');
            return;
        }
        
        // Agregamos el correo a la tabla
        agregarCorreoATabla(correo, asunto, mensaje);
        
        // Limpiamos el formulario
        formulario.reset();
    }
    
    // Agregamos el event listener al formulario
    formulario.addEventListener('submit', manejarEnvioFormulario);
});