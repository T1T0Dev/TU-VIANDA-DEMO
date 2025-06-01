import mysql from 'mysql2/promise';


const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "RoblesThiago21122005", // tu pass de MySQL
    database: "tuvianda"
  });

export default db;