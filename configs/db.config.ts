import mysql from 'mysql2/promise'


const mysqlPool = mysql.createPool({
    host: 'db',
    user: "root",
    password: '1234567890Do',
    database: 'project_db'
})


export default mysqlPool
