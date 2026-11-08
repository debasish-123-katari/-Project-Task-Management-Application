
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const Login = () => {

    const [form, setForm] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);

    const { setUser } = useAuth();
    const navigate = useNavigate();


    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setBusy(true);

        try {
            const response = await api.post('/auth/login', form);

            setUser(response.data.user);

            navigate('/');

        } catch (err) {
            setError(
                err.response?.data?.message || 'Login failed. Please try again.'
            );
        } finally {
            setBusy(false);
        }
    };


    return (
        <div className="auth-page">

            <div className="auth-brand">
                <span className="brand-mark">T</span>
                TaskFlow
            </div>

            <section className="auth-card">

                <div className="eyebrow">WELCOME BACK</div>

                <h1>Sign in to your workspace</h1>

                <p className="muted">
                    Keep your projects moving forward.
                </p>

                {error && (
                    <div className="alert">
                        {error}
                    </div>
                )}

                <form className="form-stack" onSubmit={handleSubmit}>

                    <label>
                        Email address

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            required
                        />
                    </label>

                    <label>
                        Password

                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="At least 8 characters"
                            required
                        />
                    </label>

                    <button
                        type="submit"
                        className="btn btn-primary btn-full"
                        disabled={busy}
                    >
                        {busy ? 'Signing in...' : 'Sign in'}
                    </button>

                </form>

                <p className="auth-foot">
                    New to TaskFlow?{' '}
                    <Link to="/register">
                        Create an account
                    </Link>
                </p>

            </section>

            <p className="auth-caption">
                Plan clearly. Build together. Deliver better.
            </p>

        </div>
    );
};

export default Login;

