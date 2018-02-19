'use strict';
module.exports = (sequelize, DataTypes) => {
  var Setor = sequelize.define('Setor', {
    nome: DataTypes.STRING,
    sigla: DataTypes.STRING,
    endereco: DataTypes.STRING,
    telefone: DataTypes.STRING,
    ramal: DataTypes.STRING
    // autor: Usuario.id,
    // responsavel: Usuario.id
  }, {
    freezeTableName: true,
    tableName: 'setores'
  });
  Setor.associate = function(modelo) {
    /* migration: 20180215175120-define-autor-do-setor */
    modelo.Setor.belongsTo(modelo.Usuario, { as: 'Autor', foreignKey: 'autor' })

    /* migration: 20180215175128-define-responsavel-pelo-setor */
    modelo.Setor.belongsTo(modelo.Usuario, { as: 'Responsavel', foreignKey: 'responsavel' })
  };
  return Setor;
};