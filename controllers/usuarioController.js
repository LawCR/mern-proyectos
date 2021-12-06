const Usuario = require("../models/Usuario")
const bcryptjs = require('bcryptjs')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

/*exports.crearUsuario = (req, res) => {
    console.log('Desde crear Usuario');
}*/

const crearUsuario = async(req, res) => {
    // Revisar si hay errores
    const errores = validationResult(req)
    // Si errores no esta vacio
    if (!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()})
    }

    // Extraer email y password
    const { email, password } = req.body
    try {
        // Validar que el usuario registrado sea unico
        let usuario = await Usuario.findOne({email})

        if (usuario) {
            return res.status(400).json({msg: 'El usuario ya existe'})
        }

        // Crea el nuevo usuario
        usuario = new Usuario(req.body)

        //Hasher el password
        const salt = await bcryptjs.genSalt(10)
        usuario.password = await bcryptjs.hash(password, salt)

        // Guardar Usuario
        await usuario.save()

        // Crear y firmar el JWT
        // Creamos el JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        }

        // firmar el JWT (payload, palabraSecreta, configuracion )
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600 // 1 hora
        }, (error, token) => {
            if (error) throw error
            // Mensaje de confirmación
            res.status(200).json({ msg: 'Usuario registrado correctamente', token })
        })

        
    } catch (error) {
        console.log(error);
        res.status(400).send({msg: 'Hubo un error'})
    }
}

module.exports = {
    crearUsuario
}