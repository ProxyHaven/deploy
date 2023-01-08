import { serve } from "https://deno.land/std@0.159.0/http/server.ts";
import { serveFile } from "https://deno.land/std@0.159.0/http/file_server.ts";

import Proxy from "./proxy/proxy.ts";
const proxy = new Proxy("/fetch", "/fetchWs");

await serve(
	async (req: Request): Promise<Response> => {
		const path: string = new URL(req.url).pathname || "";

		if (proxy.route(path)) return await proxy.handle(req);
		else if (proxy.routeWs(path)) return await proxy.handleWs(req);
		else {
			const dir = "site";

			return serveFile(req, path === "/" ? `${dir}/index.html` : dir + path);
		}
	},
	{ port: 3000 }
);
