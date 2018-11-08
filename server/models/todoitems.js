module.exports = (sequelize, DataTypes) => {
  const TodoItems = sequelize.define('TodoItem', {
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    complete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });
  TodoItems.associate = (models) => {
    TodoItems.belongsTo(models.Todo, {
      foreignKey: 'todoId',
    });
  };
  return TodoItems;
};
