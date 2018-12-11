const sql = require('mssql');

const config = {
    user: process.env.user,
    password: process.env.password,
    server: process.env.server,
    port: Number.parseInt(process.env.dbport),
    database: process.env.database,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
}

const poolPromise = new sql.ConnectionPool(config)
                .connect()
                .then(pool => {
                    console.log(`Connected to MSSQL database ${pool.config.database} at ${pool.config.server}:${pool.config.port}`);
                    return pool
                  })
                  .catch(err => console.log('Database Connection Failed! Bad Config: ', err))

module.exports = {
    poolPromise
};
