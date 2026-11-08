const express = require('express');
const mongoose = require('mongoose');

const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);



router.get('/', async (req, res, next) => {
  try {
    const filter = {};


    if (req.query.projectId) {
      filter.project = req.query.projectId;
    }

    const validStatuses = ['todo', 'in-progress', 'done'];

    if (validStatuses.includes(req.query.status)) {
      filter.status = req.query.status;
    }

    const validPriorities = ['low', 'medium', 'high'];

    if (validPriorities.includes(req.query.priority)) {
      filter.priority = req.query.priority;
    }


    if (req.query.assignee === 'me') {
      filter.assignee = req.user._id;
    } else if (
      req.query.assignee &&
      mongoose.isValidObjectId(req.query.assignee)
    ) {
      filter.assignee = req.query.assignee;
    }

    if (req.query.search) {
      const searchText = req.query.search.trim();

      const escapedSearch = searchText.replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&'
      );

      filter.title = {
        $regex: escapedSearch,
        $options: 'i'
      };
    }

    const ownedProjects = await Project.find({
      owner: req.user._id
    }).select('_id');

    const projectIds = ownedProjects.map((project) => project._id);

   
    if (req.query.projectId) {
      filter.project = {
        $in: projectIds.filter(
          (projectId) => String(projectId) === req.query.projectId
        )
      };
    } else {
      filter.project = {
        $in: projectIds
      };
    }

    
    const tasks = await Task.find(filter)
      .populate('project', 'name')
      .populate('assignee', 'name email')
      .sort({ updatedAt: -1 });

    res.json({ tasks });

  } catch (error) {
    next(error);
  }
});


router.post('/projects/:projectId/tasks', async (req, res, next) => {
  try {
    
    const project = await Project.findOne({
      _id: req.params.projectId,
      owner: req.user._id
    });

    if (!project) {
      return res.status(404).json({
        message: 'Project not found.'
      });
    }

    const {
      title,
      description = '',
      status = 'todo',
      priority = 'medium',
      dueDate = null,
      assignee = null
    } = req.body;

    
    if (!title?.trim()) {
      return res.status(400).json({
        message: 'Task title is required.'
      });
    }

  
    if (assignee && !await User.exists({ _id: assignee })) {
      return res.status(400).json({
        message: 'Assignee is not a registered user.'
      });
    }

    const task = await Task.create({
      title: title.trim(),
      description,
      status,
      priority,
      dueDate: dueDate || null,
      project: project._id,
      assignee: assignee || null,
      createdBy: req.user._id
    });

    
    await task.populate([
      {
        path: 'assignee',
        select: 'name email'
      },
      {
        path: 'project',
        select: 'name'
      }
    ]);

    res.status(201).json({ task });

  } catch (error) {
    next(error);
  }
});



router.patch('/:id', async (req, res, next) => {
  try {
    
    const task = await Task.findById(req.params.id)
      .populate('project');

    
    if (
      !task ||
      String(task.project.owner) !== String(req.user._id)
    ) {
      return res.status(404).json({
        message: 'Task not found.'
      });
    }

    
    const allowedFields = [
      'title',
      'description',
      'status',
      'priority',
      'dueDate',
      'assignee'
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        task[field] =
          req.body[field] ||
          (field === 'assignee' || field === 'dueDate'
            ? null
            : req.body[field]);
      }
    });

  
    if (
      task.assignee &&
      !await User.exists({ _id: task.assignee })
    ) {
      return res.status(400).json({
        message: 'Assignee is not a registered user.'
      });
    }

  
    await task.save();

  
    await task.populate([
      {
        path: 'assignee',
        select: 'name email'
      },
      {
        path: 'project',
        select: 'name'
      }
    ]);

    res.json({ task });

  } catch (error) {
    next(error);
  }
});



router.delete('/:id', async (req, res, next) => {
  try {
  
    const task = await Task.findById(req.params.id)
      .populate('project');

    
    if (
      !task ||
      String(task.project.owner) !== String(req.user._id)
    ) {
      return res.status(404).json({
        message: 'Task not found.'
      });
    }

    await task.deleteOne();

    res.json({
      message: 'Task deleted.'
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
