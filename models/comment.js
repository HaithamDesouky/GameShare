const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: {
    type: String
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  dealId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deal'
  },
  imagePath: {
    type: String
  }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
