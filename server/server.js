const express = require('express')
const app = express()
const pool = require('./db')

app.use(express.json());

app.get("/api", async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM item ORDER BY number ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch items' });
    }
});


app.put('/api/reorder', async (req, res) => {
    const { orderedIds } = req.body;

    try {
        await pool.query('BEGIN');
        for (let i = 0; i < orderedIds.length; i++) {
            await pool.query('UPDATE item SET number=$1 WHERE id=$2', [i, orderedIds[i]]);
        }
        await pool.query('COMMIT');
        res.json({ message: 'Order updated successfully' });
    } catch (err) {
        await pool.query('ROLLBACK');
        res.status(500).json({ error: 'Failed to update order' });
    }
});

app.listen(5000, () => {console.log("Server started on port 5000")})