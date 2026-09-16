import { useEffect, useMemo, useState } from 'react';
import { formatDate } from '../utils/text';

const getPageSize = () => {
  if (window.innerWidth <= 600) return 1;
  if (window.innerWidth <= 1000) return 4;
  return 8;
};

export const HistogramCarousel = ({ histograms }) => {
  const [offset, setOffset] = useState(0);
  const [pageSize, setPageSize] = useState(getPageSize);

  useEffect(() => {
    const handleResize = () => setPageSize(getPageSize());

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const rows = useMemo(() => {
    const total =
      histograms.find(
        (item) => item.histogramType === 'totalDocuments'
      )?.data || [];

    const risk =
      histograms.find(
        (item) => item.histogramType === 'riskFactors'
      )?.data || [];

    const risks = new Map(
      risk.map((item) => [item.date, item.value])
    );

    return total
      .map((item) => ({
        date: item.date,
        total: item.value,
        risk: risks.get(item.date) ?? 0,
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [histograms]);

  useEffect(() => {
    const maxOffset = Math.max(0, rows.length - pageSize);

    if (offset > maxOffset) {
      setOffset(maxOffset);
    }
  }, [offset, pageSize, rows.length]);

  const visible = rows.slice(offset, offset + pageSize);
  const maxOffset = Math.max(0, rows.length - pageSize);
  const totalDocuments = rows.reduce(
    (sum, row) => sum + row.total,
    0
  );

  return (
    <section className="summary-section">
      <h2>Общая сводка</h2>

      <p className="muted">
        Найдено {totalDocuments.toLocaleString('ru-RU')} вариантов
      </p>

      <div className="summary-carousel">
        <button
          type="button"
          className="carousel-arrow"
          onClick={() => setOffset(Math.max(0, offset - 1))}
          disabled={offset === 0}
          aria-label="Предыдущий период"
        >
          ‹
        </button>

        <div className="summary-table">
          <div className="summary-labels">
            <span>Период</span>
            <span>Всего</span>
            <span>Риски</span>
          </div>

          <div
            className="summary-columns"
            style={{ '--summary-page-size': pageSize }}
          >
            {visible.map((row) => (
              <div className="summary-column" key={row.date}>
                <span>{formatDate(row.date)}</span>
                <span>{row.total}</span>
                <span>{row.risk}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="carousel-arrow"
          onClick={() =>
            setOffset(Math.min(maxOffset, offset + 1))
          }
          disabled={offset >= maxOffset}
          aria-label="Следующий период"
        >
          ›
        </button>
      </div>
    </section>
  );
};
