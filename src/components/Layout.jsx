import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.svg';
import footerLogo from '../assets/logo-footer.svg';

const Loader = () => <span className="spinner" aria-label="Загрузка" />;

export const Layout = () => {
  const { isAuthenticated, accountInfo, accountLoading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="app-shell">
      <header className={`site-header ${menuOpen ? 'menu-open' : ''}`}>
        <div className="container header-inner">
          <NavLink to="/" className="brand" aria-label="СКАН" onClick={closeMenu}>
            <img src={logo} alt="СКАН" />
          </NavLink>

          <nav className="main-nav" aria-label="Основная навигация">
            <NavLink to="/">Главная</NavLink>
            <a href="/#tariffs">Тарифы</a>
            <a href="#faq">FAQ</a>
          </nav>

          <div className="account-area">
            {isAuthenticated ? (
              <>
                <div className="limits-card">
                  {accountLoading ? (
                    <Loader />
                  ) : (
                    <>
                      <span>Использовано компаний <b>{accountInfo?.usedCompanyCount ?? 0}</b></span>
                      <span>Лимит по компаниям <b className="limit-value">{accountInfo?.companyLimit ?? 0}</b></span>
                    </>
                  )}
                </div>
                <div className="profile-block">
                  <div>
                    <strong>Алексей А.</strong>
                    <button type="button" className="link-button" onClick={logout}>Выйти</button>
                  </div>
                  <span className="avatar" aria-hidden="true">А</span>
                </div>
              </>
            ) : (
              <div className="guest-actions">
                <button type="button" className="register-link">Зарегистрироваться</button>
                <span className="separator" />
                <NavLink to="/login" className="login-button">Войти</NavLink>
              </div>
            )}
          </div>

          <button
            className="menu-button"
            type="button"
            aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <div className="mobile-menu">
          <nav aria-label="Мобильная навигация">
            <NavLink to="/" onClick={closeMenu}>Главная</NavLink>
            <a href="/#tariffs" onClick={closeMenu}>Тарифы</a>
            <a href="#faq" onClick={closeMenu}>FAQ</a>
          </nav>
          {!isAuthenticated ? (
            <div className="mobile-auth">
              <button type="button" className="register-link">Зарегистрироваться</button>
              <NavLink to="/login" className="login-button" onClick={closeMenu}>Войти</NavLink>
            </div>
          ) : (
            <button type="button" className="mobile-logout" onClick={() => { logout(); closeMenu(); }}>Выйти</button>
          )}
        </div>
      </header>

      <Outlet />

      <footer className="site-footer">
        <div className="container footer-inner">
          <img src={footerLogo} alt="СКАН" />
          <div className="footer-copy">
            <p>г. Москва, Цветной б-р, 40<br />+7 495 771 21 11<br />info@skan.ru</p>
            <small>Copyright. 2026</small>
          </div>
        </div>
      </footer>
    </div>
  );
};
