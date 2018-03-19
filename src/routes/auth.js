const express = require('express');
const passport = require('passport')
const jwt = require('jsonwebtoken');
const router = express.Router();

/* POST login */
router.post('/login', function (req, res, next) {
  let session = false // para não manter sessão
  
  passport.authenticate('local', { session }, (err, usuario, info) => {
    if (err || !usuario) {
      return res.status(400).json({ // return erro como requisição malformada
        message: info ? info.message : 'Failed to login',
        usuario
      });
    }
    // se tudo estiver certinho, tenta logar
    req.login(usuario, { session }, err => {
      if (err) { // se houver erro retorna o erro
        res.send(err);
      }
    // se der certo retorna os dados de usuario num jwt e os dados de usuario puros
    const token = jwt.sign(usuario, 'jwt_secret');
    return res.json({usuario, token});
    });
  })(req, res);
})
module.exports = router
