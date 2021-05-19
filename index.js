const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

//Creando el servidor
const app = express();

//Conectando a la base de datos
connectDB();

//Habilitando cors
app.use(cors());

//Habilitar express.json en lugar de body-parser
app.use(express.json({ extended: true }));

//Puerto del servidor
const port = process.env.port || 4000; //Si no existe el puerto se asigna 4000

//Importando rutas Middlewares
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/proyectos", require("./routes/proyectos"));
app.use("/api/tareas", require("./routes/tareas"));

//Arrancando el servidor
app.listen(port, "0.0.0.0", () => {
  console.log(`El servidor está funcionando en el puerto ${port}`);
});
