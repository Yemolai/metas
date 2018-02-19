'use strict';

module.exports = {
  up: (q, S) => q.addColumn('metas', 'responsavel', { type: S.INTEGER, references: { model: 'usuarios', key: 'id' }}),
  down: q => q.removeColumn('metas', 'responsavel')
};
