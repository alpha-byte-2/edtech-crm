import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const STATUSES = ['Pending', 'Contacted', 'Resolved'];

export default function AdminDashboard() {
  const [inquiries, setInquiries] = useState([]);
  const [category, setCategory] = useState('');
  const [userType, setUserType] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  // wait for the person to stop typing before searching
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }

    const controller = new AbortController();
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (userType) params.append('user_type', userType);
    if (debouncedSearch) params.append('search', debouncedSearch);

    setLoading(true);
    setError('');

    fetch(`${API_URL}/api/admin/inquiries?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    })
      .then(async (res) => {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('token');
          navigate('/admin/login');
          return;
        }
        if (!res.ok) throw new Error();
        setInquiries(await res.json());
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setError('Couldn’t load inquiries. Check your connection and try again.');
        setLoading(false);
      });

    return () => controller.abort();
  }, [category, userType, debouncedSearch, reload, token, navigate]);

  const updateStatus = async (id, status) => {
    // update the row right away, then confirm with the server
    setInquiries((rows) => rows.map((r) => (r.id === id ? { ...r, status } : r)));
    try {
      const res = await fetch(`${API_URL}/api/admin/inquiries/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setError('Couldn’t save the status change. Showing the saved data again.');
      setReload((n) => n + 1);
    }
  };

  const count = (s) => inquiries.filter((i) => i.status === s).length;
  const hasFilters = category || userType || search;

  return (
    <div className="dash">
      <header className="dash-head">
        <h1>Inquiries</h1>
        <button className="btn btn-ghost" onClick={logout}>Log out</button>
      </header>

      <section className="stats" aria-label="Summary of the current view">
        <div className="stat"><b>{inquiries.length}</b><span>Shown</span></div>
        {STATUSES.map((s) => (
          <div className="stat" key={s}><b>{count(s)}</b><span>{s}</span></div>
        ))}
      </section>

      <section className="toolbar" aria-label="Filters">
        <input
          className="input"
          type="search"
          placeholder="Search by name or phone"
          aria-label="Search by name or phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="select" aria-label="Filter by category" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          <option value="Scholarship">Scholarship</option>
          <option value="Concert">Concert</option>
          <option value="Admission">Admission</option>
          <option value="General Query">General Query</option>
        </select>
        <select className="select" aria-label="Filter by user type" value={userType} onChange={(e) => setUserType(e.target.value)}>
          <option value="">All user types</option>
          <option value="Parent">Parent</option>
          <option value="Student">Student</option>
          <option value="School">School</option>
        </select>
      </section>

      {error && <p className="alert" role="alert">{error}</p>}

      <div className="panel table-wrap">
        {loading ? (
          <div className="empty">Loading inquiries…</div>
        ) : inquiries.length === 0 ? (
          <div className="empty">
            <h3>{hasFilters ? 'No inquiries match these filters' : 'No inquiries yet'}</h3>
            <p>
              {hasFilters
                ? 'Clear the search or choose different filters.'
                : 'New inquiries from the form will appear here.'}
            </p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Contact</th>
                <th>Type</th>
                <th>Category</th>
                <th>Message</th>
                <th>Received</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inq) => (
                <tr key={inq.id}>
                  <td className="who">
                    <strong>{inq.name}</strong>
                    <small>{inq.phone}</small>
                    <br />
                    <small>{inq.email}</small>
                  </td>
                  <td data-label="Type">{inq.user_type}</td>
                  <td data-label="Category"><span className="tag">{inq.category}</span></td>
                  <td data-label="Message"><p className="msg" title={inq.message}>{inq.message}</p></td>
                  <td data-label="Received">
                    {new Date(inq.created_at).toLocaleDateString(undefined, {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td data-label="Status">
                    <select
                      className="status"
                      data-s={inq.status}
                      aria-label={`Status for ${inq.name}`}
                      value={inq.status}
                      onChange={(e) => updateStatus(inq.id, e.target.value)}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}