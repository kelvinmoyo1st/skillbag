import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api';

const LETTERS = ['A', 'B', 'C', 'D'];

function Quiz() {
  const { id } = useParams();
  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await api.generateQuiz(id);
      setQuestions(data.questions);
      setAnswers(new Array(data.questions.length).fill(''));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSelect(qIndex, letter) {
    const updated = [...answers];
    updated[qIndex] = letter;
    setAnswers(updated);
  }

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.submitQuiz(id, { answers, questions });
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const allAnswered = questions && answers.every((a) => a !== '');

  return (
    <div>
      <Link to={`/profiles/${id}`}>&larr; Back to Profile</Link>
      <h1>Review Quiz</h1>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {!questions && !result && (
        <button onClick={handleGenerate} disabled={loading}>
          {loading ? 'Generating quiz...' : 'Generate Quiz'}
        </button>
      )}

      {questions && !result && (
        <div>
          {questions.map((q, i) => (
            <div key={i} style={{ marginBottom: '1.5rem' }}>
              <p><strong>{i + 1}. {q.question}</strong></p>
              {q.options.map((opt, oi) => (
                <label key={oi} style={{ display: 'block' }}>
                  <input
                    type="radio"
                    name={`q-${i}`}
                    checked={answers[i] === LETTERS[oi]}
                    onChange={() => handleSelect(i, LETTERS[oi])}
                  />
                  {' '}{LETTERS[oi]}. {opt}
                </label>
              ))}
            </div>
          ))}
          <button onClick={handleSubmit} disabled={!allAnswered || loading}>
            {loading ? 'Scoring...' : 'Submit Quiz'}
          </button>
        </div>
      )}

      {result && (
        <div>
          <h2>Score: {result.score} / {result.total}</h2>
          <button onClick={() => { setQuestions(null); setResult(null); }}>
            Take Another Quiz
          </button>
        </div>
      )}
    </div>
  );
}

export default Quiz;
