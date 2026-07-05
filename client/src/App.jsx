import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ProfileDetail from './pages/ProfileDetail';
import Mentors from './pages/Mentors';
import Quiz from './pages/Quiz';

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>Dashboard</Link>
      </nav>
      <div style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profiles/:id" element={<ProfileDetail />} />
          <Route path="/profiles/:id/mentors" element={<Mentors />} />
          <Route path="/profiles/:id/quiz" element={<Quiz />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
