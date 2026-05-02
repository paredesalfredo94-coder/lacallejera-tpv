const productos = [
 {nombre:"Clásica", precio:8.50, imagen:"img/clasica.png.jpeg"},
 {nombre:"Clásica doble", precio:10.00, imagen:"img/clasica-doble.png.jpeg"},
 {nombre:"Puro lomito", precio:12.00, imagen:"img/puro-lomito.png.jpeg"},
 {nombre:"Desmechadita", precio:12.00, imagen:"img/desmechadita.png.jpeg"},
 {nombre:"Mixta", precio:14.00, imagen:"img/mixta.png.jpeg"},
 {nombre:"Coca-Cola Original", precio:2.00, imagen:"img/coca-original.png.jpeg"},
 {nombre:"Coca-Cola Zero", precio:2.00, imagen:"img/coca-zero.png.jpeg"}
];

let venta = [];
let historial = JSON.parse(localStorage.getItem("historial")) || [];
let cajaDia = Number(localStorage.getItem("cajaDia")) || 0;
let fondoCaja = Number(localStorage.getItem("fondoCaja")) || 0;

function guardarTodo(){
    localStorage.setItem("historial", JSON.stringify(historial));
    localStorage.setItem("cajaDia", cajaDia);
    localStorage.setItem("fondoCaja", fondoCaja);
}

function renderProductos() {
let html = "";

productos.forEach((p,i)=>{

html += `
<button onclick="agregarProducto(${i})">

<img src="${p.imagen}">

<div class="infoProducto">
<div class="tituloProducto">${p.nombre}</div>
<div class="precioProducto">${p.precio.toFixed(2)}€</div>
</div>

</button>
`;

});

document.getElementById("productosGrid").innerHTML = html;
}

function agregarProducto(i){
    venta.push(productos[i]);
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

function cobrar(tipo) {

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

function descargarCSV() {

  let texto = "Fecha,Metodo,Total\n";

  historial.forEach(h => {
    texto += `${h.fecha},${h.tipo},${h.total}\n`;
  });

  let blob = new Blob([texto], { type: "text/csv" });
  let a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "ventas.csv";
  a.click();
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

renderProductos();
renderVenta();
renderHistorial();
renderCaja();
