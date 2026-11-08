
import { useEffect, useState } from 'react';

import api from '../api';
import { Priority } from './Dashboard';

const Tasks = () => {

    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);

    const [filters, setFilters] = useState({
        search: '',
        status: '',
        priority: '',
        projectId: ''
    });

    const [error, setError] = useState('');


    // Get tasks and projects from backend
    const loadTasks = async () => {

        try {
            const [taskResponse, projectResponse] = await Promise.all([
                api.get('/tasks', {
                    params: filters
                }),

                api.get('/projects')
            ]);

            setTasks(taskResponse.data.tasks);
            setProjects(projectResponse.data.projects);

            setError('');

        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };


    useEffect(() => {
        loadTasks();
    }, [filters.search, filters.status, filters.priority, filters.projectId]);


    // Handle filter changes
    const handleFilterChange = (e) => {

        const { name, value } = e.target;

        setFilters({
            ...filters,
            [name]: value
        });
    };


    // Update task status
    const handleStatusChange = async (task, status) => {

        try {
            await api.patch(`/tasks/${task._id}`, {
                status: status
            });

            loadTasks();

        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };


    // Delete task
    const handleDelete = async (task) => {

        const confirmDelete = window.confirm(
            `Are you sure you want to delete "${task.title}"?`
        );

        if (!confirmDelete) return;

        try {
            await api.delete(`/tasks/${task._id}`);

            loadTasks();

        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };


    // Clear all filters
    const clearFilters = () => {
        setFilters({
            search: '',
            status: '',
            priority: '',
            projectId: ''
        });
    };


    return (
        <>

            <div className="page-heading">

                <div>
                    <div className="eyebrow">ALL YOUR WORK</div>

                    <h1>Tasks</h1>

                    <p className="muted">
                        Search, filter, and keep every task moving.
                    </p>
                </div>

            </div>


            {error && (
                <div className="alert">
                    {error}
                </div>
            )}


            <section className="panel">

                {/* Search and filters */}
                <div className="filter-bar">

                    <div className="search-box">

                        <span>⌕</span>

                        <input
                            type="text"
                            name="search"
                            value={filters.search}
                            onChange={handleFilterChange}
                            placeholder="Search tasks by title..."
                        />

                    </div>


                    <select
                        name="projectId"
                        value={filters.projectId}
                        onChange={handleFilterChange}
                    >
                        <option value="">All projects</option>

                        {projects.map((project) => (
                            <option
                                key={project._id}
                                value={project._id}
                            >
                                {project.name}
                            </option>
                        ))}

                    </select>


                    <select
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                    >
                        <option value="">All statuses</option>
                        <option value="todo">To do</option>
                        <option value="in-progress">In progress</option>
                        <option value="done">Done</option>
                    </select>


                    <select
                        name="priority"
                        value={filters.priority}
                        onChange={handleFilterChange}
                    >
                        <option value="">All priorities</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>

                </div>


                
                <div className="panel-heading task-results-heading">

                    <h2>
                        Task list{' '}
                        <span className="count-badge">
                            {tasks.length}
                        </span>
                    </h2>

                </div>


                {tasks.length > 0 ? (

                    <div className="table-wrap">

                        <table>

                            <thead>
                                <tr>
                                    <th>TASK</th>
                                    <th>PROJECT</th>
                                    <th>ASSIGNEE</th>
                                    <th>PRIORITY</th>
                                    <th>STATUS</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>


                            <tbody>

                                {tasks.map((task) => (

                                    <tr key={task._id}>

                                        <td>
                                            <strong>{task.title}</strong>

                                            <div className="table-sub">
                                                {task.dueDate
                                                    ? `Due ${new Date(task.dueDate).toLocaleDateString()}`
                                                    : task.description}
                                            </div>
                                        </td>


                                        <td>
                                            {task.project?.name || '-'}
                                        </td>


                                        <td>
                                            {task.assignee?.name || 'Unassigned'}
                                        </td>


                                        <td>
                                            <Priority value={task.priority} />
                                        </td>


                                        <td>

                                            <select
                                                className="inline-select"
                                                value={task.status}
                                                onChange={(e) =>
                                                    handleStatusChange(
                                                        task,
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="todo">
                                                    To do
                                                </option>

                                                <option value="in-progress">
                                                    In progress
                                                </option>

                                                <option value="done">
                                                    Done
                                                </option>

                                            </select>

                                        </td>


                                        <td>
                                            <button
                                                className="text-action danger-text"
                                                onClick={() => handleDelete(task)}
                                            >
                                                Delete
                                            </button>
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                ) : (

                    <div className="empty-state">

                        <span>⌕</span>

                        <p>No tasks match those filters.</p>

                        <button
                            className="btn btn-light"
                            onClick={clearFilters}
                        >
                            Clear filters
                        </button>

                    </div>

                )}

            </section>

        </>
    );
};

export default Tasks;

