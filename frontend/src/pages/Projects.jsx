import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const Projects = () => {

    const [projects, setProjects] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        name: '',
        description: '',
        status: 'active'
    });


    // Get all projects
    const loadProjects = async () => {
        try {
            const response = await api.get('/projects');
            setProjects(response.data.projects);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };


    useEffect(() => {
        loadProjects();
    }, []);


    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value
        });
    };


    // Open form for creating or editing a project
    const openForm = (project = null) => {

        setEditingProject(project);

        if (project) {
            setForm({
                name: project.name,
                description: project.description || '',
                status: project.status
            });
        } else {
            setForm({
                name: '',
                description: '',
                status: 'active'
            });
        }

        setError('');
        setShowForm(true);
    };


    // Create or update project
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');

        try {
            if (editingProject) {
                await api.patch(
                    `/projects/${editingProject._id}`,
                    form
                );
            } else {
                await api.post('/projects', form);
            }

            setShowForm(false);
            setEditingProject(null);
            loadProjects();

        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };


    // Delete project
    const handleDelete = async (project) => {

        const confirmDelete = window.confirm(
            `Are you sure you want to delete "${project.name}" and all its tasks?`
        );

        if (!confirmDelete) return;

        try {
            await api.delete(`/projects/${project._id}`);
            loadProjects();
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };


    // Close project form
    const closeForm = () => {
        setShowForm(false);
        setEditingProject(null);
    };


    return (
        <>

            <div className="page-heading">

                <div>
                    <div className="eyebrow">ORGANIZE YOUR WORK</div>

                    <h1>Projects</h1>

                    <p className="muted">
                        Plan, track, and deliver your team's work.
                    </p>
                </div>

                <button
                    className="btn btn-primary"
                    onClick={() => openForm()}
                >
                    + New project
                </button>

            </div>


            {error && (
                <div className="alert">
                    {error}
                </div>
            )}


            {/* Create and edit project form */}
            {showForm && (

                <div className="panel form-panel">

                    <div className="panel-heading">

                        <h2>
                            {editingProject
                                ? 'Edit project'
                                : 'Create a project'}
                        </h2>

                        <button
                            type="button"
                            className="icon-button"
                            onClick={closeForm}
                        >
                            ✕
                        </button>

                    </div>


                    <form className="form-stack" onSubmit={handleSubmit}>

                        <label>
                            Project name

                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="e.g. Website redesign"
                                required
                            />
                        </label>


                        <label>
                            Description

                            <textarea
                                name="description"
                                rows="3"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="What is this project about?"
                            />
                        </label>


                        <label>
                            Status

                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                            >
                                <option value="planning">Planning</option>
                                <option value="active">Active</option>
                                <option value="completed">Completed</option>
                            </select>
                        </label>


                        <div className="form-actions">

                            <button
                                type="button"
                                className="btn btn-light"
                                onClick={closeForm}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                {editingProject
                                    ? 'Save changes'
                                    : 'Create project'}
                            </button>

                        </div>

                    </form>

                </div>
            )}


            {/* Display all projects */}
            <div className="project-grid">

                {projects.map((project, index) => (

                    <article
                        className="project-card"
                        key={project._id}
                    >

                        <div className="project-card-top">

                            <span className={`project-icon project-icon-${index % 4}`}>
                                ▣
                            </span>

                            <span className={`pill project-${project.status}`}>
                                {project.status}
                            </span>

                        </div>


                        <Link
                            className="project-card-title"
                            to={`/projects/${project._id}`}
                        >
                            {project.name}
                        </Link>


                        <p className="muted project-description">
                            {project.description ||
                                'No description added yet.'}
                        </p>


                        <div className="project-card-foot">

                            <span>
                                Updated{' '}
                                {new Date(
                                    project.updatedAt
                                ).toLocaleDateString()}
                            </span>


                            <div>

                                <button
                                    className="text-action"
                                    onClick={() => openForm(project)}
                                >
                                    Edit
                                </button>

                                <button
                                    className="text-action danger-text"
                                    onClick={() => handleDelete(project)}
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    </article>

                ))}

            </div>


            {/* Show message when there are no projects */}
            {projects.length === 0 && !showForm && !error && (

                <div className="panel">

                    <div className="empty-state">

                        <span>▣</span>

                        <h3>Your projects start here</h3>

                        <p>
                            Create a project to organize tasks,
                            deadlines, and team assignments.
                        </p>

                        <button
                            className="btn btn-primary"
                            onClick={() => openForm()}
                        >
                            Create your first project
                        </button>

                    </div>

                </div>

            )}

        </>
    );
};

export default Projects;

