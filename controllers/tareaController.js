
const { validationResult } = require('express-validator')
const Proyecto = require('../models/Proyecto')
const Tarea = require('../models/Tarea')
const router = require('../routes/tareas')

// Crea una nueva Tarea
const crearTarea = async(req, res) => {
    // Revisar si hay errores
    const errores = validationResult(req)
    // Si errores no esta vacio
    if (!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()})
    }

    
    try {
        // Extraer el proyecto y comprobar si existe
        const {proyecto} = req.body
        const existeProyecto = await Proyecto.findById(proyecto)
        if (!existeProyecto) {
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No Autorizado'})
        }

        // Creamos la tarea
        const tarea = new Tarea(req.body)
        await tarea.save()
        res.json({tarea})

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error')
    }

}

// Obtener tareas por proyecto
const obtenerTareas = async(req, res) => {
    try {
        // Extraer el proyecto(id) y comprobar si existe
        const {proyecto} = req.query

        const existeProyecto = await Proyecto.findById(proyecto)
        if (!existeProyecto) {
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }
        
        // Revisar si el proyecto actual pertenece al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No Autorizado'})
        }

        // Obtener las tareas por proyecto
        const tareas = await Tarea.find({proyecto}).sort({creado: -1})
        res.json({tareas})
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error')
    }
}

// Actualizar una tarea
const actualizarTarea = async(req, res) => {
    try {
        // Extraer el proyecto(id) y comprobar si existe
        const {proyecto, nombre, estado} = req.body

        // Si la tarea existe o no
        let tarea = await Tarea.findById(req.params.id)
        if (!tarea) {
            return res.status(401).json({msg: 'No existe la tarea'})
        }

        
        // Revisar si el proyecto actual pertenece al usuario autenticado
        const existeProyecto = await Proyecto.findById(proyecto)

        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No Autorizado'})
        }

        // Crear un objeto con la nueva información
        const nuevaTarea = {}
        nuevaTarea.nombre = nombre
        nuevaTarea.estado = estado
        
        // Guardar la tarea
        tarea = await Tarea.findOneAndUpdate({_id : req.params.id}, nuevaTarea, {new: true} )
        res.json({msg: 'Tarea Actualizada Correctamente' , tarea})

    } catch (error) {
        
    }
}

//Elimina una tarea
const eliminarTarea = async(req, res) => {
     try {
        // Extraer el proyecto(id) y comprobar si existe
        const {proyecto} = req.query

        // Si la tarea existe o no
        let tarea = await Tarea.findById(req.params.id)
        if (!tarea) {
            return res.status(401).json({msg: 'No existe la tarea'})
        }

        // Revisar si el proyecto actual pertenece al usuario autenticado
        const existeProyecto = await Proyecto.findById(proyecto)

        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No Autorizado'})
        }

        // Eliminar
        await Tarea.findOneAndRemove({_id: req.params.id})
        res.json({msg: 'Tarea Eliminada'})
     } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error')
     }
}



module.exports = {
    crearTarea,
    obtenerTareas,
    actualizarTarea,
    eliminarTarea
}