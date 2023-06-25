// Middleware
import config from "./config.js";
const { requireUnlock, key, bypassCrOS } = config;

import { IncomingMessage, ServerResponse } from "node:http";
import { Next } from "polka";

import { httpCookie } from "cookie-muncher";

function block(_req: IncomingMessage, res: ServerResponse) {
	const type = res.getHeader("content-type");

	// Ignore non-html files (To prevent issues with the first time use of the key)
	if (typeof type === "string" && type.includes("text/html"))
		res.end("Blocked");
}

export default (req: IncomingMessage, res: ServerResponse, next: Next) => {
	const cookies = httpCookie.parse(req.headers.cookie ?? "");
	const theKey =
		cookies.find(cookie => cookie.name === "key")?.value || false;

	if (req.headers.host) {
		const url = new URL(req.headers.host + req.url);
		const unlocked = theKey && theKey === key;
		const code = url.search.startsWith("?unlock");
		const usingCrOS =
			bypassCrOS &&
			(req.headers["user-agent"]?.includes("CrOS") ?? false);
		const allowed = !requireUnlock || unlocked || code || usingCrOS;

		// Block
		if (!allowed) block(req, res);

		if (code)
			res.setHeader("set-cookie", "key=unlock; SameSite=None; Secure");
	}

	if (req.url)
		if (req.url.startsWith("/go/")) {
			res.statusCode = 404;
			res.end("Failed to start the service worker");
		}

	next();
};
