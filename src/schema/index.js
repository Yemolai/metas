const { makeExecutableSchema } = require('graphql-tools');
const map = require('./fn/map');
const db = require('../models');

const TypeRequire = TypeDir => db => name => require(TypeDir + '/' + name)(db);
const resolver = obj => map(v => v.resolver)(obj);
const typeDir = './types';
const TypeNames = [
  'Usuario',
  'Setor',
  'Coordenadoria',
  'Meta',
  'Atualizacao',
  'Permissao'
];
// ƒ to require the type using the specified path and Sequelize instance
const typeRequire = TypeRequire(typeDir)(db);
// array with Types objects containing its name, definitions and resolvers
const Types = TypeNames.map(name => ({ name, ...typeRequire(name) }));
// array with isolated Type's Computed properties resolvers into a single depth list
const Computed = Types.reduce((p, a) => ({...p, [a.name]: (a.computed || {})}), {});
// array with isolated Type's Query resolvers
const Query = Types.reduce((p, a) => Object.assign(p, resolver(a.Query)), {});
const Mutation = Types.reduce((p, a) => Object.assign(p, resolver(a.Mutation)), {});

const resolvers = {
  // custom Types
  Date: require('./scalar/Date'),
  ...Computed,
  Query,
  Mutation
};

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
