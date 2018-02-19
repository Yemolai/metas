'use strict';

module.exports = {
  up: (q, S) => q.addColumn('coordenadorias', 'setor', { type: S.INTEGER, references: { model: 'setores', key: 'id' } }),
  down: q => q.removeColumn('coordenadorias', 'setor')
};
