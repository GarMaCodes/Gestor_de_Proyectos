"use strict";

const Proyecto = require("../models/ProyectoModel");
const { validationResult } = require("express-validator");

exports.crearProyecto = async (req, res) => {
  //Revisando si hay errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }

  try {
    //Creando un nuevo proyecto
    const proyecto = new Proyecto(req.body);

    //Guardando el creador del proyecto vía jwt
    proyecto.creador = req.usuario.id;

    //Guardando el proyecto en la db
    proyecto.save();
    res.json(proyecto);
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

//Obteniendo los proyectos del usuario autenticado
exports.getProjects = async (req, res) => {
  try {
    const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({
      creado: -1,
    });
    //.sort -1 cambia el orden de los proyectos a desc
    res.json({ proyectos });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error al obtener los proyectos");
  }
};

//Actualiza un proyecto
exports.actualizarProyecto = async (req, res) => {
  //Revisando si hay errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }

  //Extrayendo la info del proyecto
  const { nombre } = req.body;
  //Se declara un objeto vacío por si se agregan más campos al proyecto aparte
  //del nombre
  const nuevoProyecto = {};

  if (nombre) {
    nuevoProyecto.nombre = nombre;
  }

  try {
    //Obteniendo el id del proyecto y comprobando su existencia
    let proyecto = await Proyecto.findById(req.params.id);

    if (!proyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    //Verificando que el proyecto pertenezca al usuario autenticado
    if (proyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    //Se actualiza el proyecto
    proyecto = await Proyecto.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: nuevoProyecto },
      { new: true }
    );

    res.json({ proyecto });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor");
  }
};

//Elimina un proyecto por su id
exports.eliminarProyecto = async (req, res) => {
  try {
    //Obteniendo el id del proyecto
    let proyecto = await Proyecto.findById(req.params.id);

    if (!proyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    if (proyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    await Proyecto.findOneAndRemove({ _id: req.params.id });
    res.json({ msg: "Proyecto eliminado" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor");
  }
};
