"use strict";

const Usuario = require("../models/UsuarioModel");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "variables.env" });

exports.autenticarUsuario = async (req, res) => {
  //Revisando si hay errores. La sig función regresa un arreglo
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }

  const { email, password } = req.body;

  try {
    //Revisando que el usuario esté registrado
    let usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ msg: "El usuario no está registrado" });
    }

    //Revisando el password del usuario
    const password_correcto = await bcryptjs.compare(
      password,
      usuario.password
    );
    if (!password_correcto) {
      return res.status(400).json({ msg: "La contraseña es incorrecta" });
    }

    //Creando y firmando el JWT si el email y el password son corectos
    const payload = {
      usuario: {
        id: usuario.id,
      },
    };

    jwt.sign(
      payload,
      process.env.SECRETA,
      {
        expiresIn: 3600, //una hora
      },
      (error, token) => {
        if (error) throw error;

        res.json({ token: token });
      }
    );
  } catch (error) {
    console.log(error);
  }
};

//Obteniendo el usuario autenticado
exports.usuarioAutenticado = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select("-password"); //Password no se mostrará
    res.json({ usuario });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error" });
  }
};
