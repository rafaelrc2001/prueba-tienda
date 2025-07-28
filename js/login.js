document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Validación de credenciales
        if (username === 'admin' && password === 'admin123') {
            // Credenciales correctas
            errorMessage.textContent = '';
            alert('¡Inicio de sesión exitoso!');
            // Redireccionar a la página principal
            window.location.href = 'modulo/principal.html'; // Cambia por tu página de destino
        } else {
            // Credenciales incorrectas
            errorMessage.textContent = 'Usuario o contraseña incorrectos';
            // Efecto de sacudida para el formulario
            loginForm.style.animation = 'shake 0.5s';
            setTimeout(() => {
                loginForm.style.animation = '';
            }, 500);
        }
    });
});

// Añadir animación de sacudida al CSS dinámicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);