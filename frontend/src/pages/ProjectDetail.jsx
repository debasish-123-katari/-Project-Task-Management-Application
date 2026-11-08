import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import api from '../api';
import TaskForm from '../components/TaskForm';
import { Status, Priority } from './Dashboard';

const ProjectDetail = () => {

    const { id } = useParams();

    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);


    // Get project details
    const loadProject = async () => {
        try {
            const response = await api.get(`/projects/${id}`);
            setData(response.data);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };


    useEffect(() => {
        loadProject();
    }, [id]);


    // Delete a task
    const handleDelete = async (task) => {

        const confirmDelete = window.confirm(
            `Are you sure you want to delete "${task.title}"?`
        );

        if (!confirmDelete) return;

        try {
            await api.delete(`/tasks/${task._id}`);
            loadProject();
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };


    // Change task status
    const handleStatusChange = async (taskId, status) => {
        try {
            await api.patch(`/tasks/${taskId}`, { status });
            loadProject();
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };


    // Open form for adding a task
    const handleAddTask = () => {
        setEditingTask(null);
        setShowForm(true);
    };


    // Open form for editing a task
    const handleEditTask = (task) => {
        setEditingTask(task);
        setShowForm(true);
    };


    // Close form after saving or cancelling
    const handleCloseForm = () => {
        setShowForm(false);
        setEditingTask(null);
    };


    if (!data && !error) {
        return <p className="muted">Loading project...</p>;
    }


    return (
        <>
            <Link to="/projects" className="back-link">
                ← All projects
            </Link>

            {error && (
                <div className="alert">
                    {error}
                </div>
            )}

            {data && (
                <>
                    <div className="page-heading">
                        <div>
                            <div className="eyebrow">PROJECT DETAILS</div>

                            <h1>{data.project.name}</h1>

                            <p className="muted">
                                {data.project.description ||
                                    'No project description.'}
                            </p>
                        </div>

                        <button
                            className="btn btn-primary"
                            onClick={handleAddTask}
                        >
                            + Add task
                        </button>
                    </div>


                    {/* Task form */}
                    {showForm && (
                        <div className="panel form-panel">

                            <div className="panel-heading">
                                <h2>
                                    {editingTask ? 'Edit task' : 'New task'}
                                </h2>
                            </div>

                            <TaskForm
                                projectId={id}
                                task={editingTask}
                                onSaved={() => {
                                    handleCloseForm();
                                    loadProject();
                                }}
                                onCancel={handleCloseForm}
                            />

                        </div>
                    )}


                    {/* Project tasks */}
                    <section className="panel">

                        <div className="panel-heading">
                            <div>
                                <h2>Project tasks</h2>

                                <p className="muted">
                                    {data.tasks.length} tasks in this project
                                </p>
                            </div>
                        </div>


                        {data.tasks.length > 0 ? (

                            <div className="table-wrap">
                                <table>

                                    <thead>
                                        <tr>
                                            <th>TASK</th>
                                            <th>ASSIGNEE</th>
                                            <th>DUE DATE</th>
                                            <th>PRIORITY</th>
                                            <th>STATUS</th>
                                            <th>ACTIONS</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {data.tasks.map((task) => (

                                            <tr key={task._id}>

                                                <td>
                                                    <strong>{task.title}</strong>

                                                    <div className="table-sub">
                                                        {task.description}
                                                    </div>
                                                
                                                </td>
                                                <td>
                                                    
                                                    <div className="table-form">Date</div>
                                                </td>

                                                <td>
                                                    {task.assignee?.name || 'Unassigned'}
                                                </td>

                                                <td>
                                                    {task.dueDate
                                                        ? new Date(task.dueDate).toLocaleDateString()
                                                        : '—'}
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
                                                                task._id,
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
                                                        className="text-action"
                                                        onClick={() =>
                                                            handleEditTask(task)
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="text-action danger-text"
                                                        onClick={() =>
                                                            handleDelete(task)
                                                        }
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
                                <span>☷</span>

                                <p>No tasks in this project yet.</p>

                                <button
                                    className="btn btn-primary"
                                    onClick={handleAddTask}
                                >
                                    Add first task
                                </button>
                            </div>

                        )}

                    </section>
                </>
            )}
        </>
    );
};

export default ProjectDetail;

