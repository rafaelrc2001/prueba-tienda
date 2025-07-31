const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Obtener todos los formularios
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM formulario ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error al obtener formularios:', err.message);
        res.status(500).json({ error: 'Error al obtener los formularios' });
    }
});

// Crear un nuevo formulario
router.post('/', async (req, res) => {
    try {
        const { nombre, numero, estado } = req.body;
        const result = await db.query(
            'INSERT INTO formulario (nombre, numero, estado) VALUES ($1, $2, $3) RETURNING *',
            [nombre, numero, estado]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error al guardar formulario:', err.message);
        res.status(500).json({ 
            error: 'Error al guardar el formulario',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

module.exports = router;