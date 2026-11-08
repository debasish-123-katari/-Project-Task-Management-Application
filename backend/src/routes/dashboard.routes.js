const express = require('express');

const auth = require('../middleware/auth');
const Project = require('../models/Project');
const Task = require('../models/Task');

const router = express.Router();


router.get('/', auth, async (req, res, next) => {
  try {

    const projects = await Project.find({
      owner: req.user._id
    })
      .select('_id name status updatedAt')
      .sort({ updatedAt: -1 });


    const projectIds = projects.map((project) => project._id);

    const [
      totalTasks,
      todo,
      inProgress,
      done,
      recentTasks
    ] = await Promise.all([


      Task.countDocuments({
        project: { $in: projectIds }
      }),

      Task.countDocuments({
        project: { $in: projectIds },
        status: 'todo'
      }),

      Task.countDocuments({
        project: { $in: projectIds },
        status: 'in-progress'
      }),


      Task.countDocuments({
        project: { $in: projectIds },
        status: 'done'
      }),

      Task.find({
        project: { $in: projectIds }
      })
        .populate('project', 'name')
        .populate('assignee', 'name')
        .sort({ updatedAt: -1 })
        .limit(6)

    ]);


    res.json({
      summary: {
        totalProjects: projects.length,
        totalTasks,
        todo,
        inProgress,
        done
      },

      projects: projects.slice(0, 5),

      recentTasks
    });

  } catch (error) {
    next(error);
  }
});


module.exports = router;

