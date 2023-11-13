
function iniciarMap() {
    var coordSantiago = { lat: -33.4489, lng: -70.6693 }; // Coordenadas de Santiago de Chile
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10, // Zoom adecuado para ver las calle
        center: coordSantiago // Centro del mapa en Santiago de Chile
    });

    // Realiza una solicitud al servidor para obtener los puntos de interés (calle)
    fetch('/get-calle')
    .then(response => response.json())
    .then(data => {
        // Procesa los datos de las calle y crea marcadores en el mapa
        data.calle.forEach(calle => {
            var marker = new google.maps.Marker({
                position: { lat: calle.latitud, lng: calle.longitud },
                map: map,
                title: calle.nombre
            });

                            // Crea un contenido personalizado para el infoWindow
                            var contenidoInfoWindow = '<h3>' + calle.calle + '</h3>' +
                            '<p>$ ' + calle.valorPropiedad + '</p>' + "agregar boton de pago" + '</p>' +
                            '<a href="URL_DE_TU_PAGINA" target="_blank">Ir a la página</a>';;
        
                        // Crea el infoWindow y asócialo con el marcador
                        var infoWindow = new google.maps.InfoWindow({
                            content: contenidoInfoWindow
                        });
        
                        // Agrega un evento de clic al marcador para mostrar el infoWindow
                        marker.addListener('click', function () {
                            infoWindow.open(map, marker);
                        });
                    });
                })
                .catch(error => {
                    console.error('Error al obtener las calles:', error);
                });
        }
 
     

// Agrega un evento de clic al botón "Vender"
document.getElementById('venderBtn').addEventListener('click', function() {
    // Realiza una solicitud al servidor para verificar si el usuario está autenticado
    fetch('/check-auth')
        .then(response => {
            if (!response.ok) {
                throw new Error('La solicitud ha fallado');
            }
            return response.json();
        })
        .then(data => {
            if (data.loggedin) {
                // Si el usuario está autenticado, redirige al formulario de publicación (reemplaza la URL adecuadamente)
                window.location.href = '/vender';
            } else {
                // Si el usuario no está autenticado, muestra un mensaje de advertencia con SweetAlert2
                Swal.fire({
                    title: 'Advertencia',
                    text: 'Debes iniciar sesión antes de vender.',
                    icon: 'warning',
                    confirmButtonText: 'OK'
                });
                // Puedes redirigir al inicio de sesión si lo prefieres
                // window.location.href = '/login';
            }
        })
        .catch(error => {
            console.error("Error al realizar la solicitud a /check-auth:", error);
            // Muestra un mensaje de error con SweetAlert2
            Swal.fire({
                title: 'Error',
                text: 'Ha ocurrido un error',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        });
});


// Agrega un evento de clic al botón "Mis_publicaciones"


document.getElementById('mis_publicacionesBtn').addEventListener('click', function () {
    // Realiza una solicitud al servidor para verificar si el usuario está autenticado
    fetch('/check-auth')
        .then(response => {
            if (!response.ok) {
                throw new Error('La solicitud ha fallado');
            }
            return response.json();
        })
        .then(data => {
            if (data.loggedin) {
                // Si el usuario está autenticado, redirige al formulario de publicación (reemplaza la URL adecuadamente)
                window.location.href = '/mis_publicaciones';
            } else {
                // Si el usuario no está autenticado, muestra un mensaje de advertencia con SweetAlert2
                Swal.fire({
                    title: 'Advertencia',
                    text: 'Debes iniciar sesión antes de ver tus publicaciones.',
                    icon: 'warning',
                    confirmButtonText: 'OK'
                });
                // Puedes redirigir al inicio de sesión si lo prefieres
                // window.location.href = '/login';
            }
        })
        .catch(error => {
            console.error("Error al realizar la solicitud a /check-auth:", error);
            // Muestra un mensaje de error con SweetAlert2
            Swal.fire({
                title: 'Error',
                text: 'Ha ocurrido un error',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        });
});
