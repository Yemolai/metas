'use strict';
module.exports = (sequelize, DataTypes) => {
  var Usuario = sequelize.define('Usuario', {
    guid: DataTypes.STRING,
    matricula: DataTypes.STRING,
    nome: DataTypes.STRING,
    Usuario: DataTypes.STRING,
    senha: DataTypes.STRING
    // permissoes: Permissao.id,
    // setor: Setor.id,
    // coordenadoria: Coordenadoria.id
  }, {
    freezeTableName: true,
    tableName: 'usuarios'
  });
  Usuario.associate = function(modelo) {
    // associations can be defined here

    /* migration: 20180215174805-define-permissoes-de-usuario */
    modelo.Usuario.belongsTo(modelo.Permissao, { as: 'Permissoes', foreignKey: 'permissoes' })

    /* migration: 20180215175200-define-setor-do-usuario */
    modelo.Usuario.belongsTo(modelo.Setor, { as: 'Setor', foreignKey: 'setor' })

    /* migration: 20180215175809-define-coordenadoria-do-usuario */
    modelo.Usuario.belongsTo(modelo.Coordenadoria, { as: 'Coordenadoria', foreignKey: 'coordenadoria' })
  };
  return Usuario;
};