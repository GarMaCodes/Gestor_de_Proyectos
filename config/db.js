"use strict";
//Conectando el proyecto a la base de datos
const mongoose = require("mongoose");
require("dotenv").config({ path: "variables.env" });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_MONGO, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
    });
    console.log(
      "Conexión a la base de datos gestion_proyectos establecida con éxito"
    );
  } catch (error) {
    console.log(error);
    process.exit(1); //Detiene la aplicación
  }
};

module.exports = connectDB;
