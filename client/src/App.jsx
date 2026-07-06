import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ProfileDetail from './pages/ProfileDetail';
import Mentors from './pages/Mentors';
import Quiz from './pages/Quiz';

function App() {
  return (
    <BrowserRouter>
      <div className="nav">
        <Link to="/" className="nav-brand">SkillBag</Link>
      </div>
      <div className="app-shell">
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
