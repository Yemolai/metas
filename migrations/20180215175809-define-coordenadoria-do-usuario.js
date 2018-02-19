'use strict';

module.exports = {
  up: (q, S) => q.addColumn('usuarios', 'coordenadoria', { type: S.INTEGER, references: { model: 'coordenadorias', key: 'id' } }),
  down: q => q.removeColumn('usuarios', 'coordenadoria')
};
