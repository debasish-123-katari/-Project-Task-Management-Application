const mongoose = require('mongoose');


const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: ''
    },
    status: {
      type: String,
      enum: ['planning', 'active', 'completed'],
      default: 'active'
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },{ timestamps: true }
);

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;

