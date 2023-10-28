function iniciarMap() {
    var coordSantiago = { lat: -33.4489, lng: -70.6693 }; // Coordenadas de Santiago de Chile
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10, // Zoom adecuado para ver las comunas
        center: coordSantiago // Centro del mapa en Santiago de Chile
    });

    // Realiza una solicitud al servidor para obtener los puntos de interés (comunas)
    fetch('/get-comunas')
    .then(response => response.json())
    .then(data => {
        // Procesa los datos de las comunas y crea marcadores en el mapa
        data.comunas.forEach(comuna => {
            var marker = new google.maps.Marker({
                position: { lat: comuna.latitud, lng: comuna.longitud },
                map: map,
                title: comuna.nombre
            });

                            // Crea un contenido personalizado para el infoWindow
                            var contenidoInfoWindow = '<h3>' + comuna.comuna + '</h3>' +
                            '<p>$ ' + comuna.valorPropiedad + '</p>' + "agregar boton de pago" + '</p>' +
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
                    console.error('Error al obtener las comunas:', error);
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
                // Si el usuario no está autenticado, muestra un mensaje de advertencia
                alert("Debes iniciar sesión antes de vender.");
                // Puedes redirigir al inicio de sesión si lo prefieres
                // window.location.href = '/login';
            }
        })
        .catch(error => {
            console.error("Error al realizar la solicitud a /check-auth:", error);
        });
});

