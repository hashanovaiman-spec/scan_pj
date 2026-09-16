import { extractImageUrl, formatDate, stripMarkup } from '../utils/text';

const getTags = (attributes = {}) => {
  const tags = [];
  if (attributes.isTechNews) tags.push('Технические новости');
  if (attributes.isAnnouncement) tags.push('Анонсы и события');
  if (attributes.isDigest) tags.push('Сводки новостей');
  return tags;
};

export const DocumentCard = ({ item }) => {
  if (!item?.ok) return null;

  const doc = item.ok;
  const tags = getTags(doc.attributes);
  const markup = doc.content?.markup || '';
  const text = stripMarkup(markup);
  const imageUrl = extractImageUrl(markup);
  const sourceUrl = doc.url || '#';

  return (
    <article className="document-card">
      <div className="document-meta">
        <time dateTime={doc.issueDate}>{formatDate(doc.issueDate)}</time>
        <a href={sourceUrl} target="_blank" rel="noreferrer">{doc.source?.name || 'Источник'}</a>
      </div>
      <h3>{doc.title?.text || 'Без заголовка'}</h3>
      <div className="tag-row">
        {tags.map((tag) => <span className="doc-tag" key={tag}>{tag}</span>)}
      </div>
      {imageUrl && <img className="document-image" src={imageUrl} alt="" loading="lazy" />}
      <p className="document-text">{text.slice(0, 900)}{text.length > 900 ? '…' : ''}</p>
      <div className="document-footer">
        <a className="source-button" href={sourceUrl} target="_blank" rel="noreferrer">Читать в источнике</a>
        <span>{(doc.attributes?.wordCount ?? 0).toLocaleString('ru-RU')} слов</span>
      </div>
    </article>
  );
};
