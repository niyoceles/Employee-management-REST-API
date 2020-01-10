export default (sequelize, DataTypes) => {
  const logs = sequelize.define(
    'logs',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
        validate: {
          isEmail: true
        }
      },
      activity: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {}
  );
  logs.associate = models => {
    //any association
  };
  return logs;
};
