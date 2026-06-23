import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { submitFeedback } from '../../lib/db';
import './FeedbackWidget.css';

const TYPES = ['Bug', 'Suggestion', 'Question'];

export default function FeedbackWidget() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('Suggestion');
  const [status, setStatus] = useState('idle'); // idle | sending | done | error

  // Only logged-in users see the widget.
  if (!user) return null;

  function close() {
    setOpen(false);
    // Reset shortly after closing so the modal is fresh next time.
    setTimeout(() => {
      setMessage('');
      setType('Suggestion');
      setStatus('idle');
    }, 200);
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!message.trim() || status === 'sending') return;
    setStatus('sending');
    try {
      await submitFeedback(user.id, message, type);
      setStatus('done');
    } catch (err) {
      console.error('Feedback submit failed:', err);
      setStatus('error');
    }
  }

  return (
    <>
      <button className="fb-fab" onClick={() => setOpen(true)} aria-label="שלח פידבק">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
        <span>Feedback?</span>
      </button>

      {open && (
        <div className="fb-overlay" onClick={close}>
          <div className="fb-modal" role="dialog" aria-label="טופס פידבק" onClick={(e) => e.stopPropagation()}>
            <div className="fb-modal__header">
              <span className="fb-modal__title">שלחו לנו פידבק</span>
              <button className="fb-modal__close" onClick={close} aria-label="סגור">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {status === 'done' ? (
              <div className="fb-thanks">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <p>תודה! קיבלנו את הפידבק שלך.</p>
                <button className="fb-btn fb-btn--primary" onClick={close}>סגור</button>
              </div>
            ) : (
              <form className="fb-form" onSubmit={onSubmit}>
                <label className="fb-label" htmlFor="fb-type">סוג</label>
                <select
                  id="fb-type"
                  className="fb-select"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  {TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>

                <label className="fb-label" htmlFor="fb-message">ההודעה שלך</label>
                <textarea
                  id="fb-message"
                  className="fb-textarea"
                  rows="4"
                  placeholder="ספרו לנו מה עובד, מה לא, או מה הייתם רוצים לראות…"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />

                {status === 'error' && (
                  <p className="fb-error">שליחה נכשלה. נסו שוב בעוד רגע.</p>
                )}

                <div className="fb-actions">
                  <button type="button" className="fb-btn" onClick={close}>ביטול</button>
                  <button
                    type="submit"
                    className="fb-btn fb-btn--primary"
                    disabled={!message.trim() || status === 'sending'}
                  >
                    {status === 'sending' ? 'שולח…' : 'שליחה'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
