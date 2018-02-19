'use strict';

module.exports = {
  up: (q, S) => q.addColumn('metas', 'pai', { type: S.INTEGER, references: { model: 'metas', key: 'id' }, constraints: false }),
  down: q => q.removeColumn('metas', 'pai')
};
