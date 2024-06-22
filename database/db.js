import mysql from 'mysql2/promise';
import 'dotenv/config';

// Membuat koneksi pool ke database
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Fungsi untuk menguji koneksi database
const testConnection = async () => {
    try {
        await db.getConnection();
        console.log("Berhasil terhubung ke database");
    } catch (e) {
        console.log("Gagal terhubung ke database", e);
    }
}

// Fungsi untuk menjalankan query
const query = async (query, values) => {
    try {
        const [result] = await db.query(query, values ?? []);
        return result;
    } catch (e) {
        console.log("Gagal menjalankan query", e);
        throw e;
    }
}

export { testConnection, query };
