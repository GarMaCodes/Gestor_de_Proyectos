"use strict";

//Creamos un middleware personalizado
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  //Obteniendo el token del header
  const token = req.header("x-auth-token");
  //Se envía desde postman
  //console.log(token);

  //Revisando que exista un token
  if (!token)
    return res.status(401).json({ msg: "No hay token, permiso denegado" });

  //Validando el token
  try {
    const cifrado = jwt.verify(token, process.env.SECRETA);
    req.usuario = cifrado.usuario;
    next(); //Para que vaya al siguiente middlware
  } catch (error) {
    return res.status(401).json({ msg: "El token no es válido" });
  }
};
