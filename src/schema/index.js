const { makeExecutableSchema } = require('graphql-tools');
const map = require('./fn/map');
const o2a = require('./fn/objToArray');
const db = require('../../models');
const typeDir = './types';
const TypeNames = [
  'Usuario',
  'Setor',
  'Coordenadoria',
  'Meta',
  'Atualizacao',
  'Permissao'
];
// ƒ to require a Sequelize instance from a specified Type Directory
const TypeRequire = TypeDir => db => name => require(TypeDir + '/' + name)(db);
// ƒ to reduce objects in order to extract only specific inner properties (t: {Object} types, i: {*} inicial object, k: {string} property key, s: {string} subproperty key)
/**
 * ƒ to reduce objects extracting only specific inner subproperties of given properties
 * @param {Array} t Type list array os objects with k property
 * @param {*} i Reduction initial value
 * @param {string} k property name of objects within t with s property
 * @param {string} s name of property within k
 * @returns {Object} with t's s properties
 */
const reducer = (t, k, s, i = {}) => t.reduce((p, a) => Object.assign(p, map(v => v[s])(a[k])), i)
// ƒ to require the type using the specified path and Sequelize instance
const typeRequire = TypeRequire(typeDir)(db);
// array with Types objects containing its name, definitions and resolvers
const Types = TypeNames.map(name => ({ name, ...typeRequire(name) }));
// array with isolated Type's Computed properties resolvers into a single depth list
const Computed = Types.reduce((p, a) => ({...p, [a.name]: (a.computed || {})}), {});
// array with isolated Type's Query resolvers
const TypeDefinitions = Types.map(v => v.def).reduce((p, a) => (p + '\n    ' + a), '');

const resolvers = {
  // custom Types
  Date: require('./scalar/Date'),
  ...Computed,
  Query: reducer(Types, 'Query', 'resolver'),
  Mutation: reducer(Types, 'Mutation', 'resolver')
};
const typeDefs = `
    scalar Date
    ${TypeDefinitions}
    type Query {
      ${o2a(reducer(Types, 'Query', 'def')).join('\n')}
    }
    type Mutation {
      ${o2a(reducer(Types, 'Mutation', 'def')).join('\n')}
    }`;
const schema = makeExecutableSchema({ typeDefs, resolvers });
module.exports = schema;
