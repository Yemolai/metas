'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('permissoes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nome: {
        type: Sequelize.STRING
      },
      setor_create: { 
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      setor_read: { 
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      setor_update: { 
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      setor_delete: { 
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      coord_create: { 
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      coord_read: { 
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      coord_update: { 
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      coord_delete: { 
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      meta_create: { 
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      meta_read: { 
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      meta_update: { 
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      meta_delete: { 
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      atual_create: { 
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      atual_read: { 
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      atual_update: { 
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      atual_delete: { 
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      own_setor_update: { 
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      own_setor_delete: { 
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      own_coord_update: { 
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      own_coord_delete: { 
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      own_meta_update: {
        type: Sequelize.BOOLEAN,
        defaultvalue: true
      },
      own_meta_delete: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      own_atual_update: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      own_atual_delete: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('permissoes');
  }
};