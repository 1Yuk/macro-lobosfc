// Incremento y decremento con almacenamiento
function increment(id) {
    const totalElement = document.getElementById(id + "-total");
    const newValue = parseInt(totalElement.innerText) + 1;
    totalElement.innerText = newValue;
    localStorage.setItem(id + "-total", newValue);
}

function decrement(id) {
    const totalElement = document.getElementById(id + "-total");
    const currentValue = parseInt(totalElement.innerText);
    if (currentValue > 0) {
        const newValue = currentValue - 1;
        totalElement.innerText = newValue;
        localStorage.setItem(id + "-total", newValue);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const $btnExportar = document.querySelector("#btnExportar");
    const $btnExportarRival = document.querySelector("#btnExportarRival");
    const $tabla1 = document.querySelector("#tabla1");
    const $tabla2 = document.querySelector("#tabla2");

    // Exportar la primera tabla
    $btnExportar.addEventListener("click", function () {
        let tableExport = new TableExport($tabla1, {
            exportButtons: false,
            filename: "Reporte_Equipo",
            sheetname: "Reporte_Equipo",
        });
        let datos = tableExport.getExportData();
        let preferenciasDocumento = datos.tabla1.xlsx;
        tableExport.export2file(
            preferenciasDocumento.data,
            preferenciasDocumento.mimeType,
            preferenciasDocumento.filename,
            preferenciasDocumento.fileExtension,
            preferenciasDocumento.merges,
            preferenciasDocumento.RTL,
            preferenciasDocumento.sheetname
        );
    });

    // Exportar la segunda tabla (rival)
    $btnExportarRival.addEventListener("click", function () {
        let tableExport = new TableExport($tabla2, {
            exportButtons: false,
            filename: "Reporte_Rival",
            sheetname: "Reporte_Rival",
        });
        let datos = tableExport.getExportData();
        let preferenciasDocumento = datos.tabla2.xlsx;
        tableExport.export2file(
            preferenciasDocumento.data,
            preferenciasDocumento.mimeType,
            preferenciasDocumento.filename,
            preferenciasDocumento.fileExtension,
            preferenciasDocumento.merges,
            preferenciasDocumento.RTL,
            preferenciasDocumento.sheetname
        );
    });

    let segundos1 = parseInt(localStorage.getItem("segundos1") || 0);
    let segundos2 = parseInt(localStorage.getItem("segundos2") || 0);
    let intervalId;

    // Función para recuperar y mostrar valores de localStorage
    function recuperarEstado() {
        actualizarContador("contadorTiempo1", segundos1);
        actualizarContador("contadorTiempo2", segundos2);

        // Recupera y muestra nombres de los equipos
        document.getElementById("header-equipo").value = localStorage.getItem("headerEquipo") || "";
        document.getElementById("header-rival").value = localStorage.getItem("headerRival") || "";
        document.getElementById("btnTiempo1").textContent = localStorage.getItem("headerEquipo") || "Tiempo 1";
        document.getElementById("btnTiempo2").textContent = localStorage.getItem("headerRival") || "Tiempo 2";

        // Recupera y muestra valores de los contadores
        document.querySelectorAll("[id$='-total']").forEach(element => {
            const id = element.id;
            element.innerText = localStorage.getItem(id) || 0;
        });
    }

    // Llamar a la función de recuperación al cargar la página
    recuperarEstado();

    // Función para actualizar y guardar los contadores de tiempo
    function actualizarContador(id, segundos) {
        const minutos = Math.floor(segundos / 60);
        const seg = segundos % 60;
        document.getElementById(id).textContent =
            `${String(minutos).padStart(2, '0')}:${String(seg).padStart(2, '0')}`;
    }

    function iniciarContador(contadorId) {
        clearInterval(intervalId);
        intervalId = setInterval(() => {
            if (contadorId === 1) {
                segundos1++;
                actualizarContador("contadorTiempo1", segundos1);
                localStorage.setItem("segundos1", segundos1);
            } else {
                segundos2++;
                actualizarContador("contadorTiempo2", segundos2);
                localStorage.setItem("segundos2", segundos2);
            }
        }, 1000);
    }

    function pausarContadores() {
        clearInterval(intervalId);
    }

    function reiniciarContadores() {
        clearInterval(intervalId);
        segundos1 = 0;
        segundos2 = 0;
        actualizarContador("contadorTiempo1", segundos1);
        actualizarContador("contadorTiempo2", segundos2);
        localStorage.setItem("segundos1", 0);
        localStorage.setItem("segundos2", 0);
    }

    // Eventos de botones
    document.getElementById("btnTiempo1").addEventListener("click", () => iniciarContador(1));
    document.getElementById("btnTiempo2").addEventListener("click", () => iniciarContador(2));
    document.getElementById("btnPausar").addEventListener("click", pausarContadores);
    document.getElementById("btnResetear").addEventListener("click", reiniciarContadores);

    // Almacenar los nombres de los equipos en localStorage al cambiar
    document.getElementById("header-equipo").addEventListener("input", function () {
        const nuevoTexto = this.value;
        document.getElementById("btnTiempo1").textContent = nuevoTexto;
        localStorage.setItem("headerEquipo", nuevoTexto);
    });

    document.getElementById("header-rival").addEventListener("input", function () {
        const nuevoTexto = this.value;
        document.getElementById("btnTiempo2").textContent = nuevoTexto;
        localStorage.setItem("headerRival", nuevoTexto);
    });

    // Función para restablecer todos los valores a los predeterminados
    document.getElementById("btnResetDefault").addEventListener("click", () => {
        // Limpia el localStorage
        localStorage.clear();

        // Reinicia los contadores de tiempo y de incremento/decremento
        segundos1 = 0;
        segundos2 = 0;
        actualizarContador("contadorTiempo1", segundos1);
        actualizarContador("contadorTiempo2", segundos2);

        // Restablece los contadores de incremento/decremento a 0
        document.querySelectorAll("[id$='-total']").forEach(element => {
            element.innerText = 0;
        });

        // Restablece los nombres de los equipos y el texto de los botones
        document.getElementById("header-equipo").value = "";
        document.getElementById("header-rival").value = "";
        document.getElementById("btnTiempo1").textContent = "Tiempo 1";
        document.getElementById("btnTiempo2").textContent = "Tiempo 2";

        // Pausar cualquier contador activo
        pausarContadores();

        alert("Los valores han sido restablecidos a sus valores predeterminados.");
    });
});
