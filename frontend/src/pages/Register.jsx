import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import api from '../api';
import { useAuth } from '../context/AuthContext';

const Register = () => {

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);

    const { setUser } = useAuth();
    const navigate = useNavigate();


    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value
        });
    };


    // Handle registration form
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setBusy(true);

        try {
            const response = await api.post('/auth/register', form);

            setUser(response.data.user);

            navigate('/');

        } catch (err) {
            setError(
                err.response?.data?.message || err.message
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

                <div className="eyebrow">
                    GET STARTED
                </div>

                <h1>Create your account</h1>

                <p className="muted">
                    Your team's next great project starts here.
                </p>


                {error && (
                    <div className="alert">
                        {error}
                    </div>
                )}


                <form className="form-stack" onSubmit={handleSubmit}>

                    <label>
                        Full name

                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Your name"
                            required
                        />
                    </label>


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
                            minLength={8}
                            required
                        />
                    </label>


                    <button
                        type="submit"
                        className="btn btn-primary btn-full"
                        disabled={busy}
                    >
                        {busy ? 'Creating account...' : 'Create account'}
                    </button>

                </form>


                <p className="auth-foot">
                    Already have an account?{' '}
                    <Link to="/login">
                        Sign in
                    </Link>
                </p>

            </section>


            <p className="auth-caption">
                Plan clearly. Build together. Deliver better.
            </p>

        </div>
    );
};

export default Register;

