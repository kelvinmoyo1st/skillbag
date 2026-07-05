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
      <Link to={`/profiles/${id}`}>&larr; Back to Profile</Link>
      <h1>Mentors & Resources</h1>

      {loading && <p>Searching for mentors and resources...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {!loading && !error && results.length === 0 && (
        <p>No results found.</p>
      )}

      {!loading && !error && results.length > 0 && (
        <ul>
          {results.map((r, i) => (
            <li key={i} style={{ marginBottom: '1rem' }}>
              <a href={r.link} target="_blank" rel="noreferrer">{r.title}</a>
              <p>{r.snippet}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Mentors;
