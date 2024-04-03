import { Hono } from "hono";
import { poweredBy } from "hono/powered-by";
import { logger } from "hono/logger";
import { dbConnect } from "./db/dbConnection";
import videoRouter from "./routes/video.routes";

const app = new Hono().basePath("/api"); // --> /api

// middlewares
app.use(poweredBy());
app.use(logger());

dbConnect()
  .then(() => {
    app.route("/videos", videoRouter); // --> /api/videos
  })
  .catch((err) => {
    console.error(err);
    app.get("/*", (c) => {
      return c.json(
        { message: `Failed to connect mongodb: ${err.message}` },
        500
      );
    });
  });

app.onError((err, c) => {
  return c.json({ message: `App Error: ${err.message}` }, 500);
});

export default app;
