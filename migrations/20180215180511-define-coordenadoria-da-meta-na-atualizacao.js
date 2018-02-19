'use strict';

module.exports = {
  up: (q, S) => q.addColumn('atualizacoes', 'coordenadoria', { type: S.INTEGER, references: { model: 'coordenadorias', key: 'id' } }),
  down: q => q.removeColumn('atualizacoes', 'coordenadoria')
};
