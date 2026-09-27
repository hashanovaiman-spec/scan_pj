import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { HistogramCarousel } from '../components/HistogramCarousel';
import { DocumentCard } from '../components/DocumentCard';
import {
  loadMoreDocuments,
  runSearch,
} from '../store/searchSlice';

import resultsImage from '../assets/results.svg';

export const ResultsPage = () => {
  const dispatch = useDispatch();
  const restoreStarted = useRef(false);

  const {
    histograms,
    ids,
    documents,
    status,
    histogramStatus,
    docsStatus,
    error,
    histogramError,
    lastPayload,
  } = useSelector((state) => state.search);

  useEffect(() => {
    if (
      status === 'idle' &&
      lastPayload &&
      !restoreStarted.current
    ) {
      restoreStarted.current = true;
      dispatch(runSearch(lastPayload));
    }
  }, [dispatch, lastPayload, status]);

  if (status === 'idle' && !lastPayload) {
    return <Navigate to="/search" replace />;
  }

  const restoring = status === 'idle' && Boolean(lastPayload);
  const hasMore = documents.length < ids.length;

  return (
    <main className="results-page container">
      <section className="results-heading">
        <div>
          <h1>
            Ищем. Скоро
            <br />
            будут результаты
          </h1>

          <p>
            Поиск может занять некоторое время,
            <br />
            просим сохранять терпение.
          </p>
        </div>

        <img
          className="results-illustration"
          src={resultsImage}
          alt=""
          aria-hidden="true"
        />
      </section>

      {(histogramStatus === 'loading' || restoring) && (
        <section className="summary-section">
          <h2>Общая сводка</h2>
          <p className="muted">Загружаем данные</p>

          <div className="summary-loading">
            <div className="summary-loading-labels">
              <span>Период</span>
              <span>Всего</span>
              <span>Риски</span>
            </div>

            <div>
              <span className="spinner" />
              <span>Загружаем данные</span>
            </div>
          </div>
        </section>
      )}

      {histogramStatus === 'failed' && !restoring && (
        <section className="summary-section">
          <h2>Общая сводка</h2>
          <p className="form-error results-error">
            {histogramError || 'Не удалось получить сводку'}
          </p>
        </section>
      )}

      {histogramStatus === 'succeeded' && !restoring && (
        <HistogramCarousel histograms={histograms} />
      )}

      <section className="documents-section">
        <h2>Список документов</h2>

        {status === 'failed' && (
          <p className="form-error results-error">
            {error || 'Не удалось получить результаты поиска'}
          </p>
        )}

        {status !== 'failed' && (
          <>
            <div className="documents-grid">
              {documents.map((item, index) => (
                <DocumentCard
                  item={item}
                  key={item.ok?.id || index}
                />
              ))}
            </div>

            {(docsStatus === 'loading' || restoring) && (
              <div className="large-loader">
                <span className="spinner" />
                <span>Загружаем документы…</span>
              </div>
            )}

            {status === 'succeeded' &&
              docsStatus !== 'loading' &&
              documents.length === 0 && (
                <p className="muted">
                  По заданным параметрам публикации не найдены.
                </p>
              )}

            {hasMore && docsStatus !== 'loading' && (
              <button
                className="primary-button more-button"
                type="button"
                onClick={() => dispatch(loadMoreDocuments())}
              >
                Показать больше
              </button>
            )}

            {docsStatus === 'failed' && error && (
              <p className="form-error results-error">
                {error}
              </p>
            )}
          </>
        )}
      </section>
    </main>
  );
};
