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
        }

        if (path.startsWith('/project/') && method === 'GET') {
            const projectId = path.split('/')[2];
            try {
                const [rows] = await mysqlPool.query('SELECT * FROM projects WHERE project_id = ?', [projectId]);
                if (rows.length === 0) return new Response(JSON.stringify({ success: false, message: "ไม่พบโปรเจกต์" }), { status: 404, headers: { "Content-Type": "application/json" } });
                return new Response(JSON.stringify(rows[0]), { status: 200, headers: { "Content-Type": "application/json" } });
            } catch (error) {
                console.log("ERROR: ", error);
                return new Response(JSON.stringify({ success: false, message: "Server Error" }), { status: 500, headers: { "Content-Type": "application/json" } });
            }
        }

        if (path === '/project/insert' && method === 'POST') {
            try {
                const formData = await req.formData();
                const data = Object.fromEntries(formData.entries());

                const [result] = await mysqlPool.query(
                    `INSERT INTO projects (project_id, project_url, project_name, project_description, project_caretaker1, project_caretaker2, project_date, project_status, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), null)`,
                    [
                        data.project_id,
                        data.project_url,
                        data.project_name,
                        data.project_description,
                        data.project_caretaker1,
                        data.project_caretaker2 || null,
                        data.project_date,
                        data.project_status || 0
                    ]
                );

                return new Response(JSON.stringify({ success: true, message: 'สร้างโปรเจกต์สำเร็จ..' }), { status: 201, headers: { "Content-Type": "application/json" } });
            } catch (error) {
                console.log("ERROR: ", error);
                return new Response("Server Error", { status: 500 });
            }
        }

        if (path === '/project/update' && method === 'PUT') {
            const formData = await req.formData();
            const data = Object.fromEntries(formData.entries());

            try {
                const [result] = await mysqlPool.query(
                    `UPDATE projects SET 
                        project_url = ?, 
                        project_name = ?, 
                        project_description = ?, 
                        project_caretaker1 = ?, 
                        project_caretaker2 = ?, 
                        project_date = ?, 
                        project_status = ?, 
                        updated_at = NOW()
                     WHERE project_id = ?`,
                    [
                        data.project_url,
                        data.project_name,
                        data.project_description,
                        data.project_caretaker1,
                        data.project_caretaker2 || null,
                        data.project_date,
                        data.project_status || 0,
                        data.project_id
                    ]
                );

                return new Response(JSON.stringify({ success: true, message: "อัพเดตโปรเจกต์สำเร็จ.." }), { status: 200, headers: { "Content-Type": "application/json" } });
            } catch (error) {
                console.log("ERROR:", error);
                return new Response(JSON.stringify({ success: false, message: "Server Error" }), { status: 500, headers: { "Content-Type": "application/json" } });
            }
        }


        if (path === '/project/delete' && method === 'DELETE') {
            const formData = await req.formData();
            const data = Object.fromEntries(formData.entries());

            try {
                const [result] = await mysqlPool.query('DELETE FROM projects WHERE project_id = ?', [data.project_id]);
                return new Response(JSON.stringify({ success: true, message: "ลบโปรเจกต์สำเร็จ.." }), { status: 200, headers: { "Content-Type": "application/json" } });
            } catch (error) {
                console.log("ERROR:", error);
                return new Response(JSON.stringify({ success: false, message: "Server Error" }), { status: 500, headers: { "Content-Type": "application/json" } });
            }
        }


        return await new Response("404 File not Found", { status: 404 });
    }
})