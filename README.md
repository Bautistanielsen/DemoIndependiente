# DemoIndependiente

Demo navegable del sistema de gestion del Club Atletico Independiente de Loberia (Next.js, solo front con datos de ejemplo).

```
npm install
npm run dev
```

Socia de ejemplo: DNI 38456123, clave 1234.
No socio de ejemplo: Mateo Álvarez, DNI 40765892, clave 5678.

Ambas cuentas pueden ingresar con DNI y contraseña o con los accesos directos del mismo recuadro. Los accesos de secretaría, comisión y DT se mantienen.

El botón del ojo dentro del campo permite mostrar u ocultar la contraseña. El enlace «¿Olvidaste tu contraseña?» abre `/recuperar-contrasena`, con un formulario de correo de demostración: no envía mensajes ni cambia contraseñas.

El encabezado y la pestaña principal dicen «Inicio» en ambos perfiles, conservando las rutas `/socio/carnet` y `/no-socio/carnet`. La cuenta socia mantiene su carnet digital, QR y enlace para pagar cuotas. En no socio, Inicio muestra la imagen `public/asociate_img.png` completa, adaptada al ancho de pantalla, y «Quiero asociarme» hacia WhatsApp; no genera un carnet válido ni un QR de socio.

La navegación de socio tiene cuatro columnas: Inicio, Cuotas, Salones y Pádel. La de no socio tiene tres: Inicio, Salones y Pádel, con los mismos íconos para las secciones compartidas. No socio no tiene sección de cuotas: el enlace anterior `/no-socio/cuotas` redirige en el servidor a `/no-socio/carnet`.

Las pantallas de salones y pádel se reutilizan, sin duplicarlas. Los pagos, cuotas de actividad y turnos propios se mantienen separados por perfil; esa separación del estado no implica que no socio tenga disponible una pantalla de cuotas. No se borran ni migran cuotas o pagos guardados; el no socio no paga cuota social. La disponibilidad de reservas es compartida. `/no-socia` se conserva únicamente como redirección para los enlaces anteriores.

En socio y no socio, Inicio lleva el subtítulo «Tu lugar en el club» y «Salir» está en el encabezado de cada pantalla, no debajo del contenido. En Inicio de socio, el carnet y su botón de pago (cuando corresponde) se centran como un grupo entre el encabezado y la navegación, con un ancho máximo de 400 px y desplazamiento en pantallas bajas. El espacio inferior de ambos inicios reserva la altura de la navegación fija, el área segura del celular y 16 px de separación. Las salidas del personal se mantienen sin cambios.

El CTA prepara una consulta con el nombre de la persona, sin DNI. Como todavía no está configurado el número del club, abre WhatsApp para elegir destinatario; no envía mensajes automáticamente.

Comprobaciones de las pantallas de acceso (sin dependencias adicionales):

```
node --test tests/*.test.cjs
npx tsc --noEmit
npm run build
```

Las pruebas renderizan los componentes de página y verifican su HTML. No sustituyen una prueba interactiva en un navegador.
