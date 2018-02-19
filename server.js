const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const db = require('./models/');

const typeDefs = [`
type Usuario {
  id: ID!
  guid: String
  matricula: String
  nome: String
  usuario: String
  senha: String
}

type Query {
  hello: String,
  usuarios: [Usuario]
}

schema {
  query: Query
}`];

const resolvers = {
  Query: {
    hello(root) {
      return 'world';
    }
  }
};

const schema = makeExecutableSchema({typeDefs, resolvers});
const app = express();
app.use('/graphql', bodyParser.json(), graphqlExpress({schema}));
app.use('/graphiql', graphiqlExpress({endpointURL: '/graphql'}));
app.listen(4000, () => console.log('Now browse to localhost:4000/graphiql'));