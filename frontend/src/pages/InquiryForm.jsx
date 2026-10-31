import { useState } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const USER_TYPES = ['Student', 'Parent', 'School'];

const CATEGORIES = [
  { value: 'Admission', hint: 'Applying or enrolling' },
  { value: 'Scholarship', hint: 'Funding and eligibility' },
  { value: 'Concert', hint: 'Dates, tickets, performing' },
  { value: 'General Query', hint: 'Anything else' },
];

const EMPTY = {
  name: '',
  email: '',
  phone: '',
  user_type: 'Student',
  category: 'General Query',
  message: '',
};

export default function InquiryForm() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState('idle'); // idle | sending | sent
  const [error, setError] = useState('');

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatus('sending');
    try {
      const res = await fetch(`${API_URL}/api/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setForm(EMPTY);
      setStatus('sent');
    } catch {
      setError('We couldn’t send your inquiry. Check your connection and try again.');
      setStatus('idle');
    }
  };

  return (
    <div className="split">
      <aside className="intro">
        <div>
          <h1>Ask us anything.</h1>
          <p>
            Admissions, scholarships, concerts — tell us who you are and what
            you need, and we’ll get back to you.
          </p>
        </div>
        <Link to="/admin/login">Admin login</Link>
      </aside>

      <main className="form-col">
        {status === 'sent' ? (
          <div className="form-card success" role="status">
            <div className="tick" aria-hidden="true">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            </div>
            <h2>Inquiry sent</h2>
            <p className="muted">
              Thanks — we’ve received your message and will contact you by email or phone.
            </p>
            <button className="btn btn-ghost" onClick={() => setStatus('idle')}>
              Send another inquiry
            </button>
          </div>
        ) : (
          <form className="form-card" onSubmit={handleSubmit}>
            <h2>Send an inquiry</h2>

            <fieldset>
              <legend className="legend">I am a</legend>
              <div className="segmented">
                {USER_TYPES.map((t) => (
                  <label key={t} className="choice">
                    <input
                      type="radio"
                      name="user_type"
                      value={t}
                      checked={form.user_type === t}
                      onChange={set('user_type')}
                    />
                    <span>{t}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="legend">Topic</legend>
              <div className="tiles">
                {CATEGORIES.map((c) => (
                  <label key={c.value} className="choice">
                    <input
                      type="radio"
                      name="category"
                      value={c.value}
                      checked={form.category === c.value}
                      onChange={set('category')}
                    />
                    <span>
                      <strong>{c.value}</strong>
                      <small>{c.hint}</small>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="field">
              <span>Full name</span>
              <input className="input" type="text" autoComplete="name" value={form.name} onChange={set('name')} required />
            </label>

            <div className="row-2">
              <label className="field">
                <span>Email</span>
                <input className="input" type="email" autoComplete="email" value={form.email} onChange={set('email')} required />
              </label>
              <label className="field">
                <span>Phone</span>
                <input className="input" type="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} required />
              </label>
            </div>

            <label className="field">
              <span>Message</span>
              <textarea
                className="textarea"
                placeholder="What would you like to know?"
                value={form.message}
                onChange={set('message')}
                required
              />
            </label>

            {error && <p className="alert" role="alert">{error}</p>}

            <button className="btn btn-primary" type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Send inquiry'}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
