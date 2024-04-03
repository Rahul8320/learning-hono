import { Hono } from "hono";
import VideoService from "../services/video.service";

const video = new Hono();
const videoService = new VideoService();

// GET list of vidoes
video.get("/", async c => {
  try {
    const documents = await videoService.getAllVideos();
    return c.json(documents.map(d => d.toObject()), 200);
  } catch (err) {
    return c.json({ message: `Fetch failed with error: ${(err as any)?.message || "Internal server error"}` }, 500);
  }
});

// GET video by id
video.get("/:id", c => {
  const id = c.req.param("id");
  return c.text("Get video: " + id);
});

// POST new video
video.post("/", async c => {
  try {
    const formData = await c.req.json();

    if (!formData.thumbleUrl) {
      delete formData.thumbleUrl;
    }

    const document = await videoService.addNewVideo(formData);
    return c.json(document.toObject(), 201);
  } catch (err) {
    return c.json({ message: `Create failed with error: ${(err as any)?.message || "Internal server error"}` }, 500);
  }
});

export default video;
