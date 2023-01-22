import { serve } from "https://deno.land/std@0.173.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.173.0/http/file_server.ts";

import { getCookies } from "https://deno.land/std@0.173.0/http/cookie.ts";

import Proxy from "https://cdn.jsdelivr.net/gh/ProxyHaven/aero-backends/proxy.ts";
const proxy = new Proxy("/fetch", "/fetchWs");

import "https://deno.land/std@0.173.0/dotenv/load.ts";
import config from "./config.json" assert { type: "json" };

import { prefix } from "https://cdn.jsdelivr.net/gh/ProxyHaven/aero/config.js";

await Deno.run({
	cmd: ["./deps.sh"],
	stderr: "piped",
});

await serve(
	async (req: Request): Promise<Response> => {
		const { key } = getCookies(req.headers);

		const url = new URL(req.url);
		const unlocked = key === config.key;
		const code = url.search.startsWith("?unlock");
		const usingCrOS = req.headers.get("user-agent")?.includes("CrOS") ?? false;
		const allow = !config.requireUnlock || unlocked || code || usingCrOS;

		if (!allow) {
			const resp = await serveDir(req, {
				fsRoot: config.blockedDir,
				showIndex: true,
				quiet: true,
			});

			// Only block html files
			if (resp.headers.get("content-type")?.includes("text/html")) return resp;
		}

		const path = url.pathname;

		if (proxy.route(path)) return await proxy.handle(req);
		else if (proxy.routeWs(path)) return await proxy.handleWs(req);
		else {
			if (path.startsWith(prefix))
				return new Response("Failed to start the service worker", {
					status: 404,
				});

			const resp = await serveDir(req, {
				fsRoot: config.dir,
				showDirListing: true,
				showIndex: true,
				quiet: true,
			});

			if (code)
				resp.headers.set("set-cookie", "key=unlock; SameSite=None; Secure");

			// TODO: Set status to 404 to avoid storing history on Chromium
			return resp;
		}
	},
	{ port: config.port }
);
