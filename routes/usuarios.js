// Rutas para crear usuarios
const { Router } = require('express')
const { check } = require('express-validator')
const { crearUsuario } = require('../controllers/usuarioController')
const router = Router()

//Crear un usuario
router.post('/',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'Agrega un email válido').isEmail(),
        check('password', 'El password debe ser minimo de 6 caracteres').isLength({min: 6})
    ],
    crearUsuario)

module.exports = router