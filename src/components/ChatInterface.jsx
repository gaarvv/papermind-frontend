import { useState, useRef, useEffect } from 'react'

function CitationBadge({ source }) {
  const name = source.filename.length > 20
    ? source.filename.slice(0, 17) + '…'
    : source.filename
  return (
    <span className="citation">
      📎 {name}, p.{source.page}
    </span>
  )
}

function Message({ msg }) {
  return (
    <div className={`message ${msg.role}`}>
      <div className={`avatar ${msg.role === 'assistant' ? 'bot' : 'user-av'}`}>
        {msg.role === 'assistant' ? '📄' : '👤'}
      </div>
      <div>
        <div className="bubble">{msg.content}</div>
        {msg.sources?.length > 0 && (
          <div className="sources">
            {msg.sources.map((s, i) => <CitationBadge key={i} source={s} />)}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ChatInterface({ messages, onQuery, querying, hasDocuments }) {
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, querying])

  function handleSend() {
    const q = input.trim()
    if (!q || querying || !hasDocuments) return
    setInput('')
    onQuery(q)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      <div className="chat-messages">
        {!hasDocuments && (
          <div className="chat-hint">
            ← Upload a PDF to get started
          </div>
        )}
        {messages.map((msg, i) => <Message key={i} msg={msg} />)}
        {querying && (
          <div className="message assistant">
            <div className="avatar bot">📄</div>
            <div className="bubble">
              <div className="chat-typing">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input-bar">
        <textarea
          className="chat-input"
          rows={1}
          placeholder={hasDocuments ? 'Ask anything about your documents…' : 'Upload a PDF first'}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!hasDocuments || querying}
        />
        <button
          className="send-btn"
          onClick={handleSend}
          disabled={!hasDocuments || querying || !input.trim()}
        >
          {querying ? '…' : 'Send →'}
        </button>
      </div>
    </>
  )
}
