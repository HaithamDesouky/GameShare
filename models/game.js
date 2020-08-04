'use strict';

const mongoose = require('mongoose');
const gameSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      trim: true,
      required: true
    },
    platform: {
      type: String,
      enum: ['Playstation', 'Xbox', 'Nintendo Switch']
    },
    content: {
      type: String,
      minlength: 3,
      maxlength: 280,
      required: true
    },
    photo: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: {
      createdAt: 'creationDate',
      updatedAt: 'editDate'
    }
  }
  /*githubToken: {
    type: String
  }*/
);
const Game = mongoose.model('Game', gameSchema);
module.exports = Game;
