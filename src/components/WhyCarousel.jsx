import { useState } from 'react';
import speedIcon from '../assets/adv-speed.svg';
import searchIcon from '../assets/adv-search.svg';
import securityIcon from '../assets/adv-security.svg';

const cards = [
  { icon: speedIcon, text: 'Высокая и оперативная скорость обработки заявки' },
  { icon: searchIcon, text: 'Огромная комплексная база данных, обеспечивающая объективный ответ на запрос' },
  { icon: securityIcon, text: 'Защита конфиденциальных сведений, не подлежащих разглашению по федеральному законодательству' },
  { icon: speedIcon, text: 'Быстрый доступ к результатам поиска по открытым источникам' },
];

export const WhyCarousel = () => {
  const [start, setStart] = useState(0);
  const move = (step) => setStart((value) => (value + step + cards.length) % cards.length);
  const visible = [0, 1, 2].map((offset) => cards[(start + offset) % cards.length]);

  return (
    <div className="why-carousel">
      <button type="button" className="carousel-arrow" onClick={() => move(-1)} aria-label="Предыдущие преимущества">‹</button>
      <div className="why-grid">
        {visible.map((card, index) => (
          <article className="why-card" key={`${card.text}-${index}`}>
            <img src={card.icon} alt="" aria-hidden="true" />
            <p>{card.text}</p>
          </article>
        ))}
      </div>
      <button type="button" className="carousel-arrow" onClick={() => move(1)} aria-label="Следующие преимущества">›</button>
    </div>
  );
};
