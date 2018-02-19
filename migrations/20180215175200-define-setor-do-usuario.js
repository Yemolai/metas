'use strict';

module.exports = {
  up: (q, S) => q.addColumn('usuarios', 'setor', { type: S.INTEGER, references: { model: 'setores', key: 'id' } }),
  down: q => q.removeColumn('usuarios', 'setor')
};
