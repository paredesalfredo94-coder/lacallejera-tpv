const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let pedidos = [];

app.get("/", (req, res) => {
    res.send("Backend TPV activo");
});

app.post("/pedido", (req, res) => {

    console.log("BODY:", req.body);
  
    const pedido = req.body;

    pedidos.push(pedido);

    console.log("Nuevo pedido:", pedido);

    res.json({
        ok: true,
        mensaje: "Pedido recibido"
    });

});

app.get("/pedidos", (req, res) => {
    res.json(pedidos);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log("Servidor funcionando puerto " + PORT);
});
