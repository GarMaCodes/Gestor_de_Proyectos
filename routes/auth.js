"use strict";

//Rutas para autenticar usuarios
const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const authController = require("../controllers/authController");
const auth = require("../middleware/autenticacion");

//Iniciando Sesión
//Autenticando usuario con end point api/auth
router.post(
  "/",
  /*[
    check("email", "Introduce un email válido").isEmail(),
    check(
      "password",
      "La contraseña debe ser de 6 caracteres como mínimo"
    ).isLength({ min: 6 }),
  ],*/
  authController.autenticarUsuario
);

//Obteniendo el usuario autenticado
router.get("/", auth, authController.usuarioAutenticado);

module.exports = router;
