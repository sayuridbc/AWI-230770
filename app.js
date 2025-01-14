import express from 'express';
import session from 'express-session';
import moment from 'moment-timezone';

const app = express();

// Configuración del middleware de sesiones
app.use(
    session({
        secret: 'p3-SAY#holaaa-sesionespersistentes', // Cambia esto por una clave
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 horas en milisegundos
    })
);

// Ruta para inicializar la sesión
app.get('/iniciar-sesion', (req, res) => {
    if (!req.session.inicio) {
        req.session.inicio = new Date(); // Fecha de inicio de sesión
        req.session.ultimoAcceso = new Date(); // Última consulta inicial
        res.send('Sesión iniciada.');
    } else {
        res.send('La sesión ya está activa.');
    }
});

// Ruta para actualizar la fecha de última consulta
app.get('/actualizar', (req, res) => {
    if (req.session.inicio) {
        req.session.ultimoAcceso = new Date();
        res.send('Fecha de última consulta actualizada.');
    } else {
        res.send('No hay una sesión activa.');
    }
});

// Ruta para ver el estado de la sesión
app.get('/estado-sesion', (req, res) => {
    if (req.session.inicio) {
        const inicio = req.session.inicio; 
        const ultimoAcceso = req.session.ultimoAcceso;
        const ahora = new Date();

        // Calcular la antigüedad de la sesión
        const antiguedadMS = ahora - inicio;
        const horas = Math.floor(antiguedadMS / (1000 * 60 * 60));
        const minutos = Math.floor((antiguedadMS % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((antiguedadMS % (1000 * 60)) / 1000);

        // Convertimos la fecha al uso horario de CDMX usando moment-timezone
        const inicioCDMX = moment(inicio).tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');
        const ultimoAccesoCDMX = moment(ultimoAcceso).tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');

        res.json({
            mensaje: 'Estado de la sesión',
            sesionID: req.sessionID,
            inicio: inicioCDMX,  // Fecha de inicio en formato de CDMX
            ultimoAcceso: ultimoAccesoCDMX,  // Último acceso en formato de CDMX
            antiguedad: `${horas} horas, ${minutos} minutos, ${segundos} segundos`
        });
    } else {
        res.send('No hay una sesión activa.');
    }
});

// Ruta para cerrar sesión
app.get('/cerrar-sesion', (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).send('Error al cerrar la sesión.');
            }
            res.send('Sesión cerrada correctamente.');
        });
    } else {
        res.send('No hay una sesión activa para cerrar.');
    }
});

// Iniciar el servidor
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
