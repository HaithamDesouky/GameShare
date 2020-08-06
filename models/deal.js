'use strict';

const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    buyerName: {
      type: String,
      required: true
    },
    buyerPhoto: {
      type: String,
      required: true
    },
    buyerGame: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
      required: true
    },
    buyerGameName: {
      type: String,
      required: true
    },
    buyerGamePhoto: {
      type: String,
      required: true
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    sellerName: {
      type: String,
      required: true
    },
    sellerPhoto: {
      type: String,
      required: true
    },
    sellerGame: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
      required: true
    },
    sellerGameName: {
      type: String,
      required: true
    },
    sellerGamePhoto: {
      type: String,
      required: true
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
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
