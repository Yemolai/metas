'use strict';

module.exports = {
  up: (q, S) => q.addColumn('usuarios', 'permissoes', { type: S.INTEGER, references: { model: 'permissoes', key: 'id' } }),
  down: q => q.removeColumn('usuarios', 'permissoes')
};
