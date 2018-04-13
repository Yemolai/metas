const { makeExecutableSchema } = require('graphql-tools');
const map = require('./fn/map');
const resolvers = require('./resolvers'); // Will be implemented at a later stage.
const defs = obj => map(v => v.def)(obj);
const typeDefs = `
    scalar Date

    ${Permissao.def}

    ${Usuario.def}

    ${Setor.def}

    ${Coordenadoria.def}

    ${Meta.def}

    ${Atualizacao.def}

    type Query {
      ${defs(Permissao.Query)}
      ${defs(Usuario.Query)}
      ${defs(Setores.Query)}
      ${defs(Coordenadoria.Query)}
      ${defs(Meta.Query)}
      ${defs(Atualizacao.Query)}
    }

    type Mutation {
      ${defs(Permissao.Mutation)}
      ${defs(Usuario.Mutation)}
      ${defs(Setor.Mutation)}
      ${defs(Coordenadoria.Mutation)}
      ${defs(Atualizacao.Mutation)}
    }
    `;

const schema = makeExecutableSchema({ typeDefs, resolvers });
module.exports = schema;