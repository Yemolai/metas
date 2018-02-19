'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('atualizacoes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      titulo: {
        type: Sequelize.STRING
      },
      resumo: {
        type: Sequelize.STRING
      },
      estado: {
        type: Sequelize.TEXT
      },
      escopo_previsto: {
        type: Sequelize.FLOAT
      },
      escopo_realizado: {
        type: Sequelize.FLOAT
      },
      inicio_previsto: {
        type: Sequelize.DATE
      },
      inicio_realizado: {
        type: Sequelize.DATE
      },
      fim_previsto: {
        type: Sequelize.DATE
      },
      fim_realizado: {
        type: Sequelize.DATE
      },
      custo_previsto: {
        type: Sequelize.FLOAT
      },
      custo_realizado: {
        type: Sequelize.FLOAT
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
    return queryInterface.dropTable('atualizacoes');
  }
};