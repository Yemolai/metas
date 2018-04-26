const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const db = require('../models')

/**
 * Usado na autenticação em auth.js
 */
passport.use(new LocalStrategy({
  usernameField: 'usuario',
  passwordField: 'senha'
}, function (usuario, senha, cb) {
  return db.Usuario.findOne({ where: {usuario, senha} })
    .then(usuario => usuario.dataValues)
    .then(usr => usr
      ? cb(null, usr, { message: 'Logged' })
      : cb(null, false, { message: 'Incorrect' })
    )
    .catch(err => cb(err))
}));

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'jwt_secret'
}, function (jwtPayload, cb) { // used with jwtStrategy
  db.Usuario.findOne({ where: {id: jwtPayload.id} })
    .then(usr => usr
      ? cb(null, usr.dataValues)
      : cb(null, false, {message: 'USER_NOT_FOUND'})
    )
    .catch(err => cb(err));
}));
