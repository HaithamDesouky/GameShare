'use strict';

const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true
    },
    photo: {
      type: String
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String
    },
    location: {
      coordinates: [
        {
          type: Number,
          min: -180,
          max: 180
        }
      ],
      type: {
        type: String,
        default: 'Point'
      }
    },
    games: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }],
    status: {
      type: String,
      enum: ['pending_confirmation', 'active'],
      default: 'pending_confirmation'
    },
    confirmationToken: {
      type: String,
      unique: true
    }
  },
  {
    timestamps: {
      createdAt: 'creationDate',
      updatedAt: 'editDate'
    }
    /*githubToken: {
    type: String
  }*/
  }
);
const User = mongoose.model('User', userSchema);
module.exports = mongoose.model('User', schema);
