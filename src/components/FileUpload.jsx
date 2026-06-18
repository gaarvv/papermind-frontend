import { useState, useRef } from 'react'

export default function FileUpload({ onUpload, uploading }) {
  const [dragging, setDragging] = useState(false)
  const [selected, setSelected] = useState([])
  const inputRef = useRef(null)

  function handleFiles(files) {
    const pdfs = Array.from(files).filter(f => f.name.toLowerCase().endsWith('.pdf'))
    setSelected(pdfs)
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  async function handleUpload() {
    if (!selected.length) return
    await onUpload(selected)
    setSelected([])
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="upload-section">
      <h3>Upload Documents</h3>

      <div
        className={`drop-zone ${dragging ? 'drag-over' : ''} ${uploading ? 'uploading' : ''}`}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <span className="drop-icon">📂</span>
        {selected.length > 0
          ? <p className="drop-text">{selected.length} PDF{selected.length > 1 ? 's' : ''} selected</p>
          : <>
              <p className="drop-text">Drop PDFs here</p>
              <p className="drop-hint">or click to browse</p>
            </>
        }
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          multiple
          style={{ display: 'none' }}
          onChange={e => handleFiles(e.target.files)}
        />
      </div>

      {selected.length > 0 && (
        <button
          className="upload-btn"
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading && <span className="upload-spinner" />}
          {uploading ? 'Uploading…' : `Upload ${selected.length} file${selected.length > 1 ? 's' : ''}`}
        </button>
      )}
    </div>
  )
}
