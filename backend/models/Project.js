const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Project = sequelize.define('Project', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 100]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [1, 500]
    }
  },
  image: {
    type: DataTypes.STRING,
    defaultValue: 'no-photo.jpg'
  },
  technologies: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  githubUrl: {
    type: DataTypes.STRING,
    validate: {
      isUrl: true
    }
  },
  liveUrl: {
    type: DataTypes.STRING,
    validate: {
      isUrl: true
    }
  }
});

// Define associations
Project.belongsTo(User, {
  foreignKey: {
    name: 'userId',
    allowNull: false
  }
});

User.hasMany(Project, {
  foreignKey: 'userId'
});

module.exports = Project; 