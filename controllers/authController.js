const Usuario = require("../models/Usuario")
const bcryptjs = require('bcryptjs')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

const autenticarUsuario = async(req, res) => {
    // Revisar si hay errores
    const errores = validationResult(req)
    // Si errores no esta vacio
    if (!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()})
    }

    // Extraer email y password
    const {email, password} = req.body
    try {
        // Revisar que sea un usuario registrado
        let usuario = await Usuario.findOne({email})
        if (!usuario) {
            res.status(400).json({msg: 'El usuario no existe'})
        }

        // Revisar el password
        const passCorrecto = await bcryptjs.compare(password, usuario.password)
        if (!passCorrecto) {
            return res.status(400).json({msg: 'Password Incorrecto'})
        }

        // Si todo es correcto, Crear y firmar el JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        }

        // firmar el JWT (payload, palabraSecreta, configuaracion )
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600 // 1 hora
        }, (error, token) => {
            if (error) throw error
            // Mensaje de confirmación
            res.status(200).json({ msg: 'Inicio de Sesión Exitoso', token })
        })

    } catch (error) {
        console.log(error);
    }
}


// Obtiene que usuario esta autenticado}
const usuarioAutenticado = async(req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password')
        res.json({usuario})
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error en el sistema'})
    }
}

module.exports = {
    autenticarUsuario,
    usuarioAutenticado
}