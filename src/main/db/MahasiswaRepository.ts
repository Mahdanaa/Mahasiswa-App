import { Repository } from './Repository';
import { Mahasiswa } from '../models/Mahasiswa';
import { Database as DB } from 'better-sqlite3';
export class MahasiswaRepository extends Repository<Mahasiswa> {
  constructor(db: DB) {
    super(db, 'mahasiswa');
  }
  insert(data: Omit<Mahasiswa, 'id'>): Mahasiswa {
    const existing = this.findByNim(data.nim);

    if (existing) {
      throw new Error(`NIM ${data.nim} sudah terdaftar! Silakan gunakan NIM lain.`);
    }

    const stmt = this.db.prepare(`
      INSERT INTO mahasiswa (nim, nama, jurusan,ipk, angkatan)
      VALUES (@nim, @nama, @jurusan, @ipk, @angkatan)
    `);

    const result = stmt.run(data);
    return { id: Number(result.lastInsertRowid), ...data };
  }
  update(id: number, data: Partial<Mahasiswa>): Mahasiswa | undefined {
    const existing = this.findById(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...data };
    this.db
      .prepare(
        `
    UPDATE mahasiswa
    SET nim = @nim, nama = @nama, jurusan = @jurusan, angkatan = @angkatan, ipk = @ipk
    WHERE id = @id
  `
      )
      .run(updated);
    return updated;
  }
  findByNim(nim: string): Mahasiswa | undefined {
    return this.db.prepare(`SELECT * FROM mahasiswa WHERE nim = ?`).get(nim) as Mahasiswa | undefined;
  }
  findByJurusan(jurusan: string): Mahasiswa[] {
    return this.db.prepare(`SELECT * FROM mahasiswa WHERE jurusan = ?`).all(jurusan) as Mahasiswa[];
  }
  search(keyword: string): Mahasiswa[] {
    return this.db
      .prepare(`SELECT * FROM mahasiswa WHERE nim LIKE @keyword OR nama LIKE @keyword`)
      .all({ keyword: `%${keyword}%` }) as Mahasiswa[];
  }
}
