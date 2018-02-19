'use strict';

module.exports = {
  up: (q, S) => q.addColumn('atualizacoes', 'responsavel', { type: S.INTEGER, references: { model: 'usuarios', key: 'id' } }),
  down: q => q.removeColumn('atualizacoes', 'responsavel')
};
