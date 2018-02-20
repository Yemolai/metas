'use strict';
module.exports = (sequelize, DataTypes) => {
  var Permissao = sequelize.define('Permissao', {
    nome: DataTypes.STRING,
    setor_create: DataTypes.BOOLEAN,
    setor_read: DataTypes.BOOLEAN,
    setor_update: DataTypes.BOOLEAN,
    setor_delete: DataTypes.BOOLEAN,
    coord_create: DataTypes.BOOLEAN,
    coord_read: DataTypes.BOOLEAN,
    coord_update: DataTypes.BOOLEAN,
    coord_delete: DataTypes.BOOLEAN,
    meta_create: DataTypes.BOOLEAN,
    meta_read: DataTypes.BOOLEAN,
    meta_update: DataTypes.BOOLEAN,
    meta_delete: DataTypes.BOOLEAN,
    atual_create: DataTypes.BOOLEAN,
    atual_read: DataTypes.BOOLEAN,
    atual_update: DataTypes.BOOLEAN,
    atual_delete: DataTypes.BOOLEAN,
    own_setor_update: DataTypes.BOOLEAN,
    own_setor_delete: DataTypes.BOOLEAN,
    own_coord_update: DataTypes.BOOLEAN,
    own_coord_delete: DataTypes.BOOLEAN,
    own_meta_update: DataTypes.BOOLEAN,
    own_meta_delete: DataTypes.BOOLEAN,
    own_atual_update: DataTypes.BOOLEAN,
    own_atual_delete: DataTypes.BOOLEAN
  }, {
    freezeTableName: true,
    tableName: 'permissoes'
  });
  Permissao.associate = function(models) {
    // associations can be defined here
  };
  return Permissao;
};