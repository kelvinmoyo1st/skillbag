import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

function Dashboard() {
  const [profiles, setProfiles] = useState([]);
  const [dueReminders, setDueReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');

  async function loadDashboard() {
    setLoading(true);
    setError(null);
    try {
      const profileList = await api.getProfiles();
      setProfiles(profileList);

      // gather due reminders across all profiles
      const allDue = [];
      for (const profile of profileList) {
        const due = await api.getDueReminders(profile.id);
        due.forEach((r) => allDue.push({ ...r, profileName: profile.name }));
      }
      setDueReminders(allDue);
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
    try {
      await api.createProfile({ name, goal });
      setName('');
      setGoal('');
      loadDashboard();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <h1>SkillBag Dashboard</h1>

      {dueReminders.length > 0 && (
        <div style={{ background: '#fff3cd', padding: '1rem', marginBottom: '1rem', borderRadius: '4px' }}>
          <strong>Due Reminders</strong>
          <ul>
            {dueReminders.map((r) => (
              <li key={r.id}>{r.profileName}: {r.message}</li>
            ))}
          </ul>
        </div>
      )}

      <h2>Skill Profiles</h2>
      <ul>
        {profiles.map((p) => (
          <li key={p.id}>
            <Link to={`/profiles/${p.id}`}>{p.name}</Link> — {p.goal}
          </li>
        ))}
      </ul>

      <h3>Add a New Skill</h3>
      <form onSubmit={handleCreate}>
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
        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default Dashboard;
