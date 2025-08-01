const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Obtener todos los correos
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM correos ORDER BY fecha_envio DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error al obtener correos:', err.message);
        res.status(500).json({ 
            error: 'Error al obtener los correos',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

// Enviar un nuevo correo
router.post('/', async (req, res) => {
    try {
        const { correo, asunto, mensaje } = req.body;
        
        // Validación básica
        if (!correo || !asunto || !mensaje) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }
        
        const result = await db.query(
            'INSERT INTO correos (correo, asunto, mensaje) VALUES ($1, $2, $3) RETURNING *',
            [correo, asunto, mensaje]
        );
        
        res.status(201).json({
            message: 'Correo enviado correctamente',
            data: result.rows[0]
        });
    } catch (err) {
        console.error('Error al guardar correo:', err.message);
        res.status(500).json({ 
            error: 'Error al enviar el correo',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

module.exports = router;
