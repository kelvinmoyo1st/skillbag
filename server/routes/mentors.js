const express = require('express');
const router = express.Router();
const pool = require('../db');
const { getJson } = require('serpapi');

// simple in-memory cache: { profileId: { results, cachedAt } }
const searchCache = {};

router.get('/:id', async (req, res, next) => {
  const profileId = req.params.id;

    try {
        // return cached result if we have one
            if (searchCache[profileId]) {
                  return res.json({ cached: true, results: searchCache[profileId].results });
                      }

                          // look up the profile
                              const profileResult = await pool.query(
                                    'SELECT * FROM skill_profiles WHERE id = $1',
                                          [profileId]
                                              );
                                                  if (profileResult.rows.length === 0) {
                                                        return res.status(404).json({ error: 'profile not found' });
                                                            }
                                                                const profile = profileResult.rows[0];

                                                                    const query = `${profile.name} mentor OR course OR community for ${profile.goal || 'beginners'}`;

                                                                        getJson(
                                                                              {
                                                                                      engine: 'google',
                                                                                              q: query,
                                                                                                      api_key: process.env.SERPAPI_KEY,
                                                                                                              num: 5
                                                                                                                    },
                                                                                                                          (json) => {
                                                                                                                                  const results = (json.organic_results || [])
                                                                                                                                            .slice(0, 5)
                                                                                                                                                      .map((r) => ({
                                                                                                                                                                  title: r.title,
                                                                                                                                                                              link: r.link,
                                                                                                                                                                                          snippet: r.snippet
                                                                                                                                                                                                    }));

                                                                                                                                                                                                            searchCache[profileId] = { results, cachedAt: Date.now() };
                                                                                                                                                                                                                    res.json({ cached: false, results });
                                                                                                                                                                                                                          }
                                                                                                                                                                                                                              );
                                                                                                                                                                                                                                } catch (err) {
                                                                                                                                                                                                                                    next(err);
                                                                                                                                                                                                                                      }
                                                                                                                                                                                                                                      });

                                                                                                                                                                                                                                      module.exports = router;