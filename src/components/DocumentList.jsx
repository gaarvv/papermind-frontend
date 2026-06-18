export default function DocumentList({ documents, onDelete }) {
  return (
    <div className="doc-section">
      <h3>Uploaded Docs ({documents.length})</h3>
      {documents.length === 0
        ? <p className="doc-empty">No documents yet</p>
        : documents.map(doc => (
            <div key={doc.doc_id} className="doc-item">
              <span className="doc-icon">📄</span>
              <span className="doc-name" title={doc.filename}>{doc.filename}</span>
              <button
                className="doc-delete"
                onClick={() => onDelete(doc.doc_id)}
                title="Remove document"
              >✕</button>
            </div>
          ))
      }
    </div>
  )
}
