const request = require('supertest');
const app = require('../server');
const pool = require('../db');

let createdProfileId;

afterAll(async () => {
  await pool.end();
  });

  describe('Skill Profiles', () => {
    test('POST /api/profiles - creates a profile', async () => {
        const res = await request(app)
              .post('/api/profiles')
                    .send({ name: 'Piano', goal: 'Learn scales' });

                        expect(res.statusCode).toBe(201);
                            expect(res.body).toHaveProperty('id');
                                expect(res.body.name).toBe('Piano');

                                    createdProfileId = res.body.id;
                                      });

                                        test('POST /api/profiles - fails with no name', async () => {
                                            const res = await request(app)
                                                  .post('/api/profiles')
                                                        .send({ goal: 'no name here' });

                                                            expect(res.statusCode).toBe(400);
                                                                expect(res.body).toHaveProperty('error');
                                                                  });

                                                                    test('GET /api/profiles - returns a list', async () => {
                                                                        const res = await request(app).get('/api/profiles');

                                                                            expect(res.statusCode).toBe(200);
                                                                                expect(Array.isArray(res.body)).toBe(true);
                                                                                  });

                                                                                    test('POST /api/profiles/:id/logs - creates a log entry', async () => {
                                                                                        const res = await request(app)
                                                                                              .post(`/api/profiles/${createdProfileId}/logs`)
                                                                                                    .send({ note: 'Practiced scales for 15 minutes' });

                                                                                                        expect(res.statusCode).toBe(201);
                                                                                                            expect(res.body.note).toBe('Practiced scales for 15 minutes');
                                                                                                              });

                                                                                                                test('POST /api/profiles/:id/logs - fails with no note', async () => {
                                                                                                                    const res = await request(app)
                                                                                                                          .post(`/api/profiles/${createdProfileId}/logs`)
                                                                                                                                .send({});

                                                                                                                                    expect(res.statusCode).toBe(400);
                                                                                                                                        expect(res.body).toHaveProperty('error');
                                                                                                                                          });
                                                                                                                                          });