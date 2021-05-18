"use strict";

const express = require("express");
const router = express.Router();
const proyectoController = require("../controllers/proyectoController");
const auth = require("../middleware/autenticacion");
const { check } = require("express-validator");

//Creando proyecto con end point api/proyectos
router.post(
  "/",
  auth,
  [check("nombre", "El nombre del proyecto es necesario").not().isEmpty()],
  proyectoController.crearProyecto
);

//Obteniendo todos los proyectos
router.get("/", auth, proyectoController.getProjects);

//Actualizando un priyecto vía id /:id = comodín
router.put(
  "/:id",
  auth,
  [check("nombre", "El nombre del proyecto es necesario").not().isEmpty()],
  proyectoController.actualizarProyecto
);

//Eliminando un proyecto
router.delete("/:id", auth, proyectoController.eliminarProyecto);

module.exports = router;
