import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const getStatusLabel = (status) => {
    const labels = {
        todo: 'To do',
        'in-progress': 'In progress',
        done: 'Done'
    };

    return labels[status] || status;
};

function Dashboard() {
    const [data, setData] = useState(null);
    const [error, setError] = useState('');

    const loadDashboard = async () => {
        try {
            const response = await api.get('/dashboard');
            setData(response.data);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    if (error) {
        return <div className="alert">{error}</div>;
    }

    if (!data) {
        return <div className="muted">Loading dashboard...</div>;
    }

    const { summary, projects, recentTasks } = data;

    const completedPercentage = summary.totalTasks
        ? Math.round((summary.done / summary.totalTasks) * 100)
        : 0;

    return (
        <>
            <div className="page-heading">
                <div>
                    <div className="eyebrow">YOUR WORKSPACE</div>
                    <h1>Overview</h1>
                    <p className="muted">
                        Here's what's happening across your projects.
                    </p>
                </div>

                <Link to="/projects" className="btn btn-primary">
                    + New project
                </Link>
            </div>

            <div className="stats-grid">
                <Stat
                    label="Total projects"
                    value={summary.totalProjects}
                    icon="▣"
                    tone="violet"
                />

                <Stat
                    label="Total tasks"
                    value={summary.totalTasks}
                    icon="☷"
                    tone="blue"
                />

                <Stat
                    label="In progress"
                    value={summary.inProgress}
                    icon="◷"
                    tone="amber"
                />

                <Stat
                    label="Completed tasks"
                    value={summary.done}
                    icon="✓"
                    tone="green"
                />
            </div>

            <div className="dashboard-grid">
                <section className="panel">
                    <div className="panel-heading">
                        <div>
                            <h2>Your projects</h2>
                            <p className="muted">Recently updated work</p>
                        </div>

                        <Link to="/projects">View all ↗</Link>
                    </div>

                    {projects.length > 0 ? (
                        projects.map((project) => (
                            <Link
                                to={`/projects/${project._id}`}
                                className="project-row"
                                key={project._id}
                            >
                                <span className="project-icon">▣</span>

                                <span className="row-main">
                                    <strong>{project.name}</strong>
                                    <small>
                                        {project.status} · Updated{' '}
                                        {new Date(
                                            project.updatedAt
                                        ).toLocaleDateString()}
                                    </small>
                                </span>

                                <span className="row-arrow">→</span>
                            </Link>
                        ))
                    ) : (
                        <Empty text="No projects yet. Create your first project to get started." />
                    )}
                </section>

                <section className="panel">
                    <div className="panel-heading">
                        <div>
                            <h2>Task progress</h2>
                            <p className="muted">
                                Across all your projects
                            </p>
                        </div>
                    </div>

                    <div className="progress-summary">
                        <div className="progress-number">
                            {completedPercentage}
                            <small>%</small>
                        </div>

                        <p className="muted">of tasks completed</p>

                        <div className="progress-track">
                            <div
                                className="progress-fill"
                                style={{
                                    width: `${completedPercentage}%`
                                }}
                            />
                        </div>

                        <div className="progress-legend">
                            <span>
                                <i className="dot dot-gray" /> To do
                                <b>{summary.todo}</b>
                            </span>

                            <span>
                                <i className="dot dot-blue" /> In progress
                                <b>{summary.inProgress}</b>
                            </span>

                            <span>
                                <i className="dot dot-green" /> Done
                                <b>{summary.done}</b>
                            </span>
                        </div>
                    </div>
                </section>
            </div>

            <section className="panel recent-panel">
                <div className="panel-heading">
                    <div>
                        <h2>Recent tasks</h2>
                        <p className="muted">
                            Latest activity in your workspace
                        </p>
                    </div>

                    <Link to="/tasks">All tasks ↗</Link>
                </div>

                {recentTasks.length > 0 ? (
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>TASK</th>
                                    <th>PROJECT</th>
                                    <th>ASSIGNEE</th>
                                    <th>PRIORITY</th>
                                    <th>STATUS</th>
                                </tr>
                            </thead>

                            <tbody>
                                {recentTasks.map((task) => (
                                    <tr key={task._id}>
                                        <td>
                                            <strong>{task.title}</strong>
                                        </td>

                                        <td>{task.project?.name || '-'}</td>

                                        <td>
                                            {task.assignee?.name || 'Unassigned'}
                                        </td>

                                        <td>
                                            <Priority value={task.priority} />
                                        </td>

                                        <td>
                                            <Status value={task.status} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <Empty text="Tasks you create will appear here." />
                )}
            </section>
        </>
    );
}

export default Dashboard;


// Statistics card
export function Stat({ label, value, icon, tone }) {
    return (
        <div className="stat-card">
            <span className={`stat-icon ${tone}`}>{icon}</span>
            <span className="stat-label">{label}</span>
            <strong className="stat-value">{value}</strong>
            <span className="stat-foot">In your workspace</span>
        </div>
    );
}


// Empty state message
export function Empty({ text }) {
    return (
        <div className="empty-state">
            <span>✳</span>
            <p>{text}</p>
        </div>
    );
}


// Task status badge
export function Status({ value }) {
    return (
        <span className={`pill status-${value}`}>
            {getStatusLabel(value)}
        </span>
    );
}


// Task priority badge
export function Priority({ value }) {
    return (
        <span className={`priority priority-${value}`}>
            {value}
        </span>
    );
}

