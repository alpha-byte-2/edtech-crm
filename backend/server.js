import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import pool from './db.js';
import authMiddleware from './middleware/auth.js';

const app=express();
app.use(cors());
app.use(express.json());

// submit inquiry form
app.post('/api/inquiries', async (req, res) => {
  const { name, email, phone, user_type, category, message } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO inquiries (name, email, phone, user_type, category, message)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, email, phone, user_type, category, message]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// custom auth login
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const admin = result.rows[0];
    const validPassword = await bcrypt.compare(password, admin.password_hash);
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// View & Filter Inquiries
app.get('/api/admin/inquiries', authMiddleware, async (req, res) =>{
    const { category, user_type, search } = req.query;
    let query ='SELECT * FROM inquiries WHERE 1=1';
    const values=[];
    if(category){
        values.push(category);
        query+=`AND category= $${values.length}`;
    }
    if (user_type) {
    values.push(user_type);
    query += ` AND user_type = $${values.length}`;
    }
    if (search) {
    values.push(`%${search}%`);
    query += ` AND (name ILIKE $${values.length} OR phone ILIKE $${values.length})`;
  }

  query += ' ORDER BY created_at DESC';
  try {
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});

// manage inquiry status
app.patch('/api/admin/inquiries/:id/status', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE inquiries SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));