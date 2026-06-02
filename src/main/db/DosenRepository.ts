import { Repository } from './Repository';
import { Dosen } from '../models/Dosen';
import { Database as DB } from 'better-sqlite3';

export class DosenRepository extends Repository<Dosen> {
  constructor(db: DB) {
    super(db, 'dosen');
  }

  insert(data: Omit<Dosen, 'id'>): Dosen {
    const stmt = this.db.prepare(`
      INSERT INTO dosen (nidn, nama, matkul)
      VALUES (@nidn, @nama, @matkul)
    `);

    const result = stmt.run(data);
    return { id: Number(result.lastInsertRowid), ...data };
  }

  update(id: number, data: Partial<Dosen>): Dosen | undefined {
    const existing = this.findById(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...data };

    this.db
      .prepare(
        `
      UPDATE dosen
      SET nidn = @nidn, nama = @nama, matkul = @matkul
      WHERE id = @id
    `
      )
      .run(updated);

    return updated;
  }
}
