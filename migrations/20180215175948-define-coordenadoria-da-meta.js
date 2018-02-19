'use strict';

module.exports = {
  up: (q, S) => q.addColumn('metas', 'coordenadoria', { type: S.INTEGER, references: { model: 'coordenadorias', key: 'id' }}),
  down: q => q.removeColumn('metas', 'coordenadoria')
};
