require('dotenv').config()
const express = require('express')
const cors = require('cors')
const pool = require('./db')

const app = express()

app.use(cors())
app.use(express.json());
app.use('/api/profiles', require('./routes/profiles'));
const errorHandler = require('./middleware/errorHandler');
// ... all your other app.use() and routes above ...
app.use((req, res) => {
    res.status(404).json({ error: 'route not found' });
    });

app.use(errorHandler);

app.get('/health', async (req, res) => {
  try {
      const result = await pool.query('SELECT NOW()')
          res.json({ status: 'ok', time: result.rows[0].now })
            } catch (err) {
                res.status(500).json({ status: 'error', message: err.message })
                  }
                  })

                  const PORT = process.env.PORT || 3000
                  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
                  