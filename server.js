const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const db = require('./models/');

const channels = [{
  id: 1,
  name: 'soccer',
}, {
  id: 2,
  name: 'baseball',
}];

let nextId = 3;

const typeDefs = [
  `type Channel {
      id: ID! # "!" denotes a required field
      name: String
      messages: [Message]!
    }

    type Message {
      id: ID!
      text: String
    }
    # This type specifies the entry points into our API. 
    type Query {
      channels: [Channel]    # "[]" means this is a list of channels
      channel(id: ID!): Channel
    }

    # The mutation root type, used to define all mutations.
    type Mutation {
      # A mutation to add a new channel to the list of channels
      addChannel(name: String!): Channel
    }
  `
];

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
app.use('/db', function (req, res, next) {

})
app.listen(4000, () => console.log('Now browse to localhost:4000/graphiql'));