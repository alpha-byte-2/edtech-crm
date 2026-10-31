import bcrypt from 'bcrypt';
import pool from './db.js';

const hash = await bcrypt.hash('admin123', 10);
await pool.query(
  'INSERT INTO admins (email, password_hash) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING',
  ['admin@edtech.com', hash]
);
console.log('Admin seeded: admin@edtech.com / admin123');
process.exit();