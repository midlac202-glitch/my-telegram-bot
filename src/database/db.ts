import Database from 'better-sqlite3';

const db = new Database('bot.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    selected_font TEXT DEFAULT 'bold'
  )
`);

export interface User {
  id: number;
  selected_font: string;
}

export function getUser(userId: number): User {
  let user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as User | undefined;
  
  if (!user) {
    db.prepare('INSERT INTO users (id, selected_font) VALUES (?, ?)').run(userId, 'bold');
    user = { id: userId, selected_font: 'bold' };
  }
  
  return user;
}

export function updateUserFont(userId: number, font: string): void {
  getUser(userId);
  db.prepare('UPDATE users SET selected_font = ? WHERE id = ?').run(font, userId);
}

export function getUserCount(): number {
  const result = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  return result.count;
}