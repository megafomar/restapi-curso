const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Valores permitidos para roles, enum!!!
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}

const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

// desaparecer la propiedad password para no ser mostrada al usuario NUNCA
// NO utilizar NUNCA función flecha en éste caso
usuarioSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

// validación unique
usuarioSchema.plugin(uniqueValidator, { message: 'El {PATH} ya ha sido utilizado' });
usuarioSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Usuario', usuarioSchema);