const bcrypt = require('bcryptjs');

const helpers = {};

helpers.encryptPassword = async (password) => { //toma el pass que pone el usuario
    const salt = await bcrypt.genSalt(10);      //se crea un patron 
    const hash = bcrypt.hash(password, salt)    //se sifra la contraseña
    return hash;
};

helpers.matchPassword = async (password, savedPasword) => {
    try {
        return await bcrypt.compare(password, savedPasword)
    } catch(e) {
        console.log(e);
    }
    
};

module.exports = helpers;