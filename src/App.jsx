import { useState, useEffect } from 'react'
import FileUpload from './components/FileUpload'
import DocumentList from './components/DocumentList'
import ChatInterface from './components/ChatInterface'
import './App.css'

const API = import.meta.env.VITE_API_URL || 'https://papermind-backend-el4h.onrender.com'

export default function App() {
  const [documents, setDocuments] = useState([])
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: 'Hello! Upload one or more PDF documents on the left, then ask me anything about them.',
    sources: [],
  }])
  const [uploading, setUploading] = useState(false)
  const [querying, setQuerying] = useState(false)

  async function fetchDocs() {
    try {
      const res = await fetch(`${API}/documents`)
      const data = await res.json()
      setDocuments(data.documents || [])
    } catch (_) {}
  }

  useEffect(() => { fetchDocs() }, [])

  async function handleUpload(files) {
    setUploading(true)
    const form = new FormData()
    files.forEach(f => form.append('files', f))
    try {
      const res = await fetch(`${API}/upload`, { method: 'POST', body: form })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Upload failed')
      }
      const data = await res.json()
      await fetchDocs()
      const names = data.uploaded.map(d => d.filename).join(', ')
      addBot(`Uploaded ${data.uploaded.length} file(s): ${names}. Ask me anything!`, [])
    } catch (e) {
      addBot(`Upload error: ${e.message}`, [])
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(docId) {
    await fetch(`${API}/documents/${docId}`, { method: 'DELETE' })
    fetchDocs()
  }

  async function handleQuery(question) {
    setMessages(prev => [...prev, { role: 'user', content: question, sources: [] }])
    setQuerying(true)
    try {
      const res = await fetch(`${API}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail)
      }
      const data = await res.json()
      addBot(data.answer, data.sources || [])
    } catch (e) {
      addBot(`Error: ${e.message}`, [])
    } finally {
      setQuerying(false)
    }
  }

  function addBot(content, sources) {
    setMessages(prev => [...prev, { role: 'assistant', content, sources }])
  }

  return (
    <div className="layout">
      <header className="topbar">
        <div className="brand">
          <span className="brand-icon">📄</span>
          <span className="brand-name">PaperMind</span>
        </div>
        <span className="brand-tag">Multi-document RAG · Powered by Groq</span>
      </header>

      <div className="body">
        <aside className="sidebar">
          <FileUpload onUpload={handleUpload} uploading={uploading} />
          <DocumentList documents={documents} onDelete={handleDelete} />
        </aside>
        <main className="chat-area">
          <ChatInterface
            messages={messages}
            onQuery={handleQuery}
            querying={querying}
            hasDocuments={documents.length > 0}
          />
        </main>
      </div>
    </div>
  )
}
