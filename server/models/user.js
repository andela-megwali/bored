module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    issueId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  User.associate = (models) => {
    User.hasMany(models.Todo, {
      foreignKey: 'userId',
      as: 'todos',
      onDelete: 'cascade',
    });
  };
  return User;
};
