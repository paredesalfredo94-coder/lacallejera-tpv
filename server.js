const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const fetch = require("node-fetch");

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

app.post("/pedido", async (req, res) => {

    console.log("BODY:", req.body);
  
    const pedido = req.body;

    pedidos.push(pedido);

    console.log("Nuevo pedido:", pedido);
 try {

    await fetch("http://evolution-api:8080/message/sendText/System_burger", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "apikey": "429683C4C977415CAAFCCE10F7D57E11"
        },

        body: JSON.stringify({
            number: "34641230579",
            text: `🍔 NUEVO PEDIDO

💳 Pago: ${pedido.tipo}

💰 Total: ${pedido.total}€

📄 Productos:
${pedido.productos.map(p => `• ${p.nombre}`).join("\n")}
`
        })
    });

    console.log("WhatsApp enviado");

} catch (err) {

    console.log("Error WhatsApp:", err);

}

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
