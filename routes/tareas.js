"use strict";

const express = require("express");
const router = express.Router();
const tareaController = require("../controllers/tareaController");
const auth = require("../middleware/autenticacion");
const { check } = require("express-validator");

//Creando una tarea con end point api/tareas
router.post(
  "/",
  auth,
  [
    check("nombre", "El nombre de la tarea es necesario").not().isEmpty(),
    check("proyecto", "El proyecto es obligatorio").not().isEmpty(),
  ],
  tareaController.crearTarea
);

//Obteniendo las tareas por proyecto
router.get("/", auth, tareaController.obtenerTareas);

//Actualizando una tarea
router.put("/:id", auth, tareaController.actualizarTarea);

//Eliminando una tarea
router.delete("/:id", auth, tareaController.eliminarTarea);

module.exports = router;
