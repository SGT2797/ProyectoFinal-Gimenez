//Formulario de solicitud de atención domiciliaria//
document.addEventListener("DOMContentLoaded", () => {
  const nombreInput = document.getElementById("nombre");
  const dniInput = document.getElementById("dni");
  const direccionInput = document.getElementById("direccion");
  const emailInput = document.getElementById("email");
  const planSelect = document.getElementById("plan");
  const formAtencion = document.getElementById("formAtencion");

  // Precarga de datos desde localStorage//
  const datosGuardados = JSON.parse(localStorage.getItem("datosUsuario"));
  if (datosGuardados) {
    nombreInput.value = datosGuardados.nombre || "";
    dniInput.value = datosGuardados.dni || "";
    direccionInput.value = datosGuardados.direccion || "";
    emailInput.value = datosGuardados.email || "";
  }

  //Carga de planes desde JSON//
  fetch("planes.json")
    .then(res => res.json())
    .then(data => {
      const opcionDefault = document.createElement("option");
      opcionDefault.value = "";
      opcionDefault.textContent = "-- Elige un plan --";
      planSelect.appendChild(opcionDefault);
      data.forEach(plan => {
        const option = document.createElement("option");
        option.value = plan.precio;
        option.textContent = plan.nombre;
        planSelect.appendChild(option);
      });
    })
    .catch(error => {
      console.error("Error al cargar los planes:", error);
    });

  //Validación y envío del formulario//
  if (formAtencion) {
    formAtencion.addEventListener("submit", function (e) {
      e.preventDefault();
      console.log("formulario enviado");

      const nombre = nombreInput.value.trim();
      const dni = dniInput.value.trim();
      const direccion = direccionInput.value.trim();
      const email = emailInput.value.trim();
      const planPrecio = parseInt(planSelect.value);
      const planTexto = planSelect.options[planSelect.selectedIndex].text;

      if (!nombre || !dni || !direccion || !email || !planPrecio) {
        Swal.fire({
          icon: 'warning',
          title: 'Formulario incompleto',
          text: 'Por favor, complete todos los campos.'
        });
        return;
      }

      Swal.fire({
        icon: 'success',
        title: 'Solicitud enviada',
        html: `
          <p><strong>${nombre}</strong>, tu solicitud de atención domiciliaria ha sido recibida.</p>
          <p>Dirección: <strong>${direccion}</strong></p>
          <p>Plan seleccionado: <strong>${planTexto}</strong></p>
          <p>Precio estimado: <strong>$${planPrecio.toLocaleString()}</strong> mensuales</p>
          <p>Se ha enviado detalles e información de pago a: <strong>${email}</strong></p>
        `
      });

      //Almacenamiento en localStorage//
      const solicitudes = JSON.parse(localStorage.getItem("solicitudesDomicilio")) || [];
      solicitudes.push({ nombre, dni, direccion, email, plan: planTexto, precio: planPrecio });
      localStorage.setItem("solicitudesDomicilio", JSON.stringify(solicitudes));
      localStorage.setItem("datosUsuario", JSON.stringify({ nombre, dni, direccion, email }));

      formAtencion.reset();
    });
  }
});

//Simulación de backend//
async function cargarPlanes() {
  try {
    const res = await fetch("planes.json");
    const data = await res.json();
  } catch (error) {
    console.error("Error al cargar los planes:", error);
  }
}
cargarPlanes();

