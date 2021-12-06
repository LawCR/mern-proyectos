// Rutas para proyectos
const { Router } = require('express')
const { check } = require('express-validator')
const { crearProyecto, obtenerProyectos, actualizarProyecto, eliminarProyecto } = require('../controllers/proyectoController')
const auth = require('../middleware/auth')
const router = Router()

// Crea Proyectos - api/proyectos
router.post('/', auth, [
    check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
], crearProyecto)

// obtener proyectos del que lo creo mendiante el token
router.get('/', auth, obtenerProyectos)

// Actualizar proyecto via ID
router.put('/:id', auth, [
    check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
],  actualizarProyecto)

// Eliminar un proyecto
router.delete('/:id', auth, eliminarProyecto)

module.exports = router