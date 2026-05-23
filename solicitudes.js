"use strict";
 
/* ============================================================
   ESTADO GLOBAL — LocalStorage
   ============================================================ */
let estudiantes = JSON.parse(localStorage.getItem("estudiantes")) || [];
let asignaciones = JSON.parse(localStorage.getItem("asignaciones")) || [];
let Rutas = JSON.parse(localStorage.getItem("Rutas")) || [];
let editId = null;
let editIdR = null;
 
 
/* ============================================================
   REFERENCIAS AL DOM — ESTUDIANTES
   ============================================================ */
const tbody = document.querySelector("#tbody");
const btnNuevo = document.getElementById("btnNuevo");
const Modal = document.getElementById("modalE");
const btnCerrar = document.getElementById("cerrar");
const nombre = document.getElementById("nombre");
const edad = document.getElementById("edad");
const grado = document.getElementById("grado");
const telefono = document.getElementById("telefono");
const acudiente = document.getElementById("acudiente");
 
 
/* ============================================================
   REFERENCIAS AL DOM — RUTAS / CONDUCTORES
   ============================================================ */
const btnRutas = document.getElementById("btnRutas");
const btnCerrarR = document.getElementById("cerrarR");
const modalR = document.getElementById("modalR");
const formR = document.getElementById("formR");
const tbodyR = document.querySelector("#tbodyR");
const nombreRuta = document.getElementById("nombreR");
const conductor_nombre = document.getElementById("conductorNombre");
const email = document.getElementById("email");
const tiempo = document.getElementById("tiempoSalida");
 
 
/* ============================================================
   REFERENCIAS AL DOM — ASIGNACIONES Y UTILIDADES
   ============================================================ */
const ListaUsuarios = document.getElementById("listaUsuarios");
const listaEstudiantes = document.getElementById("listaTareas");
const form = document.getElementById("form");
const btnLimpiar = document.getElementById("btnLimpiar");
const btnCargar = document.getElementById("btnCargarUsuarios");
 
 
/* ============================================================
   PERSISTENCIA — LocalStorage
   ============================================================ */
function guardar() {
    localStorage.setItem("estudiantes", JSON.stringify(estudiantes));
    localStorage.setItem("asignaciones", JSON.stringify(asignaciones));
    localStorage.setItem("Rutas", JSON.stringify(Rutas));
}
 
 
/* ============================================================
   MÓDULO ESTUDIANTES — Render
   ============================================================ */
 
//SE CREA LA LISTA DE ESTUDIANTES EN LA TABLA, RECORRIENDO EL ARREGLO DE ESTUDIANTES 
// Y CREANDO UNA FILA POR CADA UNO CON SUS DATOS Y LOS BOTONES DE EDITAR Y ELIMINAR
   function render(data_usuarios){
    tbody.innerHTML="";
    data_usuarios.forEach(element => {
        tbody.innerHTML += `  
            <tr>
                <td>${element.nombre}</td>
                <td>${element.edad}</td>
                <td>${element.grado}</td>
                <td>${element.telefono}</td>
                <td>${element.acudiente}</td>
                <td>
                    <button class="editar" data-id="${element.id}">Editar</button>
                    <button class="eliminar" data-id="${element.id}">Eliminar</button>
                </td>
            </tr>
        ` 
    });
}
 
 
/* ============================================================
   MÓDULO ESTUDIANTES — Eventos del modal
   ============================================================ */
btnNuevo.addEventListener("click", function(){
    editId = null
    form.reset();
    Modal.classList.add("showE")
})
 
btnCerrar.addEventListener("click", function(){
    editId = null;
    Modal.classList.remove("showE")
})
 
document.addEventListener("keydown", (evento)=>{
    if(evento.key === "Escape"){
        Modal.classList.remove("showE");
    }
})
 
//GUARDAR
form.addEventListener("submit", function(event){
        event.preventDefault();
 
    // VALIDACION NOMBRE - solo letras y espacios
    //EL + SIGNIFICA QUE TIENE Q HABER ALMENOS UN CARACTER 
    const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    /**SI EL NOMBRE NO CUMPLE CON EL PATRON*/
    if(!soloLetras.test(nombre.value)){
        alert("El nombre solo puede contener letras");
        return;
    }
 
    // VALIDACION EDAD - entero entre 1 y 99
    const edadNum = Number(edad.value);
    if(isNaN(edadNum) || !Number.isInteger(edadNum) || edadNum < 1 || edadNum > 99){
        alert("La edad debe ser un número entero entre 1 y 99");
        return;
    }
 
    // VALIDACION GRADO - entero entre 1 y 11
    const gradoNum = Number(grado.value);
    if(isNaN(gradoNum) || !Number.isInteger(gradoNum) || gradoNum < 1 || gradoNum > 11){
        alert("El grado debe ser un número entero entre 1 y 11");
        return;
    }
 
    // VALIDACION TELEFONO - exactamente 10 numeros
    if(telefono.value.length !== 10 || isNaN(telefono.value)){
        alert("El teléfono debe tener exactamente 10 números");
        return;
    }
 
    // VALIDACION ACUDIENTE - solo letras y espacios
    if(!soloLetras.test(acudiente.value)){
        alert("El acudiente solo puede contener letras");
        return;
    }
 
 
        const data = {
            id: editId || Date.now(),
            nombre: nombre.value,
            edad: edad.value,
            grado: grado.value,
            telefono: telefono.value,
            acudiente: acudiente.value
        }
 
        if(editId){
            estudiantes = estudiantes.map(usere => {
               return usere.id === editId ? data : usere;
            })
        }else{
            estudiantes.push(data)
        }
        guardar();
        Modal.classList.remove("showE");
        alert("Estudiante agregado a la lista de estudiantes");
        render(estudiantes);
        console.log("estudiantes", estudiantes);
})
 
 
/* ============================================================
   MÓDULO ESTUDIANTES — Eventos de tabla (editar / eliminar)
   ============================================================ */
tbody.addEventListener("click", (evento) =>{
    const id = Number(evento.target.dataset.id);
    //ACCEDE AL ID DEL BOTON AL QUE SE LE HIZO CLICK PARA SABER QUE USUARIO QUEREMOS ELIMINAR O EDITAR
    if(evento.target.classList.contains("eliminar")) {
        if(!confirm("¿Desea realizar esta acción?")){
            return;
        }
        //SI CONTIENE LA CLASE ELIMINAR ENTONCES FILTRA EL ARREGLO DE ESTUDIANTES 
        // Y DEVUELVE SOLO LOS QUE NO COINCIDEN CON EL ID, 
        // ES DECIR, ELIMINA EL USUARIO QUE COINCIDE CON ESE ID
        estudiantes = estudiantes.filter(user => user.id !== id)
        render(estudiantes);
        guardar();
    }else{
        if(evento.target.classList.contains("editar")){
            if(!confirm("¿Desea realizar esta acción?")){
                return;
            }
            //ACCEDE AL ID DEL BOTON DE EDITAR Y BUSCA EN EL ARREGLO DE ESTUDIANTES EL USUARIO QUE COINCIDE CON ESE ID
            const usuario_editado = estudiantes.find(user => user.id === id)
            //SI ENCUENTRA AL USUARIO, LLENA EL FORMULARIO CON SUS DATOS Y MUESTRA EL MODAL PARA EDITAR
            if (usuario_editado) {
                editId = id;
                nombre.value = usuario_editado.nombre;
                edad.value = usuario_editado.edad,
                grado.value = usuario_editado.grado,
                telefono.value = usuario_editado.telefono,
                acudiente.value = usuario_editado.acudiente
                Modal.classList.add("showE");
                guardar();
            }
        }
    }
})
 
 
/* ============================================================
   MÓDULO RUTAS — Render
   ============================================================ */
function renderRutas(data_conductor){
    tbodyR.innerHTML="";
    data_conductor.forEach(element => {
        tbodyR.innerHTML += `  
            <tr>
                <td>${element.nombreR}</td>
                <td>${element.conductor_Nombre}</td>
                <td>${element.email}</td>
                <td>${element.tiempo}</td>
                <td>
                    <button class="editarR" data-id="${element.idR}">Editar</button>
                    <button class="eliminarR" data-id="${element.idR}">Eliminar</button>
                </td>
            </tr>
        ` 
    });
}
 
 
/* ============================================================
   MÓDULO RUTAS — Eventos del modal
   ============================================================ */
btnRutas.addEventListener("click", function(){
    editIdR = null
    formR.reset();
    modalR.classList.add("showR")
})
 
btnCerrarR.addEventListener("click", function(){
    editIdR = null;
    modalR.classList.remove("showR")
})
 
formR.addEventListener("submit", function(event){
        event.preventDefault();
 
         // VALIDACION NOMBRE RUTA - solo letras y espacios
        const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        if(!soloLetras.test(nombreRuta.value)){
            alert("El nombre de la ruta solo puede contener letras");
            return;
        }
 
        // VALIDACION NOMBRE CONDUCTOR - solo letras y espacios
        if(!soloLetras.test(conductor_nombre.value)){
            alert("El nombre del conductor solo puede contener letras");
            return;
        }
 
        const dataConductor = {
            idR: editIdR || Date.now(),
            nombreR: nombreRuta.value,
            conductor_Nombre: conductor_nombre.value,
            email: email.value,
            tiempo: tiempo.value,
        }
 
        if(editIdR){
            Rutas = Rutas.map(userConductor => {
               return userConductor.idR === editIdR ? dataConductor : userConductor;
            })
        }else{
            Rutas.push(dataConductor)
        }
        guardar();
        modalR.classList.remove("showR");
        alert("Ruta agregada a la lista de rutas");
        renderRutas(Rutas);
        renderUsers();
})
 
 
/* ============================================================
   MÓDULO RUTAS — Eventos de tabla (editar / eliminar)
   ============================================================ */
tbodyR.addEventListener("click", (evento) =>{
    const idR = Number(evento.target.dataset.id);
    if(evento.target.classList.contains("eliminarR")) { 
        if(!confirm("¿Desea realizar esta acción?")){
            return;
        }
        Rutas = Rutas.filter(user => user.idR !== idR)
        renderRutas(Rutas)
        renderUsers();
        cargarUsuarios.reset();
        guardar();
    }else{
        if(evento.target.classList.contains("editarR")){
            if(!confirm("¿Desea realizar esta acción?")){
                return;
            }
                const Rutas_editado = Rutas.find(user => user.idR === idR)
                if (Rutas_editado) {
                    editIdR = idR;
                    nombreRuta.value = Rutas_editado.nombreR;
                    conductor_nombre.value = Rutas_editado.conductor_Nombre,
                    email.value = Rutas_editado.email,
                    tiempo.value = Rutas_editado.tiempo,
                    modalR.classList.add("showR");
                    guardar();
                    renderUsers();
                }
        }
    }
})
 
 
/* ============================================================
   MÓDULO ASIGNACIONES — Render y eventos
   ============================================================ */
function renderEstudiantesAsignados() {
    listaEstudiantes.innerHTML = "";
    //INDEX ES EL SEGUNDO PARAMETRO DE FOREACH Y NOS PERMITE SABER EN QUE POSICION DEL ARREGLO ESTAMOS,
    //LO USAMOS PARA PODER ELIMINAR LA ASIGNACION CORRECTA CUANDO SE HAGA CLICK EN EL BOTON DE ELIMINAR
    asignaciones.forEach((asignacion, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${asignacion.nombre} fue asignado a la ruta de el conductor ${asignacion.nombreConductor}
            <button data-index="${index}" class="eliminar">
                X
            </button>
        `;
        listaEstudiantes.appendChild(li);
    });
}
 
listaEstudiantes.addEventListener("click", (e) => {
    if (e.target.classList.contains("eliminar")) {
        const index = Number(e.target.dataset.index);
        asignaciones.splice(index, 1);
        guardar();
        renderEstudiantesAsignados();
    }
});
 
 
/* ============================================================
   MÓDULO CONDUCTORES (CARDS) — Render y asignación
   ============================================================ */
function cargarUsuarios() {
    try {
        renderUsers();
    } catch (error) {
        ListaUsuarios.innerHTML = "<li>Error cargando usuarios</li>";
    }
}
 
function renderUsers() {
    ListaUsuarios.innerHTML = "";
    Rutas.forEach(user => {
        const li = document.createElement("li");
 
        const opcionesEstudiantes = estudiantes.map(estudiante => `
            <option value="${estudiante.id}">${estudiante.nombre}</option>
        `).join("");
 
        li.innerHTML = `
            <div class="user-card">
 
                <!-- Cabecera de la tarjeta -->
                <div class="user-card__header">
                    <div class="user-card__badge">🚌</div>
                    <div>
                        <div class="user-card__ruta">${user.nombreR}</div>
                        <div class="user-card__conductor">${user.conductor_Nombre}</div>
                    </div>
                </div>
 
                <!-- Datos del conductor -->
                <div class="user-card__body">
 
                    <div class="user-card__row">
                        <span class="user-card__label">✉️ Correo</span>
                        <span class="user-card__value">${user.email}</span>
                    </div>
 
                    <div class="user-card__row">
                        <span class="user-card__label">🕐 Hora de salida</span>
                        <span id="hora" class="user-card__time">${user.tiempo}</span>
                    </div>
 
                </div>
 
                <hr class="user-card__divider">
 
                <!-- Asignación de estudiante -->
                <div class="user-card__assign">
                    <label class="user-card__select-label">👦 Seleccione el estudiante</label>
                    <select name="estudiantes" id="estudiantes" class="user-card__select">
                        ${opcionesEstudiantes}
                    </select>
                    <button data-name="${user.conductor_Nombre}" class="agregarUser user-card__btn">
                        ＋ Asignar a la ruta
                    </button>
                </div>
 
            </div>
        `;
 
        ListaUsuarios.appendChild(li);
    });
}
 
/*Boton de asignar a la ruta */
ListaUsuarios.addEventListener("click", (e) => {
    if (e.target.classList.contains("agregarUser")) {
        /**ESTE BOTON GUARDA EL NOMBRE DEL CONDUCTOR AL QUE SE LE HIZO CLICK*/
        const nombreConductor = e.target.dataset.name;
        /*ACCEDEMOS AL SELECT QUE TIENE LOS NOMBRES Y ENTRAMOS A LA Q SE LE HIZO CLICK*/ 
        const select = e.target.parentElement.querySelector("select");
        /*DEVUELVE EL ID DE LA OPCION SELECCIONADA EN EL DEL SELECT*/ 
        const estudianteId = Number(select.value);
        /**BUSCA EL ID QUE COINCIDE CON EL DEL SELECT Y OBTIENE TODOS SUS DATOS EN ESTE CASO DEL ESTUDIANTE */
        const estudiante = estudiantes.find(est => est.id === estudianteId);
        /**SI ENCUENTRA AL ESTUDIANTE LE MANDA A ASIGNACIONES UN TEXTO */
        if (estudiante) {
 
            // VALIDACION - verificar si el estudiante ya tiene una ruta asignada
            //ES ASIGNACIONES BUSCA SI YA HAY UNA ASIGNACION CON EL ID DEL ESTUDIANTE QUE QUEREMOS ASIGNAR
            const yaAsignado = asignaciones.find(asignacion => asignacion.idEstudiante === estudianteId);
 
            if(yaAsignado){
                alert(`${estudiante.nombre} ya tiene una ruta asignada, debe eliminarlo primero`);
                return;
            }
 
            asignaciones.push({
                idEstudiante: estudiante.id,
                nombre: estudiante.nombre,
                nombreConductor: nombreConductor
            });
 
            guardar();
            renderEstudiantesAsignados();
        }
    }
});
 
 
/* ============================================================
   MÓDULO UTILIDADES — Botones generales
   ============================================================ */
btnLimpiar.addEventListener("click", ()=>{
    asignaciones = [];
    guardar();
    renderEstudiantesAsignados();

     const evento = new CustomEvent("asignacionesLimpiadas", {
        detail: { mensaje: "Todas las asignaciones fueron eliminadas" }
    });
    //esto manda el evento como si fuera una carta
    document.dispatchEvent(evento);
})
//aca lo recibe y escribe en la consola y en el alert como funcionalidad del evento
document.addEventListener("asignacionesLimpiadas", (e) => {
    console.log("🧹 Custom Event recibido:", e.detail.mensaje);
    alert("Todas las asignaciones fueron eliminadas 🧹")
});
 
let cargadosUsuarios = false;
 
btnCargar.addEventListener("click", function(){
    if(!cargadosUsuarios){
        cargarUsuarios();
        cargadosUsuarios = true;
        btnCargar.textContent = "Ocultar conductores";
    }else{
        ListaUsuarios.innerHTML = "";
        cargadosUsuarios = false;
        btnCargar.textContent = "Cargar conductores";
    }
});
 
 
/* ============================================================
   INICIALIZACIÓN — Carga inicial al abrir la página
   ============================================================ */
render(estudiantes); //MUESTRA ESTUDIANTES
renderRutas(Rutas); //MUESTRA RUTAS
renderEstudiantesAsignados(); //MUESTRA LAS ASIGNACIONES DE ESTUDIANTES A RUTAS
 
 
/* ============================================================
   API - SHADOW DOM - TEMPLATE
   ============================================================ */
//ESTO DICE QUE SERA UN HTML CUSTOM ELEMENT LLAMADO <weather-card>
class WeatherCard extends HTMLElement {
//EL CONSTRUCTOR SE EJECUTA CUANDO SE CREA EL ELEMENTO EN EL DOM
//AQUI DEFINIMOS SU ESTRUCTURA Y ESTILOS
            constructor() {
//SIEMPRE QUE SE CREA UN CUSTOM ELEMENT, 
//DEBEMOS LLAMAR A SUPER() PRIMERO PARA HEREDAR 
//LAS PROPIEDADES DE HTMLElement
                super();
//CREAMOS UN SHADOW DOM PARA QUE LOS ESTILOS Y
//LA ESTRUCTURA DE ESTE COMPONENTE NO INTERFIERAN 
//CON EL RESTO DE LA PAGINA
                this.attachShadow({ mode: "open" });
//CREA UN DIV LLAMADO CARD Y LE AGREGA LA CLASE
//CARD PARA ESTILIZARLO
                const card = document.createElement("div");
                card.classList.add("card");
                card.innerHTML = `
                    <h1 id="ciudad"></h1>
                    <img id="icono">
                    <h2 id="temperatura"></h2>
                    <p id="descripcion"></p>
                `;
 
                const style = document.createElement("style");
                style.textContent = `
 
                    /* TARJETA PRINCIPAL */
                    .card {
                        width: 280px;
                        padding: 24px 20px;
                        border-radius: 16px;
                        background: white;
                        border-top: 5px solid #2563eb;
                        box-shadow: 0 4px 20px rgba(0, 100, 200, 0.08);
                        text-align: center;
                        font-family: Arial, sans-serif;
                        position: relative;
                        overflow: hidden;
                    }
 
                    /* Esquina decorativa igual que .section */
                    .card::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        right: 0;
                        width: 80px;
                        height: 80px;
                        background: linear-gradient(135deg, #eff6ff, transparent);
                        border-radius: 0 16px 0 100%;
                    }
 
                    /* CIUDAD */
                    h1 {
                        font-size: 18px;
                        font-weight: 800;
                        color: #1e3a5f;
                        letter-spacing: 1px;
                        text-transform: uppercase;
                        margin-bottom: 8px;
                    }
 
                    /* ICONO */
                    img {
                        width: 80px;
                        filter: drop-shadow(0 2px 6px rgba(37, 99, 235, 0.2));
                    }
 
                    /* TEMPERATURA */
                    h2 {
                        font-size: 36px;
                        font-weight: 800;
                        color: #2563eb;
                        margin: 6px 0;
                    }
 
                    /* DESCRIPCION */
                    p {
                        text-transform: capitalize;
                        font-size: 13px;
                        color: #6b7280;
                        font-weight: 600;
                        letter-spacing: 0.5px;
                    }
 
                `;
                //ESTO HACE QUE LOS ESTILOS Y LA ESTRUCTURA 
                // SE APLIQUEN SOLO A ESTE COMPONENTE Y NO 
                //INTERFIERAN CON EL RESTO DE LA PAGINA
                this.shadowRoot.append(style, card);
            }
            //SE EJECUTA CUANDO EL COMPONENTE CUANDO SE AGREGA AL DOM
            async connectedCallback() {
 
                const API_KEY = "b1586b901c00a7c1cb7084e7943463f6"; // 
                const ciudad = "Bucaramanga";
 
                try {
                    //HACE LA SOLICITUD A LA API DE OPENWEATHER EN SU HTTP PARA OBTENER 
                    //LOS DATOS DEL CLIMA DE LA CIUDAD
                    const respuesta = await fetch(
                        `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${API_KEY}&units=metric&lang=es`
                    );
 
                    if (!respuesta.ok) {
                        //SI LA RESPUESTA NO ES OK, OBTIENE EL MENSAJE DE ERROR 
                        // LO CONVIERTE EN UN JSON DE 
                        // LA API Y LO MUESTRA EN CONSOLA
                        const err = await respuesta.json();
                        console.error("Error API:", err.message);
                        return;
                    }
                    //TRANSFORMA LA RESPUESTA EN UN OBJETO
                    //PARA PODER USAR SUS DATOS
                    const data = await respuesta.json();
                    //LLENA LOS ELEMENTOS DE LA TARJETA CON LOS DATOS OBTENIDOS DE LA API
                    this.shadowRoot.getElementById("ciudad")
                        .textContent = data.name;
                    //MUESTRA LA TEMPERATURA REDONDEADA Y CON EL 
                    //SIMBOLO DE GRADOS CELSIUS
                    //MATH.ROUND REDONDEA EL NUMERO AL ENTERO MAS CERCANO
                    this.shadowRoot.getElementById("temperatura")
                        .textContent = Math.round(data.main.temp) + "°C";
                    //LA DESCRIPCION DEL CLIMA LA OBTIENE DE LA PROPIEDAD 
                    //WEATHER QUE ES UN ARREGLO Y EL PRIMER ELEMENTO
                    //TIENE LA DESCRIPCION
                    this.shadowRoot.getElementById("descripcion")
                        .textContent = data.weather[0].description;
                    //EL ICONO DEL CLIMA LO OBTIENE DE LA PROPIEDAD WEATHER
                    this.shadowRoot.getElementById("icono")
                        .src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
                
                } catch (error) {
                    //SI HAY UN ERROR DE RED O CORS, LO MUESTRA EN CONSOLA
                    console.error("Error de red o CORS:", error);
                }
            }
        }
        //REGISTRA EL COMPONENETE PARA QUE PUEDA SER USADO 
        // EN EL HTML COMO <weather-card></weather-card>
        customElements.define("weather-card", WeatherCard);