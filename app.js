const productos = [

{
categoria:"🍔 Hamburguesas",
nombre:"La clásica de la calle",
precio:8.50,
imagen:"img/clasica.png.jpeg"
},

{
categoria:"🍔 Hamburguesas",
nombre:"La clásica de la calle doble",
precio:10.00,
imagen:"img/clasica-doble.png.jpeg"
},

{
categoria:"🍔 Hamburguesas",
nombre:"Puro lomito",
precio:12.00,
imagen:"img/puro-lomito.png.jpeg"
},

{
categoria:"🍔 Hamburguesas",
nombre:"Desmechadita",
precio:12.00,
imagen:"img/desmechadita.png.jpeg"
},

{
categoria:"🍔 Hamburguesas",
nombre:"La mixta de la calle",
precio:14.00,
imagen:"img/mixta.png.jpeg"
},



// MENÚS

{
categoria:"📦 Menús",
nombre:"Menú clásico",
precio:12.00,
imagen:"img/menu-clasico.png.jpeg"
},

{
categoria:"📦 Menús",
nombre:"Menú doble",
precio:13.50,
imagen:"img/menu-doble.png.jpeg"
},

{
categoria:"📦 Menús",
nombre:"Menú lomito",
precio:15.00,
imagen:"img/menu-lomito.png.jpeg"
},

{
categoria:"📦 Menús",
nombre:"Menú desmechada",
precio:15.00,
imagen:"img/menu-desmechada.png.jpeg"
},

{
categoria:"📦 Menús",
nombre:"Menú mixta",
precio:16.50,
imagen:"img/menu-mixta.png.jpeg"
},



// COMPLEMENTOS

{
categoria:"🍟 Complementos",
nombre:"Patatas fritas",
precio:1.50,
imagen:"img/patatas.png.jpeg"
},



// BEBIDAS

{
categoria:"🥤 Bebidas",
nombre:"Coca-Cola",
precio:2.00,
imagen:"img/coca-cola.png.jpeg"
},



// EXTRAS

{
categoria:"➕ Extras",
nombre:"Extra queso cheddar",
precio:0.50,
imagen:"img/cheddar.png.jpeg"
},

{
categoria:"➕ Extras",
nombre:"Extra bacon",
precio:0.50,
imagen:"img/bacon.png.jpeg"
},

{
categoria:"➕ Extras",
nombre:"Extra pepinillos",
precio:0.50,
imagen:"img/pepinillos.png.jpeg"
},

{
categoria:"➕ Extras",
nombre:"Extra huevo",
precio:0.50,
imagen:"img/huevo.png.jpeg"
}

];

let venta = [];
let historial = JSON.parse(localStorage.getItem("historial")) || [];
let cajaDia = Number(localStorage.getItem("cajaDia")) || 0;
let fondoCaja = Number(localStorage.getItem("fondoCaja")) || 0;
let extrasRapidos = [];

function getFechaHoy() {
    let hoy = new Date();
    return hoy.toISOString().split("T")[0];
}

function verificarCambioDia() {
    let ultimaFecha = localStorage.getItem("fechaCaja");
    let hoy = getFechaHoy();

    if (ultimaFecha !== hoy) {
        localStorage.setItem("historial", JSON.stringify([]));
        localStorage.setItem("cajaDia", 0);
        localStorage.setItem("fechaCaja", hoy);
    }
}

function guardarTodo(){
    localStorage.setItem("historial", JSON.stringify(historial));
    localStorage.setItem("cajaDia", cajaDia);
    localStorage.setItem("fondoCaja", fondoCaja);
}

function renderProductos() {

let html = "";

const categorias = [...new Set(productos.map(p => p.categoria))];

categorias.forEach(categoria => {

html += `
<div class="categoria-titulo">
${categoria}
</div>

<div class="categoria-grid">
`;

productos
.filter(p => p.categoria === categoria)
.forEach((p, i) => {

html += `
<div class="producto" onclick="agregarProducto(${productos.indexOf(p)})">

<img src="${p.imagen}">

<h3>${p.nombre}</h3>

<p>${p.precio.toFixed(2)}€</p>

</div>
`;

});

html += `</div>`;

});

document.getElementById("productosGrid").innerHTML = html;

}

function agregarProducto(i){

const producto = productos[i];

venta.push(producto);

renderVenta();

if(
producto.categoria === "🍔 Hamburguesas" ||
producto.categoria === "📦 Menús"
){

mostrarExtras();

}



// SOLO hamburguesas y menús

if(
producto.categoria === "🍔 Hamburguesas" ||
producto.categoria === "📦 Menús"
){

mostrarExtras();

}



let extrasSeleccionados = [];

function mostrarExtras(){

extrasSeleccionados = [];

document.querySelectorAll(".extra-btn")
.forEach(btn => btn.classList.remove("active"));

document.getElementById("extrasModal").style.display = "flex";

}


function toggleExtra(btn,nombre,precio){

btn.classList.toggle("active");

const existe = extrasSeleccionados.find(e => e.nombre === nombre);

if(existe){

extrasSeleccionados =
extrasSeleccionados.filter(e => e.nombre !== nombre);

}else{

extrasSeleccionados.push({
nombre:nombre,
precio:precio,
imagen:""
});

}

}


function confirmarExtras(){

extrasSeleccionados.forEach(extra => {

venta.push(extra);

});

renderVenta();

cerrarExtras();

}


function cerrarExtras(){

document.getElementById("extrasModal").style.display = "none";

}


const agregarBacon = confirm("¿Agregar bacon +0.50€?");

if(agregarBacon){

venta.push({
nombre:"Extra bacon",
precio:0.50,
imagen:"img/bacon.png.jpeg"
});

}


const agregarPepinillos = confirm("¿Agregar pepinillos +0.50€?");

if(agregarPepinillos){

venta.push({
nombre:"Extra pepinillos",
precio:0.50,
imagen:"img/pepinillos.png.jpeg"
});

}


const agregarHuevo = confirm("¿Agregar huevo +0.50€?");

if(agregarHuevo){

venta.push({
nombre:"Extra huevo",
precio:0.50,
imagen:"img/huevo.png.jpeg"
});

}

renderVenta();

}

function renderVenta(){
    let html = "";
    let total = 0;

    venta.forEach(v=>{
        total += v.precio;
        html += `<div class="linea">${v.nombre} - ${v.precio.toFixed(2)}€</div>`;
    });

    document.getElementById("listaVenta").innerHTML = html || "Sin productos";
    document.getElementById("total").innerText = total.toFixed(2)+"€";
}

function vaciarVenta(){
    venta = [];
    renderVenta();
}

function renderHistorial() {

  let html = "";

  historial.slice(0,10).forEach(h => {

    html += `
      <div class="ticket-item">
        ${h.fecha}<br>
        ${h.tipo} - ${h.total.toFixed(2)}€
      </div>
    `;
  });

  document.getElementById("historial").innerHTML = html;
}

function renderCaja() {
  let totalCaja = cajaDia + fondoCaja;
  document.getElementById("cajaDia").innerText = totalCaja.toFixed(2) + "€";
}

function ponerFondoCaja(){

    let cantidad = prompt("Cantidad fondo caja:");

    if(!cantidad) return;

    cantidad = Number(cantidad);

    if(isNaN(cantidad)) return;

    fondoCaja += cantidad;

    guardarTodo();
    renderCaja();

    alert("Fondo agregado correctamente");
}

function descargarExcel() {

    let historial = JSON.parse(localStorage.getItem("historial")) || [];

    if (historial.length === 0) {
        alert("No hay ventas para exportar");
        return;
    }

    let datos = [];

    let totalEfectivo = 0;
    let totalTarjeta = 0;
    let totalBizum = 0;

    historial.forEach(v => {
        datos.push({
            Fecha: v.fecha,
            Metodo: v.tipo,
            Total: v.total
        });

        if (v.tipo === "Efectivo") totalEfectivo += v.total;
        if (v.tipo === "Tarjeta") totalTarjeta += v.total;
        if (v.tipo === "Bizum") totalBizum += v.total;
    });

    let totalGeneral = totalEfectivo + totalTarjeta + totalBizum;

    // Añadir resumen al final
    datos.push({});
    datos.push({ Fecha: "RESUMEN" });
    datos.push({ Metodo: "Efectivo", Total: totalEfectivo });
    datos.push({ Metodo: "Tarjeta", Total: totalTarjeta });
    datos.push({ Metodo: "Bizum", Total: totalBizum });
    datos.push({ Metodo: "TOTAL GENERAL", Total: totalGeneral });

    let ws = XLSX.utils.json_to_sheet(datos);
    let wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Ventas");

    XLSX.writeFile(wb, "cierre_caja.xlsx");
}

async function cobrar(tipo) {

    if (venta.length === 0) return;

    let total = venta.reduce((a, b) => a + b.precio, 0);

    let ticket = {
        fecha: new Date().toLocaleString(),
        tipo: tipo,
        productos: [...venta],
        total: total
    };

    historial.unshift(ticket);
    cajaDia += total;

    guardarTodo();
    renderHistorial();
    renderCaja();
    descargarTicket(ticket);

    try {

        const res = await fetch("https://system-burger-tpv-api.zklm7v.easypanel.host/pedido", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(ticket)
        });

        const data = await res.json();

        console.log("Pedido enviado:", data);

    } catch(err) {

        console.error("ERROR FETCH:", err);

    }

    venta = [];
    renderVenta();
}

function descargarTicket(t) {

  let texto = "LA CALLEJERA\n\n";
  texto += t.fecha + "\n\n";

  t.productos.forEach(p => {
    texto += p.nombre + " - " + p.precio.toFixed(2) + "€\n";
  });

  texto += "\nPago: " + t.tipo;
  texto += "\nTOTAL: " + t.total.toFixed(2) + "€";

  let blob = new Blob([texto], { type: "text/plain" });
  let a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "ticket.txt";
  a.click();
}

function adminLogin() {

  let pass = prompt("Contraseña admin:");

  if (pass === "callejera2026") {
    adminPanel();
  } else {
    alert("Incorrecta");
  }
}

function adminPanel() {

  let nombre = prompt("Nuevo producto:");
  if (!nombre) return;

  let precio = parseFloat(prompt("Precio:"));

  productos.push({
    nombre: nombre,
    precio: precio
  });

  renderProductos();
}

function imprimirTicket(){

if(venta.length === 0) return;

let fecha = new Date().toLocaleString();

let contenido = `
<html>
<head>
<title>Ticket</title>
<style>
body{
font-family: monospace;
padding:20px;
font-size:18px;
width:300px;
}
h2,h3{
text-align:center;
margin:5px 0;
}
.linea{
display:flex;
justify-content:space-between;
margin:6px 0;
}
hr{
margin:10px 0;
}
.total{
font-size:24px;
font-weight:bold;
text-align:right;
}
</style>
</head>
<body>

<h2>LA CALLEJERA</h2>
<h3>TPV PRO MAX</h3>
<hr>
<div>${fecha}</div>
<hr>
`;

let total = 0;

venta.forEach(v=>{

    total += v.precio;

    contenido += `
    <div class="linea">
        <span>${v.nombre}</span>
        <span>${v.precio.toFixed(2)}€</span>
    </div>
    `;
});

contenido += `
<hr>
<div class="total">TOTAL: ${total.toFixed(2)}€</div>
<hr>
<h3>Gracias por su compra</h3>

</body>
</html>
`;

let win = window.open("", "", "width=350,height=700");
win.document.write(contenido);
win.document.close();
win.print();
}

verificarCambioDia();

renderProductos();
renderVenta();
renderHistorial();
renderCaja();

function cerrarCaja() {

    let historial = JSON.parse(localStorage.getItem("historial")) || [];
    let fondoCaja = Number(localStorage.getItem("fondoCaja")) || 0;

    let efectivo = 0;
    let tarjeta = 0;
    let bizum = 0;

    historial.forEach(v => {
        if (v.tipo === "Efectivo") efectivo += v.total;
        if (v.tipo === "Tarjeta") tarjeta += v.total;
        if (v.tipo === "Bizum") bizum += v.total;
    });

    let totalVentas = efectivo + tarjeta + bizum;
    let cajaEsperada = fondoCaja + efectivo;

    let resumen =
`🔒 CIERRE DE CAJA

📅 ${new Date().toLocaleString()}

💵 Efectivo: ${efectivo.toFixed(2)}€
💳 Tarjeta: ${tarjeta.toFixed(2)}€
📱 Bizum: ${bizum.toFixed(2)}€

🧾 TOTAL VENTAS: ${totalVentas.toFixed(2)}€

💰 Fondo inicial: ${fondoCaja.toFixed(2)}€
🏦 Caja esperada (solo efectivo): ${cajaEsperada.toFixed(2)}€

¿Cerrar caja ahora?`;

    if (confirm(resumen)) {
        localStorage.setItem("historial", JSON.stringify([]));
        localStorage.setItem("cajaDia", 0);

        venta = [];
        renderVenta();
        renderHistorial();
        renderCaja();

        alert("✅ Caja cerrada correctamente");
    }
}
