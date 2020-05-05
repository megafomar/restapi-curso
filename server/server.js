/**
 *  Configurar en automático ambiente de producción o desarrollo
 */
require('./config/config');

const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

/**
 *  Conexión a base de datos con mongoose
 */
mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true,
    useFindAndModify: false
}, (err, res)=>{
    if (err) throw err;
    console.log('base de datos ONLINE!');
});

// mongoose.connect('mongodb://localhost:27017/cafe', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
// .then(connect => console.log('Conectado a la base de datos!'))
// .catch(err => console.log('Hubo un problema de conexión a BD'));

/**
 *  body parser middleware
 */
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

/**
 *  Importar y usar la ruta de usuarios
 */
app.use( require('./rutas/usuario'));

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`app corriendo en puerto ${port}`)
});