import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { runSearch } from '../store/searchSlice';
import { validateInn } from '../utils/inn';
import { buildSearchPayload } from '../utils/searchPayload';

import searchImage from '../assets/search-illustration.svg';
import folderImage from '../assets/folder.svg';
import documentImage from '../assets/document.svg';

const initialForm = {
  inn: '',
  tonality: 'any',
  limit: '',
  startDate: '',
  endDate: '',
  maxFullness: true,
  businessContext: true,
  onlyMainRole: true,
  onlyWithRiskFactors: false,
  includeTechNews: false,
  includeAnnouncements: true,
  includeDigests: false,
};

export const SearchPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [touched, setTouched] = useState({});

  const errors = useMemo(() => {
    const result = {};

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const start = form.startDate
      ? new Date(`${form.startDate}T00:00:00`)
      : null;

    const end = form.endDate
      ? new Date(`${form.endDate}T00:00:00`)
      : null;

    if (form.inn && !validateInn(form.inn)) {
      result.inn = 'Введите корректные данные';
    }

    const limit = Number(form.limit);

    if (
      form.limit &&
      (!Number.isInteger(limit) || limit < 1 || limit > 1000)
    ) {
      result.limit = 'Введите корректные данные';
    }

    if (start && start > today) {
      result.dates = 'Введите корректные данные';
    }

    if (end && end > today) {
      result.dates = 'Введите корректные данные';
    }

    if (start && end && start > end) {
      result.dates = 'Введите корректные данные';
    }

    return result;
  }, [form]);

  const requiredFilled = Boolean(
    form.inn &&
      form.limit &&
      form.startDate &&
      form.endDate &&
      form.tonality
  );

  const canSubmit =
    requiredFilled && Object.keys(errors).length === 0;

  const update = (name, value) => {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const markTouched = (name) => {
    setTouched((current) => ({
      ...current,
      [name]: true,
    }));
  };

  const submit = (event) => {
    event.preventDefault();

    if (!canSubmit) return;

    const payload = buildSearchPayload(form);

    dispatch(runSearch(payload));
    navigate('/results');
  };

  const checks = [
    ['maxFullness', 'Признак максимальной полноты'],
    ['businessContext', 'Упоминания в бизнес-контексте'],
    ['onlyMainRole', 'Главная роль в публикации'],
    ['onlyWithRiskFactors', 'Публикации только с риск-факторами'],
    ['includeTechNews', 'Включать технические новости рынков'],
    ['includeAnnouncements', 'Включать анонсы и календари'],
    ['includeDigests', 'Включать сводки новостей'],
  ];

  return (
    <main className="search-page container">
      <section className="search-intro">
        <div>
          <h1>
            Найдите необходимые
            <br />
            данные в пару кликов.
          </h1>

          <p>
            Задайте параметры поиска.
            <br />
            Чем больше заполните, тем точнее поиск.
          </p>
        </div>

        <div
          className="search-top-icons"
          aria-hidden="true"
        >
          <img src={documentImage} alt="" />
          <img src={folderImage} alt="" />
        </div>
      </section>

      <section className="search-content">
        <form
          className="search-form"
          onSubmit={submit}
          noValidate
        >
          <div className="search-main-fields">
            <label>
              <span className="field-label">
                ИНН компании
                <span className="required-mark">*</span>
              </span>

              <input
                inputMode="numeric"
                placeholder="10 цифр"
                value={form.inn}
                onBlur={() => markTouched('inn')}
                onChange={(event) =>
                  update(
                    'inn',
                    event.target.value
                      .replace(/\D/g, '')
                      .slice(0, 12)
                  )
                }
                className={
                  touched.inn && errors.inn
                    ? 'input-error'
                    : ''
                }
              />

              {touched.inn && errors.inn && (
                <span className="field-error">
                  {errors.inn}
                </span>
              )}
            </label>

            <label>
              <span className="field-label">
                Тональность
                <span className="required-mark">*</span>
              </span>

              <select
                value={form.tonality}
                onChange={(event) =>
                  update(
                    'tonality',
                    event.target.value
                  )
                }
              >
                <option value="any">Любая</option>
                <option value="positive">
                  Позитивная
                </option>
                <option value="negative">
                  Негативная
                </option>
              </select>
            </label>

            <label>
              <span className="field-label">
                Количество документов в выдаче
                <span className="required-mark">*</span>
              </span>

              <input
                type="number"
                min="1"
                max="1000"
                placeholder="От 1 до 1000"
                value={form.limit}
                onBlur={() => markTouched('limit')}
                onChange={(event) =>
                  update(
                    'limit',
                    event.target.value
                  )
                }
                className={
                  touched.limit && errors.limit
                    ? 'input-error'
                    : ''
                }
              />

              {touched.limit && errors.limit && (
                <span className="field-error">
                  {errors.limit}
                </span>
              )}
            </label>

            <fieldset className="date-fieldset">
              <legend>
                <span className="field-label">
                  Диапазон поиска
                  <span className="required-mark">*</span>
                </span>
              </legend>

              <div className="date-row">
                <input
                  type="date"
                  value={form.startDate}
                  onBlur={() =>
                    markTouched('dates')
                  }
                  onChange={(event) =>
                    update(
                      'startDate',
                      event.target.value
                    )
                  }
                  className={
                    touched.dates && errors.dates
                      ? 'input-error'
                      : ''
                  }
                  aria-label="Дата начала поиска"
                />

                <input
                  type="date"
                  value={form.endDate}
                  onBlur={() =>
                    markTouched('dates')
                  }
                  onChange={(event) =>
                    update(
                      'endDate',
                      event.target.value
                    )
                  }
                  className={
                    touched.dates && errors.dates
                      ? 'input-error'
                      : ''
                  }
                  aria-label="Дата окончания поиска"
                />
              </div>

              {touched.dates && errors.dates && (
                <span className="field-error">
                  {errors.dates}
                </span>
              )}
            </fieldset>
          </div>

          <div className="search-options">
            <div className="checkbox-list">
              {checks.map(([name, label]) => (
                <label
                  className="check-row"
                  key={name}
                >
                  <input
                    type="checkbox"
                    checked={form[name]}
                    onChange={(event) =>
                      update(
                        name,
                        event.target.checked
                      )
                    }
                  />

                  <span>{label}</span>
                </label>
              ))}
            </div>

            <div className="search-submit-area">
              <button
                className="primary-button"
                type="submit"
                disabled={!canSubmit}
              >
                Поиск
              </button>

              <small>
                * Обязательные к заполнению поля
              </small>
            </div>
          </div>
        </form>

        <img
          className="search-illustration"
          src={searchImage}
          alt=""
          aria-hidden="true"
        />
      </section>
    </main>
  );
};