"use strict";

const Usuario = require("../models/UsuarioModel");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "variables.env" });

exports.crearUsuario = async (req, res) => {
  //Revisando si hay errores. La sig función regresa un arreglo
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }

  //Extrayendo email y password del req
  const { email, password } = req.body;

  try {
    let usuario = await Usuario.findOne({ email });

    if (usuario) {
      return res.status(400).json({
        msg:
          "Este email ya se encuentra en nuestra base de datos, por lo que no podemos completar tu registro",
      });
    }

    //creando el nuevo usuario en la bd
    usuario = new Usuario(req.body);

    //Hash al password
    const salt = await bcryptjs.genSalt(10);
    usuario.password = await bcryptjs.hash(password, salt);

    //guardando el nuevo usuario
    await usuario.save();

    //Creando y firmando el JWT
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
  } catch (err) {
    console.log(err);
    res.status(400).send("Error al crear el nuevo usuario");
  }
};
