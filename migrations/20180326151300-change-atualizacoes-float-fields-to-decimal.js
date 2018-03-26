module.exports = {
  up: (q, S) => q.changeColumn('atualizacoes', 'escopo_previsto', { type: S.DECIMAL(32, 12) })
    .then(() => q.changeColumn('atualizacoes', 'escopo_realizado', { type: S.DECIMAL(32, 12) }))
    .then(() => q.changeColumn('atualizacoes', 'custo_previsto', { type: S.DECIMAL(32, 12) }))
    .then(() => q.changeColumn('atualizacoes', 'custo_realizado', { type: S.DECIMAL(32, 12) })),
  down: (q, S) => q.changeColumn('atualizacoes', 'escopo_previsto', { type: S.FLOAT })
    .then(() => q.changeColumn('atualizacoes', 'escopo_realizado', { type: S.FLOAT }))
    .then(() => q.changeColumn('atualizacoes', 'custo_previsto', { type: S.FLOAT }))
    .then(() => q.changeColumn('atualizacoes', 'custo_realizado', { type: S.FLOAT }))
};
