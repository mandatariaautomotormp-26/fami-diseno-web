// Envío real del formulario de contacto de FaMi mediante Formspree.
document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formContacto");
    if (!formulario) return;

    const estado = document.getElementById("estadoFormulario");
    const boton = formulario.querySelector('button[type="submit"]');
    const textoOriginal = boton ? boton.textContent : "Enviar consulta";

    formulario.addEventListener("submit", async (evento) => {
        evento.preventDefault();

        if (!formulario.reportValidity()) return;

        if (estado) {
            estado.textContent = "Enviando tu consulta...";
            estado.className = "estado-formulario enviando";
        }
        if (boton) {
            boton.disabled = true;
            boton.textContent = "Enviando...";
        }

        try {
            const respuesta = await fetch(formulario.action, {
                method: "POST",
                body: new FormData(formulario),
                headers: { "Accept": "application/json" }
            });

            if (!respuesta.ok) {
                let detalle = "No se pudo enviar la consulta. Intentá nuevamente.";
                try {
                    const datos = await respuesta.json();
                    if (datos.errors && datos.errors.length) {
                        detalle = datos.errors.map(error => error.message).join(" ");
                    }
                } catch (_) { /* La respuesta puede no contener JSON. */ }
                throw new Error(detalle);
            }

            formulario.reset();
            if (estado) {
                estado.textContent = "¡Gracias! Recibimos tu consulta. Nos pondremos en contacto a la brevedad.";
                estado.className = "estado-formulario exito";
            }
        } catch (error) {
            if (estado) {
                estado.textContent = error.message || "Ocurrió un error al enviar. Revisá tu conexión e intentá nuevamente.";
                estado.className = "estado-formulario error";
            }
        } finally {
            if (boton) {
                boton.disabled = false;
                boton.textContent = textoOriginal;
            }
        }
    });
});
