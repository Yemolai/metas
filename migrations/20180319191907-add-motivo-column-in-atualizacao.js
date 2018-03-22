'use strict';

module.exports = {
  up: (q, S) => q.addColumn('atualizacoes', 'motivo', { type: S.STRING }),
  down: q => q.removeColumn('atualizacoes', 'motivo')
};
