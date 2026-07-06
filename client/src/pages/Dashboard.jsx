import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

function Dashboard() {
  const [profiles, setProfiles] = useState([]);
  const [logCounts, setLogCounts] = useState({});
  const [dueReminders, setDueReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [creating, setCreating] = useState(false);

  async function loadDashboard() {
    setLoading(true);
    setError(null);
    try {
      const profileList = await api.getProfiles();
      setProfiles(profileList);

      const allDue = [];
      const counts = {};
      for (const profile of profileList) {
        const [due, logs] = await Promise.all([
          api.getDueReminders(profile.id),
          api.getLogs(profile.id)
        ]);
        due.forEach((r) => allDue.push({ ...r, profileName: profile.name }));
        counts[profile.id] = logs.length;
      }
      setDueReminders(allDue);
      setLogCounts(counts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    try {
      await api.createProfile({ name, goal });
      setName('');
      setGoal('');
      loadDashboard();
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  }

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p style={{ color: 'var(--danger)' }}>Error: {error}</p>;

  return (
    <div>
      <h1>Dashboard</h1>

      {dueReminders.length > 0 && (
        <div className="reminder-banner">
          <strong>Due reminders</strong>
          <ul>
            {dueReminders.map((r) => (
              <li key={r.id}>{r.profileName}: {r.message}</li>
            ))}
          </ul>
        </div>
      )}

      <h2>Skill Profiles</h2>
      <div className="profile-list">
        {profiles.map((p) => (
          <Link to={`/profiles/${p.id}`} key={p.id} className="profile-card">
            <div>
              <span className="profile-name">{p.name}</span>
              <span className="profile-goal">{p.goal}</span>
            </div>
            <span className="badge">{logCounts[p.id] ?? 0} entries</span>
          </Link>
        ))}
      </div>

      <h2>Add a New Skill</h2>
      <form onSubmit={handleCreate} className="inline-form">
        <input
          placeholder="Skill name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />
        <button type="submit" disabled={creating}>
          {creating ? 'Creating...' : 'Create'}
        </button>
      </form>
    </div>
  );
}

export default Dashboard;
