import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api';

function Mentors() {
  const { id } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadMentors() {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getMentors(id);
        setResults(data.results || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadMentors();
  }, [id]);

  return (
    <div>
      <Link to={`/profiles/${id}`}>&larr; Profile</Link>
      <h1>Mentors & Resources</h1>

      {loading && <p>Searching for mentors and resources...</p>}
      {error && <p style={{ color: 'var(--danger)' }}>Error: {error}</p>}

      {!loading && !error && results.length === 0 && (
        <p className="empty-state">No results found.</p>
      )}

      {!loading && !error && results.length > 0 && (
        <div className="mentor-list">
          {results.map((r, i) => (
            <a href={r.link} target="_blank" rel="noreferrer" key={i} className="mentor-card">
              <span className="mentor-title">{r.title}</span>
              <p className="mentor-snippet">{r.snippet}</p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default Mentors;
