'use strict';
module.exports = (sequelize, DataTypes) => {
  var Coordenadoria = sequelize.define('Coordenadoria', {
    nome: DataTypes.STRING,
    sigla: DataTypes.STRING,
    endereco: DataTypes.STRING,
    telefone: DataTypes.STRING,
    ramal: DataTypes.STRING
    // autor: Usuario.id,
    // responsavel: Usuario.id,
    // setor: Setor.id
  }, {
    freezeTableName: true,
    tableName: 'coordenadorias'
  });
  Coordenadoria.associate = function(modelo) {
    // associations can be defined here

    /* migration: 20180215175632-define-autor-da-coordenadoria */
    modelo.Coordenadoria.belongsTo(modelo.Usuario, { as: 'Autor', foreignKey: 'autor' })

    /* migration: 20180215175657-define-responsavel-da-coordenadoria */
    modelo.Coordenadoria.belongsTo(modelo.Usuario, { as: 'Responsavel', foreignKey: 'responsavel' })

    /* migration: 20180215175704-define-setor-da-coordenadoria */
    modelo.Coordenadoria.belongsTo(modelo.Setor, { as: 'Setor', foreignKey: 'setor' })
  };
  return Coordenadoria;
};