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
    date: {
      type: Date,
      required: true
    },
    content: {
      type: String,
      minlength: 3,
      maxlength: 280,
      required: true
    },
    picPath: {
      type: String
    },
    picName: {
      type: String
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
module.exports = mongoose.model('Game', schema);
