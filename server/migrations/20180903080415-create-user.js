module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      admin: {
        type: Sequelize.BOOLEAN,
      },
      name: {
        type: Sequelize.STRING,
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
      },
      issueId: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })),
  down: queryInterface => queryInterface.dropTable('Users'),
};
