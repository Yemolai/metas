const express = require('express');
const cors = require('cors');
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
const bodyParser = require('body-parser');

const schema = require('./src/schema');

const PORT = 7700;
const server = express();
server.use('*', cors({ origin: 'http://localhost:8080' })); //Restrict the client-origin for security reasons.

server.use('/graphql', bodyParser.json(), graphqlExpress({
  schema 
}));

server.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql'
}));

server.listen(PORT, () =>
  console.log(`GraphQL Server is now running on http://localhost:${PORT}`)
);