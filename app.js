const productos = [
 {nombre:"Clásica", precio:8.50},
 {nombre:"Clásica doble", precio:10.00},
 {nombre:"Puro lomito", precio:12.00},
 {nombre:"Desmechadita", precio:12.00},
 {nombre:"Mixta", precio:14.00},
 {nombre:"Coca-Cola Original", precio:2.00},
 {nombre:"Coca-Cola Zero", precio:2.00}
];

let venta = [];

function renderProductos() {
    let html = "";

    productos.forEach((p,i)=>{
        html += `
        <button onclick="agregarProducto(${i})">
            ${p.nombre}<br>
            ${p.precio.toFixed(2)}€
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

renderProductos();
renderVenta();

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

  historial.slice(0, 10).forEach(h => {
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
  document.getElementById("cajaDia").innerText = cajaDia.toFixed(2) + "€";
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

  guardarTodo();
  renderProductos();
}

renderProductos();
renderVenta();
renderHistorial();
renderCaja();
