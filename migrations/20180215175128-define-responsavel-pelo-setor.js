'use strict';

module.exports = {
  up: (q, S) => q.addColumn('setores', 'responsavel', { type: S.INTEGER, references: { model: 'usuarios', key: 'id' } }),
  down: q => q.removeColumn('setores', 'responsavel')
};
