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
  console.log('jwtPayload', jwtPayload)
  db.Usuario.findOne({ where: {id: jwtPayload.id} })
    .then(usr => {
      console.log('user:', usr)
      if (usr === null) {
        console.log('no user found, returning false')
        return cb(null, false, {message: 'USER_NOT_FOUND'})
      }
      console.log('user found, returning its data')
      return cb(null, usr.dataValues)
    })
    .catch(err => {
      console.log('An unknown error occurred:', err)
      return cb(err)
    });
}));