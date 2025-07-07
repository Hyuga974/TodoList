import sqlite3 from 'sqlite3'
import dotenv from 'dotenv'
import { promisify } from 'util'

dotenv.config()

const DB_PATH = process.env.DB_PATH as string;

if (!DB_PATH) {
  throw new Error('DB_PATH environment variable is not defined')
}

interface RunResult {
  lastID: number
  changes: number
}

class Database {
  private db: sqlite3.Database

  constructor(dbPath: string = DB_PATH) {
    this.db = new sqlite3.Database(dbPath)
  }

  async run(sql: string, params: any[] = []): Promise<RunResult> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) reject(err)
        else resolve({ lastID: this.lastID, changes: this.changes })
      })
    })
  }

  async get<T = any>(sql: string, params: any[] = []): Promise<T> {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err)
        else resolve(row as T)
      })
    })
  }

  async all<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err)
        else resolve(rows as T[])
      })
    })
  }

  async exec(sql: string): Promise<void> {
    return promisify(this.db.exec).call(this.db, sql)
  }

  close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close(err => {
        if (err) reject(err)
        else resolve()
      })
    })
  }
}

function openDB(testDbPath?: string): Database {
  return testDbPath ? new Database(testDbPath) : new Database();
}

export { openDB, Database, RunResult }
