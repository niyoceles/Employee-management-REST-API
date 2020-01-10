export default (sequelize, DataTypes) => {
  const managers = sequelize.define(
    'managers',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },

      managerNames: {
        type: DataTypes.STRING,
        allowNull: false
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        required: true,
        validate: {
          isEmail: true
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      position: {
        type: DataTypes.STRING,
        allowNull: false
      },
      nationalId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
      },
      birthDate: {
        type: DataTypes.STRING,
        allowNull: true
      },
      status: {
        allowNull: false,
        type: DataTypes.BOOLEAN
      },
      isVerified: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {}
  );
  managers.associate = models => {
    //any association
  };
  return managers;
};
