-- Script para crear la tabla de correos
CREATE TABLE IF NOT EXISTS correos (
    id SERIAL PRIMARY KEY,
    correo VARCHAR(255) NOT NULL,
    asunto VARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos de ejemplo (opcional)
INSERT INTO correos (correo, asunto, mensaje) VALUES 
('ejemplo@dominio.com', 'Primer correo', 'Este es un mensaje de prueba'),
('usuario@ejemplo.com', 'Segundo correo', 'Otro mensaje de prueba');
