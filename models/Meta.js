'use strict';
module.exports = (sequelize, DataTypes) => {
  var Meta = sequelize.define('Meta', {
    titulo: DataTypes.STRING,
    escopo_previsto: DataTypes.FLOAT,
    inicio_previsto: DataTypes.DATE,
    fim_previsto: DataTypes.DATE,
    custo_previsto: DataTypes.FLOAT
    // autor: Usuario.id,
    // responsavel: Usuario.id,
    // coordenadoria: Coordenadoria.id,
    // pai: Meta.id
  }, {
    freezeTableName: true,
    tableName: 'metas'
  });
  Meta.associate = function(modelo) {
    // associations can be defined here

    /* migration: 20180215175922-define-autor-da-meta */
    modelo.Meta.belongsTo(modelo.Usuario, { as: 'Autor', foreignKey: 'autor' })

    /* migration: 20180215175929-define-responsavel-pela-meta */
    modelo.Meta.belongsTo(modelo.Usuario, { as: 'Responsavel', foreignKey: 'responsavel' })

    /* migration: 20180215175948-define-coordenadoria-da-meta */
    modelo.Meta.belongsTo(modelo.Coordenadoria, { as: 'Coordenadoria', foreignKey: 'coordenadoria' })

    /* migration: 20180215180001-define-meta-pai-da-meta */
    modelo.Meta.belongsTo(modelo.Meta, { as: 'Pai', foreignKey: 'pai' })
  };
  return Meta;
};