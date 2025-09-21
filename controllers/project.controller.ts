import type { Project } from "../classes/project.class";
import pool from "../configs/db.config";

export const getAllProjects = async () => {
    try {
        const [rows] = await pool.query('SELECT * FROM projects');
        return new Response(JSON.stringify(rows), { status: 200, headers: { "Content-Type": "application/json" } })
    } catch (error) {
        console.log("ERROR: ", error)
        return new Response("Server Error", { status: 500 })
    }
}

export const getFindProjectById = async (projectId: string) => {
    try {
        const [rows] = await pool.query('SELECT * FROM projects WHERE projectId = ?', [projectId]);
        if (rows.length === 0) return new Response(JSON.stringify({ success: false, message: "ไม่พบโปรเจกต์" }), { status: 404, headers: { "Content-Type": "application/json" } });
        return new Response(JSON.stringify(rows[0]), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error) {
        console.log("ERROR: ", error);
        return new Response(JSON.stringify({ success: false, message: "Server Error" }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
};


export const postProjectInsert = async (projectData: Project) => {
    try {
        const [result] = await pool.query(
            `INSERT INTO projects (projectId, projectUrl, projectName, projectDescription, projectCaretaker1, projectCaretaker2, projectDate, projectStatus, createdAt, updatedAt)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), null)`,
            [
                projectData.projectId,
                projectData.projectUrl,
                projectData.projectName,
                projectData.projectDescription,
                projectData.projectCaretaker1,
                projectData.projectCaretaker2 || null,
                projectData.projectDate,
                projectData.projectStatus || 0,
            ]
        );

        return new Response(JSON.stringify({ success: true, message: 'สร้างโปรเจกต์สำเร็จ..' }), { status: 201, headers: { "Content-Type": "application/json" } });
    } catch (error) {
        console.log("ERROR: ", error);
        return new Response("Server Error", { status: 500 });
    }
}

export const putProjectUpdate = async (projectData: Project) => {
    try {
        const [result] = await pool.query(`UPDATE projects SET projectUrl = ?, projectName = ?, projectDescription = ?, projectCaretaker1 = ?, projectCaretaker2 = ?, 
            projectDate = ?, projectStatus = ?, updatedAt = NOW() WHERE projectId = ?`,
            [
                projectData.projectUrl,
                projectData.projectName,
                projectData.projectDescription,
                projectData.projectCaretaker1,
                projectData.projectCaretaker2 || null,
                projectData.projectDate,
                projectData.projectStatus || 0,
                projectData.projectId
            ]
        );

        return new Response(JSON.stringify({ success: true, message: "อัพเดตโปรเจกต์สำเร็จ.." }), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error) {
        console.log("ERROR:", error);
        return new Response(JSON.stringify({ success: false, message: "Server Error" }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
}

export const deleteProjectDelete = async (projectId: string) => {
    try {
        const [result] = await pool.query('DELETE FROM projects WHERE projectId = ?', [projectId]);
        return new Response(JSON.stringify({ success: true, message: "ลบโปรเจกต์สำเร็จ.." }), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error) {
        console.log("ERROR:", error);
        return new Response(JSON.stringify({ success: false, message: "Server Error" }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
}