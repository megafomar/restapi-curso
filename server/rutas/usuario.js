const express = require('express')
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');

app.get('/', function (req, res) {
    res.json('Hello World')
});

/**
 *  Get usuario
 */
app.get('/usuario', function (req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    "ok": false,
                    "msg": "Hubo un problema",
                    "err": err
                });
            }

            // Conteo de registros
            Usuario.countDocuments({ estado: true }, (err, total) => {
                res.json({
                    ok: true,
                    usuarios: usuarios,
                    total: total
                });
            });

        });

});

/**
 *  Post usuario
 */
app.post('/usuario', function (req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: req.body.nombre,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        img: req.bodyimge,
        role: req.body.role,
        estado: req.body.estado,
        google: req.body.google
    });
    // usuario.save()
    // .then(result => {
    //     console.log('usuario creado exitosamente');
    //     res.status(201).json(usuario);
    // })
    // .catch(err => {
    //     console.log(`hubo un problema ${err}`);
    //     res.status(400).json({
    //         "ok": false,
    //         "msg": "hubo un problema",
    //         "err": err
    //     });
    // });
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                "ok": false,
                "msg": "Hubo un problema",
                "err": err
            });
        }
        console.log('usuario creado exitosamente');
        res.status(201).json(usuarioDB);
    });

});

/**
 *  Put usuario
 */
app.put('/usuario/:id', function (req, res) {

    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    console.log(body);

    let id = req.params.id;

    /** 
     * option context: 'query' hizo posible modifica email, sin ello marcaba problema de validación por 
     * email único!!!!
     */
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                "ok": false,
                "msg": "Hubo un problema",
                "err": err
            });
        }

        res.json({
            ok: true,
            usuarioDB: usuarioDB
        });
    });

});

/**
 *  Delete usuario
 */
app.delete('/usuario/:id', function (req, res) {

    let body = _.pick(req.body, ['estado']);
    let id = req.params.id;

    // eliminación física
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado)=>{
    //     if (err) {
    //         return res.status(400).json({
    //             "ok": false,
    //             "msg": "Hubo un problema",
    //             "err": err
    //         });
    //     }
    //     // Si no hay error verifica si el usuario exite
    //     if (!usuarioBorrado){
    //         return res.status(404).json({
    //             "ok": false,
    //             "msg": "El usuario no existe",
    //             "err": err
    //         });
    //     }

    //     res.json({
    //         ok: true,
    //         usuario: usuarioBorrado
    //     })
    // });

    // eliminación virtual cambiando el estado a false!
    // Si no hay error verifica si el usuario exite
    Usuario.findById(id, (err, usuarioEncontrado) => {
        if (err) {
            return res.status(404).json({
                "ok": false,
                "msg": "Hubo un problema para encontrar al usuario",
                "err": err
            });
        }
        if (usuarioEncontrado.estado === false) {
            return res.status(404).json({
                "ok": false,
                "msg": "El usuario ya no existe",
                "err": err
            });
        } else {

            Usuario.findByIdAndUpdate(id, { estado: false }, { new: true, runValidators: true, context: 'query' }, (err, usuarioActualizado) => {
                if (err) {
                    return res.status(400).json({
                        "ok": false,
                        "msg": "Hubo un problema",
                        "err": err
                    });
                }

                res.json({
                    ok: true,
                    msg: 'Usuario virtualmente eliminado',
                    usuario: usuarioActualizado
                })
            });

        }
    });



});

module.exports = app;