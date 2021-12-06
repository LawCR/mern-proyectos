// Rutas para autenticar usuarios
const { Router } = require('express')
const router = Router()
const { check } = require('express-validator')
const { autenticarUsuario, usuarioAutenticado } = require('../controllers/authController')
const auth = require('../middleware/auth')




//Iniciar sesión
router.post('/',
    [
        check('email', 'Agrega un email válido').isEmail(),
        check('password', 'El password debe ser minimo de 6 caracteres').isLength({min: 6})
    ],
    autenticarUsuario)

// Obtiene el usuario autenticado
router.get('/', auth, usuarioAutenticado)


module.exports = router