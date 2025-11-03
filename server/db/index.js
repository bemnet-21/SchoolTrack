import pkg from 'pg'

const { Pool } = pkg

const pool = new Pool()
pool.on('connect', () => {
    console.log("Connected to the PostgreSQL database")
})