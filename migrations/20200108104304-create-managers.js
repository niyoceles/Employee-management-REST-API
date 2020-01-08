'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('managers', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      managerNames: {
        type: Sequelize.STRING,
        allowNull: false,
        required: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        required: true,
        validate: {
          isEmail: true
        }
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      position: {
        type: Sequelize.STRING,
        allowNull: false,
        required: true
      },
      nationalId: {
        type: Sequelize.STRING,
        allowNull: false,
        required: true,
        unique: true
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        required: true,
        unique: true
      },
      birthDate: {
        type: Sequelize.STRING,
        allowNull: false,
        required: true
      },
      status: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      isVerified: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('managers');
  }
};
