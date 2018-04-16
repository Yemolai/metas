const { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const passport = require('passport');
require('./src/passport'); // to run passport-related config
const schema = require('./src/schema/');
const auth = require('./src/routes/auth');
const user = require('./src/routes/user');
const cfg = require('./config/server.json');

const PORT = cfg.port;
const server = express();
server.use('*', cors({ origin: cfg.corsOrigin })); //Restrict the client-origin for security reasons.
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));

server.use('/auth', auth)
server.use('/user', passport.authenticate('jwt', {session: false}), user);

server.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

if (cfg.graphiqlEnabled) {
  server.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
}

// error handler
server.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    error: res.locals.error || true,
    message: res.locals.error || 'route not found'
  });
});

server.listen(PORT, () =>
  console.log(`GraphQL Server is now running on http://localhost:${PORT}`)
);