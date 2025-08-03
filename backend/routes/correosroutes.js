const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Función para generar un ID numérico único basado en la fecha actual
const generarIdUnico = () => {
    return Date.now(); // Esto genera un número único basado en la marca de tiempo actual
};

// Obtener todos los correos
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM correo ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error al obtener correos:', err.message);
        res.status(500).json({ 
            error: 'Error al obtener los correos',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

// Crear un nuevo correo
router.post('/', async (req, res) => {
    try {
        const { correo, asunto, mensaje } = req.body;
        
        // Validación de campos requeridos
        if (!correo || !asunto || !mensaje) {
            return res.status(400).json({ 
                error: 'Todos los campos son obligatorios (correo, asunto, mensaje)' 
            });
        }
        
        // Generamos un ID único para el nuevo correo
        const nuevoId = generarIdUnico();
        
        // Insertamos el nuevo correo con el ID generado
        const result = await db.query(
            'INSERT INTO correo (id, correo, asunto, mensaje) VALUES ($1, $2, $3, $4) RETURNING *',
            [nuevoId, correo.trim(), asunto.trim(), mensaje.trim()]
        );
        
        res.status(201).json({
            message: 'Correo guardado correctamente',
            data: result.rows[0]
        });
    } catch (err) {
        console.error('Error al guardar correo:', err.message);
        res.status(500).json({ 
            error: 'Error al guardar el correo',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

module.exports = router;
