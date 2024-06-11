const Pool = require("pg").Pool;
const pool = new Pool({
    user: process.env.DBLOGIN,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT
});
pool.connect((err) => { err ? console.log(err) : console.log("Connected to DB") });
module.exports = pool;