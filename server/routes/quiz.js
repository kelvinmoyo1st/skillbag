const express = require('express');
const router = express.Router();
const pool = require('../db');
const OpenAI = require('openai');

// Groq uses the same API shape as OpenAI, just a different base URL and key
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1'
    });

    router.post('/:id/generate', async (req, res, next) => {
      const profileId = req.params.id;

        try {
            const profileResult = await pool.query(
                  'SELECT * FROM skill_profiles WHERE id = $1',
                        [profileId]
                            );
                                if (profileResult.rows.length === 0) {
                                      return res.status(404).json({ error: 'profile not found' });
                                          }
                                              const profile = profileResult.rows[0];

                                                  const logsResult = await pool.query(
                                                        'SELECT note FROM progress_logs WHERE profile_id = $1 ORDER BY created_at DESC LIMIT 5',
                                                              [profileId]
                                                                  );
                                                                      const notes = logsResult.rows.map((r) => r.note).join('; ') || 'no logs yet';

                                                                          const prompt = `Skill: ${profile.name}. Goal: ${profile.goal || 'not specified'}. Recent progress notes: ${notes}.
                                                                          Generate exactly 5 multiple-choice quiz questions to review this person's understanding of the skill above.
                                                                          Respond ONLY with valid JSON, no markdown formatting, no code fences, in this exact shape:
                                                                          {"questions":[{"question":"...","options":["A","B","C","D"],"answer":"A"}]}`;

                                                                              async function askGroq(messages) {
                                                                                    const completion = await client.chat.completions.create({
                                                                                            model: 'llama-3.3-70b-versatile',
                                                                                                    messages,
                                                                                                            temperature: 0.7
                                                                                                                  });
                                                                                                                        let text = completion.choices[0].message.content.trim();
                                                                                                                              text = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '');
                                                                                                                                    return text;
                                                                                                                                        }

                                                                                                                                            let quiz;
                                                                                                                                                const rawText = await askGroq([{ role: 'user', content: prompt }]);
                                                                                                                                                    try {
                                                                                                                                                          quiz = JSON.parse(rawText);
                                                                                                                                                              } catch (parseErr) {
                                                                                                                                                                    const retryText = await askGroq([
                                                                                                                                                                            { role: 'user', content: prompt },
                                                                                                                                                                                    { role: 'assistant', content: rawText },
                                                                                                                                                                                            { role: 'user', content: 'That was not valid JSON. Reply with ONLY the raw JSON object, nothing else, no code fences.' }
                                                                                                                                                                                                  ]);
                                                                                                                                                                                                        try {
                                                                                                                                                                                                                quiz = JSON.parse(retryText);
                                                                                                                                                                                                                      } catch (secondErr) {
                                                                                                                                                                                                                              return res.status(502).json({ error: 'quiz generation failed, please try again' });
                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                            res.json(quiz);
                                                                                                                                                                                                                                              } catch (err) {
                                                                                                                                                                                                                                                  next(err);
                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                    });

// Score submitted answers and store the result
router.post('/:id/submit', async (req, res, next) => {
  const profileId = req.params.id;
    const { answers, questions } = req.body;
      // answers: array of submitted answer letters, e.g. ["A","C","B","D","A"]
        // questions: the original questions array (with correct answers), sent back from the client

          if (!Array.isArray(answers) || !Array.isArray(questions) || answers.length !== questions.length) {
              return res.status(400).json({ error: 'answers and questions must be matching arrays' });
                }

                  try {
                      const profileResult = await pool.query(
                            'SELECT id FROM skill_profiles WHERE id = $1',
                                  [profileId]
                                      );
                                          if (profileResult.rows.length === 0) {
                                                return res.status(404).json({ error: 'profile not found' });
                                                    }

                                                        let score = 0;
                                                            questions.forEach((q, i) => {
                                                                  if (q.answer === answers[i]) score++;
                                                                      });

                                                                          const result = await pool.query(
                                                                                'INSERT INTO quiz_results (profile_id, score, total, answers) VALUES ($1, $2, $3, $4) RETURNING *',
                                                                                      [profileId, score, questions.length, JSON.stringify(answers)]
                                                                                          );

                                                                                              res.status(201).json(result.rows[0]);
                                                                                                } catch (err) {
                                                                                                    next(err);
                                                                                                      }
                                                                                                      });
                                                                                                                                                                                                                                                    module.exports = router;