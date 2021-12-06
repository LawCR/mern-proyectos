// Rutas para tareas
const { Router } = require('express')
const auth = require('../middleware/auth')
const router = Router()
const { check } = require('express-validator')
const { crearTarea, obtenerTareas, actualizarTarea, eliminarTarea } = require('../controllers/tareaController')

// crear una tarea - api/tareas
router.post('/', auth, [
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('proyecto','El proyecto es obligatorio').not().isEmpty()
], crearTarea)

// Obtener las tareas por proyecto - api/tareas
router.get('/', auth, obtenerTareas)

// Actualizar tarea
router.put('/:id', auth, actualizarTarea)

// Eliminar tarea
router.delete('/:id', auth, eliminarTarea)

module.exports = router