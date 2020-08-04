'use strict';

const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required.'],
      minlength: 3,
      maxlength: 200
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    photo: {
      type: String,
      default: ''
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required.'],
      minlength: 6
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
module.exports = User;
