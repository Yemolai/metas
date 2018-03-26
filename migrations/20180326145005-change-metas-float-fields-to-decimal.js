'use strict';

module.exports = {
  up: (q, S) => q.changeColumn('metas', 'escopo_previsto', { type: S.DECIMAL(32, 12) })
  .then(() => q.changeColumn('metas', 'custo_previsto', { type: S.DECIMAL(32, 12) })),

  down: (q, S) => q.changeColumn('metas', 'escopo_previsto', { type: S.FLOAT })
  .then(() => q.changeColumn('metas', 'custo_previsto', { type: S.FLOAT }))
};
