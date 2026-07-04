const cron = require('node-cron');
const pool = require('./db');

function startReminderCron() {
  // runs every minute
    cron.schedule('* * * * *', async () => {
        try {
              const result = await pool.query(
                      'SELECT * FROM reminders WHERE remind_at <= NOW() AND sent = FALSE'
                            );

                                  if (result.rows.length > 0) {
                                          console.log(`[cron] ${result.rows.length} reminder(s) due:`);
                                                  result.rows.forEach((r) => {
                                                            console.log(`  - Profile ${r.profile_id}: "${r.message}" (due ${r.remind_at})`);
                                                                    });

                                                                            const ids = result.rows.map((r) => r.id);
                                                                                    await pool.query(
                                                                                              'UPDATE reminders SET sent = TRUE WHERE id = ANY($1::int[])',
                                                                                                        [ids]
                                                                                                                );
                                                                                                                      }
                                                                                                                          } catch (err) {
                                                                                                                                console.error('[cron] error checking reminders:', err.message);
                                                                                                                                    }
                                                                                                                                      });

                                                                                                                                        console.log('Reminder cron job started (checks every minute)');
                                                                                                                                        }

                                                                                                                                        module.exports = startReminderCron;
                                                                                                                                        