import config from "./config.js";
const { port } = config;

import polka from "polka";

// Middleware
import bare from "./bare.js";
import unlock from "./unlock.js";
import { createServer as createViteServer } from "vite";
const vite = await createViteServer({
	root: "site",
	optimizeDeps: {
		exclude: ["./site/aero"],
	},
	server: { middlewareMode: "html" },
});

const app = polka();

app.use(bare);
app.use(unlock);
app.use(vite.middlewares);

app.listen(config.port, () => `Listening on ${port}`);
