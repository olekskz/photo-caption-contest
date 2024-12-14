const Pool = require('pg').Pool

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Photo contest',
    password: 'postgres',
    port: '5432',
})