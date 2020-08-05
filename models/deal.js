'use strict';

const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }],
    status: {
      type: String,
      enum: ['pending_confirmation', 'accepted', 'rejected'],
      default: 'pending_confirmation'
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    sellerGame: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
      required: true
    },
    buyerGame: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
      required: true
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
const Deal = mongoose.model('Deal', dealSchema);
module.exports = Deal;
