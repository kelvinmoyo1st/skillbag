const express = require('express');
const router = express.Router();
const pool = require('../db');

// Create a profile
router.post('/', async (req, res, next) => {
  const { name, goal } = req.body;
    if (!name || !name.trim()) {
        return res.status(400).json({ error: 'name is required' });
          }
            try {
                const result = await pool.query(
                      'INSERT INTO skill_profiles (name, goal) VALUES ($1, $2) RETURNING *',
                            [name, goal || null]
                                );
                                    res.status(201).json(result.rows[0]);
                                      } catch (err) {
                                          next(err);
                                            }
                                            });

                                            // List all profiles
                                            router.get('/', async (req, res, next) => {
                                              try {
                                                  const result = await pool.query('SELECT * FROM skill_profiles ORDER BY created_at DESC');
                                                      res.json(result.rows);
                                                        } catch (err) {
                                                            next(err);
                                                              }
                                                              });

                                                              // Get one profile
                                                              router.get('/:id', async (req, res, next) => {
                                                                try {
                                                                    const result = await pool.query('SELECT * FROM skill_profiles WHERE id = $1', [req.params.id]);
                                                                        if (result.rows.length === 0) return res.status(404).json({ error: 'not found' });
                                                                            res.json(result.rows[0]);
                                                                              } catch (err) {
                                                                                  next(err);
                                                                                    }
                                                                                    });

                                                                                    // Add a log entry for a profile
                                                                                    router.post('/:id/logs', async (req, res, next) => {
                                                                                      const { note } = req.body;
                                                                                        if (!note || !note.trim()) {
                                                                                            return res.status(400).json({ error: 'note is required' });
                                                                                              }
                                                                                                try {
                                                                                                    // confirm the profile exists first
                                                                                                        const profile = await pool.query('SELECT id FROM skill_profiles WHERE id = $1', [req.params.id]);
                                                                                                            if (profile.rows.length === 0) return res.status(404).json({ error: 'profile not found' });

                                                                                                                const result = await pool.query(
                                                                                                                      'INSERT INTO progress_logs (profile_id, note) VALUES ($1, $2) RETURNING *',
                                                                                                                            [req.params.id, note]
                                                                                                                                );
                                                                                                                                    res.status(201).json(result.rows[0]);
                                                                                                                                      } catch (err) {
                                                                                                                                          next(err);
                                                                                                                                            }
                                                                                                                                            });

                                                                                                                                            // List logs for a profile
                                                                                                                                            router.get('/:id/logs', async (req, res, next) => {
                                                                                                                                              try {
                                                                                                                                                  const result = await pool.query(
                                                                                                                                                        'SELECT * FROM progress_logs WHERE profile_id = $1 ORDER BY created_at DESC',
                                                                                                                                                              [req.params.id]
                                                                                                                                                                  );
                                                                                                                                                                      res.json(result.rows);
                                                                                                                                                                        } catch (err) {
                                                                                                                                                                            next(err);
                                                                                                                                                                              }
                                                                                                                                                                              });

                                                                                                                                                                              module.exports = router;