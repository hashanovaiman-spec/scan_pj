import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { WhyCarousel } from '../components/WhyCarousel';
import { TariffCard } from '../components/TariffCard';
import { tariffs } from '../data/tariffs';
import heroImage from '../assets/hero.svg';
import homeBand from '../assets/home-band.svg';

export const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <main>
      <section className="hero-section container">
        <div className="hero-copy">
          <h1>Сервис по поиску публикаций<br />о компании<br />по его ИНН</h1>
          <p>Комплексный анализ публикаций, получение данных в формате PDF на электронную почту.</p>
          {isAuthenticated && (
            <Link className="primary-button hero-button" to="/search">Запросить данные</Link>
          )}
        </div>
        <img className="hero-illustration" src={heroImage} alt="" aria-hidden="true" />
      </section>

      <section className="section container">
        <h2>Почему именно мы</h2>
        <WhyCarousel />
      </section>

      <div className="home-band container" aria-hidden="true">
        <img src={homeBand} alt="" />
      </div>

      <section className="section container tariffs-section" id="tariffs">
        <h2>Наши тарифы</h2>
        <div className="tariffs-grid">
          {tariffs.map((tariff, index) => (
            <TariffCard key={tariff.name} tariff={tariff} current={isAuthenticated && index === 0} />
          ))}
        </div>
      </section>
    </main>
  );
};
