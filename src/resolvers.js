const TypeRequire = TypeDir => db => name => require(TypeDir + '/' + name)(db)
const map = require('./fn/map');
const db = require('../models');

const resolver = obj => map(v => v.resolver)(obj)
const typeDir = './types';
const TypeNames = [
  'Usuario',
  'Setor',
  'Coordenadoria',
  'Meta',
  'Atualizacao',
  'Permissao'
];
const typeRequire = TypeRequire(typeDir)(db)
const Types = TypeNames.map(name => ({ name, ...typeRequire(name) }))
const Computed = Types.reduce((p, a) => ({...p, [a.name]: (a.computed || {})}), {});
const Query = Types.reduce((p, a) => Object.assign(p, resolver(a.Query)), {});
const Mutation = Types.reduce((p, a) => Object.assign(p, resolver(a.Mutation)), {});
console.log('Computed:', Computed);
console.log('Query:', Query);
console.log('Mutation:', Mutation);
module.exports = {
  // custom Types
  Date: require('./scalar/Date'),
  ...Computed,
  Query,
  Mutation,
};