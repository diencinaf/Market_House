//Invocamos a express 
const express = require('express');
const app = express();

app.set('view engine', 'ejs');

//2 set urlencoded para captura de datos del formulario
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//3 Invocamos a dotenv

const dotenv = require('dotenv');
dotenv.config({path:'./env/.env'});

//4 set directorio publico 


app.use(express.static(__dirname + '/public'));
app.use('/resources', express.static('public'));

// Enrutamiento dinámico para vistas


// Ruta inicio (index)

const routes = ['register'];
routes.forEach(route => {
    app.get(`/${route}`, (req, res) => {
        res.render(route);
    });
});

// Ruta inicio (index)
app.get('/', (req, res) => {
    if (req.session && req.session.loggedin && req.session.user) {
        res.render('index', { login: req.session.loggedin, user: req.session.user });
    } else {
        res.render('index', { login: false, user: null });
    }
});


// Ruta login

app.get('/login', (req, res) => {
    res.render('login');
});


// Ruta vender

app.get('/vender', (req, res) => {
    res.render('vender');
});


// Ruta registro

app.get('/registro', (req, res) => {
    res.render('registro');
});








//5 set motor de plantilla
app.set('view engine', 'ejs');

//6 bycreps js

const bcryptjs = require('bcryptjs');


//7var. session

const session = require('express-session');
const connection = require('./database/db');
app.use(session({
    secret:'secret',
    resave: true,
    saveUninitialized:true
}));

//8 modulo de conexion
require('./database/db');





// 10 registro
app.post('/register', async (req, res) => {
    const nombres = req.body.nombres;
    const apellidos = req.body.apellidos;
    const user = req.body.user;
    const rut = req.body.rut;
    const rutCi = req.body.rutCi;
    const pass = req.body.pass;
    const celular = req.body.celular;
    const fechaNacimiento = req.body.fechaNacimiento;

    // Seleccionar la base de datos adecuada
    connection.query('USE login_node', (error) => {
        if (error) {
            console.error('Error al seleccionar la base de datos:', error);
            res.status(500).send('Error interno del servidor');
        } else {
            // Generar el hash de la contraseña
            bcryptjs.hash(pass, 8, async (error, passwordHash) => {
                if (error) {
                    console.error('Error al generar el hash de la contraseña:', error);
                    res.status(500).send('Error interno del servidor');
                } else {
                    // Realizar la inserción en la base de datos
                    const sql = 'INSERT INTO users SET ?';
                    const userData = {
                        nombres: nombres,
                        apellidos: apellidos,
                        user: user,
                        rut: rut,
                        rutCi: rutCi,
                        pass: passwordHash,
                        celular: celular,
                        fechaNacimiento: fechaNacimiento,
                    };

                    connection.query(sql, userData, (error, results) => {
                        if (error) {
                            console.error('Error al insertar en la base de datos:', error);
                            res.status(500).send('Error interno del servidor');
                        } else {
                            // Crear una sesión para el usuario inmediatamente después de registrarse
                            req.session.loggedin = true;
                            req.session.user = user;

                            // Redirigir al usuario a la página deseada
                            res.redirect('/'); 
                        }
                    });
                }
            });
        }
    });
});






  

// Login /



connection.query('USE login_node', (error) => {
    if (error) {
        console.error('Error al seleccionar la base de datos:', error);

    } else {

        connection.query('SELECT * FROM users WHERE user = ?', ['ADMIN'], (error, results) => {
            if (error) {
                console.error('Error en la consulta SQL:', error);

            } else {

                console.log('Resultados:', results);
            }
        });
    }
});

app.post('/auth', async (req, res) => {
    const user = req.body.user;
    const pass = req.body.pass;

    if (user && pass) {
        connection.query('SELECT * FROM users WHERE user = ?', [user], async (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).send('Error interno del servidor');
            } else {
                if (results && results.length > 0 && (await bcryptjs.compare(pass, results[0].pass))) {
                    req.session.loggedin = true;
                    req.session.user = results[0].user;
                    // Redirige al usuario después de la autenticación exitosa
                    res.redirect('/'); // Puedes cambiar '/' con la ruta que desees
                } else {
                    res.render('login', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Usuario y/o contraseña incorrectos",
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: 1500,
                        ruta: 'login'
                    });
                }
            }
        });
    } else {
        res.render('login', {
            alert: true,
            alertTitle: "Advertencia",
            alertMessage: "Por favor ingrese un usuario y/o contraseña",
            alertIcon: 'warning',
            showConfirmButton: true,
            timer: 1500,
            ruta: 'login'
        });
    }
});



//12 auth pages tambien vemos a que pagina te envia al hacer login
//12 auth pages para comprobar si el usuario ha iniciado sesión
app.get('/get-user', (req, res) => {
    if (req.session.loggedin) {
        // Si el usuario ha iniciado sesión, respondemos con el nombre de usuario
        res.send(req.session.user);
    } else {
        // Si no ha iniciado sesión, respondemos con un mensaje indicando que debe iniciar sesión
        res.send('Publica iniciando sesión');
    }
});

app.get('/check-auth', (req, res) => {
    // Verifica si el usuario está autenticado
    if (req.session.loggedin) {
        res.json({ loggedin: true });
    } else {
        res.json({ loggedin: false });
    }
});







// Logout
app.get('/logout', (req, res)=>{
    req.session.destroy(()=>{
        res.redirect('/')
    })
})


// Registro de una VENTA
app.post('/vender', async (req, res) => {
  const calle = req.body.calle;
  const habitaciones = req.body.habitaciones;
  const banos = req.body.banos;
  const terrenoConstruido = req.body.terrenoConstruido;
  const terrenoTotal = req.body.terrenoTotal;
  const valorPropiedad = req.body.valorPropiedad;
  const material = req.body.material;
  const estacionamientos = req.body.estacionamientos;
  const latitud = req.body.latitud;
  const longitud = req.body.longitud;
  const usuario_id = req.body.usuario_id;



  // Seleccionar la base de datos adecuada
  connection.query('USE login_node', (error) => {
      if (error) {
          console.error('Error al seleccionar la base de datos:', error);
          res.status(500).send('Error interno del servidor');
      } else {
          // Realizar la inserción en la base de datos
          const sql = 'INSERT INTO vender SET ?';
          const userData = {
              calle: calle,
              habitaciones: habitaciones,
              banos: banos,
              terrenoConstruido: terrenoConstruido,
              terrenoTotal: terrenoTotal,
              valorPropiedad: valorPropiedad,
              material: material,
              estacionamientos: estacionamientos,
              latitud: req.body.latitud,
              longitud: req.body.longitud,
              usuario_id: req.session.user
          };

          connection.query(sql, userData, (error, results) => {
            if (error) {
                console.error('Error al insertar en la base de datos:', error);
                res.status(500).send('Error interno del servidor');
            } else {
                res.redirect('/?alert=true&alertTitle=Registration&alertMessage=registro+exitoso&alertIcon=success&showConfirmButton=false&timer=1500&ruta=/');
            }
        });        
      }
  });
});


// Alimenta el map con las comunas que se van agregando

// Obtener comunas desde la base de datos
app.get('/get-calle', (req, res) => {
    connection.query('SELECT calle, valorPropiedad, latitud, longitud FROM vender', (error, results) => {
        if (error) {
            console.error('Error al obtener las calle:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        } else {
            const calle = results;
            res.json({ calle });
        }
    });
});


//CRUD

app.get('/mis_publicaciones', (req, res) => {
    // Verifica si el usuario ha iniciado sesión
    if (req.session.loggedin) {
        const usuario_id = req.session.user;

        // Realiza una consulta a la base de datos para obtener las propiedades del usuario
        connection.query('SELECT * FROM vender WHERE usuario_id = ?', [usuario_id], (error, results) => {
            if (error) {
                console.error('Error al obtener propiedades:', error);
                res.status(500).json({ error: 'Error interno del servidor' });
            } else {
                const propiedades = results;

                // Renderiza la vista 'mis_publicaciones' con el valor de totalPropiedades y las propiedades
                res.render('mis_publicaciones', { totalPropiedades: propiedades.length, propiedades });
            }
        });
    } else {
        // Si el usuario no ha iniciado sesión, redirige al usuario a la página de inicio con un mensaje de error
        res.redirect('/?alert=true&alertTitle=Error&alertMessage=Debes+iniciar+sesión&alertIcon=error&showConfirmButton=false&timer=3000&ruta=/');
    }
});




app.post('/eliminar_propiedad', (req, res) => {
    if (req.session.loggedin) {
        const usuario_id = req.session.user;
        const propiedadIndex = req.body.index;

        // Obtener la propiedad específica del índice
        const propiedadAEliminar = propiedades[propiedadIndex];

        // Realizar la consulta para eliminar la propiedad de la base de datos
        connection.query('DELETE FROM vender WHERE id = ? AND usuario_id = ?', [propiedadAEliminar.id, usuario_id], (error, results) => {
            if (error) {
                console.error('Error al eliminar la propiedad:', error);
                res.status(500).json({ error: 'Error interno del servidor' });
            } else {
                // Devolver una respuesta exitosa
                res.json({ success: true });
            }
        });
    } else {
        res.status(401).json({ error: 'No autorizado' });
    }
});





app.listen(3000, (req, res)=>{
    console.log('SERVER RUNNING IN http://localhost:3000');
})








