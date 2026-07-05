const BASE_URL = 'https://animated-space-cod-69pv5rj66pjwcrrgj-3000.app.github.dev/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error((data && data.error) || `Request failed: ${res.status}`);
  }
  return data;
}

export const api = {
  getProfiles: () => request('/profiles'),
  getProfile: (id) => request(`/profiles/${id}`),
  createProfile: (data) => request('/profiles', { method: 'POST', body: JSON.stringify(data) }),

  getLogs: (profileId) => request(`/profiles/${profileId}/logs`),
  addLog: (profileId, note) =>
    request(`/profiles/${profileId}/logs`, { method: 'POST', body: JSON.stringify({ note }) }),

  getDueReminders: (profileId) => request(`/profiles/${profileId}/reminders/due`),
  createReminder: (profileId, data) =>
    request(`/profiles/${profileId}/reminders`, { method: 'POST', body: JSON.stringify(data) }),

  getMentors: (profileId) => request(`/mentors/${profileId}`),

  generateQuiz: (profileId) => request(`/quiz/${profileId}/generate`, { method: 'POST' }),
  submitQuiz: (profileId, payload) =>
    request(`/quiz/${profileId}/submit`, { method: 'POST', body: JSON.stringify(payload) })
};
