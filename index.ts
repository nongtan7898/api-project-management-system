import { serve } from 'bun'
import mysql from 'mysql2/promise'

console.log("Hello via Bun!");

const mysqlPool = mysql.createPool({
    host: 'db',
    user: "root",
    password: '1234567890Do',
    database: 'project_db'
})

serve({
    port: 3000,
    async fetch(req) {
        const url = new URL(req.url);
        const path = url.pathname;
        const method = req.method;

        // List all API
        if (path == '/project/list' && method === 'GET') {
            try {
                const [rows] = await mysqlPool.query('SELECT * FROM projects');
                return new Response(JSON.stringify(rows), { status: 200, headers: { "Content-Type": "application/json" } })

            } catch (error) {
                console.log("ERROR: ", error)
                return new Response("Server Error", { status: 500 })
            }

            // return new Response("List of projects", { status: 200 })
        }

        if (path.startsWith('/project/:id')) {
            const projectId = path.split('/').pop();
            return new Response('Project ID: ' + projectId, { status: 200 })

        }

        return await new Response("404 File not Found", { status: 404 });
    }
})