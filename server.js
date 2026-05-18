const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let pedidos = [];

app.get("/", (req, res) => {
    res.send("Backend TPV activo");
});

app.post("/pedido", (req, res) => {

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

app.listen(3001, () => {
    console.log("Servidor funcionando puerto 3001");
});
