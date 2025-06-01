import mysql from 'mysql2/promise';


const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "", // tu pass de MySQL
    database: "tuvianda"
  });

export default db;