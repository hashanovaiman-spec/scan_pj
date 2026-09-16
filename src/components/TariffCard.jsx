import beginnerIcon from '../assets/tariff-beginner.svg';
import proIcon from '../assets/tariff-pro.svg';
import businessIcon from '../assets/tariff-business.svg';

const icons = {
  Beginner: beginnerIcon,
  Pro: proIcon,
  Business: businessIcon,
};

export const TariffCard = ({ tariff, current }) => (
  <article className={`tariff-card tariff-${tariff.accent} ${current ? 'current-tariff' : ''}`}>
    <div className="tariff-head">
      <div>
        <h3>{tariff.name}</h3>
        <p>{tariff.subtitle}</p>
      </div>
      <img src={icons[tariff.name]} alt="" aria-hidden="true" />
    </div>
    <div className="tariff-body">
      {current && <span className="current-badge">Текущий тариф</span>}
      <div className="price-line">
        <strong>{tariff.price}</strong>
        <del>{tariff.oldPrice}</del>
      </div>
      <p className="installment">{tariff.installment || '\u00a0'}</p>
      <h4>В тариф входит:</h4>
      <ul>
        {tariff.features.map((feature) => <li key={feature}><span>✓</span>{feature}</li>)}
      </ul>
      <button type="button" className={current ? 'secondary-button' : 'primary-button'}>
        {current ? 'Перейти в личный кабинет' : 'Подробнее'}
      </button>
    </div>
  </article>
);
