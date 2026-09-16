import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import peopleImage from '../assets/login-people.svg';
import lockImage from '../assets/lock.svg';
import googleLogo from '../assets/google.svg';
import facebookLogo from '../assets/facebook.svg';
import yandexLogo from '../assets/yandex.svg';

export const LoginPage = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ login: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const submit = async (event) => {
    event.preventDefault();
    if (!form.login.trim() || !form.password) return;

    setError('');
    setLoading(true);
    try {
      await login(form.login.trim(), form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Введите корректные данные');
    } finally {
      setLoading(false);
    }
  };

  const disabled = !form.login.trim() || !form.password || loading;

  return (
    <main className="login-page container">
      <section className="login-copy">
        <h1>Для оформления подписки<br />на тариф, необходимо<br />авторизоваться.</h1>
      </section>

      <img className="login-people" src={peopleImage} alt="" aria-hidden="true" />

      <section className="login-card" aria-label="Авторизация">
        <img className="login-lock" src={lockImage} alt="" aria-hidden="true" />
        <div className="auth-tabs">
          <button type="button" className="active">Войти</button>
          <button type="button">Зарегистрироваться</button>
        </div>
        <form onSubmit={submit} noValidate>
          <label>
            Логин или номер телефона:
            <input
              value={form.login}
              onChange={(e) => setForm({ ...form, login: e.target.value })}
              autoComplete="username"
              className={error ? 'input-error' : ''}
            />
          </label>
          <label>
            Пароль:
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              autoComplete="current-password"
              className={error ? 'input-error' : ''}
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="primary-button full-button" type="submit" disabled={disabled}>
            {loading ? 'Входим…' : 'Войти'}
          </button>
        </form>
        <button type="button" className="forgot-link">Восстановить пароль</button>
        <p className="social-title">Войти через:</p>
        <div className="social-row">
          <button type="button" aria-label="Войти через Google"><img src={googleLogo} alt="Google" /></button>
          <button type="button" aria-label="Войти через Facebook"><img src={facebookLogo} alt="Facebook" /></button>
          <button type="button" aria-label="Войти через Яндекс"><img src={yandexLogo} alt="Яндекс" /></button>
        </div>
      </section>
    </main>
  );
};
