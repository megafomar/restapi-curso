/**
 *  Configurar en automático ambiente de producción o desarrollo
 */
require('./config/config');

const express = require('express')
var bodyParser = require('body-parser');

const app = express();

/**
 *  body parser middleware
 */
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.json('Hello World')
});

/**
 *  Get usuario
 */
app.get('/usuario', function (req, res) {
    res.json('get usuario');
});

/**
 *  Post usuario
 */
app.post('/usuario', function (req, res) {
    let nombre = req.body.nombre;
    let edad = req.body.edad;
    let body = req.body;

    // simulando falla en información recibida
    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: "nombre es necesario"
        });
    } else {
        res.json({
            http: 'post',
            nombre,
            edad,
            body
        });
    }

});

/**
 *  Put usuario
 */
app.put('/usuario/:id', function (req, res) {
    let id = req.params.id;
    res.json({
        id
    });
});

/**
 *  Delete usuario
 */
app.delete('/usuario', function (req, res) {
    res.json('delete usuario');
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`app corriendo en puerto ${port}`)
});