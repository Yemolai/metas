const passport = require('passport');
const passportJWT = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const db = require('../models')

const authenticate = function (usuario, senha, cb) {
  return db.Usuario.findOne({ where: {usuario, senha} })
    .then(usuario => usuario.dataValues)
    .then(usuario => usuario
      ? cb(null, usuario, {message: 'Logged'})
      : cb(null, false, {message: 'Incorrect'})
    )
    .catch(err => cb(err))
};

const validateJwt = function (jwtPayload, cb) { // used with jwtStrategy
  return db.Usuario.findOne({ where: {id: jwtPayload.id} })
    .then(usuario => cb(null, usuario))
    .catch(err => cb(err));
}

const localStrategy = new LocalStrategy({
  usernameField: 'usuario',
  passwordField: 'senha'
}, authenticate);

const jwtStrategy = new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'jwtsecret'
}, validateJwt);

passport.use(localStrategy);
passport.use(jwtStrategy);