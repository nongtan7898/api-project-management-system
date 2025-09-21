import { serve } from 'bun'
import projectRouter from './routers/project.router';


serve({
    port: 3000,
    async fetch(req) {
        const url = new URL(req.url);

        if (url.pathname.startsWith('/project')) {
            return await projectRouter(req);
        }
        return await new Response("404 File not Found", { status: 404 });
    }
})