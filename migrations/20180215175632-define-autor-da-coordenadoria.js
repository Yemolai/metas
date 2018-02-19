'use strict';

module.exports = {
  up: (q, S) => q.addColumn('coordenadorias', 'autor', { type: S.INTEGER, references: { model: 'usuarios', key: 'id' } }),
  down: q => q.removeColumn('coordenadorias', 'autor')
};
