const { makeExecutableSchema } = require('graphql-tools');

const resolvers = require('./resolvers'); // Will be implemented at a later stage.

const typeDefs = `
    scalar Date

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

    type Usuario {
      id: ID!
      guid: String
      matricula: String
      nome: String!
      usuario: String
      senha: String
      permissoes: Permissao!
      setor: Setor
      coordenadoria: Coordenadoria
    }

    type Setor {
      id: ID!
      nome: String!
      sigla: String!
      endereco: String
      telefone: String
      ramal: String
      responsavel: Usuario
      autor: Usuario
      coordenadorias: [Coordenadoria!]
    }

    type Coordenadoria {
      id: ID!
      nome: String!
      sigla: String!
      endereco: String
      telefone: String
      ramal: String
      setor: Setor
      responsavel: Usuario
      autor: Usuario
      metas(submetas: Boolean): [Meta!]
    }

    type Meta {
      id: ID!
      titulo: String!
      resumo: String
      estado: String
      atualizado: Date
      escopo_previsto: Float
      escopo_realizado: Float
      inicio_previsto: Date
      inicio_realizado: Date
      fim_previsto: Date
      fim_realizado: Date
      custo_previsto: Float
      custo_realizado: Float
      pai: Meta
      responsavel: Usuario
      coordenadoria: Coordenadoria
      autor: Usuario
      submetas: [Meta!]
    }

    # This type specifies the entry points into our API. 
    type Query {
      permissao(id: ID!): Permissao
      permissoes: [Permissao!]
      usuario(id: ID!): Usuario
      usuarios: [Usuario!]
      setor(id: ID!): Setor
      setores: [Setor!]
      coordenadoria(id: ID!): Coordenadoria
      meta(id: ID!): Meta
    }

    # The mutation root type, used to define all mutations.
    type Mutation {
      addMeta(
        titulo: String!,
        escopo_previsto: Float,
        inicio_previsto: Date,
        fim_previsto: Date,
        custo_previsto: Float,
        pai: Int,
        responsavel: Int,
        coordenadoria: Int,
        autor: Int
      ): Meta
      deleteMeta(id: ID!): Int
      addUsuario(
        guid: String,
        matricula: String,
        nome: String!,
        usuario: String,
        senha: String,
        permissoes: Int!,
        setor: Int,
        coordenadoria: Int
      ): Usuario
      deletePermissao(id: ID!): Int
      addPermissao(
        nome: String!,
        setor_create: Boolean, 
        setor_read: Boolean, 
        setor_update: Boolean, 
        setor_delete: Boolean, 
        coord_create: Boolean, 
        coord_read: Boolean, 
        coord_update: Boolean, 
        coord_delete: Boolean, 
        meta_create: Boolean, 
        meta_read: Boolean, 
        meta_update: Boolean, 
        meta_delete: Boolean, 
        atual_create: Boolean, 
        atual_read: Boolean, 
        atual_update: Boolean, 
        atual_delete: Boolean, 
        own_setor_update: Boolean, 
        own_setor_delete: Boolean, 
        own_coord_update: Boolean, 
        own_coord_delete: Boolean, 
        own_meta_update: Boolean, 
        own_meta_delete: Boolean,
        own_atual_update: Boolean,
        own_atual_delete: Boolean
      ): Permissao
    }
    `;

const schema = makeExecutableSchema({ typeDefs, resolvers });
module.exports = schema;