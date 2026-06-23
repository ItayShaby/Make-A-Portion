import { useState, useRef, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import './AiAssistant.css';

const WELCOME = {
  role: 'assistant',
  content: 'היי! אני השף של Make A Portion 👨‍🍳 שאלו אותי כל דבר על בישול, החלפת מרכיבים, או בקשו רעיון למתכון.',
};

const SUGGESTIONS = [
  'מה אפשר להכין מ-3 ביצים ובצל?',
  'תציע לי קינוח שוקולד מהיר',
  'איך מחליפים חמאה בעוגה?',
];

export default function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, loading, open]);

  async function send(text) {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const next = [...messages, { role: 'user', content }];
    setMessages(next);
    setInput('');
    setError('');
    setLoading(true);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('ai-assistant', {
        body: { messages: next.filter((m) => m !== WELCOME) },
      });
      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);
      setMessages((m) => [...m, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      console.error('AI assistant failed:', err);
      setError('משהו השתבש. נסו שוב בעוד רגע.');
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e) {
    e.preventDefault();
    send();
  }

  return (
    <>
      {!open && (
        <button
          className="ai-fab"
          onClick={() => setOpen(true)}
          aria-label="פתח עוזר בישול"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span>שף AI</span>
        </button>
      )}

      {open && (
        <div className="ai-panel" role="dialog" aria-label="עוזר בישול AI">
          <div className="ai-panel__header">
            <span className="ai-panel__title">👨‍🍳 השף של Make A Portion</span>
            <button className="ai-panel__close" onClick={() => setOpen(false)} aria-label="סגור">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="ai-panel__body" ref={bodyRef}>
            {messages.map((m, i) => (
              <div key={i} className={`ai-msg ai-msg--${m.role}`}>
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="ai-msg ai-msg--assistant ai-msg--typing">
                <span></span><span></span><span></span>
              </div>
            )}
            {error && <div className="ai-panel__error">{error}</div>}

            {messages.length === 1 && !loading && (
              <div className="ai-suggestions">
                {SUGGESTIONS.map((s) => (
                  <button key={s} className="ai-suggestion" onClick={() => send(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form className="ai-panel__input" onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="כתבו שאלה…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()} aria-label="שלח">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
