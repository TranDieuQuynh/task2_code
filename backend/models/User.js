const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sequelize } = require('../config/db');

class User extends Model {
  // Generate JWT token
  getSignedJwtToken() {
    return jwt.sign(
      { 
        id: this.id,
        name: this.name,
        email: this.email,
        avatar: this.avatar,
        title: this.title,
        bio: this.bio,
        location: this.location,
        website: this.website,
        github: this.github,
        linkedin: this.linkedin,
        twitter: this.twitter
      }, 
      process.env.JWT_SECRET, 
      {
        expiresIn: process.env.JWT_EXPIRE
      }
    );
  }

  // Match password
  async matchPassword(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  }

  // Generate and hash password token
  getResetPasswordToken() {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expire
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    return resetToken;
  }
}

User.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    avatar: {
      type: DataTypes.STRING,
      defaultValue: 'default.jpg'
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: {
          msg: 'Website must be a valid URL'
        }
      }
    },
    github: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: {
          msg: 'GitHub URL must be valid',
          args: {
            allowNull: true
          }
        }
      }
    },
    linkedin: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: {
          msg: 'LinkedIn URL must be valid',
          args: {
            allowNull: true
          }
        }
      }
    },
    twitter: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: {
          msg: 'Twitter URL must be valid',
          args: {
            allowNull: true
          }
        }
      }
    },
    resetPasswordToken: {
      type: DataTypes.STRING
    },
    resetPasswordExpire: {
      type: DataTypes.DATE
    }
  },
  {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  }
);

module.exports = User; 