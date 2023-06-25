// Bare middleware
import createBareServer from "@tomphttp/bare-server-node";

import { IncomingMessage, ServerResponse } from "node:http";
import { Next } from "polka";

const bare = createBareServer("/bare/");

export default (req: IncomingMessage, res: ServerResponse, next: Next) => {
	if (bare.shouldRoute(req)) bare.routeRequest(req, res);
	else next();
};
