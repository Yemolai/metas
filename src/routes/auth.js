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
    const profile = {
      id: usuario.id,
      matricula: usuario.matricula || null,
      nome: usuario.nome,
      usuario: usuario.usuario,
      setor: usuario.setor || null,
      coordenadoria: usuario.coordenadoria || null,
      permissoes: usuario.permissoes || null
    }
    const token = jwt.sign(profile, 'jwt_secret');
    return res.json({ token });
    });
  })(req, res);
})
module.exports = router
