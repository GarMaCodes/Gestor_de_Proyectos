"use strict";

const Tarea = require("../models/tareaModel");
const Proyecto = require("../models/ProyectoModel");
const { validationResult } = require("express-validator");

//Creando una nueva tarea
exports.crearTarea = async (req, res) => {
  //Revisando si hay errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }

  //Extrayendo el proyecto y comprobando si existe
  const { proyecto } = req.body; //id del proyecto

  try {
    const existeProyecto = await Proyecto.findById(proyecto);

    if (!existeProyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    //Verificando que el usuario autenticado sea dueño del proyecto
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    //Se crea la tarea
    const tarea = new Tarea(req.body);
    await tarea.save();
    res.json({ tarea });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

//Obteniendo las tareas de un proyecto
exports.obtenerTareas = async (req, res) => {
  //Extrayendo el proyecto y comprobando si existe
  const { proyecto } = req.query; //id del proyecto

  try {
    const existeProyecto = await Proyecto.findById(proyecto);

    if (!existeProyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    //Verificando que el usuario autenticado sea dueño del proyecto
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    //Obteniendo las tareas
    const tareas = await Tarea.find({ proyecto });
    res.json({ tareas });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

//Actualizando una tarea
exports.actualizarTarea = async (req, res) => {
  try {
    //Extrayendo el proyecto
    const { proyecto, nombre, estado } = req.body; //id del proyecto

    //Comprobando si la tarea existe
    let tarea = await Tarea.findById(req.params.id);

    if (!tarea) {
      return res.status(404).json({ msg: "Tarea no encontrada" });
    }

    //Comprobando si el proyecto existe
    const existeProyecto = await Proyecto.findById(proyecto);

    //Verificando que el usuario autenticado sea dueño del proyecto
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    //Creando un objeto con la nueva información
    const nueva_tarea = {};
    nueva_tarea.nombre = nombre;
    nueva_tarea.estado = estado;

    //Guardando los cambios de la tarea
    tarea = await Tarea.findOneAndUpdate({ _id: req.params.id }, nueva_tarea, {
      new: true,
    });
    res.json({ tarea });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

//Eliminando una tarea
exports.eliminarTarea = async (req, res) => {
  try {
    //Extrayendo el proyecto
    const { proyecto } = req.query; //id del proyecto

    //Comprobando si la tarea existe
    let tarea = await Tarea.findById(req.params.id);

    if (!tarea) {
      return res.status(404).json({ msg: "Tarea no encontrada" });
    }

    //Comprobando si el proyecto existe
    const existeProyecto = await Proyecto.findById(proyecto);

    //Verificando que el usuario autenticado sea dueño del proyecto
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    //Eliminando la tarea
    await Tarea.findByIdAndRemove({ _id: req.params.id });
    res.json({ msg: "Tarea eliminada" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};
