'use strict';
module.exports = (sequelize, DataTypes) => {
  var Atualizacao = sequelize.define('Atualizacao', {
    titulo: DataTypes.STRING,
    resumo: DataTypes.STRING,
    estado: DataTypes.TEXT,
    escopo_previsto: DataTypes.DECIMAL(32, 12), // was FLOAT
    escopo_realizado: DataTypes.DECIMAL(32, 12), // was FLOAT
    inicio_previsto: DataTypes.DATE,
    inicio_realizado: DataTypes.DATE,
    fim_previsto: DataTypes.DATE,
    fim_realizado: DataTypes.DATE,
    custo_previsto: DataTypes.DECIMAL(32, 12), // was FLOAT
    custo_realizado: DataTypes.DECIMAL(32, 12), // was FLOAT
    motivo: DataTypes.STRING // migration: 20180319191907-add-motivo-column-in-atualizacao
    // autor: Usuario.id,
    // meta: Meta.id,
    // responsavel: Usuario.id,
    // pai: Meta.id,
    // coordenadoria: Coordenadoria.id
  }, {
    freezeTableName: true,
    tableName: 'atualizacoes'
  });
  Atualizacao.associate = function(modelo) {
    // model associations are defined here

    /* migration: 20180215180333-define-autor-da-atualizacao */
    modelo.Atualizacao.belongsTo(modelo.Usuario, { as: 'Autor', foreignKey: 'autor' })

    /* migration: 20180215180352-define-meta-da-atualizacao */
    modelo.Atualizacao.belongsTo(modelo.Meta, { as: 'Meta', foreignKey: 'meta' })

    /* migration: 20180215180421-define-responsavel-pela-meta-na-atualizacao */
    modelo.Atualizacao.belongsTo(modelo.Usuario, { as: 'Responsavel', foreignKey: 'responsavel' })

    /* migration: 20180215180457-define-meta-pai-da-meta-na-atualizacao */
    modelo.Atualizacao.belongsTo(modelo.Meta, { as: 'Pai', foreignKey: 'pai' })

    /* migration: 20180215180511-define-coordenadoria-da-meta-na-atualizacao */
    modelo.Atualizacao.belongsTo(modelo.Coordenadoria, { as: 'Coordenadoria', foreignKey: 'coordenadoria' })
  };
  return Atualizacao;
};