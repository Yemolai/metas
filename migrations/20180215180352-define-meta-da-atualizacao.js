'use strict';

module.exports = {
  up: (q, S) => q.addColumn('atualizacoes', 'meta', { type: S.INTEGER, references: { model: 'metas', key: 'id' } }),
  down: q => q.removeColumn('atualizacoes', 'meta')
};
