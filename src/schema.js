const { makeExecutableSchema } = require('graphql-tools');

const resolvers = require('./resolvers'); // Will be implemented at a later stage.

const typeDefs = `
    type Channel {
      id: ID! # "!" denotes a required field
      name: String
      messages: [Message]!
    }

    type Permissao {
      id: ID!
      nome: String!
      setor_create: Boolean!
      setor_read: Boolean!
      setor_update: Boolean!
      setor_delete: Boolean!
      coord_create: Boolean!
      coord_read: Boolean!
      coord_update: Boolean!
      coord_delete: Boolean!
      meta_create: Boolean!
      meta_read: Boolean!
      meta_update: Boolean!
      meta_delete: Boolean!
      atual_create: Boolean!
      atual_read: Boolean!
      atual_update: Boolean!
      atual_delete: Boolean!
      own_setor_update: Boolean!
      own_setor_delete: Boolean!
      own_coord_update: Boolean!
      own_coord_delete: Boolean!
      own_meta_update: Boolean!
      own_meta_delete: Boolean!
      own_atual_update: Boolean!
      own_atual_delete: Boolean!
    }

    type Message {
      id: ID!
      text: String
    }
    # This type specifies the entry points into our API. 
    type Query {
      channels: [Channel] # "[]" means this is a list of channels
      channel(id: ID!): Channel
      permissao(id: ID!): Permissao
      permissoes: [Permissao]
    }

    # The mutation root type, used to define all mutations.
    type Mutation {
      # A mutation to add a new channel to the list of channels
      addChannel(name: String!): Channel
    }
    `;

const schema = makeExecutableSchema({ typeDefs, resolvers });
module.exports = schema;