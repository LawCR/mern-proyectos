const Proyecto = require("../models/Proyecto");
const { validationResult } = require('express-validator')

const crearProyecto = async(req, res) => {
    // Revisar si hay errores
    const errores = validationResult(req)
    // Si errores no esta vacio
    if (!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()})
    }

    try {
        // Crear un nuevo proyecto
        const proyecto = new Proyecto(req.body)

        // Guardar el creador via JWT (obtenido del middleware)
        proyecto.creador = req.usuario.id

        //guardamos el proyecto
        proyecto.save()
        res.status(200).json(proyecto)
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error')
    }
}

// Obtiene todos los proyectos del usuario actual
const obtenerProyectos = async(req, res) => {
    try {
        // Buscamos los proyectos hechos por el creador dueño del token
        const proyectos = await Proyecto.find({creador: req.usuario.id}).sort({creado: -1})
        res.status(200).json({proyectos})
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error')
    }
}

// Actualiza un proyecto
const actualizarProyecto = async(req, res) => {
    // Revisar si hay errores
    const errores = validationResult(req)
    // Si errores no esta vacio
    if (!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()})
    }

    // Extraer la información del proyecto
    const {nombre} = req.body
    const nuevoProyecto = {}

    if(nombre) {
        nuevoProyecto.nombre = nombre
    }

    try {
        // Revisar el ID
        let proyecto = await Proyecto.findById(req.params.id)
        // Si el proyecto existe o no
        if (!proyecto) {
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }
        // Verificar el creador del proyecto
        if (proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No Autorizado'})
        }
        // Actualizar
        proyecto = await Proyecto.findByIdAndUpdate({_id: req.params.id}, {$set: nuevoProyecto}, {new: true} )
        res.status(200).json({ msg: 'Proyecto actualizado correctamente', proyecto})
    } catch (error) {
        console.log(error);
        res.status(500).send({msg: 'Error en el servidor'})
    }
}

// Elimina el proyecto por su ID
const eliminarProyecto = async(req, res) => {
    try {
        let proyecto = await Proyecto.findById(req.params.id)
        // Si el proyecto existe o no
        if (!proyecto) {
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }
        // Verificar el creador del proyecto
        if (proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No Autorizado'})
        }

        //Eliminar el Proyecto
        await Proyecto.findOneAndRemove({ _id: req.params.id })
        res.json({msg: 'Proyecto eliminado correctamente'})
    } catch (error) {
        console.log(error);
        res.status(500).send({msg: 'Error en el servidor'})
    }
}

module.exports = {
    crearProyecto,
    obtenerProyectos,
    actualizarProyecto,
    eliminarProyecto
}