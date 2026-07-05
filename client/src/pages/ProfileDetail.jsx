import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api';

function ProfileDetail() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [profileData, logData] = await Promise.all([
        api.getProfile(id),
        api.getLogs(id)
      ]);
      setProfile(profileData);
      setLogs(logData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [id]);

  async function handleAddLog(e) {
    e.preventDefault();
    if (!note.trim()) return;
    setSubmitting(true);
    try {
      await api.addLog(id, note);
      setNote('');
      const updatedLogs = await api.getLogs(id);
      setLogs(updatedLogs);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!profile) return <p>Profile not found.</p>;

  return (
    <div>
      <Link to="/">&larr; Back to Dashboard</Link>
      <h1>{profile.name}</h1>
      <p>Goal: {profile.goal}</p>

      <div style={{ margin: '1rem 0' }}>
        <Link to={`/profiles/${id}/mentors`} style={{ marginRight: '1rem' }}>Find Mentors</Link>
        <Link to={`/profiles/${id}/quiz`}>Take Quiz</Link>
      </div>

      <h2>Progress Log</h2>
      <form onSubmit={handleAddLog}>
        <input
          placeholder="What did you practice today?"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{ width: '60%' }}
        />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : 'Add Entry'}
        </button>
      </form>

      {logs.length === 0 ? (
        <p>No log entries yet.</p>
      ) : (
        <ul>
          {logs.map((log) => (
            <li key={log.id}>
              {new Date(log.created_at).toLocaleString()} — {log.note}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProfileDetail;
