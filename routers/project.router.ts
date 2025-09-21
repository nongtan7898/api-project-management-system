import { getAllProjects, getFindProjectById, postProjectInsert, putProjectUpdate, deleteProjectDelete } from "../controllers/project.controller";
import type { Project } from "../classes/project.class";

const routerHandler = async (req: Request) => {
    const url = new URL(req.url);
    const pathPart = url.pathname.split('/').filter(Boolean);

    if (pathPart[0] !== 'project') {
        return new Response('Path Not Found!', { status: 404 });
    }

    const method = req.method;
    const pathProjectId = pathPart[1];

    switch (method) {
        case "GET":
            if (pathProjectId) {
                return getFindProjectById(pathProjectId)
            }
            return getAllProjects();
        case "POST":
            const formData = await req.formData();
            const raw = Object.fromEntries(formData.entries());

            const projectData: Project = {
                projectId: raw.projectId as string,
                projectName: raw.projectName as string,
                projectUrl: raw.projectUrl as string,
                projectDescription: raw.projectDescription as string,
                projectCaretaker1: raw.projectCaretaker1 as string,
                projectCaretaker2: raw.projectCaretaker2 as string,
                projectDate: new Date(raw.projectDate as string),
                projectStatus: Number(raw.projectStatus) || 0,
            };

            return postProjectInsert(projectData)
        case "PUT":
            const formData2 = await req.formData();
            const raw2 = Object.fromEntries(formData2.entries());

            const projectData2: Project = {
                projectId: raw2.projectId as string,
                projectName: raw2.projectName as string,
                projectUrl: raw2.projectUrl as string,
                projectDescription: raw2.projectDescription as string,
                projectCaretaker1: raw2.projectCaretaker1 as string,
                projectCaretaker2: raw2.projectCaretaker2 as string,
                projectDate: new Date(raw2.projectDate as string),
                projectStatus: Number(raw2.projectStatus) || 0,
            };

            return putProjectUpdate(projectData2)
        case "DELETE":
            const formData3 = await req.formData();
            const raw3 = Object.fromEntries(formData3.entries());
            const projectId: string = raw3.projectId as string;

            return deleteProjectDelete(projectId);
        default:
            return new Response('Method Not Allowed', { status: 405 });

    }
}

export default routerHandler