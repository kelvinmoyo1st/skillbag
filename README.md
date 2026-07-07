# SkillBag

A personal skill-growth tracker. Log practice sessions, get AI-generated review quizzes based on your own notes, find mentors and learning resources, and set reminders - all in one place.

Built as a 16-day solo project, single-user, no login required.

## What it does

- Skill Profiles - create a profile for anything you're learning (an instrument, a language, a sport), with a name and a goal.
- Progress Log - log practice sessions per skill, timestamped, in a simple running ledger.
- Mentor and Resource Search - pulls real search results (via SerpAPI) matched to your skill and goal, cached per profile so it doesn't re-query every time you open it.
- AI Review Quiz - generates a 5-question multiple-choice quiz based on your skill and recent practice notes (via Groq/Llama), scores your answers, and stores the result.
- Reminders - set a reminder for a skill; a background job checks every minute for anything due and surfaces it on the dashboard.

## Stack

- Frontend: React (Vite), React Router, plain CSS
- Backend: Node.js, Express
- Database: PostgreSQL (hosted on Neon)
- AI: Groq API (Llama 3.3 70B) for quiz generation
- Search: SerpAPI for mentor and resource results
- Scheduling: node-cron for reminder checks

## Running it locally

Backend:
  cd server
  npm install
  (set DATABASE_URL, GROQ_API_KEY, SERPAPI_KEY as env secrets)
  node server.js

Frontend:
  cd client
  npm install
  npm run dev

Update client/src/api.js with your backend's URL if it isn't running on localhost:3000.

## Tests

  cd server
  npm test

## Project structure

server/
  routes/       - Express routes (profiles, mentors, quiz)
  middleware/   - error handling
  tests/        - Jest/Supertest coverage
  cron.js       - reminder polling job
  schema.sql    - database schema

client/
  src/pages/    - Dashboard, ProfileDetail, Mentors, Quiz
  src/api.js    - fetch helper wrapping the backend API
