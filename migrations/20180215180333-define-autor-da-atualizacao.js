'use strict';

module.exports = {
  up: (q, S) => q.addColumn('atualizacoes', 'autor', { type: S.INTEGER, references: { model: 'usuarios', key: 'id' } }),
  down: q => q.removeColumn('atualizacoes', 'autor')
};
