"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {
      Course.belongsTo(models.User, {
        as: "user",
        foreignKey: {
          fieldName: "userId",
          allowNull: false,
          validate: {
            notNull: {
              msg: "Please enter a user id.",
            },
          },
        },
      });
    }

    toJSON() {
      const courseObj = Object.assign({}, this.dataValues);
      delete courseObj.user.dataValues.password;
      delete courseObj.user.dataValues.createdAt;
      delete courseObj.user.dataValues.updatedAt;
      delete courseObj.createdAt;
      delete courseObj.updatedAt;
      delete courseObj.userId;

      return courseObj;
    }
  }

  Course.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "A title is required",
          },
          notEmpty: {
            msg: "Please provide a title",
          },
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "A description is required",
          },
          notEmpty: {
            msg: "Please provide a description",
          },
        },
      },
      estimatedTime: DataTypes.STRING,
      materialsNeeded: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Course",
    }
  );
  return Course;
};
