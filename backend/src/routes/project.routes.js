const express = require('express');
const mongoose = require('mongoose');

const Project = require('../models/Project');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const router = express.Router();


router.use(auth);



router.get('/', async (req, res, next) => {
  try {

    const projects = await Project.find({
      owner: req.user._id
    }).sort({ updatedAt: -1 });

    res.json({
      projects
    });

  } catch (error) {
    next(error);
  }
});



router.post('/', async (req, res, next) => {
  try {

    const { name, description = '', status = 'active' } = req.body;

    // Check whether project name is provided
    if (!name?.trim()) {
      return res.status(400).json({
        message: 'Project name is required.'
      });
    }

 
    const project = await Project.create({
      name: name.trim(),
      description,
      status,
      owner: req.user._id
    });

    res.status(201).json({
      project
    });

  } catch (error) {
    next(error);
  }
});



router.get('/:id', async (req, res, next) => {
  try {

    const projectId = req.params.id;

    // Check whether project ID is valid
    if (!mongoose.isValidObjectId(projectId)) {
      return res.status(400).json({
        message: 'Invalid project id.'
      });
    }

   
    const project = await Project.findOne({
      _id: projectId,
      owner: req.user._id
    });

  
    if (!project) {
      return res.status(404).json({
        message: 'Project not found.'
      });
    }

   
    const tasks = await Task.find({
      project: project._id
    })
      .populate('assignee', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      project,
      tasks
    });

  } catch (error) {
    next(error);
  }
});



router.patch('/:id', async (req, res, next) => {
  try {

  
    const allowedFields = {};

    const fields = ['name', 'description', 'status'];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        allowedFields[field] = req.body[field];
      }
    });

  
    const project = await Project.findOneAndUpdate(
      {
        _id: req.params.id,
        owner: req.user._id
      },
      allowedFields,
      {
        new: true,
        runValidators: true
      }
    );

    if (!project) {
      return res.status(404).json({
        message: 'Project not found.'
      });
    }

    res.json({
      project
    });

  } catch (error) {
    next(error);
  }
});


router.delete('/:id', async (req, res, next) => {
  try {

  
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!project) {
      return res.status(404).json({
        message: 'Project not found.'
      });
    }

    await Task.deleteMany({
      project: project._id
    });

    res.json({
      message: 'Project and its tasks deleted.'
    });

  } catch (error) {
    next(error);
  }
});


module.exports = router;

